import React, { useState } from 'react';
import { ProfileShareButton } from '../figurat-politike/ProfileShareButton';
import type { VipProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  MARAGON_CONFIDENCE_LABELS,
  isMaragonBiographyPublic,
  maragonInternalPreview,
  notAssessedLabel,
} from '../../utils/maragonPublication';
import {
  AwaitingPhoto,
  BandPill,
  BandRadar,
  CYAN,
  FONT,
  LABEL_CLASS,
  LINE,
  Mark,
  MUTED,
  NAVY,
  NovaricLogo,
  PAGE_BG,
  SURFACE,
  TINT,
  ProvisionalRibbon,
  RED,
  ReviewProvisionalRibbon,
  REVIEW_PROVISIONAL_LABEL,
  ConfirmationFlag,
  StatusBadge,
  factText,
  unverifiedLabel,
  formatNameSurname,
  getPresenterRecord,
  nameSurnameFromFull,
  visibleIndicatorBand,
  type DisplayMode,
  type Lang,
} from './maragonPresenterUi';
import type { MaragonPillar } from './maragonPresenterTypes';
import { ownerSuppliedMediaPortraitSrcSet, resolvePresentableMediaPhoto } from '../../utils/officialMediaPhoto';

/*
 * MARAGON® v1.0 — deeper profile page for a media personality (click-through from the cover card).
 * Route: ?page=vipProfilePage&id=vip_m1 (same flow as the political figures).
 * Public mode: facts with sources, status, "Pa vlerësim" for every point without an official band.
 * Indicative bands, findings and evidence appear only in the dev preview (?maragonPreview=1) or,
 * for bands, after the owner's written AM-09 approval of this profile — always with PROVIZOR.
 */

const L = {
  sq: {
    back: '← Kthehu', crumb: 'Personalitetet e medias', identity: 'Profili', show: 'Emisioni', channel: 'Kanali',
    slot: 'Orari (ora e Tiranës)', duration: 'Kohëzgjatja', onAir: 'Në eter që prej', history: 'Historiku', roles: 'Roli',
    contact: 'Kontakti zyrtar', bAccounts: 'Llogaritë zyrtare të transmetuesit', pAccounts: 'Llogaritë personale',
    noPersonal: 'Asnjë llogari personale e verifikuar (emri i njëjtë nuk është verifikim).', bio: 'Biografia',
    bioPending: 'Biografia e plotë është në shqyrtim dhe shfaqet pas miratimit.', draft: 'DRAFT · në shqyrtim',
    maragon: 'Vlerësimi MARAGON® v1.0', overall: 'Vlerësimi i përgjithshëm', dims: 'Dimensionet', indicators: 'Dhjetë treguesit',
    code: 'Kodi', indicator: 'Treguesi', official: 'Brezi zyrtar', indicative: 'Brezi indikativ', status: 'Statusi', evidence: 'Prova',
    findings: 'Gjetjet (draft i brendshëm)', path: 'Për brez zyrtar', open: 'Çështjet e hapura', sources: 'Burimet (hapur më 21.11.2026)',
    internal: 'PAMJE E BRENDSHME · vetëm në serverin e zhvillimit · jo për publikim',
    compositeNote: 'Nuk ka vlerësim të përgjithshëm derisa R, A, G dhe O të kenë pikë zyrtare (AM-02/AM-04). Vlerësimi provizor nuk shfaqet kurrë.',
    publicNote: 'Asnjë pikë nuk ka ende brez zyrtar. Çdo pikë pa vlerë të miratuar shfaqet «Pa vlerësim».',
    ror: 'E drejta e përgjigjes: nuk është ofruar ende', photoPending: 'Foto në pritje',
    methodologyNotes: 'Shënimet e metodologjisë', photoLicence: 'Regjistri i licencës së fotos', audit: 'Statusi / gjurma e auditimit',
    reviewBands: 'Brezat provizorë (vetëm pamja e brendshme)', reasonNotOfficial: 'Pse nuk është zyrtar',
    dimNames: { R: 'Gatishmëria', A: 'Aftësia', G: 'Qeverisja', O: 'Kujdesi mbikëqyrës' } as Record<MaragonPillar, string>,
    statusChip: { not_assessed: 'Pa vlerësim', insufficient_evidence: 'Prova të pamjaftueshme', not_applicable: 'Nuk aplikohet', assessed: 'Vlerësuar', 'assessed-qualitative': 'Cilësor' } as Record<string, string>,
    notFound: 'Profili MARAGON® nuk u gjet.', methodology: 'Metodologjia', disclaimer: 'Kjo faqe nuk publikon vlerësim. Draft për shqyrtim nga Dr Alban Gj. THIKA.',
  },
  en: {
    back: '← Back', crumb: 'Media personalities', identity: 'Profile', show: 'Show', channel: 'Channel',
    slot: 'Slot (Tirana time)', duration: 'Duration', onAir: 'On air since', history: 'History', roles: 'Role',
    contact: 'Official contact', bAccounts: 'Broadcaster’s official accounts', pAccounts: 'Personal accounts',
    noPersonal: 'No verified personal account (a matching name is not verification).', bio: 'Biography',
    bioPending: 'The full biography is under review and appears once approved.', draft: 'DRAFT · under review',
    maragon: 'MARAGON® v1.0 assessment', overall: 'Overall assessment', dims: 'Dimensions', indicators: 'The ten indicators',
    code: 'Code', indicator: 'Indicator', official: 'Official band', indicative: 'Indicative band', status: 'Status', evidence: 'Evidence',
    findings: 'Findings (internal draft)', path: 'For an official band', open: 'Open items', sources: 'Sources (opened 21.11.2026)',
    internal: 'INTERNAL VIEW · dev server only · not for publication',
    compositeNote: 'No overall assessment until R, A, G and O all have official scores (AM-02/AM-04). A provisional overall is never shown.',
    publicNote: 'No point has an official band yet. Every point without an approved value shows "Not assessed".',
    ror: 'Right of reply: not yet offered', photoPending: 'Photo pending',
    methodologyNotes: 'Methodology notes', photoLicence: 'Photo licence record', audit: 'Status / audit trail',
    reviewBands: 'Provisional bands (internal view only)', reasonNotOfficial: 'Why it is not official',
    dimNames: { R: 'Readiness', A: 'Aptitude', G: 'Governance', O: 'Oversight nurturing' } as Record<MaragonPillar, string>,
    statusChip: { not_assessed: 'Not assessed', insufficient_evidence: 'Insufficient evidence', not_applicable: 'Not applicable', assessed: 'Assessed', 'assessed-qualitative': 'Qualitative' } as Record<string, string>,
    notFound: 'MARAGON® profile not found.', methodology: 'Methodology', disclaimer: 'This page publishes no assessment. Draft for review by Dr Alban Gj. THIKA.',
  },
};

interface Props {
  profile: VipProfile;
  onBack: () => void;
  lang?: Lang;
}

const Card: React.FC<{ title: React.ReactNode; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
  <section id={id} className="rounded-lg border bg-white p-5 md:p-6" style={{ borderColor: LINE }}>
    <h2 className="text-[19px] font-bold mb-4 pb-2 border-b-2" style={{ color: NAVY, borderColor: CYAN }}>{title}</h2>
    {children}
  </section>
);

const Row: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 py-2 border-b text-[15px] leading-relaxed" style={{ borderColor: TINT }}>
    <span className={LABEL_CLASS} style={{ color: MUTED, paddingTop: 3 }}>{k}</span>
    <span style={{ color: NAVY }}>{children}</span>
  </div>
);

export const MaragonPresenterProfilePage: React.FC<Props> = ({ profile, onBack, lang: langProp }) => {
  let ctxLang: Lang | undefined;
  try { ctxLang = useLanguage().language as Lang; } catch { ctxLang = undefined; }
  const lang: Lang = langProp || ctxLang || 'sq';
  const t = L[lang];
  const rec = getPresenterRecord(profile);
  const mode: DisplayMode = maragonInternalPreview() ? 'internal' : 'public';
  const [imgFailed, setImgFailed] = useState(false);

  if (!rec) {
    return (
      <main className="min-h-screen p-10" style={{ backgroundColor: PAGE_BG, color: NAVY, fontFamily: FONT }}>
        <button onClick={onBack} className="mb-6 text-[15px] font-bold underline" style={{ color: NAVY }}>{t.back}</button>
        <h1 className="text-3xl font-bold">{nameSurnameFromFull(profile?.name || '')}</h1>
        <p className="mt-2 text-[15px]" style={{ color: MUTED }}>{t.notFound} {notAssessedLabel(lang)}.</p>
      </main>
    );
  }

  const m = rec.maragon;
  const name = formatNameSurname(rec.givenName, rec.familyName);
  const internal = mode === 'internal';
  const bands = m.indicators.map((ind) => ({ ind, v: visibleIndicatorBand(rec, ind, mode) }));
  const anyIndicative = bands.some((b) => b.v.band && b.v.indicative);
  const bioPublic = isMaragonBiographyPublic({ biographyStatus: rec.bio.status }, internal);
  const officialPhoto = resolvePresentableMediaPhoto(rec.photo, rec.id);
  const photoUrl = officialPhoto ? officialPhoto.url : null;
  const showPhoto = !!photoUrl && !imgFailed;
  const years = rec.show.onAirSinceYear != null
    ? Math.max(0, new Date(m.asOf).getFullYear() - rec.show.onAirSinceYear)
    : null;
  // vip_m1 keeps its public-source gate. Other personalities: cited official-source facts are listed.
  const publicSourceIds = new Set(['EV-001', 'EV-031', 'EV-002', 'EV-003', 'EV-005']);
  const sources = internal || rec.id !== 'vip_m1' ? rec.sources : rec.sources.filter((s) => publicSourceIds.has(s.id));
  const pillars: MaragonPillar[] = ['R', 'A', 'G', 'O'];

  return (
    <main className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: NAVY, fontFamily: FONT }}>
      <div className="w-full" style={{ backgroundColor: RED }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 text-white">
          <span className="flex-shrink-0"><NovaricLogo size={36} /></span>
          <span className="text-[16px] font-bold leading-tight"><Mark text="NOVARIC® Media House" /><span className="font-normal"> · <Mark text="MARAGON® v1.0" /></span></span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[15px]">
            <button onClick={onBack} className="font-bold underline decoration-2 underline-offset-4" style={{ color: NAVY, textDecorationColor: CYAN }}>{t.back}</button>
            <span style={{ color: MUTED }}>/</span>
            <span style={{ color: MUTED }}>{t.crumb}</span>
            <span style={{ color: MUTED }}>/</span>
            <span className="font-bold" style={{ color: NAVY }}>{name}</span>
          </div>
            <span className="flex items-center gap-2">
              <span className="relative inline-block h-8 w-8">
                <ProfileShareButton id={rec.id} name={name} />
              </span>
              <StatusBadge status={m.assessmentStatus} lang={lang} />
            </span>
        </nav>

        {internal && (
          <div className="border-2 border-dashed bg-white text-[13px] font-bold uppercase tracking-[0.04em] px-3 py-2 text-center" style={{ borderColor: RED, color: RED }}>
            {t.internal}
          </div>
        )}
        {internal && anyIndicative && <ReviewProvisionalRibbon lang={lang} />}
        {!internal && anyIndicative && <ProvisionalRibbon />}

        {/* Identity */}
        <section className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start rounded-lg border bg-white p-5 md:p-6" style={{ borderColor: LINE }}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-56 h-56 rounded-full p-[3px]" style={{ backgroundColor: CYAN }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {showPhoto ? (
                  <img src={photoUrl as string} srcSet={ownerSuppliedMediaPortraitSrcSet(photoUrl)} sizes="224px" alt={name} className="w-full h-full object-cover" style={{ objectPosition: officialPhoto?.objectPosition }} referrerPolicy="no-referrer" onError={() => setImgFailed(true)} />
                ) : (
                  <AwaitingPhoto label={t.photoPending} />
                )}
              </div>
            </div>
            <p className="text-[13px] text-center max-w-[240px] leading-snug" style={{ color: MUTED }}>
              {showPhoto ? (<>{officialPhoto?.credit}{rec.photo.officialSource?.pageUrl ? (<> · <a href={rec.photo.officialSource.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">{lang === 'en' ? 'source' : 'burimi'}</a></>) : null}</>) : (internal ? (lang === 'en' ? rec.photo.statusNote_en : rec.photo.statusNote_sq) : (lang === 'en' ? 'Photo pending.' : 'Foto në pritje.'))}
            </p>
            {internal && showPhoto && rec.photo.awaitingOwnerConfirmation && <ConfirmationFlag lang={lang} />}
          </div>
          <div>
            <p className={LABEL_CLASS} style={{ color: MUTED }}>{lang === 'en' ? 'Media personality · TV presenter' : 'Personalitet i medias · Drejtues televiziv'}</p>
            <h1 className="text-[34px] md:text-[44px] font-bold leading-tight mt-1" style={{ color: NAVY }}>{name}</h1>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {rec.roles.map((r) => (
                <span key={r.sq} className="text-[14px] px-2.5 py-0.5 rounded border" style={{ borderColor: LINE, color: NAVY }}>
                  {lang === 'en' ? r.en : r.sq} <span style={{ color: MUTED }}>/ {lang === 'en' ? r.sq : r.en}</span>
                </span>
              ))}
            </div>
            <p className="mt-4 text-[17px] leading-relaxed max-w-3xl" style={{ color: NAVY }}>{lang === 'en' ? rec.bio.short_en : rec.bio.short_sq}</p>
            {rec.activityStatus === 'inactive' && (
              <p className="mt-2 text-[14px] font-bold" style={{ color: RED }}>
                {lang === 'en' ? (rec.activityNote_en || 'Inactive / not currently in the documented on-air role.') : (rec.activityNote_sq || 'Jo aktiv / nuk është më në rolin e dokumentuar në eter.')}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-l-4 pl-3 py-1" style={{ borderColor: CYAN }}>
              <span className={LABEL_CLASS} style={{ color: MUTED }}><Mark text="MARAGON® v1.0" /> · {t.overall}</span>
              <BandPill v={{ band: null, confidence: null, indicative: false, notApplicable: false }} lang={lang} size="md" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title={t.identity}>
            <Row k={t.show}>
              {rec.show.name
                ? <>«{rec.show.name}»{rec.show.category ? <> · {rec.show.category}</> : null}{rec.show.tenure === 'former' ? <span style={{ color: MUTED }}> · {lang === 'en' ? 'former programme' : 'ish-emision'}</span> : null}</>
                : unverifiedLabel(lang)}
            </Row>
            <Row k={t.channel}>{factText(rec.show.channel, lang)}</Row>
            <Row k={t.slot}>{factText(lang === 'en' ? rec.show.slot_en : rec.show.slot_sq, lang)}</Row>
            <Row k={t.duration}>{factText(lang === 'en' ? rec.show.duration_en : rec.show.duration_sq, lang)}</Row>
            <Row k={t.onAir}>
              {rec.show.onAirSince
                ? <>{rec.show.onAirSince.split('-').reverse().join('.')}{years != null ? <> · {years} {lang === 'en' ? 'years' : 'vite'}</> : null}</>
                : rec.show.onAirSinceYear
                  ? <>{rec.show.onAirSinceYear}{years != null ? <> · {years} {lang === 'en' ? 'years' : 'vite'}</> : null}</>
                  : unverifiedLabel(lang)}
            </Row>
            <Row k={t.history}>{factText(lang === 'en' ? rec.show.history_en : rec.show.history_sq, lang)}</Row>
            <Row k={t.contact}>
              {rec.officialContact ? (
                <a href={`mailto:${rec.officialContact.value}`} className="underline decoration-2 underline-offset-2" style={{ color: NAVY, textDecorationColor: CYAN }} onClick={(e) => e.stopPropagation()}>
                  {rec.officialContact.value}
                </a>
              ) : unverifiedLabel(lang)}
              {rec.officialContact && <span style={{ color: MUTED }}> · {rec.officialContact.label}</span>}
            </Row>
            <Row k={t.bAccounts}>
              <span className="flex flex-wrap gap-2">
                {rec.broadcasterSocials.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2 text-[15px]" style={{ color: NAVY, textDecorationColor: CYAN }}>{s.label}</a>
                ))}
              </span>
            </Row>
            <Row k={t.pAccounts}>
              {rec.personalSocials.length ? rec.personalSocials.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2 mr-2" style={{ color: NAVY, textDecorationColor: CYAN }}>{s.label}</a>
              )) : <span style={{ color: MUTED }}>{t.noPersonal}</span>}
            </Row>
          </Card>

          <Card title={t.bio}>
            {bioPublic ? (
              <>
                {rec.bio.status !== 'approved' && (
                  <span className="inline-block mb-3 text-[12px] font-bold uppercase tracking-[0.04em] px-2 py-0.5 border rounded" style={{ borderColor: RED, color: RED }}>{t.draft}</span>
                )}
                <p className="text-[16px] leading-relaxed" style={{ color: NAVY }}>{rec.bio.sq}</p>
                <p className="text-[15px] leading-relaxed mt-3" style={{ color: MUTED }}>{rec.bio.en}</p>
              </>
            ) : (
              <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>{t.bioPending}</p>
            )}
          </Card>
        </div>

        <Card id="maragon" title={<Mark text={t.maragon} />}>
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
            <div className="w-full max-w-[280px] aspect-square mx-auto"><BandRadar rec={rec} mode={mode} lang={lang} /></div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={LABEL_CLASS} style={{ color: MUTED }}>{t.overall}</span>
                <BandPill v={{ band: null, confidence: null, indicative: false, notApplicable: false }} lang={lang} size="md" />
              </div>
              <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>{t.compositeNote}</p>
              <div>
                <span className={LABEL_CLASS} style={{ color: MUTED }}>{t.dims}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  {pillars.map((p) => (
                    <div key={p} className="rounded border-t-4 border px-3 py-2" style={{ borderColor: LINE, borderTopColor: CYAN, backgroundColor: SURFACE }}>
                      <div className="text-[14px] font-bold" style={{ color: NAVY }}>{p} · {t.dimNames[p]}</div>
                      <div className="text-[14px]" style={{ color: MUTED }}>{notAssessedLabel(lang)}</div>
                    </div>
                  ))}
                </div>
              </div>
              {!internal && !anyIndicative && <p className="text-[15px] leading-relaxed" style={{ color: NAVY }}>{t.publicNote}</p>}
              <p className="text-[14px] leading-relaxed" style={{ color: MUTED }}>{internal ? (lang === 'en' ? m.statusNote_en : m.statusNote_sq) : (lang === 'en' ? 'Under editorial review. No point has an official band; overall: Not assessed.' : 'Në shqyrtim editorial. Asnjë pikë nuk ka brez zyrtar; vlerësimi i përgjithshëm: Pa vlerësim.')} · {t.ror}</p>
            </div>
          </div>

          <h3 className="mt-8 mb-2 text-[17px] font-bold" style={{ color: NAVY }}>{t.indicators}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr className="text-left text-[12px] uppercase tracking-[0.04em]" style={{ color: MUTED, backgroundColor: TINT }}>
                  <th className="py-2 px-2 font-bold">{t.code}</th>
                  <th className="py-2 px-2 font-bold">{t.indicator}</th>
                  <th className="py-2 px-2 font-bold">{t.official}</th>
                  {(internal || anyIndicative) && <th className="py-2 px-2 font-bold">{t.indicative}{internal ? <span className="block font-bold normal-case tracking-normal" style={{ color: RED }}>{REVIEW_PROVISIONAL_LABEL[lang]}</span> : null}</th>}
                  <th className="py-2 px-2 font-bold">{t.status}</th>
                  {internal && <th className="py-2 px-2 font-bold">{t.evidence}</th>}
                </tr>
              </thead>
              <tbody>
                {bands.map(({ ind, v }) => (
                  <React.Fragment key={ind.id}>
                    <tr className="border-t align-top" style={{ borderColor: LINE }}>
                      <td className="py-2.5 px-2 font-bold whitespace-nowrap" style={{ color: NAVY }}>{ind.code}</td>
                      <td className="py-2.5 px-2">
                        <div style={{ color: NAVY }}>{lang === 'en' ? ind.title_en : ind.title_sq}</div>
                        <div className="text-[13px]" style={{ color: MUTED }}>{lang === 'en' ? ind.title_sq : ind.title_en}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <BandPill v={v.indicative ? { band: null, confidence: null, indicative: false, notApplicable: v.notApplicable } : v} lang={lang} />
                      </td>
                      {(internal || anyIndicative) && (
                        <td className="py-2.5 px-2">
                          {v.indicative ? <BandPill v={v} lang={lang} /> : <span style={{ color: MUTED }}>—</span>}
                        </td>
                      )}
                      <td className="py-2.5 px-2" style={{ color: NAVY }}>
                        {internal ? (t.statusChip[ind.status] || ind.status) : notAssessedLabel(lang)}
                        {internal && ind.confidence !== 'none' && (
                          <span style={{ color: MUTED }}> · {MARAGON_CONFIDENCE_LABELS[ind.confidence][lang]}</span>
                        )}
                      </td>
                      {internal && <td className="py-2.5 px-2" style={{ color: NAVY }}>{ind.evidenceCount}</td>}
                    </tr>
                    {internal && (
                      <tr>
                        <td />
                        <td colSpan={5} className="pb-3 px-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                          <span className="font-bold" style={{ color: NAVY }}>{t.findings}: </span>{lang === 'en' ? ind.finding_en : ind.finding_sq}
                          <br />
                          <span className="font-bold" style={{ color: NAVY }}>{t.reasonNotOfficial}: </span>{lang === 'en' ? ind.provisional.notOfficialReason_en : ind.provisional.notOfficialReason_sq}
                          <br />
                          <span className="font-bold" style={{ color: NAVY }}>{t.path}: </span>{lang === 'en' ? ind.pathToOfficial_en : ind.pathToOfficial_sq}
                          {ind.flags.length > 0 && <span> · flags: {ind.flags.join(', ')}</span>}
                          {ind.provisional.evidenceIds.length > 0 && <span> · {ind.provisional.evidenceIds.join(', ')}</span>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {anyIndicative && (
            <p className="mt-3 text-[14px]" style={{ color: MUTED }}>* {lang === 'en' ? 'Indicative band, low confidence: not an official score (§6.5, AM-09). Public display needs written approval of this profile.' : 'Brez indikativ, besueshmëri e ulët: nuk është pikë zyrtare (§6.5, AM-09). Shfaqja publike kërkon miratim me shkrim të këtij profili.'}</p>
          )}
          {internal && (
            <p className="mt-2 text-[13px] font-bold" style={{ color: RED }}>{t.reviewBands}: {REVIEW_PROVISIONAL_LABEL.sq} / {REVIEW_PROVISIONAL_LABEL.en}</p>
          )}
          {internal && (
            <div className="mt-4">
              <h3 className="text-[17px] font-bold mb-1" style={{ color: NAVY }}>{t.open}</h3>
              <ul className="list-disc list-inside text-[15px] leading-relaxed" style={{ color: NAVY }}>
                {(lang === 'en' ? m.openItems_en : m.openItems_sq).map((x) => <li key={x}>{x}</li>)}
              </ul>
              <p className="mt-2 text-[14px]" style={{ color: MUTED }}>{lang === 'en' ? m.approvalAct_en : m.approvalAct_sq}</p>
            </div>
          )}
        </Card>

        <Card title={t.sources}>
          <ol className="list-decimal list-inside text-[15px] leading-relaxed space-y-1.5" style={{ color: NAVY }}>
            {sources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2" style={{ color: NAVY, textDecorationColor: CYAN }}>{s.label}</a>
                <span style={{ color: MUTED }}> · {s.publisher} · {s.accessed.split('-').reverse().join('.')} · {s.usedFor}</span>
              </li>
            ))}
          </ol>
        </Card>


        {rec.documents && (
          <>
        <Card title={t.methodologyNotes}>
          {(() => {
            const n = rec.documents.methodologyNotes;
            return (
              <div className="text-[15px] leading-relaxed space-y-2" style={{ color: NAVY }}>
                <p><span className="font-bold">{n.methodologyId}</span>{' · '}{lang === 'en' ? 'signed' : 'nënshkruar'} {n.signedAt} · {n.signedBy}</p>
                <p>{lang === 'en' ? n.focus_en : n.focus_sq}</p>
                <p>{lang === 'en' ? n.sampleRule_en : n.sampleRule_sq}</p>
                <p>{lang === 'en' ? n.nullableScoring_en : n.nullableScoring_sq}</p>
                <p>{lang === 'en' ? n.bandsOnly_en : n.bandsOnly_sq}</p>
                <p>{lang === 'en' ? n.rightOfReply_en : n.rightOfReply_sq}</p>
              </div>
            );
          })()}
        </Card>

        <Card title={t.photoLicence}>
          {(() => {
            const l = rec.documents.photoLicence;
            return (
              <div className="text-[15px] leading-relaxed space-y-2" style={{ color: NAVY }}>
                <p><span className="font-bold">{l.credit}</span></p>
                <p>
                  {l.linkedByUrl
                    ? (lang === 'en' ? 'Source page: ' : 'Faqja burimore: ')
                    : (lang === 'en' ? 'File: ' : 'Skedari: ')}
                  <a href={l.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2" style={{ color: NAVY, textDecorationColor: CYAN }}>{l.sourcePageUrl}</a>
                </p>
                {l.imageUrl ? (
                  <p>
                    {l.linkedByUrl
                      ? (lang === 'en' ? 'Image (linked, not copied): ' : 'Imazhi (i lidhur, jo i kopjuar): ')
                      : (lang === 'en' ? 'Image (local file): ' : 'Imazhi (skedar lokal): ')}
                    <a href={l.imageUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-2 underline-offset-2" style={{ color: NAVY, textDecorationColor: CYAN }}>{l.imageUrl}</a>
                  </p>
                ) : (
                  <p style={{ color: MUTED }}>{lang === 'en' ? 'No official photo is on file — silhouette shown.' : 'Nuk ka foto zyrtare në dosje — shfaqet silueta.'}</p>
                )}
                <p>{lang === 'en' ? l.precedent_en : l.precedent_sq}</p>
                <p className="font-bold">{lang === 'en' ? l.status_en : l.status_sq}</p>
                {l.status === 'pending_owner_confirmation' && <p style={{ color: MUTED }}>{lang === 'en' ? 'The photograph is not shown. The silhouette stays until the owner confirms the frame.' : 'Fotografia nuk shfaqet. Silueta mbetet derisa pronari të konfirmojë kornizën.'}</p>}
                <p style={{ color: MUTED }}>{lang === 'en' ? 'No written reuse licence is on file.' : 'Nuk ka licencë të shkruar ripërdorimi në dosje.'}</p>
              </div>
            );
          })()}
        </Card>

        <Card title={t.audit}>
          <ol className="list-decimal list-inside text-[15px] leading-relaxed space-y-1.5" style={{ color: NAVY }}>
            {rec.documents.auditTrail.map((e, i) => (
              <li key={`${e.at}-${i}`}>
                <span className="font-bold">{e.at}</span>
                <span style={{ color: MUTED }}> · {lang === 'en' ? e.act_en : e.act_sq}</span>
              </li>
            ))}
          </ol>
        </Card>
          </>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-2 text-[13px] border-t pt-4" style={{ color: MUTED, borderColor: LINE }}>
          <span className="font-bold"><Mark text="NOVARIC® Media House · MARAGON® v1.0" /> · {t.methodology}: {m.methodology}</span>
          <span>{t.disclaimer}</span>
        </footer>
      </div>
    </main>
  );
};

export default MaragonPresenterProfilePage;
