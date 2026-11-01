# Përfaqësimi, Qeverisja, Narrativa

NOVARIC® Sh.A. Method `remaining_dimensions_v1`. Committee minutes retrieved 2026-11-01. The KQZ check is the same day.

Nothing in these three dimensions is estimated. A profile without the cited input stays `Në pritje të të dhënave / Awaiting data`. Zodiac is not an input (`Nuk pikëzohet / Not scored`).

The partial label stays on every overall score whose coverage is below 7/7. A profile reaches `Vlerësim i plotë / Full rating` only when all seven dimensions are scored. Peer lines on the radar are the mean of profiles that have that dimension scored (at least two). There is no external benchmark series, so the Benchmark line stays hidden and the chart says it is awaiting data.

## Përfaqësimi (D3) — not scored

The intended input is the official preferential vote, or vote share, of each candidate inside their district and party list, plus the district already stored from the Kuvendi register.

What was checked:

- `https://kqz.gov.al/rezultate-2025` describes the 11 May 2025 parliamentary election (Presidential Decree No. 399 of 5 December 2024). The sentence “Klikoni këtu për t’u konsultuar me rezultatet e zgjedhjeve” is published without a hyperlink.
- `https://iemis.kqz.gov.al/results2025/` loads a results shell. The candidate files it requests, `input/results/json_qv_kandidat_{sigla}.txt`, return HTTP 404. The files that do load (`json_qarku.txt`, `json_qv.txt`, timestamp 26/05/2025) are polling-station turnout counts. They contain no candidate names.
- News reproductions of the KQZ “Tabela Përmbledhëse” give party totals by district. They do not give a complete preferential-vote table for every candidate, and they are not the KQZ document.
- The district already on each profile comes from KQZ Decision No. 34 of 28 August 2025, as compiled in the certified roster, with source `https://kqz.gov.al`. A district label is not a magnitude. It is not turned into a score.

Because no complete, citable per-candidate vote table could be retrieved, Përfaqësimi stays null for every profile. The older engine formula that scales a raw vote count against 10,000 is not used for this run.

## Qeverisja (D5) — committee attendance

Source: committee minutes on `https://kuvendiapi.azurewebsites.net/api/dokumentet`, files created on or after 2025-09-01. A file is kept when the name starts with `Komisioni` or is a `procesverbal` of KEPF, KKIE or another committee, and the name is not a report, calendar, notice, membership list, decision or draft. Duplicate file names are kept once.

A minute counts only when the text contains `Marrin pjesë`. Names in that list are present. Names under the following `Mungojnë` are absent. Names under `Të ftuar` are guests and are not counted. A name is kept when its folded form matches a profile exactly, or when the similarity is at least 0.90 and at least 0.08 above the next profile. That second rule is what links a repeated one-letter difference in the minutes (for example “Arian Ndoja” to the register name “Arjan Ndoja”). The export keeps more than one card for some names; every card with that folded name receives the same count, because the minute names the person once. A guest under `Të ftuar` is not counted.

Formula, for a member named in at least three such minutes:

`present / (present + absent) × 100`

Fewer than three minutes leaves Qeverisja null. The percentage is the dimension score. It uses weight 0.14 in the partial composite. Office-holders who are named in those lists are scored the same way. Office-holders who are not named stay null.

Not used, and why:

- Answers to interpellations and questions are not in the parsed initiative set (`initiativeUsed` is 0 in `data/official/plenary_assertiveness.json`).
- KLSH findings are institution reports. They were not converted into a personal score, because the public record checked here does not attach a numeric finding to each minister.

The count and the minute URLs are in `data/official/committee_governance.json`. Each scored profile cites one of those URLs on evidence key D5.

This retrieval kept 263 distinct minute files and read an attendance list in 251 of them. 94 profiles are named in at least three minutes and receive a Qeverisja score (77 of the 140 active members). Edi Rama is named once, as absent, in `Komisioni i ligjeve 24.10.25`. One minute is below the minimum, so his Qeverisja score stays null.

## Narrativa (D7) — not scored

The intended input is consistency between a stated position and the vote on the same matter, taken from official text.

What is already stored:

- `data/official/plenary_assertiveness.json` has intervention counts and word counts. It does not label a speech as for or against a bill.
- `data/official/kuvendi_rollcall_scores.json` has totals (present, voted, aligned with the group). It does not store the bill or the member’s yes/no on each roll call.

Joining those two files into a consistency percentage would require classifying the stance of the speech. That classification is not a field in the official text, so it is not scored. The engine’s media-sentiment formula is also unused: there is no cited sentiment corpus. Narrativa stays null for every profile.
