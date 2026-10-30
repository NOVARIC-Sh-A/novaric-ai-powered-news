"""
NOVARIC® Test Suite — Identity Resolution
Tests fuzzy matching, patronymic disambiguation, and numericId stability.
Asserts identity-resolution precision >= 0.95 on labeled Albanian benchmark set.
"""

import unittest
from ingestion.identity_resolution import (
    IdentityResolver,
    generate_stable_numeric_id,
    normalize_albanian_text
)

# Reference benchmark of known politicians
BENCHMARK_POLITICIANS = [
    {"numeric_id": 1, "full_name": "Edi Rama", "father_name": "Kristaq", "first_name": "Edi", "last_name": "Rama"},
    {"numeric_id": 2, "full_name": "Sali Berisha", "father_name": "Ram", "first_name": "Sali", "last_name": "Berisha"},
    {"numeric_id": 6, "full_name": "Erion Veliaj", "father_name": "Luan", "first_name": "Erion", "last_name": "Veliaj"},
    {"numeric_id": 7, "full_name": "Belind Këlliçi", "father_name": "Pëllumb", "first_name": "Belind", "last_name": "Këlliçi"},
    {"numeric_id": 9, "full_name": "Benet Beci", "father_name": "Bahri", "first_name": "Benet", "last_name": "Beci"},
    {"numeric_id": 19, "full_name": "Tom Doshi", "father_name": "Gjekë", "first_name": "Tom", "last_name": "Doshi"},
    {"numeric_id": 27, "full_name": "Ulsi Manja", "father_name": "Shaban", "first_name": "Ulsi", "last_name": "Manja"},
    {"numeric_id": 33, "full_name": "Xhelal Mziu", "father_name": "Ali", "first_name": "Xhelal", "last_name": "Mziu"},
    {"numeric_id": 45, "full_name": "Oerd Bylykbashi", "father_name": "Gëzim", "first_name": "Oerd", "last_name": "Bylykbashi"},
    {"numeric_id": 87, "full_name": "Niko Peleshi", "father_name": "Aleko", "first_name": "Niko", "last_name": "Peleshi"}
]

# Labeled test pairs: (input_raw_name, input_father_name, expected_numeric_id or None)
LABELED_DATASET = [
    # Clean matches
    ("Edi Rama", "Kristaq", 1),
    ("Sali Berisha", "Ram", 2),
    ("Erion Veliaj", "Luan", 6),
    ("Belind Kellici", "Pellumb", 7),       # Missing accents (ë, ç)
    ("Benet Beci", "Bahri", 9),
    ("Tom Doshi", "Gjeke", 19),
    ("Ulsi Manja", "Shaban", 27),
    ("Xhelal Mziu", "Ali", 33),
    ("Oerd Bylykbashi", "Gezim", 45),
    ("Niko Peleshi", "Aleko", 87),

    # Variants with extra titles or slight misspellings
    ("Deputeti Edi Rama", None, 1),
    ("Dr. Sali Berisha", None, 2),
    ("Erjon Veliaj", None, 6),              # Erjon vs Erion
    ("Belind Këlliçi", None, 7),
    ("Kryetari Benet Beci", None, 9),
    ("Z. Ulsi Manja", "Shaban", 27),
    ("Oerd Bylykbashi (PD)", None, 45),
    ("Niko Peleshi (PS)", None, 87),

    # Unrelated names that should NOT match (must yield None or different)
    ("John Doe", None, None),
    ("Artan Hoxha", None, None),
    ("Mirela Kumbaro", None, None)
]

class TestIdentityResolution(unittest.TestCase):

    def setUp(self):
        self.resolver = IdentityResolver(BENCHMARK_POLITICIANS, threshold=85.0)

    def test_stable_numeric_id(self):
        # Known canonical mapping
        self.assertEqual(generate_stable_numeric_id("Edi Rama", {"Edi Rama": 1}), 1)
        self.assertEqual(generate_stable_numeric_id("Sali Berisha", {"Sali Berisha": 2}), 2)
        # New entity produces stable hash (same input -> same output)
        id1 = generate_stable_numeric_id("Deputeti Ri Test")
        id2 = generate_stable_numeric_id("Deputeti Ri Test")
        self.assertEqual(id1, id2)
        self.assertGreaterEqual(id1, 1000)

    def test_text_normalization(self):
        self.assertEqual(normalize_albanian_text("Këlliçi"), "kellici")
        self.assertEqual(normalize_albanian_text("Çarçani"), "carcani")
        self.assertEqual(normalize_albanian_text("  Oerd   Bylykbashi  "), "oerd bylykbashi")

    def test_precision_on_labeled_set(self):
        correct = 0
        total = len(LABELED_DATASET)

        for raw_name, father_name, expected_id in LABELED_DATASET:
            matched, confidence = self.resolver.resolve(raw_name, father_name)
            matched_id = matched.get("numeric_id") if matched else None
            
            if matched_id == expected_id:
                correct += 1
            else:
                print(f"Mismatch: '{raw_name}' -> got {matched_id} ({confidence}%), expected {expected_id}")

        precision = correct / float(total)
        print(f"\nIdentity Resolution Evaluation: {correct}/{total} correct -> Precision: {precision:.4f}")
        # Acceptance criteria requires precision >= 0.95
        self.assertGreaterEqual(precision, 0.95)

if __name__ == "__main__":
    unittest.main()
