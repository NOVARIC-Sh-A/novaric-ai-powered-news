import unittest

from scripts.collect_official_politician_sources import (
    civil_birth_date,
    fold,
    index_kuvendi,
    licence_allows_copy,
    match_kuvendi_record,
    merge_profile,
    official_website,
    parse_cv_text,
)


class OfficialSourceRulesTest(unittest.TestCase):
    def test_placeholder_birth_dates_are_rejected(self):
        self.assertIsNone(civil_birth_date("2022-01-15T14:11:06.0033333"))
        self.assertIsNone(civil_birth_date("0001-01-01T00:00:00"))
        self.assertIsNone(civil_birth_date(None))

    def test_timezone_offset_birth_dates_are_accepted(self):
        self.assertEqual(civil_birth_date("1944-10-14T23:00:00"), "1944-10-15")
        self.assertEqual(civil_birth_date("1964-07-03T22:00:00"), "1964-07-04")
        self.assertEqual(civil_birth_date("1970-01-02T00:00:00"), "1970-01-02")

    def test_duplicate_kuvendi_names_are_not_matched(self):
        rows = [
            {"emer": "ANA", "mbiemer": "NAKO", "id": "a"},
            {"emer": "Ana", "mbiemer": "Nako", "id": "b"},
        ]
        self.assertEqual(index_kuvendi(rows), {})
        self.assertEqual(fold("Ogerta Manastirliu"), fold("OGERTA MANASTIRLIU"))

    def test_merge_does_not_fabricate_scores(self):
        profile = {
            "id": "vip2",
            "name": "Sali Berisha",
            "composite": None,
            "dynamicScore": None,
            "paragonDimensions": None,
            "primaryRole": "unsourced",
            "shortBio": "unsourced",
            "electoralZone": "Tiranë",
        }
        merged = merge_profile(profile, {"fieldSources": {}, "mandates": [], "officialLinks": [], "affiliations": []}, "2026-10-31")
        self.assertIsNone(merged["composite"])
        self.assertIsNone(merged["dynamicScore"])
        self.assertIsNone(merged["paragonDimensions"])
        self.assertIsNone(merged["primaryRole"])
        self.assertIsNone(merged["shortBio"])
        self.assertIsNone(merged["electoralZone"])

    def test_parenthetical_and_spelling_variants_match_once(self):
        records = [
            {"emer": "LAVDRIM", "mbiemer": "KRRASHI", "id": "1"},
            {"emer": "FLORENC", "mbiemer": "SPAHO", "id": "2"},
            {"emer": "ISUF", "mbiemer": "CELAJ", "id": "3"},
            {"emer": "ARBI", "mbiemer": "AGALLIU", "id": "4"},
        ]
        record, reason = match_kuvendi_record("Lavdrim Krashi (Dibër)", records)
        self.assertEqual(record["id"], "1")
        self.assertIn("variant", reason)
        record, reason = match_kuvendi_record("Florenca Spaho", records)
        self.assertEqual(record["id"], "2")
        record, reason = match_kuvendi_record("Gjek Celaj", records)
        self.assertIsNone(record)
        self.assertIn("not in the current", reason)
        record, reason = match_kuvendi_record("Anila Agalliu", records)
        self.assertIsNone(record)
        records.append({"emer": "ILIR", "mbiemer": "METAJ", "id": "meta-wrong"})
        record, reason = match_kuvendi_record("Ilir Meta", records)
        self.assertIsNone(record)
        self.assertIn("not in the current", reason)

    def test_cv_text_extracts_official_birth_and_education(self):
        parsed = parse_cv_text(
            "Datëlindja: 16.4.1962 Vendlindja: Berat E-mail: a@parlament.al "
            "Jetëshkrimi: Ka kryer studimet në Universitetin Buqësor të Tiranës dhe ka punuar si drejtor."
        )
        self.assertEqual(parsed["dateOfBirth"], "1962-04-16")
        self.assertEqual(parsed["placeOfBirth"], "Berat")
        self.assertIn("Universitetin Buqësor", parsed["education"])
        self.assertIn("drejtor", parsed["career"])

    def test_licence_and_official_hosts(self):
        self.assertTrue(licence_allows_copy("CC BY-SA 4.0"))
        self.assertFalse(licence_allows_copy("CC BY-NC 4.0"))
        self.assertTrue(official_website("https://www.kryeministria.al/kryeministri/"))
        self.assertFalse(official_website("https://www.sali-berisha.com/"))


if __name__ == "__main__":
    unittest.main()
