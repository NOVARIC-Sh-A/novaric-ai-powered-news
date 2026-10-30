#!/usr/bin/env python3
"""
Post-Flight Verification Script for PARAGON® Scorer Production Run
"""

import sqlite3
import json
import math
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "db" / "novaric.db"

def verify():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    print("=== POST-FLIGHT VERIFICATION REPORT ===\n")

    # a. Total rows in paragon_scores
    cur.execute("SELECT count(*) FROM politicians WHERE is_active_mp = 1")
    active_mp_count = cur.fetchone()[0]

    cur.execute("SELECT MAX(period_end) FROM paragon_scores")
    latest_period_row = cur.fetchone()
    latest_period = latest_period_row[0] if latest_period_row else None

    cur.execute("SELECT count(*) FROM paragon_scores WHERE period_end = ?", (latest_period,))
    total_scores = cur.fetchone()[0]
    print(f"a. Active MPs: {active_mp_count} | Total rows in paragon_scores (period: {latest_period}): {total_scores}")
    assert total_scores == active_mp_count, f"Mismatch: {total_scores} != {active_mp_count}"

    # b. Non-null composite count
    cur.execute("SELECT count(*) FROM paragon_scores WHERE period_end = ? AND composite IS NOT NULL", (latest_period,))
    non_null_composites = cur.fetchone()[0]

    cur.execute("SELECT count(*) FROM paragon_scores WHERE period_end = ? AND composite IS NULL", (latest_period,))
    null_composites = cur.fetchone()[0]
    print(f"b. Non-null composite count: {non_null_composites} (Null composites: {null_composites})")

    # c. Dimension null count per dimension
    print("\nc. Dimension NULL counts (proving missing data scores NULL, never 0):")
    for d in ["d1_policy_engagement", "d2_accountability", "d3_representation", "d4_assertiveness", "d5_governance", "d6_party_cohesion", "d7_narrative"]:
        cur.execute(f"SELECT count(*) FROM paragon_scores WHERE period_end = ? AND {d} IS NULL", (latest_period,))
        null_cnt = cur.fetchone()[0]
        cur.execute(f"SELECT count(*) FROM paragon_scores WHERE period_end = ? AND {d} = 0", (latest_period,))
        zero_cnt = cur.fetchone()[0]
        print(f"   {d}: NULL={null_cnt}, ZERO={zero_cnt}")

    # d. Composite distribution stats
    cur.execute("SELECT composite FROM paragon_scores WHERE period_end = ? AND composite IS NOT NULL ORDER BY composite ASC", (latest_period,))
    comps = [r[0] for r in cur.fetchall()]
    n = len(comps)
    assert n > 0, "No composite scores found!"

    c_min = min(comps)
    c_max = max(comps)
    c_mean = sum(comps) / n
    variance = sum((x - c_mean) ** 2 for x in comps) / n
    c_std = math.sqrt(variance)

    def percentile(data, pct):
        k = (len(data) - 1) * pct
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return data[int(k)]
        d0 = data[int(f)] * (c - k)
        d1 = data[int(c)] * (k - f)
        return d0 + d1

    p25 = percentile(comps, 0.25)
    median = percentile(comps, 0.50)
    p75 = percentile(comps, 0.75)

    print(f"\nd. Composite Distribution Stats (N={n}):")
    print(f"   Min:    {c_min:.1f}")
    print(f"   P25:    {p25:.1f}")
    print(f"   Median: {median:.1f}")
    print(f"   Mean:   {c_mean:.1f}")
    print(f"   P75:    {p75:.1f}")
    print(f"   Max:    {c_max:.1f}")
    print(f"   StdDev: {c_std:.2f}")
    assert c_min > 0.0 and c_max <= 100.0, f"Score bounds invalid: min={c_min}, max={c_max}"

    # e. Top 5 and bottom 5 MPs by composite
    print("\ne. Top 5 MPs by Composite Score:")
    cur.execute("""
        SELECT p.full_name, p.party_short, ps.composite,
               ps.d1_policy_engagement, ps.d2_accountability, ps.d3_representation,
               ps.d4_assertiveness, ps.d5_governance, ps.d6_party_cohesion, ps.d7_narrative
        FROM paragon_scores ps
        JOIN politicians p ON ps.politician_id = p.id
        WHERE ps.period_end = ?
        ORDER BY ps.composite DESC LIMIT 5
    """, (latest_period,))
    for r in cur.fetchall():
        print(f"   {r['full_name']} ({r['party_short']}) -> Composite: {r['composite']}% | D1:{r['d1_policy_engagement']} D2:{r['d2_accountability']} D3:{r['d3_representation']} D4:{r['d4_assertiveness']} D5:{r['d5_governance']} D6:{r['d6_party_cohesion']} D7:{r['d7_narrative']}")

    print("\ne. Bottom 5 MPs by Composite Score:")
    cur.execute("""
        SELECT p.full_name, p.party_short, ps.composite,
               ps.d1_policy_engagement, ps.d2_accountability, ps.d3_representation,
               ps.d4_assertiveness, ps.d5_governance, ps.d6_party_cohesion, ps.d7_narrative
        FROM paragon_scores ps
        JOIN politicians p ON ps.politician_id = p.id
        WHERE ps.period_end = ?
        ORDER BY ps.composite ASC LIMIT 5
    """, (latest_period,))
    for r in cur.fetchall():
        print(f"   {r['full_name']} ({r['party_short']}) -> Composite: {r['composite']}% | D1:{r['d1_policy_engagement']} D2:{r['d2_accountability']} D3:{r['d3_representation']} D4:{r['d4_assertiveness']} D5:{r['d5_governance']} D6:{r['d6_party_cohesion']} D7:{r['d7_narrative']}")

    conn.close()

if __name__ == "__main__":
    verify()
