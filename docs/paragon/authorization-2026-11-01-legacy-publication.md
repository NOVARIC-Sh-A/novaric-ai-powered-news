# Authorization to publish stored legacy PARAGON scores

Date: 1 November 2026, 22:28 Europe/Tirana (`2026-11-01T22:28:00+01:00`).

Approver: Dr Alban Gj. THIKA.

Decision: the fail-closed publication gate is open for the legacy D1–D7 scores and composites already stored in `db/paragon_scores_export.json` and in `paragon_scores`. The profile page shows the seven-axis fingerprint from those stored values. A dimension that has no stored value is shown as “Në pritje të të dhënave / Awaiting data”. It is not filled with 0 or 50.

What was not changed:

- No score row was updated or deleted.
- Provenance fields and snapshots stay as they were.
- The zodiac sign is not a score.
- Name-hash integrity, morality, vulnerability and behaviour labels stay in `services/paragon_hash_quarantine.ts` and are not shown.
- The verified-count observatory remains a separate panel under the fingerprint.

The earlier closed gate row `gate-v1` is left in place. This decision is the additional row `gate-legacy-2026-11-01` in `db/migrations/20261101_paragon_legacy_publication.sql` and the history row `hist-legacy-publication-2026-11-01`.
