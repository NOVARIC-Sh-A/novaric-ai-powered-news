import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Search,
  Sparkles,
  Info,
  Scale,
  Brain,
  Gauge,
  BookOpen,
} from 'lucide-react';
import { StandardClause, ScoreDimensionKey } from '../../types/standards';

interface TraceabilityMatrixProps {
  clauses: StandardClause[];
  initialDimension?: ScoreDimensionKey;
  onNavigateToClause?: (clauseId: string) => void;
}

interface DimensionDefinition {
  key: ScoreDimensionKey;
  name: string;
  category: string;
  metricWeight: string;
  description: string;
  howMeasured: string;
  articleEngineTieIn: string;
  iconName: string;
}

const SCORE_DIMENSIONS: DimensionDefinition[] = [
  {
    key: 'credibility',
    name: 'Besueshmëria',
    category: 'Vlerësimi Thelbësor i Fakteve',
    metricWeight: 'Pesha: 25% (13/15 tregues)',
    description: 'Vlerëson triangulimin me burime parësore, citimin e ekspertëve të pavarur dhe konfirmimin e kryqëzuar të pretendimit qendror.',
    howMeasured: 'Algoritmi llogarit numrin e burimeve unike të cituara (minimumi 2), krahason domenet me regjistrin e besueshmërisë dhe verifikon lidhjet e hapura të provave.',
    articleEngineTieIn: 'Reflektohet te paneli "Besueshmëria e Përmbajtjes" me vlerësimin 13/15 në kartën e artikullit.',
    iconName: 'ShieldCheck',
  },
  {
    key: 'logic',
    name: 'Integriteti Logjik',
    category: 'Struktura Argumentative',
    metricWeight: 'Pesha: 15% (Silogjizëm & Jo-fallaci)',
    description: 'Ekzaminon mungesën e arsyetimit rrethor, korrektësinë e premisave dhe validitetin e përfundimeve të pretenduara në lajm.',
    howMeasured: 'Motori Aletheia Logic Parser skanon tekstin për 24 gabime logjike (ad hominem, post hoc, strawman) dhe ndërton pemën e vlefshmërisë formale.',
    articleEngineTieIn: 'Matet në metrikën e konsistencës së pretendimeve dhe nivelit të provueshmërisë deductive.',
    iconName: 'Brain',
  },
  {
    key: 'ethical_resonance',
    name: 'Rezonanca Etike & Pavarësia',
    category: 'Etika Gazetare',
    metricWeight: 'Pesha: 20% (Pavarësi & Mos-konflikt)',
    description: 'Garanton neutralitetin politik, mungesën e anësisë partiake, dhe mbrojtjen e subjekteve të cenueshme dhe të miturve.',
    howMeasured: 'Klasifikuesi i balancës partiake vlerëson hapësirën e alokuar për palët dhe zbatimin e rregullores së mbrojtjes së identitetit.',
    articleEngineTieIn: 'Shërben si filtër bllokues: çdo shkelje etike penalizon rezultatin e përgjithshëm me zbritje të menjëhershme.',
    iconName: 'Scale',
  },
  {
    key: 'sentiment_analytics',
    name: 'Sentimenti & Neutraliteti',
    category: 'Objektiviteti Gjuhësor',
    metricWeight: 'Pesha: 10% (Gjuhë Fakto-Centrike)',
    description: 'Parandalon përdorimin e mbiemrave ngarkues, ekzagjerimeve dhe framing-ut polarizues në tekstin gazetaresk.',
    howMeasured: 'Analizuesi semantik i gjuhës shqipe indekson intensifikatorët, tonin emocional dhe devijimet nga regjistri standard i raportimit faktik.',
    articleEngineTieIn: 'Përcakton treguesin "Ton Neutral" në diagramin e analizës së ndjenjave.',
    iconName: 'Gauge',
  },
  {
    key: 'readability',
    name: 'Lexueshmëria & Qartësia',
    category: 'Aksesueshmëria Gjuhësore',
    metricWeight: 'Pesha: 10% (Indeksi Flesch-Kincaid Shqip)',
    description: 'Mundëson kuptueshmëri universale të fakteve të komplikuara për të gjitha shtresat e qytetarëve pa kompromentuar thellësinë.',
    howMeasured: 'Llogarit gjatësinë mesatare të fjalisë, numrin e rrokjeve për fjalë dhe gradën e lehtësisë së leximit të përshtatur për strukturën e shqipes.',
    articleEngineTieIn: 'Pasqyrohet te vlerësimi "Lexueshmëria e Përmbajtjes" në metrikën e avancuar të artikullit.',
    iconName: 'BookOpen',
  },
  {
    key: 'lifecycle',
    name: 'Cikli i Jetës & Përgjegjshmëria',
    category: 'Auditimi & Korrigjimet',
    metricWeight: 'Pesha: 10% (Gjurmueshmëri & Korrigjim)',
    description: 'Monitoron auditimin e vazhdueshëm, recensimin nga kolegët (peer-review) dhe gatishmërinë për korrigjim të shpejtë publik.',
    howMeasured: 'Regjistrimi me nënshkrim të dyfishtë të redaktorit përgjegjës dhe ruajtja e historikut të ndryshimeve (diff) në rast korrigjimi.',
    articleEngineTieIn: 'Pasqyrohet te statusi i rishikimit editorial dhe vula e fundit e auditimit.',
    iconName: 'Sparkles',
  },
  {
    key: 'seo_accessibility',
    name: 'Aksesueshmëria Dixhitale',
    category: 'Shpërndarja Publike',
    metricWeight: 'Pesha: 5% (Open Access)',
    description: 'Siguron që gjetjet e verifikimit të indeksohen lirisht, pa mure pagese (paywalls) dhe të jenë të aksesueshme nga lexuesit e ekraneve.',
    howMeasured: 'Verifikon metadata Schema.org ClaimReview, strukturën semantike HTML5 dhe përputhshmërinë me WCAG 2.1 AA.',
    articleEngineTieIn: 'Verifikon etiketat ClaimReview dhe aksesueshmërinë e hapur për kërkuesit e pavarur.',
    iconName: 'Layers',
  },
  {
    key: 'emotion',
    name: 'Valenca Emocionale',
    category: 'Anti-Sensacionalizmi',
    metricWeight: 'Pesha: 5% (Jo-Emocionale)',
    description: 'Përjashton kornizimin e lajmeve përmes panikut, urrejtjes, frikës ose entuziazmit të rremë.',
    howMeasured: 'Vlerëson shpërndarjen e polaritetit emocional dhe ndalon titujt me clickbait ose apel ndaj emocioneve parësore.',
    articleEngineTieIn: 'Shfaqet në panelin e valence-s emocionale të lajmit.',
    iconName: 'Gauge',
  },
];

export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({
  clauses,
  initialDimension = 'credibility',
  onNavigateToClause,
}) => {
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<ScoreDimensionKey>(initialDimension);
  const [selectedClauseHighlight, setSelectedClauseHighlight] = useState<string | null>(null);

  const currentDimension = SCORE_DIMENSIONS.find(d => d.key === selectedDimensionKey) || SCORE_DIMENSIONS[0];

  // Clauses mapped to the currently selected dimension
  const mappedClauses = clauses.filter(c => c.score_dimensions?.includes(selectedDimensionKey));

  // If a clause is clicked, show which dimensions it touches
  const activeClause = selectedClauseHighlight ? clauses.find(c => c.id === selectedClauseHighlight) : null;

  return (
    <div id="traceability-matrix-module" className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#e4191e] uppercase tracking-wider text-white">
                Inovacioni NOVARIC®
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Matrica e Gjurmueshmërisë: Standarde ↔ Algoritëm
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              Gjurmueshmëria e Plotë e Integritetit të Artikullit
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Çdo pikë e vlerësimit <strong>3.57/4.00</strong> në panelin "Vlerësimi i Integritetit të Artikullit" dhe 15 treguesit e tij rrjedhin drejtpërdrejt nga klauzolat e këtij Kodi. Zgjidh një dimension në të majtë për të parë klauzolat që e rregullojnë atë ligjërisht dhe operacionalisht.
            </p>
          </div>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-700 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Përputhshmëria e Sistemit</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-400">100% Traceable</span>
            <span className="text-[10px] text-slate-400 block">31 klauzola të lidhura</span>
          </div>
        </div>
      </div>

      {/* Two-Pane Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: The 8 Score Dimensions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#e4191e]" /> Dimensionet e Integritetit
            </h4>
            <span className="text-xs text-slate-500">8 Metrika Operacionale</span>
          </div>

          <div className="space-y-2">
            {SCORE_DIMENSIONS.map(dim => {
              const isSelected = dim.key === selectedDimensionKey;
              const relatedCount = clauses.filter(c => c.score_dimensions?.includes(dim.key)).length;
              const touchesActiveClause = activeClause?.score_dimensions?.includes(dim.key);

              return (
                <div
                  key={dim.key}
                  onClick={() => {
                    setSelectedDimensionKey(dim.key);
                    setSelectedClauseHighlight(null);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border text-left ${
                    isSelected
                      ? 'bg-red-50/90 dark:bg-red-950/40 border-[#e4191e] shadow-md ring-1 ring-[#e4191e]/40'
                      : touchesActiveClause
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {dim.category}
                        </span>
                        {touchesActiveClause && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                            E Lidhur me {activeClause?.id}
                          </span>
                        )}
                      </div>
                      <h5 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        {dim.name}
                      </h5>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {relatedCount} Klauzola
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {dim.description}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-slate-700 dark:text-slate-300">{dim.metricWeight}</span>
                    <span className="flex items-center gap-1 font-semibold text-[#e4191e]">
                      Shiko Klauzolat <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Governed Clauses & Implementation Mechanism */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Dimension Blueprint Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#e4191e]">
                  Specifikimi Algoritmik i Dimensionit
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentDimension.name} — {currentDimension.metricWeight}
                </h4>
              </div>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {mappedClauses.length} Klauzola Zbatuese
              </span>
            </div>

            {/* How Measured in Code */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Brain className="w-4 h-4 text-[#e4191e]" />
                <span>Mekanizmi i Matjes në Motorin e Lajmit:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                {currentDimension.howMeasured}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 font-mono pt-1">
                Lidhja në UI: {currentDimension.articleEngineTieIn}
              </div>
            </div>
          </div>

          {/* List of Governing Clauses for Current Dimension */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Klauzolat që Rregullojnë "{currentDimension.name}" ({mappedClauses.length})
              </h5>
              <span className="text-[11px] text-slate-400">Kliko një klauzolë për të parë detajet</span>
            </div>

            {mappedClauses.map(clause => {
              const isHighlighted = selectedClauseHighlight === clause.id;

              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseHighlight(clause.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white dark:bg-slate-800 ${
                    isHighlighted
                      ? 'border-[#e4191e] ring-2 ring-[#e4191e]/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                        {clause.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Neni {clause.neni} • Pika {clause.letter}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Përputhshmëri
                      </span>
                    </div>

                    {onNavigateToClause && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToClause(clause.id);
                        }}
                        className="text-xs text-[#e4191e] hover:underline font-semibold flex items-center gap-1 shrink-0"
                      >
                        Hap në Kod <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <h6 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {clause.title}
                  </h6>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-serif italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                    "{clause.text}"
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="text-slate-400">Përgjegjës:</span>{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{clause.owner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Standardi:</span>{' '}
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {clause.efcsn_clause_ref} • {clause.ifcn_criterion_ref}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
