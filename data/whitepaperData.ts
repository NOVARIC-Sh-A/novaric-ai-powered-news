// ./data/whitepaperData.ts

export interface DimensionData {
    key: 'SRS' | 'CIS' | 'CSC' | 'TRF' | 'ECM';
    name: { sq: string; en: string };
    description: { sq: string; en: string };
    weight: number; 
    inputs: { sq: string[]; en: string[] }; 
    icon: string;
}

export const OFFICIAL_NER_WEIGHTS: DimensionData[] = [
    { 
        key: 'SRS', 
        name: { sq: "Besueshmëria e Burimit", en: "Source Reliability Score" }, 
        description: { sq: "Vlerëson besueshmërinë afatgjatë të burimit mediatik.", en: "Evaluates the long-term trustworthiness of the media source." }, 
        weight: 30, 
        inputs: {
            sq: ["Rekordi historik i saktësisë", "Sjellja ndaj korrigjimeve", "Transparenca e pronësisë", "Pavarësia editoriale"],
            en: ["Historical accuracy record", "Correction behavior", "Ownership transparency", "Editorial independence"]
        }, 
        icon: '🛡️' 
    },
    { 
        key: 'CIS', 
        name: { sq: "Integriteti i Përmbajtjes", en: "Content Integrity Score" }, 
        description: { sq: "Vlerëson cilësinë e brendshme të vetë artikullit.", en: "Assesses the internal quality of the article itself." }, 
        weight: 25, 
        inputs: {
            sq: ["Koherenca logjike", "Densiteti faktik vs spekulimi", "Zbulimi i sensacionalizmit", "Mungesa e kornizimit manipulues"],
            en: ["Logical coherence", "Factual density vs speculation", "Sensationalism detection", "Manipulative framing absence"]
        }, 
        icon: '📜' 
    },
    { 
        key: 'CSC', 
        name: { sq: "Konfirmimi Ndër-Burimor", en: "Cross-Source Corroboration" }, 
        description: { sq: "Mat konfirmimin e pavarur në burime të tjera të besueshme.", en: "Measures independent confirmation across trusted outlets." }, 
        weight: 20, 
        inputs: {
            sq: ["Burime të pavarura të besueshme", "Konfirmimi ndër-rajonal", "Konsistenca e pretendimeve bazë", "Mungesa e dhomave të jehonës"],
            en: ["Independent trusted sources", "Cross-regional confirmation", "Consistency of core claims", "No circular sourcing/echo-chambers"]
        }, 
        icon: '🔗' 
    },
    { 
        key: 'TRF', 
        name: { sq: "Faktori i Rëndësisë Kohore", en: "Temporal Relevance Factor" }, 
        description: { sq: "Merr parasysh freskinë e lajmit dhe ciklin e tij të jetës.", en: "Accounts for news freshness and lifecycle." }, 
        weight: 15, 
        inputs: {
            sq: ["Pesha e fortë në orët e para", "Rënia graduale pas pikut", "Efekt neutral për analiza të hershme"],
            en: ["Strong positive weight in early hours", "Gradual decay after peak relevance", "Near-neutral effect for evergreen analysis"]
        }, 
        icon: '⏱️' 
    },
    { 
        key: 'ECM', 
        name: { sq: "Modifikuesi i Kontekstit të Ekosistemit", en: "Ecosystem Context Modifier" }, 
        description: { sq: "Përshtat rëndësinë bazuar në kontekstin e audiencës.", en: "Adjusts relevance based on audience context." }, 
        weight: 10, 
        inputs: {
            sq: ["Rëndësia lokale vs ndërkombëtare", "Ndjeshmëria politike rajonale", "Afërsia gjuhësore", "Salienca kulturore"],
            en: ["Local vs international importance", "Regional political sensitivity", "Linguistic proximity", "Cultural salience"]
        }, 
        icon: '🌍' 
    },
];

export interface InterpretationBand {
    range: [number, number]; 
    label: { sq: string; en: string };
    confidence: { sq: string; en: string };
    color: string;
}

export const INTERPRETATION_MATRIX: InterpretationBand[] = [
    { range: [85, 100], label: { sq: 'Tejet e besueshme, e konfirmuar dhe relevante', en: 'Highly credible, corroborated, and relevant' }, confidence: { sq: 'Shumë e Lartë', en: 'Very High' }, color: 'bg-green-600/90' },
    { range: [70, 84], label: { sq: 'E besueshme me paqartësi të vogla', en: 'Reliable with minor uncertainties' }, confidence: { sq: 'E Lartë', en: 'High' }, color: 'bg-lime-500/90' },
    { range: [50, 69], label: { sq: 'Informative por kërkon kujdes', en: 'Informative but requires caution' }, confidence: { sq: 'Mesatare', en: 'Moderate' }, color: 'bg-yellow-500/90' },
    { range: [30, 49], label: { sq: 'Besueshmëri e ulët ose konfirmim i dobët', en: 'Low confidence or weak corroboration' }, confidence: { sq: 'E Ulët', en: 'Low' }, color: 'bg-orange-600/90' },
    { range: [0, 29], label: { sq: 'Jo e besueshme ose tejet e dyshimtë', en: 'Unreliable or highly questionable' }, confidence: { sq: 'Shumë e Ulët', en: 'Very Low' }, color: 'bg-red-700/90' },
];

export const GOVERNANCE_CONSTRAINTS = [
    { 
        title: { sq: "Auditueshmëria Algoritmike", en: "Algorithmic Auditability" }, 
        detail: { sq: "Të gjitha rezultatet janë të shpjegueshme dhe të auditueshme. Inputet bazë dhe peshat fikse janë të dokumentuara.", en: "All scores are explainable and auditable. Raw inputs and fixed weights are documented and accessible for regulatory review." }, 
        label: { sq: "Linku i Gjurmës së Auditimit", en: "Audit Trail Link" } 
    },
    { 
        title: { sq: "Përjashtimi i Anshmërisë", en: "Bias Exclusion" }, 
        detail: { sq: "Pikët janë të lira nga anshmëria politike apo ideologjike. Inputet rrjedhin vetëm nga metrikat gjuhësore.", en: "Scores are free of political/ideological bias. Inputs derived only from measurable behavior and linguistic metrics." }, 
        label: { sq: "Statusi i Përjashtimit të Anshmërisë", en: "Bias Exclusion Status" } 
    },
    { 
        title: { sq: "Integriteti i të Dhënave", en: "Data Integrity" }, 
        detail: { sq: "Rezultati final është i pandryshueshëm pas publikimit, i zbatuar nga protokollet MARAGON.", en: "The final score is immutable after publication, enforced by MARAGON data-logging protocols." }, 
        label: { sq: "Vula e Kohës së Imutabilitetit", en: "Immutability Timestamp" } 
    },
];