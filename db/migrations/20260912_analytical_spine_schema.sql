-- ====================================================================
-- NOVARIC® Analytical Spine (Shtylla Analitike) Schema & Seed Migration
-- Authority: Dr. Alban Gj. THIKA
-- Date: 2026-09-12
-- Connects: Doktrina (Standards) ↔ Metoda (Methodology) ↔ Korniza (MARAGON) ↔ Vlerësimi Live (Metrics)
-- ====================================================================

-- 1. Concepts Table (Epistemological & Theoretical Glossary)
CREATE TABLE IF NOT EXISTS public.concepts (
    id TEXT PRIMARY KEY, -- concept:framing, concept:public_sphere, etc.
    term_sq TEXT NOT NULL,
    term_en TEXT NOT NULL,
    definition TEXT NOT NULL,
    theorist TEXT NOT NULL,
    primary_citation_id TEXT,
    occurrences JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Citations Table (Academic Corpus)
CREATE TABLE IF NOT EXISTS public.citations (
    id TEXT PRIMARY KEY, -- ref:hallin-mancini-2004, etc.
    citation_text TEXT NOT NULL,
    url TEXT NOT NULL,
    credibility_industry_rating_pct INTEGER NOT NULL CHECK (credibility_industry_rating_pct BETWEEN 0 AND 100),
    authors TEXT NOT NULL,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    publisher TEXT NOT NULL,
    academic_category TEXT NOT NULL,
    citing_pages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MARAGON Indicators Table
CREATE TABLE IF NOT EXISTS public.maragon_indicators (
    id TEXT PRIMARY KEY, -- maragon:R1.1, maragon:A2.2, etc.
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    dimension CHAR(1) NOT NULL CHECK (dimension IN ('R', 'A', 'G', 'O')),
    dimension_name_sq TEXT NOT NULL,
    scope TEXT NOT NULL CHECK (scope IN ('outlet', 'individual')),
    body_excerpt TEXT NOT NULL,
    concept_ids TEXT[] DEFAULT '{}',
    citation_ids TEXT[] DEFAULT '{}',
    related_metric_ids TEXT[] DEFAULT '{}',
    methodology_step_ids TEXT[] DEFAULT '{}',
    standard_clause_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Analytical Lineage Mappings Table
CREATE TABLE IF NOT EXISTS public.analytical_mappings (
    id TEXT PRIMARY KEY, -- metric:credibility, etc.
    key TEXT NOT NULL UNIQUE,
    name_sq TEXT NOT NULL,
    category_sq TEXT NOT NULL,
    description TEXT NOT NULL,
    audit_note TEXT,
    indicator_ids TEXT[] DEFAULT '{}',
    methodology_step_ids TEXT[] DEFAULT '{}',
    standard_clause_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast traversal
CREATE INDEX IF NOT EXISTS idx_maragon_indicators_dimension ON public.maragon_indicators(dimension);
CREATE INDEX IF NOT EXISTS idx_citations_category ON public.citations(academic_category);
CREATE INDEX IF NOT EXISTS idx_analytical_mappings_key ON public.analytical_mappings(key);

-- Seed Data: Concepts
INSERT INTO public.concepts (id, term_sq, term_en, definition, theorist, primary_citation_id, occurrences)
VALUES
('concept:framing', 'Kornizimi (Framing)', 'Media Framing', 'Procesi i përzgjedhjes së disa aspekteve të një realiteti të perceptuar dhe bërja e tyre më të spikatura në një tekst komunikues, në mënyrë që të promovohet një përkufizim i caktuar i problemit, interpretim kauzal, vlerësim moral, dhe/ose rekomandim trajtimi.', 'Robert M. Entman / Shanto Iyengar', 'ref:entman-1993', '[{"page":"maragonFramework","anchorId":"maragon:A2.2","label":"MARAGON A2.2 Paanshmëria & Anshmëria"}]'::jsonb),
('concept:public_sphere', 'Sfera Publike', 'Public Sphere', 'Një hapësirë (metaforike) në jetën shoqërore ku individët mund të mblidhen për të diskutuar lirishëm dhe për të identifikuar problemet shoqërore, dhe përmes këtij diskutimi të ndikojnë në veprimin politik.', 'Jürgen Habermas / Zizi Papacharissi', 'ref:habermas-1989', '[{"page":"maragonFramework","anchorId":"vizioni","label":"MARAGON Vizioni"},{"page":"maragonFramework","anchorId":"maragon:O4.2","label":"MARAGON O4.2 Diskursi Demokratik"}]'::jsonb),
('concept:media_capture', 'Kapja e Medias', 'Media Capture', 'Një situatë ku media nuk është e pavarur dhe nuk i shërben interesit publik, por kontrollohet nga qeveria ose nga interesa të fuqishme private për të mbrojtur interesat e tyre.', 'Alina Mungiu-Pippidi', 'ref:mungiu-pippidi-2013', '[{"page":"maragonFramework","anchorId":"maragon:G3.1","label":"MARAGON G3.1 Ndikimi i Pronësisë"}]'::jsonb),
('concept:churnalism', 'Churnalism', 'Churnalism', 'Një formë gazetarie që mbështetet në ripërpunimin pasiv të njoftimeve për shtyp, historive të agjencive të lajmeve dhe materialeve të tjera të marrëdhënieve me publikun, në vend të raportimit origjinal.', 'Nick Davies', 'ref:davies-2008', '[{"page":"maragonFramework","anchorId":"maragon:A2.3","label":"MARAGON A2.3 Origjinaliteti & Thellësia"}]'::jsonb),
('concept:field_autonomy', 'Autonomia e Fushës Gazetareske', 'Journalistic Field Autonomy', 'Koncepti i Pierre Bourdieu-së që përshkruan shkallën në të cilën fusha e gazetarisë është e pavarur nga presionet e jashtme dhe operon sipas logjikës së vet profesionale.', 'Pierre Bourdieu', 'ref:bourdieu-1998', '[{"page":"maragonFramework","anchorId":"maragon:G3.2","label":"MARAGON G3.2 Kontrolli Editorial"}]'::jsonb),
('concept:media_literacy', 'Edukim Mediatik', 'Media Literacy', 'Aftësia për të aksesuar, analizuar, vlerësuar, krijuar dhe vepruar duke përdorur të gjitha format e komunikimit.', 'Sonia Livingstone', 'ref:livingstone-2004', '[{"page":"maragonFramework","anchorId":"maragon:O4.1","label":"MARAGON O4.1 Edukimi Mediatik"}]'::jsonb),
('concept:public_journalism', 'Gazetaria Publike', 'Public / Civic Journalism', 'Një filozofi dhe praktikë gazetareske që synon të përfshijë qytetarët në debatin publik dhe të ndihmojë komunitetet të zgjidhin problemet e tyre.', 'Jay Rosen', 'ref:rosen-1999', '[{"page":"maragonFramework","anchorId":"maragon:O4.2","label":"MARAGON O4.2 Diskursi Demokratik"}]'::jsonb),
('concept:polarized_pluralism', 'Pluralist i Polarizuar', 'Polarized Pluralist Model', 'Një model sistemi mediatik ku media ka një paralelizëm të lartë politik dhe instrumentalizohet nga elitat politike dhe ekonomike.', 'Daniel C. Hallin & Paolo Mancini', 'ref:hallin-mancini-2004', '[{"page":"maragonFramework","anchorId":"maragon:R1.1","label":"MARAGON R1.1 Pajtueshmëria Rregullatore"}]'::jsonb),
('concept:hermeneutic_circle', 'Rrethi Hermeneutik (Sinergjia Hermeneutike)', 'Hermeneutic Circle', 'Qasje metodologjike sipas Gadamer-it ku kuptimi i një teksti kërkon integrimin e pjesëve me të tërën. Në NOVARIC®, kjo udhëheq sinergjinë hermeneutike mes llogaritjes algoritmike dhe mbikëqyrjes njerëzore.', 'Hans-Georg Gadamer', 'ref:gadamer-1989', '[{"page":"methodology","anchorId":"meth:step-3","label":"Metodologjia: Hapi 3"},{"page":"maragonFramework","anchorId":"vleresimi-individe","label":"MARAGON Individët"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    term_sq = EXCLUDED.term_sq,
    definition = EXCLUDED.definition,
    theorist = EXCLUDED.theorist,
    occurrences = EXCLUDED.occurrences,
    updated_at = NOW();

-- Seed Data: Analytical Mappings
INSERT INTO public.analytical_mappings (id, key, name_sq, category_sq, description, audit_note, indicator_ids, methodology_step_ids, standard_clause_ids)
VALUES
('metric:credibility', 'credibility', 'Besueshmëria (Credibility)', 'Integriteti Faktik & Burimet', 'Vlerëson pretendimet e verifikuara, raportin e burimeve parësore dhe triangulimin me arkiva të besueshme.', NULL, ARRAY['maragon:R1.2', 'maragon:A2.1', 'maragon:A2.3', 'maragon:G3.1'], ARRAY['meth:step-1', 'meth:step-3'], ARRAY['std:MET-A', 'std:MET-B', 'std:ETIK-3.1A', 'std:TRANSP-4.1A']),
('metric:readability', 'readability', 'Lexueshmëria (Readability)', 'Qartësia Gjuhësore & Struktura', 'Vlerëson nivelin sintaksor Flesch-Kincaid, densitetin e fjalive pasive dhe qartësinë gjuhësore për të parandaluar churnalism.', NULL, ARRAY['maragon:A2.3'], ARRAY['meth:step-1', 'meth:step-2'], ARRAY['std:MET-A']),
('metric:bias_sentiment', 'bias_sentiment', 'Anshmëria & Sentimenti (Bias & Sentiment)', 'Paanshmëria & Kornizimi', 'Zbulon kornizimin e njëanshëm (framing), polarizimin e gjuhës dhe devijimet e pajustifikuara emocionale.', NULL, ARRAY['maragon:A2.2', 'maragon:G3.2'], ARRAY['meth:step-2', 'meth:step-3'], ARRAY['std:ETIK-3.1A', 'std:ETIK-3.1B']),
('metric:lifecycle_compliance', 'lifecycle_compliance', 'Cikli i Jetës & Përputhshmëria (Lifecycle Compliance)', 'Llogaridhënia & Korrigjimet', 'Garanton protokollin e korrigjimeve, transparencën e përditësimeve editoriale dhe përputhshmërinë rregullatore.', 'Audituar periodikisht përmes Qendrës së Korrigjimeve dhe Zyrës së Përputhshmërisë.', ARRAY['maragon:R1.1', 'maragon:R1.2', 'maragon:G3.1'], ARRAY['meth:step-3'], ARRAY['std:ETIK-3.3A', 'std:KONF-A', 'std:TRANSP-4.1A']),
('metric:seo_accessibility', 'seo_accessibility', 'SEO & Aksesueshmëria', 'Transparenca Publike & Standardet Dixhitale', 'Optimizimi semantik për indeksim të hapur, metatëdhëna Schema.org dhe lexueshmëri universale.', NULL, ARRAY['maragon:O4.1'], ARRAY['meth:step-1'], ARRAY['std:KONF-B']),
('metric:logic_fact', 'logic_fact', 'Logjikë (Fact)', 'Koherenca Logjike', 'Raporti i fakteve të vërtetueshme empirikisht kundrejt deduktimeve apo pretendimeve pa mbështetje provash.', NULL, ARRAY['maragon:A2.1', 'maragon:A2.4'], ARRAY['meth:step-1', 'meth:step-3'], ARRAY['std:MET-A', 'std:MET-B']),
('metric:ethical_resonance', 'ethical_resonance', 'Rezonanca Etike (CSR)', 'Përgjegjësia Qytetare & Interesi Publik', 'Përputhshmëria me misionin e shërbimit publik, dinjitetin njerëzor, dhe kontributin në debatin demokratik.', NULL, ARRAY['maragon:A2.2', 'maragon:G3.2', 'maragon:O4.2'], ARRAY['meth:step-3'], ARRAY['std:ETIK-3.1A', 'std:KONF-C']),
('metric:emotion_affect', 'emotion_affect', 'Emocion (Affect)', 'Intensiteti Afektiv', 'Matja e ngarkesës emocionale dhe dramatizimit për të siguruar raportim të matshëm dhe jo sensacionalist.', NULL, ARRAY['maragon:A2.2'], ARRAY['meth:step-2'], ARRAY['std:ETIK-3.1A'])
ON CONFLICT (id) DO UPDATE SET
    name_sq = EXCLUDED.name_sq,
    description = EXCLUDED.description,
    indicator_ids = EXCLUDED.indicator_ids,
    methodology_step_ids = EXCLUDED.methodology_step_ids,
    standard_clause_ids = EXCLUDED.standard_clause_ids,
    updated_at = NOW();
