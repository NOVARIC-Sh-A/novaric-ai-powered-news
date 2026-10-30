"""
NOVARIC® Identity Resolution Engine
Deterministic numericId assignment and fuzzy reconciliation (rapidfuzz / difflib).
Reconciles Albanian names (considering patronymics/atësia, accents, and diacritics).
"""

import re
import hashlib
import unicodedata
from typing import Dict, Any, Optional, Tuple, List, Union

# Try importing rapidfuzz, fallback to difflib
try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    import difflib
    HAS_RAPIDFUZZ = False

def normalize_albanian_text(text: Optional[str]) -> str:
    """Normalize Albanian text: remove accents (ë->e, ç->c), titles, honorifics, trim whitespace, lowercase."""
    if not text:
        return ""
    text = text.strip()
    # Normalize unicode
    text = unicodedata.normalize('NFKD', text)
    # Custom Albanian character mapping
    trans_map = {
        'ë': 'e', 'Ë': 'e',
        'ç': 'c', 'Ç': 'c'
    }
    for k, v in trans_map.items():
        text = text.replace(k, v)
    text = text.lower()
    # Remove common honorific titles
    titles = [
        r'\bdeputeti\b', r'\bkryetari\b', r'\bministri\b', r'\bzoti\b',
        r'\bz\b', r'\bdr\b', r'\bprof\b', r'\bdipl\b', r'\(ps\)', r'\(pd\)', r'\(pl\)', r'\(psd\)'
    ]
    for t in titles:
        text = re.sub(t, ' ', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

# Pre-allocated consumed range vip125-vip210
CONSUMED_VIP_IDS = set(range(125, 211))

def generate_stable_numeric_id(
    full_name: str,
    canonical_map: Optional[Dict[str, int]] = None,
    kuvendi_person_id: Optional[Union[str, int]] = None,
    existing_store: Optional[Dict[str, int]] = None
) -> int:
    """
    Generate a stable, deterministic numericId (never regenerates).
    1. Checks existing_store by kuvendi_person_id if provided.
    2. Preserves predefined canonical IDs (e.g. Edi Rama=1, Sali Berisha=2).
    3. Checks existing_store by normalized name.
    4. Deterministically hashes stable kuvendi_person_id or normalized name,
       avoiding collision with consumed range (125-210) unless already mapped.
    """
    # 1. Check existing store by kuvendi_person_id
    if existing_store and kuvendi_person_id is not None:
        k_key = f"kuvendi:{kuvendi_person_id}"
        if k_key in existing_store:
            return existing_store[k_key]
        if str(kuvendi_person_id) in existing_store:
            return existing_store[str(kuvendi_person_id)]

    # 2. Check canonical map by full_name
    if canonical_map and full_name in canonical_map:
        return canonical_map[full_name]

    norm = normalize_albanian_text(full_name)
    if canonical_map:
        for k, v in canonical_map.items():
            if normalize_albanian_text(k) == norm:
                return v

    # 3. Check existing store by normalized name
    if existing_store:
        if norm in existing_store:
            return existing_store[norm]
        for k, v in existing_store.items():
            if normalize_albanian_text(k) == norm:
                return v

    # 4. Deterministic assignment keyed on kuvendi_person_id if available, else norm
    key_for_hash = f"kuvendi_person_{kuvendi_person_id}" if kuvendi_person_id is not None else norm
    digest = hashlib.sha256(key_for_hash.encode('utf-8')).hexdigest()
    # Modulo offset avoiding 125..210 collision if new
    base_num = int(digest[:8], 16) % 900000 + 1000
    return base_num


class IdempotentVipIdAssigner:
    """
    Idempotent VIP ID Assigner for Kuvendi MP Ingestion.
    Ensures:
    1. Double re-run on identical data mints strictly 0 new VIP IDs.
    2. Primary assignment keys on stable Kuvendi person ID (raw.Id).
    3. Respects already consumed range vip125-vip210.
    """
    def __init__(
        self,
        existing_registry: Optional[Dict[str, int]] = None,
        canonical_map: Optional[Dict[str, int]] = None
    ):
        self.registry: Dict[str, int] = dict(existing_registry or {})
        self.canonical_map: Dict[str, int] = dict(canonical_map or {})
        self.consumed_ids: set = set(CONSUMED_VIP_IDS)
        for v in self.registry.values():
            self.consumed_ids.add(v)
        for v in self.canonical_map.values():
            self.consumed_ids.add(v)

    def get_or_assign_vip_id(
        self,
        full_name: str,
        kuvendi_person_id: Optional[Union[str, int]] = None,
        existing_numeric_id: Optional[int] = None
    ) -> Tuple[int, bool]:
        """
        Assigns or retrieves VIP ID idempotently.
        Returns (numeric_id, is_newly_minted: bool).
        """
        # If explicit existing numeric_id provided and known, retain it
        if existing_numeric_id is not None:
            self.consumed_ids.add(existing_numeric_id)
            if kuvendi_person_id is not None:
                self.registry[f"kuvendi:{kuvendi_person_id}"] = existing_numeric_id
            self.registry[normalize_albanian_text(full_name)] = existing_numeric_id
            return existing_numeric_id, False

        # Key 1: Stable Kuvendi person ID
        if kuvendi_person_id is not None:
            k_key = f"kuvendi:{kuvendi_person_id}"
            if k_key in self.registry:
                return self.registry[k_key], False

        # Key 2: Canonical predefined map
        norm_name = normalize_albanian_text(full_name)
        if full_name in self.canonical_map:
            cid = self.canonical_map[full_name]
            if kuvendi_person_id is not None:
                self.registry[f"kuvendi:{kuvendi_person_id}"] = cid
            self.registry[norm_name] = cid
            return cid, False

        for k, v in self.canonical_map.items():
            if normalize_albanian_text(k) == norm_name:
                if kuvendi_person_id is not None:
                    self.registry[f"kuvendi:{kuvendi_person_id}"] = v
                self.registry[norm_name] = v
                return v, False

        # Key 3: Normalized name in existing registry
        if norm_name in self.registry:
            cid = self.registry[norm_name]
            if kuvendi_person_id is not None:
                self.registry[f"kuvendi:{kuvendi_person_id}"] = cid
            return cid, False

        # Key 4: Mint new deterministic ID
        new_id = generate_stable_numeric_id(
            full_name=full_name,
            canonical_map=self.canonical_map,
            kuvendi_person_id=kuvendi_person_id,
            existing_store=self.registry
        )

        # Collision avoidance with consumed range
        while new_id in self.consumed_ids:
            new_id = (new_id + 1000) % 900000 + 1000

        self.consumed_ids.add(new_id)
        if kuvendi_person_id is not None:
            self.registry[f"kuvendi:{kuvendi_person_id}"] = new_id
        self.registry[norm_name] = new_id
        return new_id, True

def compute_similarity(name1: str, name2: str) -> float:
    """Compute string similarity [0, 100]."""
    n1 = normalize_albanian_text(name1)
    n2 = normalize_albanian_text(name2)
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 100.0

    if HAS_RAPIDFUZZ:
        return float(fuzz.token_sort_ratio(n1, n2))
    else:
        matcher = difflib.SequenceMatcher(None, n1, n2)
        return float(matcher.ratio() * 100.0)

class IdentityResolver:
    """
    Reconciles external source strings against existing politicians directory.
    Uses full name, patronymic, and DOB verification.
    """
    def __init__(self, known_politicians: List[Dict[str, Any]], threshold: float = 90.0):
        self.known_politicians = known_politicians
        self.threshold = threshold

    def resolve(
        self,
        raw_name: str,
        father_name: Optional[str] = None,
        dob: Optional[str] = None
    ) -> Tuple[Optional[Dict[str, Any]], float]:
        """
        Attempt to resolve raw_name. Returns (politician_dict, confidence_score).
        If below threshold, returns (None, confidence_score).
        """
        best_match = None
        best_score = 0.0

        for pol in self.known_politicians:
            cand_name = pol.get("full_name") or f"{pol.get('first_name', '')} {pol.get('last_name', '')}"
            name_score = compute_similarity(raw_name, cand_name)

            score = name_score

            # Boost or verify with father_name if both present
            cand_father = pol.get("father_name")
            if father_name and cand_father:
                father_score = compute_similarity(father_name, cand_father)
                if father_score >= 85:
                    score = min(100.0, score * 0.7 + father_score * 0.3 + 5.0)
                else:
                    score = score * 0.8  # Penalty if fathers conflict

            # Check DOB if available
            cand_dob = pol.get("date_of_birth")
            if dob and cand_dob:
                if str(dob)[:10] == str(cand_dob)[:10]:
                    score = min(100.0, score + 5.0)
                else:
                    score = score * 0.85

            if score > best_score:
                best_score = score
                best_match = pol

        if best_score >= self.threshold:
            return best_match, round(best_score, 2)
        return None, round(best_score, 2)
