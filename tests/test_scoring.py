"""
NOVARIC® Test Suite — PARAGON Scoring Formulas
Tests the 7 PARAGON dimension formulas, peer normalization, 180-day time decay,
and template-guarded commentary generation.
"""

import unittest
from services.paragon_scoring_engine import (
    calculate_paragon_dimensions,
    apply_time_decay,
    generate_albanian_commentary
)

class TestParagonScoring(unittest.TestCase):

    def test_decay_half_life(self):
        # 0 days elapsed -> decay factor 1.0
        self.assertAlmostEqual(apply_time_decay(0, 180), 1.0, places=2)
        # 180 days elapsed -> decay factor 0.5
        self.assertAlmostEqual(apply_time_decay(180, 180), 0.5, places=2)
        # 360 days elapsed -> decay factor 0.25
        self.assertAlmostEqual(apply_time_decay(360, 180), 0.25, places=2)

    def test_paragon_dimensions_synthetic_fixture(self):
        synthetic_metrics = {
            "bills_sponsored_lead": 3,
            "bills_sponsored_coauthor": 8,
            "plenary_speeches_count": 15,
            "committee_attendance_pct": 85.0,
            "asset_declaration_on_time": True,
            "asset_audit_clean": True,
            "vote_participation_pct": 80.0,
            "constituency_initiatives": 4,
            "regional_hearings_attended": 5,
            "preferential_votes_count": 8000,
            "key_debates_led": 6,
            "amendments_passed": 2,
            "total_words_spoken": 20000,
            "constitutional_compliance_score": 85.0,
            "institutional_reform_initiatives": 3,
            "party_vote_alignment_pct": 95.0,
            "group_meeting_attendance_pct": 90.0,
            "recent_media_mentions_count": 50,
            "media_avg_sentiment": 0.10,
            "toxicity_score": 0.05,
            "days_since_latest_media": 5.0
        }

        dimensions, composite, _ = calculate_paragon_dimensions(synthetic_metrics)

        # Assert all 7 dimensions exist and are within [0, 100]
        expected_dims = [
            "Angazhimi Politik",
            "Llogaridhënia",
            "Përfaqësimi",
            "Asertiviteti",
            "Qeverisja",
            "Kohësioni",
            "Narrativa"
        ]
        for dim in expected_dims:
            self.assertIn(dim, dimensions)
            self.assertGreaterEqual(dimensions[dim], 0.0)
            self.assertLessEqual(dimensions[dim], 100.0)

        # Composite must be non-zero and bounded
        self.assertGreater(composite, 50.0)
        self.assertLessEqual(composite, 100.0)

    def test_commentary_generation(self):
        dims = {
            "Angazhimi Politik": 85.0,
            "Llogaridhënia": 90.0,
            "Përfaqësimi": 80.0,
            "Asertiviteti": 75.0,
            "Qeverisja": 88.0,
            "Kohësioni": 95.0,
            "Narrativa": 82.0
        }
        metrics = {
            "bills_sponsored_lead": 4,
            "bills_sponsored_coauthor": 10,
            "plenary_speeches_count": 20,
            "asset_declaration_on_time": True,
            "vote_participation_pct": 92.0
        }
        commentary = generate_albanian_commentary("Oerd Bylykbashi", "PD", 85.5, dims, metrics)
        self.assertIn("Oerd Bylykbashi (PD)", commentary)
        self.assertIn("PARAGON®", commentary)
        self.assertIn("ILDKPKI", commentary)
        # Verify 3 sentences
        sentences = [s.strip() for s in commentary.split(".") if s.strip()]
        self.assertEqual(len(sentences), 3)

if __name__ == "__main__":
    unittest.main()
