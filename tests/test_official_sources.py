import unittest

from scripts.collect_official_politician_sources import (
    choose_boci_row,
    civil_birth_date,
    fold,
    former_role_from_mandates,
    index_kuvendi,
    licence_allows_copy,
    match_kuvendi_record,
    merge_profile,
    offices_from_public_pages,
    official_website,
    parse_cv_text,
    repair_open_ended_roles,
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
        parsed = parse_cv_text(
            "Znj. Balluku është diplomuar në Institutin Teknologjik të Athinës, në degën Administrim Biznesi."
        )
        self.assertIn("Institutin Teknologjik", parsed["education"])
        parsed = parse_cv_text(
            "Jetëshkrimi: Ka përfunduar arsimin e lartë në Universitetin e Tiranës, dega Mjekësi."
        )
        self.assertIn("Universitetin e Tiranës", parsed["education"])

    def test_dated_former_role_skips_list_labels(self):
        chosen = former_role_from_mandates([
            {"period": "2002-07-29 — 2003-07-18", "role": "Lista e Ministrave të Jashtëm të Shqipërisë"},
            {"period": "1999-10-29 — 2002-02-22", "role": "Kryeministri i Shqipërisë"},
        ])
        self.assertEqual(chosen["role"], "Kryeministri i Shqipërisë")

    def test_official_role_is_not_cleared_and_undated_wikidata_role_is(self):
        kept = {
            "primaryRole": "Deputet i Kuvendit të Shqipërisë",
            "mandates": [],
            "fieldSources": {"currentRole": {"value": "Deputet i Kuvendit të Shqipërisë", "sourceUrl": "https://kqz.gov.al"}},
        }
        repair_open_ended_roles(kept)
        self.assertEqual(kept["primaryRole"], "Deputet i Kuvendit të Shqipërisë")
        dated = {
            "primaryRole": "Kryeministri i Shqipërisë (1999-10-29 — 2002-02-22)",
            "mandates": [],
            "fieldSources": {
                "currentRole": {
                    "value": "Kryeministri i Shqipërisë (1999-10-29 — 2002-02-22)",
                    "sourceUrl": "https://www.wikidata.org/wiki/Q727132",
                }
            },
        }
        repair_open_ended_roles(dated)
        self.assertIn("1999-10-29", dated["primaryRole"])
        stale = {
            "primaryRole": "Kryeministër",
            "mandates": [],
            "secondaryRoles": ["old"],
            "fieldSources": {"currentRole": {"value": "Kryeministër", "sourceUrl": "https://www.wikidata.org/wiki/Q1"}},
        }
        repair_open_ended_roles(stale)
        self.assertIsNone(stale["primaryRole"])
        self.assertNotIn("currentRole", stale["fieldSources"])

    def test_public_pages_yield_only_the_stated_office(self):
        pages = {
            "https://ps.al/": "Adresim publik i Kryeministrit, njëherësh Kryetar i Partisë Socialiste, Edi Rama për Grupin",
            "https://pd.al/": "Kryetari i Partisë Demokratike, Prof. Dr. Sali Berisha, ka publikuar",
            "https://www.tirana.al/faqe/kryetari-i-bashkise": "Erion Veliaj është Kryetar i Bashkisë së Tiranës. Ai lindi në Tiranë.",
        }
        offices = {item["name"]: item["role"] for item in offices_from_public_pages(pages)}
        self.assertEqual(offices["Edi Rama"], "Kryeministër, njëherësh Kryetar i Partisë Socialiste")
        self.assertEqual(offices["Sali Berisha"], "Kryetar i Partisë Demokratike")
        self.assertEqual(offices["Erion Veliaj"], "Kryetar i Bashkisë së Tiranës")
        self.assertEqual(offices_from_public_pages({}), [])

    def test_boci_is_separated_by_district(self):
        records = [
            {"emer": "LUCIANO", "mbiemer": "BOCI", "id": "shkoder", "status": 0, "qarku": 7},
            {"emer": "LUCIANO", "mbiemer": "BOCI", "id": "elbasan", "status": 1, "qarku": 1},
        ]
        chosen, note = choose_boci_row("Luçiano Boçi", "Shkodër", True, records)
        self.assertEqual(chosen["id"], "shkoder")
        self.assertIn("Shkodër", note)
        chosen, note = choose_boci_row("Luçiano Boçi", "Shkodër", False, records)
        self.assertIsNone(chosen)
        self.assertIn("Elbasan", note)

    def test_licence_and_official_hosts(self):
        self.assertTrue(licence_allows_copy("CC BY-SA 4.0"))
        self.assertFalse(licence_allows_copy("CC BY-NC 4.0"))
        self.assertTrue(official_website("https://www.kryeministria.al/kryeministri/"))
        self.assertTrue(official_website("https://www.tirana.al/faqe/kryetari-i-bashkise"))
        self.assertFalse(official_website("https://www.sali-berisha.com/"))


if __name__ == "__main__":
    unittest.main()
