import React, { useMemo, useState, ReactNode } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { JsonLd } from './JsonLd';
import { AnalyticalSpine } from './analytics/AnalyticalSpine';
import { ScoreLineagePanel } from './analytics/ScoreLineagePanel';
import { ConceptTooltip } from './analytics/ConceptTooltip';
import { CitationCard } from './analytics/CitationCard';
import { getMaragonIndicatorById, MARAGON_INDICATORS } from '../data/maragonIndicators';
import { normalizeClauseId } from '../data/analyticalMappings';
import { Shield, Sparkles, Activity, ArrowRight, ExternalLink } from 'lucide-react';

interface MaragonFrameworkPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
  onNavigateToStandards?: (sub?: string, clauseId?: string) => void;
  onNavigateToMethodology?: () => void;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join(' ');
  }
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const SourceLink: React.FC<{ s: number }> = ({ s }) => (
  <sup>
    <a href={`#ref-${s}`} className="text-primary-500 mx-0.5 no-underline">[{s}]</a>
  </sup>
);

export const MaragonFrameworkPage: React.FC<MaragonFrameworkPageProps> = (props) => {
  const {
    onBack,
    onNavigateToNoraAiProfile,
    onNavigateToVipProfile,
    onNavigateToArticleMetricsExplained,
    onNavigateToStandards,
    onNavigateToMethodology,
  } = props;

  const [activeLineageMetric, setActiveLineageMetric] = useState<string | null>(null);

  const pageTitle = "Korniza Analitike MARAGON® | Teoria dhe Praktika e Vlerësimit të Medias";
  const pageDescription = "Një zhytje e thellë në metodologjinë e avancuar të NOVARIC® për vlerësimin e medias, duke lidhur teorinë akademike me sfidat reale të gazetarisë shqiptare.";
  const keywords = ["Korniza MARAGON", "Teoria e Komunikimit", "Vlerësim Mediatik", "Etika e Medias", "Analizë Mediatike Shqipëri", "Integritet Gazetaresk", "Kornizim Mediatik", "Kapja e Medias", "Sfera Publike", "Standarde Gazetarizmi", "NOVARIC"];

  const sourcesList = useMemo(() => [
    { id: 1, url: "www.cambridge.org/core/books/comparing-media-systems/9780521543088", text: "Hallin, D. C., & Mancini, P. (2004). Comparing media systems. Cambridge University Press.", credibility_industry_rating_pct: 98 },
    { id: 2, url: "www.amazon.com/Elements-Journalism-What-Newspeople-Should/dp/0804136787", text: "Kovach, B., & Rosenstiel, T. (2014). The elements of journalism (3rd ed.). Three Rivers Press.", credibility_industry_rating_pct: 98 },
    { id: 3, url: "www.journalofcommunication.org/", text: "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58.", credibility_industry_rating_pct: 97 },
    { id: 4, url: "www.tandfonline.com/loi/cjcs20", text: "Davies, N. (2008). Flat earth news. Chatto & Windus.", credibility_industry_rating_pct: 90 },
    { id: 5, url: "journals.sagepub.com/doi/10.1177/0093650291018001001", text: "Iyengar, S. (1991). Is anyone responsible? How television frames political issues. University of Chicago Press.", credibility_industry_rating_pct: 96 },
    { id: 6, url: "press.uchicago.edu/ucp/books/book/chicago/M/bo3631024.html", text: "Mungiu-Pippidi, A. (2013). Freedom without impartiality: The Vicious Circle of media capture. In P. N. Howard (Ed.), Democracy's fourth wave? (pp. 45-66). Oxford University Press.", credibility_industry_rating_pct: 93 },
    { id: 7, url: "onlinlinelibrary.wiley.com/doi/10.1111/j.1460-2466.1993.tb01262.x", text: "Bourdieu, P. (1998). On Television. The New Press.", credibility_industry_rating_pct: 95 },
    { id: 8, url: "www.communicationcache.com/uploads/1/0/8/8/10887248/media_literacy_and_the_challenge_of_new_information_and_communication_technologies.pdf", text: "Livingstone, S. (2004). Media literacy and the challenge of new information and communication technologies. The Communication Review, 7(1), 3–14.", credibility_industry_rating_pct: 94 },
    { id: 9, url: "yalebooks.yale.edu/book/9780300084533/what-are-journalists-for/", text: "Rosen, J. (1999). What are journalists for?. Yale University Press.", credibility_industry_rating_pct: 93 },
    { id: 10, url: "mitpress.mit.edu/9780262581081/the-structural-transformation-of-the-public-sphere/", text: "Habermas, J. (1989). The structural transformation of the public sphere. MIT Press.", credibility_industry_rating_pct: 98 },
    { id: 11, url: "www.politybooks.com/bookdetail?book_slug=a-private-sphere-democracy-in-a-digital-age--9780745648873", text: "Papacharissi, Z. (2010). A Private Sphere: Democracy in a Digital Age. Polity Press.", credibility_industry_rating_pct: 92 },
  ], []);

  const handleClauseNav = (clauseId: string) => {
    const clean = normalizeClauseId(clauseId);
    if (onNavigateToStandards) {
      onNavigateToStandards('kodi', clean);
    } else {
      window.location.href = `/?page=standards&sub=kodi&clause=${clean}#clause-${clean}`;
    }
  };

  const handleStepNav = (stepId: string) => {
    if (onNavigateToMethodology) {
      onNavigateToMethodology();
    } else {
      window.location.href = `/?page=methodology#${stepId}`;
    }
  };

  // Helper component to render the lineage strip under each MARAGON indicator
  const IndicatorLineageStrip: React.FC<{ indicatorId: string }> = ({ indicatorId }) => {
    const ind = getMaragonIndicatorById(indicatorId);
    if (!ind) return null;

    return (
      <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-semibold text-slate-500 dark:text-slate-400">Lidhet me:</span>

        {/* Related Metrics */}
        {ind.related_metric_ids.map(mId => (
          <button
            key={mId}
            type="button"
            onClick={() => setActiveLineageMetric(mId)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono hover:bg-emerald-100 transition cursor-pointer"
            title="Kliko për të parë prejardhjen e plotë të pikëzimit"
          >
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>{mId.replace('metric:', '')}</span>
          </button>
        ))}

        {/* Methodology steps */}
        {ind.methodology_step_ids.map(sId => (
          <button
            key={sId}
            type="button"
            onClick={() => handleStepNav(sId)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono hover:bg-teal-100 transition cursor-pointer"
            title="Kliko për të parë hapin e metodologjisë"
          >
            <Sparkles className="w-3 h-3 text-teal-500" />
            <span>{sId.replace('meth:', '')}</span>
          </button>
        ))}

        {/* Standard Clauses */}
        {ind.standard_clause_ids.map(clId => (
          <button
            key={clId}
            type="button"
            onClick={() => handleClauseNav(clId)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono hover:bg-sky-100 transition cursor-pointer"
            title="Kliko për të parë klauzolën e Kodit të Standardeve"
          >
            <Shield className="w-3 h-3 text-sky-500" />
            <span>{clId.replace('std:', '')}</span>
          </button>
        ))}
      </div>
    );
  };

  const articleContentJsx = useMemo(() => (
    <>
      <ArticleSection id="vizioni" title="Vizioni: Përtej Metrikave të Thjeshta">
        <p>
          Korniza MARAGON® (Media Assessment for Readiness, Aptitude, Governance, Oversight Nurturing) është përgjigja jonë ndaj nevojës urgjente për një vlerësim të thelluar dhe të ndjeshëm ndaj kontekstit të medias shqiptare. Ajo refuzon matjet sipërfaqësore (si klikimet apo shikueshmëria) si tregues të cilësisë dhe në vend të tyre ndërton një kuadër analitik të rrënjosur në dekada të tëra të kërkimit në shkencat e komunikimit. Vizioni i saj themelor është të forcojë rolin e medias si një arkitekte e{' '}
          <ConceptTooltip conceptId="concept:public_sphere">
            sferës publike
          </ConceptTooltip>{' '}
          – hapësirës ku qytetarët formojnë opinione dhe marrin vendime të informuara, një koncept i zhvilluar nga Jürgen Habermas dhe i adaptuar për epokën dixhitale nga studiues si Papacharissi.
          <SourceLink s={10} /><SourceLink s={11} />
        </p>
      </ArticleSection>

      <ArticleSection id="dimensionet" title="Dimensionet Themelore: Katër Shtyllat e Performancës Mediatike">
        <p>Dimensionet e MARAGON® nuk janë kategori arbitrare; ato pasqyrojnë fushat kryesore të përgjegjësisë që literatura akademike i atribuon medias në një shoqëri demokratike.</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Gatishmëria (Readiness - R):</strong> Themeli Etik dhe Profesional. Përfaqëson "higjienën" bazë të gazetarisë. A i plotëson media kushtet minimale për t'u konsideruar një aktor i besueshëm?</li>
          <li><strong>Aftësia (Aptitude - A):</strong> Mjeshtëria e Gazetarisë. Përfaqëson cilësinë e produktit gazetaresk. A është përmbajtja e saktë, e thelluar dhe e paraqitur në mënyrë efektive?</li>
          <li><strong>Qeverisja (Governance - G):</strong> Integriteti Strukturor. Përfaqëson pavarësinë e medias nga forcat e jashtme. A është redaksia e lirë nga ndikimet e papërshtatshme politike dhe ekonomike?</li>
          <li><strong>Kujdesi Mbikëqyrës (Oversight Nurturing - O):</strong> Përgjegjësia Shoqërore. Përfaqëson kontributin e medias në shoqëri. A e ndihmon media publikun të kuptojë botën dhe të marrë pjesë në jetën demokratike?</li>
        </ul>
      </ArticleSection>

      <ArticleSection id="vleresimi-emisione" title="Vlerësimi Granular - Emisionet Televizive & Mediat">
        {/* R1.1 */}
        <div id="maragon:R1.1" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>R1.1. Pajtueshmëria Rregullatore:</strong> IA analizon përputhshmërinë me vendimet e AMA-s. Në kontekstin shqiptar, ku media shpesh funksionon brenda modelit "
            <ConceptTooltip conceptId="concept:polarized_pluralism">
              Pluralist të Polarizuar
            </ConceptTooltip>
            ", shkeljet e rregullave zgjedhore nuk janë thjesht administrative, por simptoma të një paralelizmi të lartë politik.
            <SourceLink s={1} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:R1.1" />
        </div>

        {/* R1.2 */}
        <div id="maragon:R1.2" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>R1.2. Pajtueshmëria Etike:</strong> IA identifikon praninë e korrigjimeve dhe ndarjen e qartë mes opinionit dhe lajmit. Kjo mat përkushtimin ndaj parimit të parë të gazetarisë: "detyrimi i parë i saj është ndaj së vërtetës".
            <SourceLink s={2} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:R1.2" />
        </div>

        {/* A2.1 */}
        <div id="maragon:A2.1" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.1. Saktësia Faktike:</strong> IA kryqëzon pretendimet me bazat e të dhënave. Kjo mat "disiplinën e verifikimit".
          </p>
          <IndicatorLineageStrip indicatorId="maragon:A2.1" />
        </div>

        {/* A2.2 */}
        <div id="maragon:A2.2" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.2. Paanshmëria & Anshmëria:</strong> IA analizon{' '}
            <ConceptTooltip conceptId="concept:framing">
              kornizimin (framing)
            </ConceptTooltip>
            . Një lajm mund të jetë 100% i saktë faktikisht, por thellësisht i anshëm për shkak të kornizimit.
            <SourceLink s={3} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:A2.2" />

          {/* Forward Link Card under A2.2 */}
          <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-red-900 dark:text-red-200">
              <Activity className="w-4 h-4 text-[#e4191e] shrink-0" />
              <span className="font-semibold">
                Shiko këtë tregues live: Anshmëria & Sentiment në Matricën e Integritetit
              </span>
            </div>
            <button
              onClick={() => setActiveLineageMetric('metric:bias_sentiment')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e4191e] hover:bg-red-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Eksploro Prejardhjen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* A2.3 */}
        <div id="maragon:A2.3" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.3. Origjinaliteti & Thellësia:</strong> IA zbulon gazetarinë investigative kundrejt praktikës së "
            <ConceptTooltip conceptId="concept:churnalism">
              churnalism
            </ConceptTooltip>
            " – ripërpunimi pasiv i njoftimeve për shtyp.
            <SourceLink s={4} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:A2.3" />
        </div>

        {/* A2.4 */}
        <div id="maragon:A2.4" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.4. Kontekstualizimi:</strong> IA vlerëson raportimin tematik (probleme sistematike) kundrejt atij episodik (ngjarje të izoluara), i cili depolitizon çështjet publike.
            <SourceLink s={5} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:A2.4" />
        </div>

        {/* G3.1 */}
        <div id="maragon:G3.1" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>G3.1. Ndikimi i Pronësisë:</strong> IA kërkon shenja të "
            <ConceptTooltip conceptId="concept:media_capture">
              kapjes së medias (media capture)
            </ConceptTooltip>
            ", ku media kontrollohet nga elita për të mbrojtur interesat e tyre private.
            <SourceLink s={6} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:G3.1" />

          {/* Forward Link Card under G3.1 */}
          <div className="mt-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-sky-900 dark:text-sky-200">
              <Shield className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-semibold">
                Shiko këtë tregues live: Transparenca e Pronësisë në Zyrën e Standardeve
              </span>
            </div>
            <button
              onClick={() => handleClauseNav('TRANSP-4.1A')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Neni 4.1</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reciprocal Backlink to PARAGON D2 (Governance Family) */}
          <div className="mt-2 p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold block">Lidhje Reciproke PARAGON®: Llogaridhënia (D2) ↔ Familja Qeverisëse G3</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">Auditimi i pasurive ILDKPKI dhe integritetit zyrtar</span>
              </div>
            </div>
            <button
              onClick={() => setActiveLineageMetric('paragon:d2')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Prejardhja e D2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* G3.2 */}
        <div id="maragon:G3.2" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>G3.2. Kontrolli Editorial:</strong> IA analizon autonominë e linjës editoriale. Ky tregues mat atë që Bourdieu e quajti "
            <ConceptTooltip conceptId="concept:field_autonomy">
              autonomia e fushës gazetareske
            </ConceptTooltip>
            ".
            <SourceLink s={7} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:G3.2" />

          {/* Reciprocal Backlink to PARAGON D5 / D2 */}
          <div className="mt-2 p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold block">Lidhje Reciproke PARAGON®: Qeverisja Institucionale (D5) ↔ G3.2</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">Integriteti kushtetues dhe vendimmarrja e pavarur</span>
              </div>
            </div>
            <button
              onClick={() => setActiveLineageMetric('paragon:d5')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Prejardhja e D5</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* O4.1 */}
        <div id="maragon:O4.1" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>O4.1. Promovimi i Edukimit Mediatik:</strong> IA identifikon segmente që demaskojnë dezinformimin. Kjo është thelbësore për të kultivuar{' '}
            <ConceptTooltip conceptId="concept:media_literacy">
              edukimin mediatik (media literacy)
            </ConceptTooltip>
            .
            <SourceLink s={8} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:O4.1" />

          {/* Reciprocal Backlink to PARAGON D3 */}
          <div className="mt-2 p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
              <Activity className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold block">Lidhje Reciproke PARAGON®: Përfaqësimi Qytetar (D3) ↔ O4.1</span>
                <span className="text-[11px] text-amber-700 dark:text-amber-300">Në pritje të auditimit të dëgjesave publike (P2 Stub)</span>
              </div>
            </div>
            <button
              onClick={() => setActiveLineageMetric('paragon:d3')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Statusi D3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* O4.2 */}
        <div id="maragon:O4.2" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>O4.2. Kontributi në Diskursin Demokratik:</strong> IA mat pluralizmin e zërave. Kjo lidhet me idealin e një{' '}
            <ConceptTooltip conceptId="concept:public_journalism">
              gazetarie publike (public journalism)
            </ConceptTooltip>
            , e cila synon të lehtësojë debatin qytetar.
            <SourceLink s={9} />
          </p>
          <IndicatorLineageStrip indicatorId="maragon:O4.2" />

          {/* Reciprocal Backlink to PARAGON D1 (O4.2 Family) */}
          <div className="mt-2 p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-semibold block">Lidhje Reciproke PARAGON®: Angazhimi Politik (D1) ↔ Familja O4.2</span>
                <span className="text-[11px] text-blue-700 dark:text-blue-300">Përllogaritur nga /mbledhjet: pjesëmarrja në komisione dhe nismat ligjore</span>
              </div>
            </div>
            <button
              onClick={() => setActiveLineageMetric('paragon:d1')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-sm"
            >
              <span>Prejardhja e D1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection id="vleresimi-individe" title="Vlerësimi Granular - Individët (Gazetarë, Drejtues)">
        <p>Këtu, fokusi zhvendoset nga struktura te agjenti, nga institucioni te profesionisti.</p>

        {/* Individual A2.2 */}
        <div id="maragon:ind:A2.2" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.2. Paanshmëria & Anshmëria:</strong> Për individët, kjo shkon përtej kornizimit të tekstit dhe përfshin analizën e performancës. A janë pyetjet sfiduese për të gjithë të ftuarit? A ka shenja të anshmërisë së nënkuptuar (implicit bias)?
          </p>
          <IndicatorLineageStrip indicatorId="maragon:ind:A2.2" />
        </div>

        {/* Individual A2.3 */}
        <div id="maragon:ind:A2.3" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>A2.3. Thellësia e Analizës:</strong> Kjo mat kapitalin kulturor dhe informacional të gazetarit. A demonstron ai/ajo një kuptim të thellë të historisë së një çështjeje, duke zbatuar{' '}
            <ConceptTooltip conceptId="concept:hermeneutic_circle">
              sinergjinë hermeneutike
            </ConceptTooltip>{' '}
            mes fakteve të veçanta dhe peizazhit të gjerë shoqëror?
          </p>
          <IndicatorLineageStrip indicatorId="maragon:ind:A2.3" />
        </div>

        {/* Individual O4.1 */}
        <div id="maragon:ind:O4.1" className="scroll-mt-24 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 my-3">
          <p>
            <strong>O4.1. Promovimi i të Menduarit Kritik:</strong> A e modelon gazetari sjelljen e një qytetari të informuar? Kjo është kalimi nga një gazetari që thotë "kjo është e vërteta" në një gazetari që thotë "ja si mund ta zbuloni të vërtetën".
          </p>
          <IndicatorLineageStrip indicatorId="maragon:ind:O4.1" />
        </div>
      </ArticleSection>

      <ArticleSection id="perfundime" title="Përfundime: Nga të Dhënat te Kuptimi">
        <p>Korniza MARAGON® përdor Inteligjencën Artificiale të Shpjegueshme (XAI) për të siguruar që çdo pikëzim të jetë transparent dhe i justifikuar. Duke e bërë këtë, ajo synon të transformojë debatin mbi cilësinë e medias në Shqipëri: nga një debat i bazuar në opinione, në një dialog të bazuar në të dhëna dhe prova.</p>
      </ArticleSection>

      <ArticleSection id="referencat" title="Referencat & Korpusi Shkencor">
        <div className="space-y-4">
          <CitationCard citationId="ref:hallin-mancini-2004" />
          <CitationCard citationId="ref:kovach-rosenstiel-2014" />
          <CitationCard citationId="ref:entman-1993" />
          <CitationCard citationId="ref:davies-2008" />
          <CitationCard citationId="ref:iyengar-1991" />
          <CitationCard citationId="ref:mungiu-pippidi-2013" />
          <CitationCard citationId="ref:bourdieu-1998" />
          <CitationCard citationId="ref:livingstone-2004" />
          <CitationCard citationId="ref:rosen-1999" />
          <CitationCard citationId="ref:habermas-1989" />
          <CitationCard citationId="ref:papacharissi-2010" />
        </div>
      </ArticleSection>
    </>
  ), [sourcesList]);

  const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
  const articleMetrics = useMemo((): ArticleMetrics => {
    return calculateArticleMetrics(
      fullArticleText,
      {
        url: window.location.href,
        published_at: "2025-09-01T22:00:00Z",
        article_id: 'maragon-framework-01'
      },
      sourcesList,
      {
        researchHours: 300,
        focusKeyword: "Korniza MARAGON"
      }
    );
  }, [fullArticleText, sourcesList]);

  const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
    return calculateArticleIntegrityProfile(articleMetrics);
  }, [articleMetrics]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Analytical Spine Ribbon at top */}
      <AnalyticalSpine
        currentTier="korniza"
        activeEntityLabel="Korniza Analitike MARAGON®"
        onNavigateTier={(tier) => {
          if (tier === 'doktrina') {
            if (onNavigateToStandards) onNavigateToStandards();
            else window.location.href = '/?page=standards';
          } else if (tier === 'metoda') {
            if (onNavigateToMethodology) onNavigateToMethodology();
            else window.location.href = '/?page=methodology';
          } else if (tier === 'vleresimi') {
            onNavigateToArticleMetricsExplained();
          } else if (tier === 'entiteti') {
            window.location.href = '/?page=newsList';
          }
        }}
      />

      <ArticleTemplate1
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageKeywords={keywords.join(', ')}
        headerTitle={renderWithSuperscript("Korniza Analitike MARAGON®")}
        headerSubtitle="Një Metodologji e Thelluar për Vlerësimin e Medias në Epokën Dixhitale"
        authors={[
          { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
          { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
        ]}
        publicationInfo={{
          publishedDate: "Publikuar: 1 Shtator, 2025",
          lastUpdated: "20 Tetor, 2025",
          location: "Shkodër, Shqipëri"
        }}
        tableOfContentsItems={[
          { id: "vizioni", title: "Vizioni: Përtej Metrikave të Thjeshta" },
          { id: "dimensionet", title: "Dimensionet Themelore" },
          { id: "vleresimi-emisione", title: "Vlerësimi Granular - Media" },
          { id: "vleresimi-individe", title: "Vlerësimi Granular - Individët" },
          { id: "perfundime", title: "Përfundime: Nga të Dhënat te Kuptimi" },
          { id: "referencat", title: "Referencat & Korpusi Shkencor" }
        ]}
        articleMetrics={articleMetrics}
        articleIntegrityProfile={articleIntegrityProfile}
        keywords={keywords}
        onBack={onBack}
        onNavigateToVipProfile={onNavigateToVipProfile}
        onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
      >
        {articleContentJsx}
      </ArticleTemplate1>

      {/* Score Lineage Modal */}
      {activeLineageMetric && (
        <ScoreLineagePanel
          metricId={activeLineageMetric}
          isModal
          isOpen={!!activeLineageMetric}
          onClose={() => setActiveLineageMetric(null)}
          onNavigateToClause={handleClauseNav}
          onNavigateToStep={handleStepNav}
        />
      )}
    </div>
  );
};
