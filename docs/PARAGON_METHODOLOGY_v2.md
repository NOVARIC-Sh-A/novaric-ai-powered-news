# PARAGON methodology v2

NOVARIC® Sh.A. Method version `methodology_v2`. Retrieval date 2026-11-01.

This note covers the three dimensions that were still empty or thin after `remaining_dimensions_v1`, and the Benchmark line. A value is published only when the input below exists. Everyone else stays `Në pritje të të dhënave / Awaiting data`. Zodiac is not an input (`Nuk pikëzohet / Not scored`). An overall score below 7/7 keeps the partial-rating label.

Proxy scores carry the badge `Metodë proxy / Proxy method` and a tooltip that names the method.

## Adopted

### Përfaqësimi — `kqz_subject_vote_share_v1` (proxy)

Preferential votes per candidate are still not published as a complete table on `kqz.gov.al` or `iemis.kqz.gov.al` (the candidate files return 404).

The obtainable table is Lidhja 1, “Rezultati përfundimtar i zgjedhjeve për çdo zonë zgjedhore”, 11 May 2025:

`https://droni.al/wp-content/uploads/2025/08/250825_Lidhja-1_rez_perf_2025_zone_V1.pdf`

Vote sums in that table match the printed totals in all 12 districts. Mandate counts match the KQZ commissioner’s announcements:

- Berat, Dibër, Shkodër, Vlorë: `https://kqz.gov.al/lajme/kshz-shperndan-mandatet-dhe-percakton-kandidatet-fitues-per-qarqet-berat-diber-shkoder-vlore`
- Fier, Elbasan, Durrës: `https://kqz.gov.al/lajme/kshz-shperndan-mandatet-per-qarqet-fier-elbasan-durres`
- Kukës, Korçë, Lezhë, Gjirokastër: `https://kqz.gov.al/lajme/kshz-shperndan-mandatet-dhe-percakton-kandidatet-fitues-per-qarqet-kukes-korcce-lezhe-gjirokaster`

Tiranë’s 37-seat split in the same table (PS 19, PD-AMSH 13, Mundësia 2, Lëvizja Bashkë 1, Nisma Shqipëria Bëhet 1, PSD 1) is the split already compiled from KQZ Decision No. 34 of 28 August 2025. The results page `https://kqz.gov.al/rezultate-2025` still has no working link to a candidate file.

Formula, for an active member whose district and electoral subject are in the table (duplicate cards of the same name receive the same figure):

`subject votes in the district / valid votes in the district × 100`

rounded to one decimal. It is the same number for every elected member of that subject in that district. It is not a preferential vote. The transcribed table is `data/official/kqz_2025_zone_results.json`.

### Qeverisja — `committee_header_attendance_v2` (direct)

Same minutes as v1, with two changes.

1. Names are read only from the header, after `Marrin pjesë` or `Mungojnë` and before `Hapet mbledhja` or `Të ftuar`. A later sentence that mentions a name, including “Kryeministri, Edi Rama”, is not attendance. That sentence had been counted as an absence in v1; it is not.
2. The rate is published from the first such minute. The sample size is in the citation: `present/meetings`.

`present / meetings × 100`

Office-holders who never appear on a header list stay null.

### Narrativa — `narrative_topic_stability_v1` (proxy)

Speech-versus-vote on the same bill is not joinable: roll-call storage has totals, not a bill identifier next to each vote. That join was rejected.

What is reproducible is a keyword count on the plenary turn. The lexicon is committed at `data/official/narrative_lexicon_v1.json` (version `narrative_lexicon_v1`). Matching is accent-folded substring search. No model is used.

A turn is classified when its text contains at least one stem. For a member with at least 5 classified turns:

`turns that contain the most frequent topic / classified turns × 100`

The topic counts and a plenary URL are stored in `data/official/narrative_consistency.json`.

### Benchmark and peers

Benchmark, for a dimension with at least two published scores, is the unweighted mean of those scores across every profile. That is the Legislature XI chamber average of the published figure, not an external target.

Peer average (`Mes. kolegëve`) is the same mean inside the member’s parliamentary group, or inside the party when the profile has no group. Fewer than two scored colleagues leaves the peer value empty. The Benchmark line is drawn from the chamber mean.

## Rejected

- Preferential-vote scores. The candidate files on the KQZ results shell are 404, and the zone table has no per-candidate vote.
- List position as a score. The numbered winner lists on the KQZ announcements are allocation order, and the names in Lidhja 1 are alphabetical. Neither is a preferential rank, so position is not turned into points.
- Seat share instead of vote share. Mandate counts are official, but the vote-share column is the finer official magnitude and is what this version uses.
- Answers to interpellations as a governance score. The initiative pass on Kuvendi files did not attribute a personal name (`initiativeUsed` is 0 in `plenary_assertiveness.json`).
- KLSH findings as a personal score. Audit reports are about institutions. They were not converted into a number for a minister.
- A speech-versus-vote consistency score. The stored roll calls cannot be joined to a bill on the same day without a classifier.
- A fixed numeric target (for example 70) as the Benchmark. No official target of that kind was found. The chamber mean above is the reference that can be recomputed from the published scores.
