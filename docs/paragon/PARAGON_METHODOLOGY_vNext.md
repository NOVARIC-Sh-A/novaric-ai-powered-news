# PARAGON methodology vNext

Version `methodology_vNext_2026-11-01`. This file does not replace `docs/PARAGON_ASERTIVITETI.md`, `docs/PARAGON_REMAINING_DIMENSIONS.md`, or `docs/PARAGON_METHODOLOGY_v2.md`. Those remain the record of what was computed. This version states what may be published after the fail-closed audit.

Publication rule, shared by `services/paragonPublicationGate.ts` and `services/paragon_publication_gate.py`: a numeric score is public only when `data/paragon/publication_gate.json` has `authorized: true`, `auditState: "published"`, `enabled` is not false, and the value has provenance. Any other state, including a stored number, a seven-element array, a previous publication, or a completed calculation, stays unpublished. The default gate is `under_review` and not authorized.

Missing data: null means not measured. Zero means a measured zero. There is no midpoint fill.

Audit states: `under_review`, `insufficient_coverage`, `verified`, `published`. Only `published` together with authorization can show a number.

Weights below are provisional. They have not had expert review or a sensitivity test. No confidence interval is stated, because no interval method has been validated.

The calibration study has not been executed.

## Indicators

### D1 Angazhimi Politik — provisional weight 0.18

Definition used in the current export: plenary roll-call presence, stored under the key `committee_attendance_pct`.

Source: Kuvendi files titled “Votimi i deputetëve”, listed from `https://kuvendiapi.azurewebsites.net/api/dokumentet`, files created on or after 2025-09-01. Retrieval date on the roll-call file: 2026-10-31.

Numerator: rows parsed as present. Denominator: roll-call rows matched to the profile.

Role normalization: none. The same presence rate is used for every matched profile.

Missing data: no matched roll call, or fewer than 8 roll calls in the collector, leaves the value null.

Reliability: the count is a parse of official PDFs. Name matching can attach the wrong person. The label “Angazhimi Politik” is wider than presence.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D2 Llogaridhënia — provisional weight 0.18

Definition used: share of roll calls with a cast vote (`participated / rollcalls`).

Source and period: the same roll-call set as D1.

Numerator: participated. Denominator: roll calls.

Role normalization: none. Asset declarations, answers to questions, and court records are not in this number.

Missing data: null when the roll-call sample is below the collector minimum.

Reliability: same parse limits as D1. Construct: voting participation is not accountability.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D3 Përfaqësimi — provisional weight 0.14

Definition used: electoral subject’s share of valid votes in the member’s district (`kqz_subject_vote_share_v1`). It is a proxy. It is the same number for every member of that subject in that district.

Source: Lidhja 1, public copy `https://droni.al/wp-content/uploads/2025/08/250825_Lidhja-1_rez_perf_2025_zone_V1.pdf`, cross-checked to KQZ mandate announcements. Election date 11 May 2025. Transcribed in `data/official/kqz_2025_zone_results.json`, retrieved 2026-11-01.

Numerator: subject votes. Denominator: valid votes in the district.

Role normalization: none. Preferential votes were not in the table.

Missing data: null when the profile has no certified district and subject in that table.

Reliability: district totals can be re-added. The construct is not an individual preferential vote.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D4 Asertiviteti — provisional weight 0.14

Definition used: `plenary_procesverbal_v1` in `docs/PARAGON_ASERTIVITETI.md`. For a profile with turns and words and no counted questions, interpellations or motions:

`min(40, turns × 8)` over cap 40, plus `min(30, words / 25000 × 30)` over cap 30, divided by the sum of those caps, times 100.

Source: plenary minutes, document type `cc439e41-586a-45b0-a005-a505f6a141a4`, from 2025-09-01. Retrieval date 2026-10-31. File `data/official/plenary_assertiveness.json`.

Numerator: counted turns and counted words. Denominator: the caps of the components that are greater than zero.

Role normalization: none.

Missing data: null when no turn and no named question, interpellation or motion is attributed.

Reliability: a turn is a printed name plus speech. Volume is not influence.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D5 Qeverisja — provisional weight 0.14

Definition used: `present / meetings × 100` from the header list of a committee minute (`committee_header_attendance_v2`), after at least one minute.

Source: committee minutes on the same Kuvendi document API, from 2025-09-01. Retrieval date 2026-11-01. File `data/official/committee_governance.json`.

Numerator: header lines under “Marrin pjesë”. Denominator: header lines under “Marrin pjesë” or “Mungojnë”.

Role normalization: none. Ministers are not scored from a different series. KLSH findings and interpellation answers were not used.

Missing data: null when the person is never named in a header list.

Reliability: a later sentence in the body is excluded. Name matching remains a source of error. Attendance is not governance.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D6 Kohësioni — provisional weight 0.10

Definition used: votes cast with the majority of the profile’s parliamentary group on the same roll call, among votes the profile cast (`aligned / comparable`).

Source and period: the same roll-call set as D1. Minimum 5 comparable votes in the collector.

Numerator: aligned votes. Denominator: comparable votes.

Role normalization: none. Group-meeting attendance is not in the file.

Missing data: null below the minimum.

Reliability: the group majority is computed inside the parsed sheet. Agreement with a group is not, by itself, accountability, and it is a narrow reading of cohesion.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### D7 Narrativa — provisional weight 0.12

Definition used: `narrative_topic_stability_v1`. Classified plenary turns that contain the most frequent topic in `data/official/narrative_lexicon_v1.json`, divided by classified turns, times 100. Minimum 5 classified turns. A turn may count toward more than one topic.

Source: the same plenary minutes as D4. Retrieval recorded on `data/official/narrative_consistency.json` as 2026-11-01.

Numerator: turns containing the dominant topic. Denominator: turns that hit at least one lexicon stem.

Role normalization: none.

Missing data: null below five classified turns.

Reliability: the lexicon is a word list, not a judgement of consistency with a vote. Speech-to-bill joins were not built.

Uncertainty: not quantified.

Verification status: `under_review`. Not public.

### Composite

Sum of available dimension times provisional weight, divided by the sum of those weights, when at least two dimensions are scored and the weight sum is at least 0.25. Otherwise null.

The composite is not public while the gate is closed. Editorial scores are not an input.

### Benchmark

The chart benchmark is the unweighted mean of stored scores for that dimension. It is not a role-specific reference. No role benchmark is applied. A role benchmark would require a cited series for that role. None is authorized here.

## Calibration study plan

This plan has not been executed.

1. Draw a blind sample of members, stratified by party, district magnitude, and whether the person holds an executive office.
2. Give two reviewers the same official documents and the indicator definitions above, without the stored scores and without each other’s marks.
3. Each reviewer records numerator, denominator, and a score, or null.
4. Compute inter-rater agreement on the null-versus-scored decision and on the numeric score where both scored.
5. Compare reviewer scores with the stored pipeline output and list every disagreement.
6. Check bias by party, gender, and executive office. A difference is reported; it is not adjusted in secret.
7. Repeat the composite with each provisional weight moved by 0.05, one weight at a time, and publish the rank changes.
8. Only after that study, and a written decision, may `auditState` move to `verified` and then, with `authorized: true`, to `published`.

No step above has been run.
