"""
NOVARIC® Test Suite — Ingestion Parsers
Tests parsing fixtures for Kuvendi OData, ILDKPKI asset declarations, KQZ, and RSS.
"""

import unittest
from ingestion.kuvendi_odata import parse_kuvendi_mp, map_kuvendi_party_slug
from ingestion.ildkpki import check_filing_deadline, parse_asset_declaration_payload
from ingestion.kqz import parse_candidate_cv
from ingestion.rss_worker import hash_url, parse_media_article
from ingestion.identity_resolution import IdentityResolver

class TestIngestionParsers(unittest.TestCase):

    def test_kuvendi_mp_parser(self):
        sample_raw = {
            "Id": "101",
            "Emri": "Oerd",
            "Atesia": "Gëzim",
            "Mbiemri": "Bylykbashi",
            "Partia": "Partia Demokratike",
            "Zona": "Durrës",
            "Email": "obylykbashi@parlament.al",
            "FotoUrl": "https://kuvendi.al/photos/oerd.jpg"
        }
        parsed = parse_kuvendi_mp(sample_raw)
        self.assertEqual(parsed["full_name"], "Oerd Bylykbashi")
        self.assertEqual(parsed["party_slug"], "pd")
        self.assertEqual(parsed["electoral_zone"], "Durrës")
        self.assertEqual(parsed["numeric_id"], 45)  # Preserves canonical ID
        self.assertTrue(parsed["is_active_mp"])

    def test_party_slug_mapping(self):
        self.assertEqual(map_kuvendi_party_slug("Grupi Parlamentar i Partisë Socialiste"), "ps")
        self.assertEqual(map_kuvendi_party_slug("Partia Demokratike"), "pd")
        self.assertEqual(map_kuvendi_party_slug("Partia e Lirisë (PL)"), "pl")
        self.assertEqual(map_kuvendi_party_slug("Partia Socialdemokrate"), "psd")
        self.assertEqual(map_kuvendi_party_slug("I Pavarur"), "ind")

    def test_ildkpki_deadline_checker(self):
        # 2024 annual declaration submitted on March 25, 2025 -> ON TIME
        self.assertTrue(check_filing_deadline("2025-03-25", 2024))
        # Submitted on April 5, 2025 -> LATE
        self.assertFalse(check_filing_deadline("2025-04-05", 2024))

    def test_ildkpki_payload_parsing(self):
        assets = [
            {"category": "real_estate", "description": "Apartament Tiranë", "value_low": 12000000, "value_high": 12000000},
            {"category": "liquid", "description": "Llogari bankare", "value_low": 1500000, "value_high": 1500000}
        ]
        res = parse_asset_declaration_payload(
            politician_numeric_id=1,
            decl_year=2024,
            filed_at="2025-03-20",
            assets_raw=assets,
            source_pdf_url="http://ildkpki.al/docs/decl_2024_1.pdf"
        )
        self.assertTrue(res["on_time"])
        self.assertEqual(res["parsed"]["asset_count"], 2)
        self.assertEqual(res["parsed"]["total_assets_estimated_all"], 13500000)
        self.assertGreaterEqual(res["confidence"], 0.9)

    def test_kqz_candidate_cv(self):
        sample_cv = {
            "Arsimi": ["Fakulteti i Drejtësisë, Universiteti i Tiranës"],
            "Profesioni": "Jurist",
            "experience": ["Këshilltar Ligjor", "Deputet"]
        }
        res = parse_candidate_cv(sample_cv)
        self.assertEqual(res["profession"], "Jurist")
        self.assertIn("Fakulteti i Drejtësisë", res["education"][0])

    def test_rss_parser(self):
        resolver = IdentityResolver([{"full_name": "Edi Rama", "numeric_id": 1}])
        article = parse_media_article(
            url="https://top-channel.tv/lajme/123",
            outlet_slug="top-channel",
            title="Kryeministri Edi Rama prezanton buxhetin e ri",
            content_text="Sot në Kuvend u diskutua rritja ekonomike dhe investimet infrastrukturore.",
            resolver=resolver
        )
        self.assertEqual(article["outlet_slug"], "top-channel")
        self.assertEqual(len(article["entities"]), 1)
        self.assertEqual(article["entities"][0]["politician_id"], 1)
        self.assertIn("ekonomi", article["topics"])
        self.assertGreaterEqual(article["sentiment"], 0.0)

if __name__ == "__main__":
    unittest.main()
