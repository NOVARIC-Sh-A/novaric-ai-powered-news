/**
 * Provides a detailed risk profile of the Albanian media environment.
 * This context helps the AI model make more nuanced and accurate assessments.
 * @param country The name of the country (currently only "Albania" is supported with detail).
 * @returns A string describing the media risk profile.
 */
export const getRiskProfile = (country: string): string => {
  if (country.toLowerCase() !== 'albania') {
    return "Kontekst i përgjithshëm: Vlerësoni pretendimin bazuar në burime me reputacion të njohur globalisht.";
  }

  return `
Kontekst Kritik për Shqipërinë:
- Peizazhi Mediatik: Jashtëzakonisht i polarizuar dhe i ndikuar nga interesat politike dhe të biznesit. Shumë media shërbejnë si zëdhënëse të partive politike ose pronarëve të tyre. Besueshmëria e burimit është kritike.
- Disa media kryesore dhe orientimi i tyre i përgjithshëm (subjekt ndryshimesh):
  - Pro-Qeveri (PS): Top Channel, TV Klan, Gazeta Shqiptare, Shqiptarja.com.
  - Pro-Opozitë (PD): Syri.net, Lapsi.al (shpesh kritik), media pranë grupimit Berisha.
  - Kritike/Të Pavarura (relativisht): BIRN Albania, Reporter.al, Exit.al.
  - Tabloide/Sensacionaliste: JOQ Albania, Pamfleti.
- Tema të Zakonshme Dezinformimi:
  - Sulme ndaj reformës në drejtësi (SPAK, GJKKO).
  - Narrativa pro-ruse ose anti-BE/SHBA.
  - Korrupsioni i supozuar (shpesh i përdorur si armë politike pa prova).
  - Skandale personale të fabrikuara për të dëmtuar figura publike.
- Teknika të Përhapura të Kornizimit (Framing):
  - Gjuhë emocionale dhe nxitëse.
  - Sulme personale (Ad Hominem) në vend të kundërshtimit të argumenteve.
  - Paraqitja e opinionit si fakt.
  - Përzgjedhja e fakteve ('cherry-picking') për të mbështetur një narrativë specifike.
  `;
};

/**
 * Creates a comprehensive, single-call prompt for the Gemini API to perform a dynamic analysis.
 * @param articleText The full text of the article to be analyzed.
 * @param country The country context for the analysis.
 * @returns A detailed prompt string for the Gemini API.
 */
export const createComprehensiveAnalysisPrompt = (articleText: string, country: string): string => {
  const riskProfile = getRiskProfile(country);

  return `
You are an expert media analyst for NOVARIC®, an Albanian news platform. Your task is to perform a nuanced integrity analysis of the provided article, considering the specific context of the Albanian media landscape.
Return your findings as a SINGLE, valid JSON object. Do not include any text, markdown, or explanations outside the JSON object itself.

**Analysis Context & Risk Profile:**
---
${riskProfile}
---

**Article to Analyze:**
---
${articleText}
---

**Required Analysis & JSON Output:**
Your entire output MUST be a single JSON object. All text values must be in Albanian. Analyze the article and produce a JSON with the following structure:

{
  "originalText": "The full original article text provided by the user.",
  "claims": [
    {
      "claim": "Extract a specific, verifiable factual claim from the text.",
      "verdict": "One of: 'True', 'False', 'Misleading', 'Unverifiable'",
      "reason": "Briefly explain the verdict. Mention sources if applicable.",
      "sources": [],
      "credibilityScore": 0.8,
      "detectedBias": "One of: 'Pro-Qeveri', 'Pro-Opozitë', 'Neutral', 'Tjetër'",
      "framingTechniques": ["List of detected techniques, e.g., 'Gjuhë emocionale', 'Sulm personal (Ad Hominem)'"],
      "disinformationPattern": "Identify a common pattern if it exists, e.g., 'Sulm ndaj reformës në drejtësi', or 'N/A' if none."
    }
  ],
  "integrityScore": 85,
  "verdict": "One of: 'High Integrity', 'Moderate Integrity', 'Low Integrity'",
  "warnings": ["A list of summary warnings, e.g., 'Artikulli përdor gjuhë tejet sensacionaliste.'"],
  "analysisSummary": {
      "mainBias": "A one-sentence summary of the article's main bias.",
      "dominantNarrative": "A one-sentence summary of the main narrative being pushed."
  }
}
  `;
};