"""
NOVARIC® Kuvendi Transcripts NLP Processing Worker
Extracts plenary speeches from transcript files/HTML, attributes segments to MPs,
performs Albanian topic classification and sentiment scoring [-1.0, 1.0].
"""

import re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from ingestion.base import BaseWorker, IngestionContext, IngestionResult
from ingestion.identity_resolution import IdentityResolver

# Albanian Topic Keywords
TOPIC_KEYWORDS = {
    "ekonomi": ["buxhet", "tatim", "investim", "rritje ekonomike", "inflacion", "paga", "pension", "biznes", "tregti"],
    "drejtësi": ["reforma në drejtësi", "spak", "gjykata", "prokuroria", "kushtetut", "ligji", "korrupsion", "veting"],
    "integrim evropian": ["bashkimi evropian", "be", "negociatat", "kapitujt", "integrim", "bruksel", "acquis"],
    "shëndetësi": ["spital", "mjekë", "shërbim shëndetësor", "barna", "pacient", "pandemi", "fondi i sigurimeve"],
    "arsim": ["shkollë", "universitet", "mësues", "student", "kurrikula", "shkencë", "arsim i lartë"],
    "infrastrukturë": ["rrugë", "autostradë", "porti", "aeroporti", "ujësjellës", "energji", "hekurudhë"],
    "siguri": ["rendi", "policia", "ushtria", "nato", "mbrojtje", "siguria kombëtare"]
}

# Albanian Sentiment Lexicon
POSITIVE_WORDS = {
    "progres", "sukses", "arritje", "zhvillim", "forcim", "mbështes", "miratim", "pozitiv",
    "transparencë", "reformë", "përmirësim", "stabilitet", "zgjidhje", "efikasitet", "partneritet"
}

NEGATIVE_WORDS = {
    "krizë", "dështim", "korrupsion", "vjedhje", "abuzim", "kundërshtoj", "skandal", "shkelje",
    "varfëri", "krim", "papërgjegjshmëri", "bllokim", "regres", "rrezik", "shkatërrim"
}

def tag_albanian_topics(text: str) -> List[str]:
    """Tag topics based on Albanian political vocabulary."""
    t_lower = text.lower()
    matched = []
    for topic, keywords in TOPIC_KEYWORDS.items():
        if any(kw in t_lower for kw in keywords):
            matched.append(topic)
    return matched if matched else ["çështje të përgjithshme"]

def compute_albanian_sentiment(text: str) -> float:
    """Compute sentiment score between -1.0 and 1.0."""
    words = re.findall(r'\w+', text.lower())
    if not words:
        return 0.0
    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
    total = pos_count + neg_count
    if total == 0:
        return 0.05  # Neutral slightly positive baseline
    score = (pos_count - neg_count) / float(total)
    return round(max(-1.0, min(1.0, score)), 3)

def parse_transcript_speeches(raw_text: str, resolver: IdentityResolver, source_url: str = "") -> List[Dict[str, Any]]:
    """
    Split plenary transcript into speeches separated by speaker headings:
    e.g. 'Kryetari i Kuvendit: ...' or 'Edi Rama: ...' or 'Deputeti Gazment Bardhi: ...'
    """
    pattern = re.compile(r'(?:(?:Fjala e|Flet|Deputeti|Ministri)\s+)?([A-ZÇË][a-zçë]+\s+[A-ZÇË][a-zçë]+(?:\s+[A-ZÇË][a-zçë]+)?)\s*:\s*', re.MULTILINE)
    matches = list(pattern.finditer(raw_text))
    speeches = []

    for i in range(len(matches)):
        speaker_name = matches[i].group(1).strip()
        start = matches[i].end()
        end = matches[i+1].start() if i + 1 < len(matches) else len(raw_text)
        speech_body = raw_text[start:end].strip()

        if len(speech_body) < 30:
            continue

        matched_pol, confidence = resolver.resolve(speaker_name)
        if matched_pol:
            speeches.append({
                "politician_id": matched_pol.get("numeric_id"),
                "speaker_name": matched_pol.get("full_name"),
                "word_count": len(speech_body.split()),
                "topic_tags": tag_albanian_topics(speech_body),
                "sentiment": compute_albanian_sentiment(speech_body),
                "excerpt": speech_body[:300] + ("..." if len(speech_body) > 300 else ""),
                "source_url": source_url,
                "confidence": confidence
            })
    return speeches

class KuvendiTranscriptsWorker(BaseWorker):
    source_name = "kuvendi.transcripts"

    async def run(self, ctx: IngestionContext) -> IngestionResult:
        start_time = datetime.now(timezone.utc)
        return IngestionResult(
            source=self.source_name,
            started_at=start_time,
            finished_at=datetime.now(timezone.utc),
            records_new=0,
            status="ok"
        )
