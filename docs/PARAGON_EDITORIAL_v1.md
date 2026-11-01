# Editorial remarks v1

NOVARIC® Sh.A. The editorial block is an opinion. It is not an input to the PARAGON® composite.

The committed file `data/editorial/remarks.json` is a JSON array. It is seeded empty. Do not paste the example below into that file.

## How an editor adds a remark

1. Open `data/editorial/remarks.json`.
2. Append one object. Leave `status` as `draft` until every scored claim has a URL.
3. Set `status` to `published` only when the text is ready to show.
4. Commit the file. Draft rows stay in the file and are not rendered. A published row with no cited URL is not rendered either.

A scored criterion must set its own `sourceUrl`. Sources on the remark do not license a criterion that has no URL. Notes without a URL are omitted, so an unsourced allegation is never shown.

`editorialScore` is the editor’s overall opinion from 0 to 100, or `null`. The profile keeps the PARAGON® composite exactly as scored. The card shows the two numbers side by side.

## Suggested criteria

Use these names. A criterion is scored only with at least one cited source.

| Criterion | What the note may rest on |
|---|---|
| Integrity & credentials / Integriteti dhe kredencialet | Verified education or diplomas, an ILDKPKI asset declaration, or a court, prosecution or decriminalisation record |
| Substance of contributions / Substanca e kontributeve | A cited bill, report, or official speech |
| Expertise / Ekspertiza | A cited qualification or official role record |
| Public conduct / Sjellja publike | A cited official record of conduct |

## Example (documentation only)

```json
{
  "profileId": "vip0",
  "editor": { "name": "Editor name", "title": "Editor, NOVARIC® Sh.A." },
  "date": "2026-11-01",
  "remarksSq": "Shembull. Ky tekst nuk është një vlerësim i publikuar.",
  "remarksEn": "Example only. This text is not a published assessment.",
  "editorialScore": null,
  "criteria": [
    {
      "name": "Integrity & credentials",
      "score": null,
      "note": "Score only after the declaration URL is checked.",
      "sourceUrl": "https://www.ildkpki.al/"
    }
  ],
  "sources": [
    { "label": "ILDKPKI", "url": "https://www.ildkpki.al/" }
  ],
  "status": "draft"
}
```

`vip0` is not a profile. The example stays in this document.

## Limited evidence

When two or more scored PARAGON® dimensions on the profile are proxy methods, the profile shows `Evidencë e kufizuar / Limited evidence`. That badge does not change the composite.
