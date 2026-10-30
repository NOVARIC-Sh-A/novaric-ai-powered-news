-- ==============================================================================
-- NOVARIC® Media Intelligence & Benchmark Ecosystem
-- Migration: 20260912_methodology_framework_schema.sql
-- Target: Methodology & Accountability Framework (Sinergjia Hermeneutike)
-- Tables: methodology_steps, framework_principles, method_references, methodology_audits
-- ==============================================================================

-- 1. methodology_steps
CREATE TABLE IF NOT EXISTS public.methodology_steps (
    id TEXT PRIMARY KEY,
    step_order INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_title TEXT NOT NULL,
    actor TEXT NOT NULL CHECK (actor IN ('ai', 'draft', 'human_team')),
    actor_label_sq TEXT NOT NULL,
    body_text TEXT NOT NULL,
    sub_points JSONB DEFAULT '[]'::jsonb,
    inputs TEXT[] NOT NULL DEFAULT '{}',
    outputs TEXT[] NOT NULL DEFAULT '{}',
    safeguards TEXT[] NOT NULL DEFAULT '{}',
    failure_modes TEXT[] NOT NULL DEFAULT '{}',
    standards_clause_ids TEXT[] NOT NULL DEFAULT '{}',
    citation_keys TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. framework_principles
CREATE TABLE IF NOT EXISTS public.framework_principles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body_text TEXT NOT NULL,
    legal_anchor TEXT NOT NULL CHECK (legal_anchor IN ('dsa', 'emfa', 'internal')),
    legal_anchor_label TEXT NOT NULL,
    legal_anchor_detail TEXT NOT NULL,
    standards_ref TEXT NOT NULL,
    evidence_url TEXT NOT NULL,
    status_badge TEXT NOT NULL,
    citation_keys TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. method_references
CREATE TABLE IF NOT EXISTS public.method_references (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    citation TEXT NOT NULL,
    short_cite TEXT NOT NULL,
    authors TEXT NOT NULL,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    publisher_or_journal TEXT NOT NULL,
    ref_type TEXT NOT NULL CHECK (ref_type IN ('book', 'journal', 'report')),
    type_label_sq TEXT NOT NULL,
    usage_anchors JSONB NOT NULL DEFAULT '[]'::jsonb,
    external_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. methodology_audits
CREATE TABLE IF NOT EXISTS public.methodology_audits (
    id TEXT PRIMARY KEY,
    audited_at TIMESTAMPTZ NOT NULL,
    auditor TEXT NOT NULL,
    result TEXT NOT NULL CHECK (result IN ('passed', 'minor_observation', 'action_required')),
    result_label_sq TEXT NOT NULL,
    compliance_score NUMERIC(5,2) NOT NULL,
    notes TEXT NOT NULL,
    next_audit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Configuration: Public Read-Only access, Service Role for Mutation
ALTER TABLE public.methodology_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.method_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.methodology_audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view methodology_steps" ON public.methodology_steps;
CREATE POLICY "Public can view methodology_steps"
    ON public.methodology_steps FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view framework_principles" ON public.framework_principles;
CREATE POLICY "Public can view framework_principles"
    ON public.framework_principles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view method_references" ON public.method_references;
CREATE POLICY "Public can view method_references"
    ON public.method_references FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view methodology_audits" ON public.methodology_audits;
CREATE POLICY "Public can view methodology_audits"
    ON public.methodology_audits FOR SELECT
    USING (true);

-- Seed Initial Data
INSERT INTO public.methodology_steps (
    id, step_order, title, short_title, actor, actor_label_sq, body_text, sub_points, inputs, outputs, safeguards, failure_modes, standards_clause_ids, citation_keys
) VALUES 
(
    'step-1',
    1,
    'Hapi 1: Analiza Fillestare nga IA (Shkalla dhe Shpejtësia)',
    'Analiza Fillestare nga IA',
    'ai',
    'Modeli i Avancuar Gjuhësor (LLM / Nora AI)',
    'Një model i avancuar gjuhësor (LLM) kryen një analizë të gjerë në ueb për të gjetur burime relevante. Kjo fazë shfrytëzon aftësinë e IA-së për të identifikuar modele dhe për të mbledhur të dhëna në një shkallë të paarritshme për analistët njerëzorë, duke qenë të vetëdijshëm për rreziqet e "paragjykimit algoritmik" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës.',
    '[]'::jsonb,
    ARRAY['Pretendimi publik i pretenduar apo lajmi në qarkullim', 'Korpus burimesh të hapura (Open Web, arkiva zyrtare, regjistri i mediave)', 'Katalogu i burimeve primare të indeksuara nga NOVARIC®'],
    ARRAY['Indeksi i dëshmive të mbledhura dhe ekstrakti i entiteteve (NER)', 'Matrica e relevancës me burime pro dhe kundër pretendimit', 'Shenjimi i anomalive semantike dhe rreziqeve të mundshme manipuluese'],
    ARRAY['Modeli trajtohet rreptësisht si mjet ndihmës hulumtues, kurrë si arbitër i së vërtetës', 'Parandalimi i halucinacioneve përmes kërkimit të detyrueshëm me tokën (grounding)', 'Ndërgjegjësimi i koduar për paragjykimet algoritmike (Diakopoulos, 2019)', 'Izolimi i plotë pa asnjë leje publikimi të drejtpërdrejtë në server'],
    ARRAY['Paragjykimi algoritmik i ponderimit të burimeve (Algorithmic Bias)', 'Optimizimi i verbër i shpejtësisë në kurriz të thellësisë kontekstuale'],
    ARRAY['MET-A', 'MET-B', 'MET-F', 'MET-G'],
    ARRAY['diakopoulos2019']
),
(
    'step-2',
    2,
    'Hapi 2: Gjenerimi i Draft-Rezultatit (Struktura Fillestare)',
    'Gjenerimi i Draft-Rezultatit',
    'draft',
    'Sistemi i Gjenerimit të Strukturuar (Draft Pipeline)',
    'Modeli gjeneron një verdikt paraprak, një përmbledhje dhe një listë burimesh, duke përfshirë prova pro dhe kundër pretendimit. Ky draft shërben si një pikënisje e strukturuar për ekipin redaksional.',
    '[]'::jsonb,
    ARRAY['Të dhënat e strukturuara dhe lidhjet e burimeve nga Hapi 1', 'Shablloni formal i verifikimit sipas standardeve të EFCSN/IFCN', 'Kriteret e taksonomisë faktike (E Saktë, E Pasaktë, Gjysmë e Vërtetë, Jashtë Kontekstit)'],
    ARRAY['Verdikti paraprak hipotetik (i paverifikuar)', 'Përmbledhja ekzekutive e provave të gjetura', 'Inventari me dy kolona: Prova PRO vs. Prova KUNDËR pretendimit', 'Dosja e papërpunuar për shqyrtim njerëzor (Review Ticket)'],
    ARRAY['Drafti etiketohet qartësisht me flamur "DRAFT I PAPUBLIKUESHËM"', 'Asnjë rrugëdalje e automatizuar drejt rrjeteve sociale apo faqes kryesore', 'Transparencë e plotë mbi prompt-et dhe parametrat e përdorur në gjenerim'],
    ARRAY['Verdikt i nxituar bazuar në sasi provash dhe jo në cilësi provash', 'Mungesë e konsideratës për nuancat ligjore dhe kushtetuese vendore'],
    ARRAY['MET-E', 'MET-H', 'MET-I'],
    ARRAY[]::text[]
),
(
    'step-3',
    3,
    'Hapi 3: Rishikimi dhe Verifikimi Njerëzor (Mbikëqyrja Hermeneutike)',
    'Rishikimi dhe Verifikimi Njerëzor (Hapi Kritik)',
    'human_team',
    'Ekipi Redaksional Njerëzor (Redaktorët & Paneli Shkencor)',
    'Drafti i IA-së nuk publikohet kurrë automatikisht. Këtu fillon procesi thelbësor i interpretimit njerëzor. Ekipi ynë i redaktorëve me përvojë ndjek katër shtylla themelore hermeneutike përpara se të marrë vendimin përfundimtar.',
    '[
        {"id": "sp-1", "title": "Verifikon Burimet", "text": "Vlerëson besueshmërinë, reputacionin dhe pozicionalitetin e çdo burimi të përdorur në hulumtim."},
        {"id": "sp-2", "title": "Shton Kontekstin (Parimi Hermeneutik)", "text": "Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur \"rrethin hermeneutik\" për të ndërtuar një kuptim të plotë (Gadamer, 1989)."},
        {"id": "sp-3", "title": "Vlerëson Nuancat", "text": "Analizon gjuhën manipulative, ironinë, mungesën e theksuar të informacionit dhe taktikat e tjera retorike që makinat nuk mund t''i zbërthejnë."},
        {"id": "sp-4", "title": "Jep Miratimin Final", "text": "Vetëm pasi ekipi njerëzor është plotësisht i bindur për saktësinë dhe paanshmërinë, rezultati finalizohet. Përgjegjësia editoriale mbetet tërësisht njerëzore."}
    ]'::jsonb,
    ARRAY['Draft-paketa nga Hapi 2', 'Kontaktimi i drejtpërdrejtë me palët e përmendura (E drejta e përgjigjes)', 'Ekspertiza profesionale e redaktorëve dhe bibliografia e akredituar'],
    ARRAY['Artikulli i plotë i miratuar i verifikimit të fakteve', 'Nënshkrimi dixhital i redaktorit përgjegjës (Editorial Sign-off)', 'Auditimi i integritetit me 15 metrika dhe lidhja me standardet'],
    ARRAY['Rregulli i detyrueshëm me katër sy (Peer Review nga të paktën dy persona)', 'Gjurmueshmëria e plotë e çdo ndërhyrjeje në tekstin e draftit', 'Përgjegjësi ligjore dhe etike personale e deklaruar publikisht'],
    ARRAY['Ndërhyrje subjektive e paargumentuar (e zbutur nga protokolli me katër sy)'],
    ARRAY['MET-J', 'MET-K', 'ETIK-1A', 'ETIK-1D', 'ETIK-2C'],
    ARRAY['gadamer1989']
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    body_text = EXCLUDED.body_text,
    sub_points = EXCLUDED.sub_points,
    inputs = EXCLUDED.inputs,
    outputs = EXCLUDED.outputs,
    safeguards = EXCLUDED.safeguards,
    failure_modes = EXCLUDED.failure_modes,
    standards_clause_ids = EXCLUDED.standards_clause_ids,
    citation_keys = EXCLUDED.citation_keys,
    updated_at = NOW();

-- Seed Principles
INSERT INTO public.framework_principles (
    id, title, body_text, legal_anchor, legal_anchor_label, legal_anchor_detail, standards_ref, evidence_url, status_badge, citation_keys
) VALUES
(
    'principle-1',
    'Lufta Kundër Dezinformimit',
    'Përtej etiketimit të informacionit si "i rremë", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004).',
    'dsa',
    'DSA Nenet 34 & 35',
    'Akti i Shërbimeve Dixhitale i BE-së: Detyrimi për vlerësimin dhe zbutjen e rreziqeve sistemike në hapësirën publike dixhitale dhe edukimi mediatik i qytetarëve.',
    'Neni 2 (MET-C, MET-D)',
    '/standards/perputhshmeri',
    'E ZBATUAR',
    ARRAY['livingstone2004']
),
(
    'principle-2',
    'Pavarësia Editoriale',
    'NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të "kapjes së medias" (Mungiu-Pippidi, 2013).',
    'emfa',
    'EMFA Neni 6',
    'Akti Evropian i Lirisë së Medias (European Media Freedom Act): Mbrojtja e patundshme e linjës editoriale nga ndërhyrjet politike, shtetërore apo oligarkike.',
    'Neni 3.1 (ETIK-1A, ETIK-1B)',
    '/standards/transparence',
    'GARANTUAR',
    ARRAY['mungiu2013']
),
(
    'principle-3',
    'Transparenca e Pronësisë',
    'Ne jemi transparentë për strukturën dhe financimin tonë, duke i dhënë mundësi audiencës të vlerësojë vetë pavarësinë tonë.',
    'emfa',
    'EMFA Neni 6.1',
    'Detyrimi ligjor i ofruesve të shërbimeve mediatike për të bërë publike pronësinë e drejtpërdrejtë dhe të tërthortë, burimet financiare dhe deklaratat vjetore.',
    'Neni 4.1 & 4.2 (TRAN-1A, TRAN-2A)',
    '/standards/transparence',
    'PUBLIKE',
    ARRAY[]::text[]
),
(
    'principle-4',
    'Mekanizmat e Raportimit dhe Korrigjimit',
    'Ne ofrojmë mekanizma të qartë për përdoruesit për të raportuar pasaktësi. Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014).',
    'dsa',
    'DSA Neni 16 & EFCSN 3.3',
    'Mekanizmat e Njoftimit dhe Veprimit (Notice-and-Action): E drejta e përdoruesit për të ankimuar përmbajtjen me një SLA të garantuar shqyrtimi brenda 7 ditëve.',
    'Neni 3.3 (ETIK-3A, ETIK-3D)',
    '/standards/korrigjime',
    'LIVE 24/7',
    ARRAY['kovach2014']
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    body_text = EXCLUDED.body_text,
    legal_anchor = EXCLUDED.legal_anchor,
    legal_anchor_label = EXCLUDED.legal_anchor_label,
    legal_anchor_detail = EXCLUDED.legal_anchor_detail,
    standards_ref = EXCLUDED.standards_ref,
    evidence_url = EXCLUDED.evidence_url,
    status_badge = EXCLUDED.status_badge,
    citation_keys = EXCLUDED.citation_keys,
    updated_at = NOW();

-- Seed References
INSERT INTO public.method_references (
    id, key, citation, short_cite, authors, year, title, publisher_or_journal, ref_type, type_label_sq, usage_anchors, external_url
) VALUES
(
    'ref-1',
    'chadwick2017',
    'Chadwick, A. (2017). The hybrid media system: Politics and power (2nd ed.). Oxford University Press.',
    'Chadwick, 2017',
    'Chadwick, Andrew',
    2017,
    'The hybrid media system: Politics and power',
    'Oxford University Press (2nd ed.)',
    'book',
    'Libër Akademik',
    '[{"section_id": "sec-hyrje", "section_title": "Hyrje", "excerpt": "Në epokën e \"sistemit mediatik hibrid\", ku teknologjia e platformave dixhitale ndërthuret me logjikat e vjetra mediatike (Chadwick, 2017)..."}]'::jsonb,
    'https://global.oup.com/academic/product/the-hybrid-media-system-9780190696726'
),
(
    'ref-2',
    'diakopoulos2019',
    'Diakopoulos, N. (2019). Automating the news: How algorithms are rewriting the media. Harvard University Press.',
    'Diakopoulos, 2019',
    'Diakopoulos, Nicholas',
    2019,
    'Automating the news: How algorithms are rewriting the media',
    'Harvard University Press',
    'book',
    'Libër Akademik',
    '[{"section_id": "sec-metodologjia", "section_title": "Hapi 1: Analiza Fillestare nga IA", "excerpt": "...duke qenë të vetëdijshëm për rreziqet e \"paragjykimit algoritmik\" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës."}]'::jsonb,
    'https://www.hup.harvard.edu/books/9780674976986'
),
(
    'ref-3',
    'gadamer1989',
    'Gadamer, H.-G. (1989). Truth and method (2nd rev. ed., J. Weinsheimer & D. G. Marshall, Trans.). Sheed & Ward.',
    'Gadamer, 1989',
    'Gadamer, Hans-Georg',
    1989,
    'Truth and method',
    'Sheed & Ward (Përkth. J. Weinsheimer & D. G. Marshall)',
    'book',
    'Libër Akademik',
    '[{"section_id": "sec-metodologjia", "section_title": "Hapi 3: Rishikimi dhe Verifikimi Njerëzor", "excerpt": "Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur \"rrethin hermeneutik\" për të ndërtuar një kuptim të plotë (Gadamer, 1989)."}]'::jsonb,
    'https://www.bloomsbury.com/uk/truth-and-method-9781780936284/'
),
(
    'ref-4',
    'kovach2014',
    'Kovach, B., & Rosenstiel, T. (2014). The elements of journalism: What newspeople should know and the public should expect (3rd ed.). Three Rivers Press.',
    'Kovach & Rosenstiel, 2014',
    'Kovach, Bill & Rosenstiel, Tom',
    2014,
    'The elements of journalism: What newspeople should know and the public should expect',
    'Three Rivers Press (3rd ed.)',
    'book',
    'Libër Akademik',
    '[{"section_id": "sec-pergjegjesia", "section_title": "Mekanizmat e Raportimit dhe Korrigjimit", "excerpt": "Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014)."}]'::jsonb,
    'https://www.penguinrandomhouse.com/books/227568/the-elements-of-journalism-revised-and-updated-4th-edition-by-bill-kovach-and-tom-rosenstiel/'
),
(
    'ref-5',
    'livingstone2004',
    'Livingstone, S. (2004). Media literacy and the challenge of new information and communication technologies. The Communication Review, 7(1), 3–14.',
    'Livingstone, 2004',
    'Livingstone, Sonia',
    2004,
    'Media literacy and the challenge of new information and communication technologies',
    'The Communication Review, 7(1), 3–14',
    'journal',
    'Artikull Shkencor',
    '[{"section_id": "sec-pergjegjesia", "section_title": "Lufta Kundër Dezinformimit", "excerpt": "Përtej etiketimit të informacionit si \"i rremë\", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004)."}]'::jsonb,
    'https://doi.org/10.1080/10714420490280152'
),
(
    'ref-6',
    'mungiu2013',
    'Mungiu-Pippidi, A. (2013). Freedom without impartiality: The Vicious Circle of media capture. In P. N. Howard & M. M. Hussain (Eds.), Democracy''s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press.',
    'Mungiu-Pippidi, 2013',
    'Mungiu-Pippidi, Alina',
    2013,
    'Freedom without impartiality: The Vicious Circle of media capture',
    'Democracy''s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press',
    'book',
    'Libër Akademik',
    '[{"section_id": "sec-pergjegjesia", "section_title": "Pavarësia Editoriale", "excerpt": "NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të \"kapjes së medias\" (Mungiu-Pippidi, 2013)."}]'::jsonb,
    'https://global.oup.com/academic/product/democracys-fourth-wave-9780199936953'
),
(
    'ref-7',
    'wardle2017',
    'Wardle, C., & Derakhshan, H. (2017). Information disorder: Toward an interdisciplinary framework for research and policymaking. Council of Europe.',
    'Wardle & Derakhshan, 2017',
    'Wardle, Claire & Derakhshan, Hossein',
    2017,
    'Information disorder: Toward an interdisciplinary framework for research and policymaking',
    'Council of Europe Report DGI(2017)09',
    'report',
    'Raport Ndërkombëtar',
    '[{"section_id": "sec-hyrje", "section_title": "Hyrje", "excerpt": "Kjo kornizë nuk është thjesht një listë rregullash, por një përgjigje strategjike ndaj sfidave të \"çrregullimit informativ\" (Wardle & Derakhshan, 2017)..."}]'::jsonb,
    'https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c'
)
ON CONFLICT (id) DO UPDATE SET
    key = EXCLUDED.key,
    citation = EXCLUDED.citation,
    short_cite = EXCLUDED.short_cite,
    authors = EXCLUDED.authors,
    year = EXCLUDED.year,
    title = EXCLUDED.title,
    publisher_or_journal = EXCLUDED.publisher_or_journal,
    ref_type = EXCLUDED.ref_type,
    type_label_sq = EXCLUDED.type_label_sq,
    usage_anchors = EXCLUDED.usage_anchors,
    external_url = EXCLUDED.external_url,
    updated_at = NOW();

-- Seed Audit
INSERT INTO public.methodology_audits (
    id, audited_at, auditor, result, result_label_sq, compliance_score, notes, next_audit_at
) VALUES (
    'AUD-MET-2026-01',
    '2026-08-12T10:00:00Z',
    'Këshilli Mbikëqyrës i Pavarur & Zyra e Standardeve NOVARIC®',
    'passed',
    'Miratuar pa Vërejtje Thelbësore',
    98.40,
    'Auditim i plotë i zbatimit të sinergjisë hermeneutike mes LLM dhe ekipit njerëzor. Nuk u identifikua asnjë publikim autonom pa miratim editorial me dy nënshkrime.',
    '2026-11-15T09:00:00Z'
)
ON CONFLICT (id) DO NOTHING;
