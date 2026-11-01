# Asertiviteti (D4) — parliamentary floor activity

NOVARIC® Sh.A. Method `plenary_procesverbal_v1`, retrieval date 2026-10-31.

The score uses only text published by the Kuvendi i Shqipërisë. Nothing is estimated.

## Sources

- Plenary minutes: document type `cc439e41-586a-45b0-a005-a505f6a141a4` on `https://kuvendiapi.azurewebsites.net/api/dokumentet`, file name containing `procesverbal`, created on or after 2025-09-01 (Legislature XI). A file is kept when the opening text contains `LEGJISLATURA`, `SEANC` and `PROCESVERBAL`, and the file name is not a committee minute (`KKIE`, `KEPF`, `Komision`).
- Questions: type `9e405b46-a84a-4621-ac26-d662da1529fd`.
- Interpellations: type `82087d8b-dcce-4830-bdcb-c8d88cded624`.
- Motions: file name containing `mocion`, same date window.

Each counted row stores the PDF URL.

## What is counted

A plenary intervention is a turn printed as `Name – speech` in the procesverbal. Words are the words in that turn. A question, interpellation or motion is counted only when the file name or the first lines name the deputy (`deputeti` / `deputetja` plus a name that matches one profile). A group request with no personal name is not assigned.

An MP with no attributed turn and no attributed question, interpellation or motion stays without an Asertiviteti score (`Në pritje të të dhënave / Awaiting data`).

## Formula

Published D4 weights, using only components that are greater than zero:

- interventions: `min(40, turns × 8)`, cap 40
- questions + interpellations + motions: `min(30, count × 15)`, cap 30
- words, when the turn text was extracted: `min(30, words / 25000 × 30)`, cap 30

The dimension score is `sum(points) / sum(caps) × 100`. It is then included in the partial composite with weight 0.14. Zodiac is not an input (`Nuk pikëzohet / Not scored`).
