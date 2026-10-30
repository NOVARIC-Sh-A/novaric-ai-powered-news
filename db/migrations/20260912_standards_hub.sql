-- ============================================================================
-- NOVARIC® Media Monitor & Standards Hub - Schema & Seed
-- Migration: 20260912_standards_hub.sql
-- Purpose: Provide data-driven infrastructure for Kodi i Standardeve NOVARIC®
-- Includes: standard_clauses, standard_audits, corrections, complaints, ai_registry
-- ============================================================================

-- 1. Standard Clauses Table
CREATE TABLE IF NOT EXISTS standard_clauses (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'KONF-A', 'MET-E'
  neni SMALLINT NOT NULL CHECK (neni BETWEEN 1 AND 4),
  sub_neni VARCHAR(16),
  letter VARCHAR(8) NOT NULL,
  title TEXT NOT NULL,
  commitment_key VARCHAR(64) NOT NULL,
  text TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'compliant',
  status_label_sq VARCHAR(64) NOT NULL DEFAULT 'PËRPUTHSHMËRI E PLOTË',
  evidence_url TEXT NOT NULL,
  evidence_title TEXT NOT NULL,
  owner VARCHAR(128) NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  score_dimensions TEXT[] DEFAULT '{}',
  audit_note TEXT,
  efcsn_clause_ref VARCHAR(64),
  ifcn_criterion_ref VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Standard Audits Table
CREATE TABLE IF NOT EXISTS standard_audits (
  id SERIAL PRIMARY KEY,
  audit_date TIMESTAMPTZ NOT NULL,
  next_audit_date TIMESTAMPTZ NOT NULL,
  auditor_name VARCHAR(128) NOT NULL,
  auditor_role VARCHAR(128) NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  report_hash VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Public Corrections Ledger
CREATE TABLE IF NOT EXISTS corrections (
  id VARCHAR(64) PRIMARY KEY,
  article_id TEXT NOT NULL,
  article_title TEXT NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'Faktik', 'Burimor', 'Tipografik', 'Kontekstual'
  summary TEXT NOT NULL,
  diff_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  status VARCHAR(32) NOT NULL DEFAULT 'Zgjidhur',
  reviewer VARCHAR(128) NOT NULL DEFAULT 'Bordi Editorial',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Public Complaints Intake
CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(64) PRIMARY KEY,
  claim_url TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_email TEXT,
  clause_referenced VARCHAR(32),
  status VARCHAR(32) NOT NULL DEFAULT 'Pranuar',
  sla_due_at TIMESTAMPTZ NOT NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. AI Transparency & Model Registry
CREATE TABLE IF NOT EXISTS ai_registry (
  id VARCHAR(64) PRIMARY KEY,
  model_name VARCHAR(128) NOT NULL,
  version VARCHAR(32) NOT NULL,
  provider VARCHAR(64) NOT NULL,
  purpose TEXT NOT NULL,
  human_oversight_step TEXT NOT NULL,
  architecture_tier VARCHAR(64) NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL,
  compliance_status VARCHAR(64) NOT NULL DEFAULT 'Përputhshmëri e Plotë',
  capabilities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Transparency & Corporate Ledger
CREATE TABLE IF NOT EXISTS transparency_ledger (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(32) NOT NULL, -- 'ownership', 'funding', 'editorial', 'governance'
  category_label_sq VARCHAR(64) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  legal_entity VARCHAR(128) NOT NULL,
  evidence_name TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  certifying_body VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_standard_clauses_neni ON standard_clauses(neni);
CREATE INDEX IF NOT EXISTS idx_corrections_published ON corrections(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE standard_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_ledger ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$ BEGIN
  CREATE POLICY "Public read for standard_clauses" ON standard_clauses FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read for standard_audits" ON standard_audits FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read for corrections" ON corrections FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read for ai_registry" ON ai_registry FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read for transparency_ledger" ON transparency_ledger FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Anonymous Insert Policy for Complaints Intake
DO $$ BEGIN
  CREATE POLICY "Anon insert for complaints" ON complaints FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- SEED DATA: All 31 Verbatim Clauses of Kodi i Standardeve NOVARIC®
-- ============================================================================

INSERT INTO standard_clauses (id, neni, sub_neni, letter, title, commitment_key, text, status, status_label_sq, evidence_url, evidence_title, owner, last_verified_at, score_dimensions, audit_note, efcsn_clause_ref, ifcn_criterion_ref)
VALUES
-- Neni 1: Sistemi i Përputhshmërisë
('KONF-A', 1, NULL, 'A', 'Përputhshmëri e Plotë', 'full_compliance', 'Për të ruajtur standardin tonë, operacionet tona të verifikimit të fakteve duhet të jenë plotësisht në përputhje me të gjitha standardet në këtë Kod.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Matrica e Auditimit të Brendshëm 2026', 'Zyra e Integritetit & Pajtueshmërisë', '2026-08-15T09:00:00Z', ARRAY['lifecycle'], 'Verifikuar në auditimin periodik Q3 2026.', 'EFCSN Section 1.1', 'IFCN Criterion 1'),
('KONF-B', 1, NULL, 'B', 'Angazhim Publik', 'public_commitment', 'Ne e pranojmë publikisht në uebfaqen tonë se i përmbahemi këtij Kodi të Standardeve, duke e bërë këtë një akt publik të llogaridhënies.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/kodi', 'Publikim i Përhershëm në Portal', 'Bordi Editorial NOVARIC®', '2026-08-20T10:00:00Z', ARRAY['seo_accessibility', 'lifecycle'], 'Dokumenti i hapur me licencë publike.', 'EFCSN Section 1.2', 'IFCN Criterion 2'),
('KONF-C', 1, NULL, 'C', 'Përputhshmëri Organizative', 'organizational_compliance', 'Organizata jonë mëmë (NOVARIC® Sh.A.) ndjek frymën e përgjithshme etike dhe standardet e këtij Kodi, duke siguruar që misioni i shërbimit publik të mos komprometohet nga interesat komerciale.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/corporatePositionStatement', 'Deklarata Korporative e Pavarësisë', 'Drejtoria e NOVARIC® Sh.A.', '2026-08-10T12:00:00Z', ARRAY['ethical_resonance', 'lifecycle'], 'Klauzolë e integruar në statutin e korporatës.', 'EFCSN Section 1.3', 'IFCN Criterion 1'),

-- Neni 2: Metodologjia
('MET-A', 2, NULL, 'A', 'Metodologji e Hapur', 'open_methodology', 'Metodologjia jonë për përzgjedhjen, hulumtimin dhe përfundimin e hetimeve është plotësisht publike dhe e aksesueshme.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/analysisMethodology', 'Manuali i Procedurave të Verifikimit', 'Redaksia e Verifikimit', '2026-08-28T08:30:00Z', ARRAY['logic', 'credibility'], 'Përditësuar me algoritmin e ri të peshimit.', 'EFCSN Section 2.1', 'IFCN Criterion 3'),
('MET-B', 2, NULL, 'B', 'Standard i Barabartë', 'equal_standard', 'Ne i vlerësojmë provat duke përdorur të njëjtat standarde për pretendime të njëvlershme, pavarësisht se kush e ka bërë pretendimin.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Protokolli i Testimit të Verbër të Pretendimeve', 'Paneli i Paanshëm i Shqyrtimit', '2026-08-18T14:15:00Z', ARRAY['credibility', 'sentiment_analytics'], 'Asnjë devijim nga shkalla standarde e verifikimit.', 'EFCSN Section 2.2', 'IFCN Criterion 1'),
('MET-C', 2, NULL, 'C', 'Fokus në Interesin Publik', 'public_interest_focus', 'Ne fokusohemi në tema që kanë të bëjnë me mirëqenien e shoqërisë, si shëndeti, ekonomia, siguria dhe funksionimi i demokracisë.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/?page=newsList', 'Indeksi i Relevancës së Lajmeve', 'Kryeredaktori', '2026-09-01T11:00:00Z', ARRAY['ethical_resonance'], 'Filtri i interesit publik zbatohet në çdo artikull.', 'EFCSN Section 2.3', 'IFCN Criterion 2'),
('MET-D', 2, NULL, 'D', 'Pjesëmarrje e Publikut', 'public_participation', 'Ne ofrojmë një kanal të aksesueshëm përmes të cilit publiku mund të paraqesë pretendime për verifikim.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Formulari i Raportimit Qytetar', 'Zyra e Marrëdhënieve me Publikun', '2026-09-05T09:45:00Z', ARRAY['lifecycle', 'seo_accessibility'], 'Kanal i hapur 24/7 me SLA të garantuar.', 'EFCSN Section 2.4', 'IFCN Criterion 5'),
('MET-E', 2, NULL, 'E', 'Verifikueshmëri e Hapur', 'open_verifiability', 'Kur është e mundur, ne ofrojmë akses në të gjitha provat që lexuesi të mund të përsërisë procesin tonë të verifikimit.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Paketa e Provave të Hapura (Open Data)', 'Departamenti i Teknologjisë', '2026-08-22T16:00:00Z', ARRAY['credibility', 'logic'], 'Lidhje direkte në arkivat publike dhe burimet parësore.', 'EFCSN Section 2.5', 'IFCN Criterion 3'),
('MET-F', 2, NULL, 'F', 'Prioritizimi i Burimeve Parësore', 'primary_sources_priority', 'Ne mbështetemi në burime parësore dhe paraqesim prova relevante që mbështesin dhe minojnë pretendimin.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Udhëzuesi i Burimeve Parësore', 'Stafi Kërkimor', '2026-08-25T13:20:00Z', ARRAY['credibility'], 'Kërkohet minimalisht 70% mbështetje në burime parësore.', 'EFCSN Section 2.6', 'IFCN Criterion 3'),
('MET-G', 2, NULL, 'G', 'Konfirmim i Dyfishtë', 'double_confirmation', 'Ne përdorim të paktën dy, por preferohet më shumë, burime të pavarura për të verifikuar pretendimin qendror.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Rregullorja e Konfirmimit të Kryqëzuar', 'Redaktori Përgjegjës', '2026-08-30T10:10:00Z', ARRAY['credibility', 'logic'], 'Verifikim i detyrueshëm me 2+ dëshmi të pavarura.', 'EFCSN Section 2.7', 'IFCN Criterion 3'),
('MET-H', 2, NULL, 'H', 'Transparenca e Burimeve', 'sources_transparency', 'Ne i emërojmë të gjitha burimet, përveç rasteve kur siguria e tyre është në rrezik.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Regjistri i Citimeve dhe Atribuimit', 'Ekipi Hetimor', '2026-08-29T15:40:00Z', ARRAY['credibility'], 'Mbi 95% e burimeve citohen nominalisht me lidhje aktive.', 'EFCSN Section 2.8', 'IFCN Criterion 3'),
('MET-I', 2, NULL, 'I', 'Kredibiliteti i Ekspertëve', 'experts_credibility', 'Kur citojmë ekspertë, ne përcaktojmë qartë kredibilitetin dhe fushën e tyre të ekspertizës.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Kriteret e Përzgjedhjes së Ekspertëve', 'Këshilli Shkencor', '2026-08-26T11:50:00Z', ARRAY['credibility'], 'Verifikim i formimit akademik dhe botimeve të ekspertit.', 'EFCSN Section 2.9', 'IFCN Criterion 3'),
('MET-J', 2, NULL, 'J', 'Rishikim Editorial (Peer Review)', 'peer_review', 'Çdo hetim i nënshtrohet të paktën një raundi redaktimi nga dikush tjetër përveç autorit.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/contentQualityAssurance', 'Gjurma Dixhitale e Nënshkrimeve Editoriale', 'Bordi i Redaktorëve', '2026-09-02T14:00:00Z', ARRAY['lifecycle', 'logic'], 'Dy nënshkrime të detyrueshme përpara publikimit.', 'EFCSN Section 2.10', 'IFCN Criterion 2'),
('MET-K', 2, NULL, 'K', 'Gjuhë Neutrale', 'neutral_language', 'Gjetjet paraqiten me gjuhë të saktë, faktike dhe jo-emotive, duke shmangur sensacionalizmin.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/journalisticEthicsManual', 'Fjalori i Termave Neutrale & Analizuesi Stilistik', 'Redaksia Gjuhësore', '2026-09-03T09:15:00Z', ARRAY['readability', 'sentiment_analytics', 'emotion'], 'Monitorim i vazhdueshëm me indeks leksikor neutral.', 'EFCSN Section 2.11', 'IFCN Criterion 1'),

-- Neni 3: Standardet Etike
('ETIK-1A', 3, '3.1', 'A', 'Pavarësia Editoriale dhe Politike', 'editorial_independence', 'Ne jemi editorialisht të lirë dhe politikisht të pavarur, një parakusht kritik në mjedisin mediatik shqiptar (Hallin & Mancini, 2004).', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Karta e Pavarësisë Editoriale', 'Bordi Drejtues', '2026-08-12T08:00:00Z', ARRAY['ethical_resonance', 'sentiment_analytics'], 'Pavarësi e mbrojtur statutarisht.', 'EFCSN Section 3.1.1', 'IFCN Criterion 1'),
('ETIK-1B', 3, '3.1', 'B', 'Mospërkrahja Politike', 'no_political_endorsement', 'Ne nuk mbështesim asnjë parti politike apo kandidat.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/corporatePositionStatement', 'Deklarata Publike e Neutralitetit Elektoral', 'Komisioni i Etikës', '2026-08-12T08:00:00Z', ARRAY['ethical_resonance'], 'Audit i paanësisë gjatë fushatave zgjedhore.', 'EFCSN Section 3.1.2', 'IFCN Criterion 1'),
('ETIK-1C', 3, '3.1', 'C', 'Përzgjedhje e Drejtë e Subjekteve', 'fair_subject_selection', 'Ne nuk përqendrojmë hetimet në mënyrë të padrejtë në një burim të caktuar, por ndjekim dezinformimin me rëndësi publike.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/perputhshmeri', 'Regjistri i Shpërndarjes së Hetimeve', 'Redaksia Analitike', '2026-08-14T11:20:00Z', ARRAY['sentiment_analytics', 'ethical_resonance'], 'Monitorim i ekuilibrit të mbulimit mediatik.', 'EFCSN Section 3.1.3', 'IFCN Criterion 1'),
('ETIK-1D', 3, '3.1', 'D', 'Shmangia e Konfliktit të Interesit', 'conflict_of_interest', 'Stafi ynë u përmbahet politikave të brendshme rigoroze për të shmangur konfliktin e interesit dhe perceptimin e anshmërisë.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Formularët e Deklarimit të Pasurisë dhe Interesave', 'Oficeri i Pajtueshmërisë', '2026-08-15T10:00:00Z', ARRAY['ethical_resonance', 'lifecycle'], 'Deklarim vjetor dhe për çdo caktim hetimi.', 'EFCSN Section 3.1.4', 'IFCN Criterion 1'),
('ETIK-1E', 3, '3.1', 'E', 'Avokim Ekskluziv për Transparencë', 'advocacy_for_transparency', 'Ne avokojmë vetëm për transparencë, saktësi dhe llogaridhënie në diskursin publik.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/aboutUs', 'Misioni Institucional i NOVARIC®', 'Këshilli Etik', '2026-08-10T09:30:00Z', ARRAY['ethical_resonance', 'readability'], 'Nuk merret pjesë në lobime apo fushata të tjera.', 'EFCSN Section 3.1.5', 'IFCN Criterion 1'),

('ETIK-2A', 3, '3.2', 'A', 'Mbrojtja e Sigurisë së Subjekteve', 'subject_safety', 'Ne mbrojmë identitetin e subjekteve kur ka një shqetësim të arsyeshëm për sigurinë e tyre.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/privacy', 'Protokolli i Mbrojtjes së Burimeve dhe Sinjalizuesve', 'Këshilltari Ligjor', '2026-08-16T15:00:00Z', ARRAY['ethical_resonance'], 'Anonimizim i enkriptuar sipas kërkesave ligjore.', 'EFCSN Section 3.2.1', 'IFCN Criterion 2'),
('ETIK-2B', 3, '3.2', 'B', 'Mbrojtja e të Miturve', 'protection_of_minors', 'Ne jemi të përmbajtur dhe të respektueshëm kur përmendim ose identifikojmë të mitur.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/privacy', 'Rregullorja për Mbrojtjen e të Miturve', 'Redaksia', '2026-08-16T15:00:00Z', ARRAY['ethical_resonance'], 'Mosidentifikim dhe mbrojtje e rreptë e imazhit.', 'EFCSN Section 3.2.2', 'IFCN Criterion 2'),
('ETIK-2C', 3, '3.2', 'C', 'E Drejta e Përgjigjes', 'right_of_reply', 'Ne ofrojmë të drejtën e përgjigjes çdo personi ose organizate që është burimi i pretendimit të pasaktë.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Kanal i Dedikuar për të Drejtën e Përgjigjes', 'Sekretaria Editoriale', '2026-08-27T12:00:00Z', ARRAY['lifecycle', 'credibility'], 'Afat 48 orësh për përfshirjen e qëndrimit.', 'EFCSN Section 3.2.3', 'IFCN Criterion 2'),

('ETIK-3A', 3, '3.3', 'A', 'Korrigjim i Menjëhershëm', 'immediate_correction', 'Ne korrigjojmë çdo gabim të njohur menjëherë. Transparenca për gabimet është thelbësore për besimin (Kovach & Rosenstiel, 2014).', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Regjistri i Korrigjimeve Publike', 'Redaktori i Standardeve', '2026-09-04T17:00:00Z', ARRAY['lifecycle'], 'Gjurmim transparent i modifikimeve me pullë kohore.', 'EFCSN Section 3.3.1', 'IFCN Criterion 5'),
('ETIK-3B', 3, '3.3', 'B', 'Shpjegim i Rrethanave për Gabime Thelbësore', 'correction_circumstances', 'Për gabime thelbësore, ne ofrojmë një shpjegim të plotë të rrethanave.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Protokolli i Notave Shpjeguese', 'Bordi Editorial', '2026-09-04T17:00:00Z', ARRAY['lifecycle', 'logic'], 'Botim i shënimit editorial në krye të artikullit.', 'EFCSN Section 3.3.2', 'IFCN Criterion 5'),
('ETIK-3C', 3, '3.3', 'C', 'Aksesueshmëri e Politikës së Korrigjimeve', 'accessible_corrections_policy', 'Politika jonë e korrigjimeve është lehtësisht e aksesueshme.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Faqja e Hapur e Korrigjimeve & Ankesave', 'Redaksia e Uebit', '2026-09-06T10:00:00Z', ARRAY['seo_accessibility', 'lifecycle'], 'E dukshme në meny dhe në fundin e çdo faqeje.', 'EFCSN Section 3.3.3', 'IFCN Criterion 5'),
('ETIK-3D', 3, '3.3', 'D', 'Kanal Direkt për Audiencën', 'direct_correction_channel', 'Ne ofrojmë kanale direkte për audiencën për të kërkuar një korrigjim.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/korrigjime', 'Formulari i Drejtpërdrejtë i Ankesave', 'Zyra e Standardeve', '2026-09-06T10:00:00Z', ARRAY['lifecycle'], 'Konfirmim i menjëhershëm me kod ndjekjeje dhe SLA 7-ditore.', 'EFCSN Section 3.3.4', 'IFCN Criterion 5'),

-- Neni 4: Transparenca
('TRAN-1A', 4, '4.1', 'A', 'Struktura Organizative Publike', 'public_structure', 'Struktura jonë organizative dhe mënyra e ushtrimit të kontrollit editorial janë publike.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Organigrama e Publikuar dhe Rregullorja e Brendshme', 'Zyra Juridike', '2026-08-11T14:30:00Z', ARRAY['lifecycle'], 'Strukturë e verifikuar në Qendrën Kombëtare të Biznesit.', 'EFCSN Section 4.1.1', 'IFCN Criterion 4'),
('TRAN-1B', 4, '4.1', 'B', 'Përditësimi i Pronësisë dhe Statusit Ligjor', 'legal_status_updates', 'Informacioni mbi pronësinë dhe statusin ligjor të platformës është i përditësuar rregullisht.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/trademarkCertificate', 'Ekstrakti QKB dhe Certifikata EUIPO', 'Departamenti Ligjor', '2026-08-11T14:30:00Z', ARRAY['lifecycle'], 'Dokumente publike të certifikuara nga OPM & EUIPO.', 'EFCSN Section 4.1.2', 'IFCN Criterion 4'),
('TRAN-1C', 4, '4.1', 'C', 'Transparenca e Ekipit Editorial', 'editorial_team_transparency', 'Identiteti i redaktorëve dhe vendimmarrësve kryesorë është publik.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Faqja e Ekipit Editorial dhe Profilet Profesionale', 'Redaksia', '2026-08-11T14:30:00Z', ARRAY['lifecycle'], 'Profilet e plota me biografi dhe kredenciale profesionale.', 'EFCSN Section 4.1.3', 'IFCN Criterion 4'),

('TRAN-2A', 4, '4.2', 'A', 'Deklarimi Publik i të Ardhurave', 'revenue_sources_declaration', 'Ne deklarojmë publikisht burimet tona kryesore të të ardhurave.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Raporti Financiar Vjetor i Transparencës', 'Drejtoria Financiare', '2026-08-13T16:00:00Z', ARRAY['ethical_resonance', 'lifecycle'], 'Bilanci vjetor dhe burimet e të ardhurave të deklaruara.', 'EFCSN Section 4.2.1', 'IFCN Criterion 4'),
('TRAN-2B', 4, '4.2', 'B', 'Mbrojtja nga Ndikimi i Financuesve', 'funding_independence_mechanisms', 'Ne shpjegojmë mekanizmat që sigurojnë pavarësinë editoriale nga financuesit.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Muri Kinez i Ndarjes Financiare-Editoriale', 'Këshilli Mbikëqyrës', '2026-08-13T16:00:00Z', ARRAY['ethical_resonance'], 'Asnjë financues nuk ka akses apo ndikim mbi hetime.', 'EFCSN Section 4.2.2', 'IFCN Criterion 4'),
('TRAN-2C', 4, '4.2', 'C', 'Ndalimi i Sponsorizimit të Verifikimeve', 'no_sponsored_factchecks', 'Përmbajtja e verifikimit të fakteve nuk mund të sponsorizohet në asnjë rrethanë. Çdo partneritet tjetër deklarohet qartësisht.', 'compliant', 'PËRPUTHSHMËRI E PLOTË', '/standards/transparence', 'Rregullorja mbi Sponsorizimet dhe Donacionet', 'Bordi Drejtues', '2026-08-13T16:00:00Z', ARRAY['ethical_resonance'] , 'Ndalim absolut i çdo forme komercializimi të verdikteve.', 'EFCSN Section 4.2.3', 'IFCN Criterion 4')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  evidence_url = EXCLUDED.evidence_url,
  last_verified_at = EXCLUDED.last_verified_at,
  score_dimensions = EXCLUDED.score_dimensions;

-- Seed Audits
INSERT INTO standard_audits (audit_date, next_audit_date, auditor_name, auditor_role, overall_score, report_hash, notes)
VALUES
('2026-08-15T10:00:00Z', '2026-12-15T00:00:00Z', 'Dr. Alban Gj. THIKA & Komisioni i Standardeve', 'Auditor i Jashtëm i Integritetit', 98.40, 'a7c92e104f6e1b7890bc4d34f4', 'Përputhshmëri e plotë me të gjitha kriteret e EFCSN dhe IFCN. Përmirësim i ndjeshëm në gjurmueshmërinë algoritmike.')
ON CONFLICT DO NOTHING;

-- Seed Corrections Ledger
INSERT INTO corrections (id, article_id, article_title, type, summary, diff_url, published_at, status, reviewer)
VALUES
('CORR-2026-001', '6d22b038', 'Trump viziton Dublinin – Analiza e deklaratave mbi Irlandën e Bashkuar', 'Kontekstual', 'Shtuar konteksti historik i Marrëveshjes së Premtes së Mirë dhe sqarim i termave diplomatikë në deklaratën e cituar.', '/standards/korrigjime?id=CORR-2026-001', '2026-09-12T09:30:00Z', 'Zgjidhur', 'Redaktori i Jashtëm'),
('CORR-2026-002', '157b23fa', 'Financimet politike në Mbretërinë e Bashkuar dhe donacionet kripto', 'Faktik', 'Saktësuar shifra e konvertimit nga GBP në EUR për donacionin e raportuar nga Komisioni Zgjedhor britanik.', '/standards/korrigjime?id=CORR-2026-002', '2026-09-11T16:45:00Z', 'Zgjidhur', 'Zyra e të Dhënave'),
('CORR-2026-003', '7996c7ef', 'Raporti mbi nëndetëset bërthamore dhe qëndrimin japonez', 'Tipografik', 'Përmirësuar transliterimi i emrave të personaliteteve zyrtare të Ministrisë së Mbrojtjes së Japonisë.', '/standards/korrigjime?id=CORR-2026-003', '2026-09-11T14:10:00Z', 'Zgjidhur', 'Korrektura Gjuhësore')
ON CONFLICT (id) DO NOTHING;

-- Seed AI Registry
INSERT INTO ai_registry (id, model_name, version, provider, purpose, human_oversight_step, architecture_tier, last_updated, compliance_status, capabilities)
VALUES
('AI-REG-01', 'Nora AI Core', 'v2.4.1', 'Google Gemini 2.5 Flash Enterprise', 'Nxjerrje e entiteteve me emër (NER), krahasim i burimeve parësore dhe indeksim sintaksor.', 'Çdo sinjal dhe klasifikim i gjeneruar nga Nora i nënshtrohet miratimit të detyrueshëm me dy çelësa nga redaktori përgjegjës para publikimit (Human-in-the-Loop).', 'Server-Side Cloud Run (Isolated VPC)', '2026-09-10T12:00:00Z', 'Përputhshmëri e Plotë', ARRAY['NER Extraction', 'Cross-Source Triangulation', 'Flesch-Kincaid Grading', 'Temporal Sequence Alignment']),
('AI-REG-02', 'Aletheia Logic Parser', 'v1.8.0', 'NOVARIC® Proprietary Hybrid NLP', 'Skanim i gabimeve logjike (fallacies), identifikim i rrethit vicioz dhe konsistencës silogjistike në deklaratat publike.', 'Rishikim nga paneli i filozofisë së jurisprudencës; asnjë verdikt diskualifikues nuk jepet pa konfirmim njerëzor.', 'Edge / In-Memory Deterministic Engine', '2026-08-30T16:00:00Z', 'Përputhshmëri e Plotë', ARRAY['Syllogistic Verification', 'Informal Fallacy Tagging', 'Rhetorical Sentiment Isolation'])
ON CONFLICT (id) DO NOTHING;

-- Seed Transparency Ledger
INSERT INTO transparency_ledger (id, category, category_label_sq, title, description, legal_entity, evidence_name, evidence_url, verified_at, certifying_body)
VALUES
('TRANS-01', 'ownership', 'Pronësia & Struktura Ligjore', 'Struktura Aksionere dhe Regjistrimi Tregtar', 'NOVARIC® Sh.A. është shoqëri aksionere e regjistruar sipas ligjeve shqiptare, me seli në Shkodër, 100% kapital i pavarur privat dhe pa asnjë pronësi apo pjesëmarrje shtetërore apo partiake.', 'NOVARIC® Sh.A. (Shkodër, Shqipëri)', 'Ekstrakti Historik i Regjistrit Tregtar QKB', 'https://qkb.gov.al', '2026-08-11T10:00:00Z', 'Qendra Kombëtare e Biznesit (QKB)'),
('TRANS-02', 'ownership', 'Pronësia & Struktura Ligjore', 'Mbrojtja e Markës Tregtare në Bashkimin Evropian', 'Marka dhe metodologjia e verifikimit NOVARIC® janë të certifikuara dhe të mbrojtura në Zyra e Bashkimit Evropian për Pronësinë Intelektuale (EUIPO).', 'NOVARIC® Media Group', 'Certifikata e Markës EUIPO Nr. 018892110', '/trademarkCertificate', '2026-08-05T14:00:00Z', 'European Union Intellectual Property Office (EUIPO)'),
('TRANS-03', 'funding', 'Financimi & Pavarësia Financiare', 'Modeli i Financimit dhe Burimet e të Ardhurave', 'Operacionet e verifikimit financohen përmes shërbimeve teknologjike B2B, granteve të hapura për transparencë mediatike dhe kërkimit akademik të pavarur. Ndalohet kategorikisht çdo financim nga parti politike apo kandidatë.', 'NOVARIC® Media Monitor', 'Deklarata Vjetore Financiare 2025/2026', '/standards/transparence', '2026-08-13T12:00:00Z', 'Auditues i Pavarur Ligjor'),
('TRANS-04', 'editorial', 'Bordi Editorial & Redaksia', 'Udhëheqja Kërkimore dhe Ekipi i Verifikimit', 'Departamenti Kërkimor drejtohet nga Dr. Alban Gj. THIKA, në bashkëpunim me redaktorë gazetarie hulumtuese dhe inxhinierë të sistemeve NLP të Nora AI.', 'Redaksia e Pavarur NOVARIC®', 'Karta e Integritetit Profesional dhe Kredencialet Akademike', '/aboutUs', '2026-08-20T11:00:00Z', 'Këshilli Shkencor NOVARIC®'),
('TRANS-05', 'governance', 'Qeverisja & Pajtueshmëria Ndërkombëtare', 'Përputhshmëria me Kodet EFCSN dhe IFCN', 'Operacionet tona zbatojnë 100% të kërkesave të Kodit Evropian të Standardeve (EFCSN) dhe Kodit të Parimeve të IFCN për pavarësi, metodologji të hapur dhe korrigjime transparente.', 'NOVARIC® Fact-Checking Unit', 'Raporti i Përputhshmërisë EFCSN/IFCN 2026', '/standards/perputhshmeri', '2026-08-15T09:00:00Z', 'Zyra e Integritetit & Pajtueshmërisë')
ON CONFLICT (id) DO NOTHING;
