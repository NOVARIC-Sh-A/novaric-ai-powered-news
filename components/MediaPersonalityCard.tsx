import React, { useState } from 'react';
import { VipProfile } from '../types';
import { isMaragonAssessmentPublished, notAssessedLabel, type MaragonAssessmentStatus } from '../utils/maragonPublication';
import {
  AwaitingPhoto,
  BandPill,
  CYAN,
  FONT,
  LABEL_CLASS,
  LINE,
  Mark,
  MUTED,
  NAVY,
  NovaricLogo,
  ProvisionalRibbon,
  RED,
  StatusBadge,
  SURFACE,
  ConfirmationFlag,
  factText,
  unverifiedLabel,
  formatNameSurname,
  getPresenterRecord,
  nameSurnameFromFull,
  visibleIndicatorBand,
  type DisplayMode,
} from './maragon/maragonPresenterUi';
import { MediaPortrait } from './maragon/MediaPortrait';
import { SevenPointPilotCard } from './maragon/SevenPointPilotCard';
import { confirmedSocialUrls } from '../utils/maragonSocialAccounts';
import { ProfileSocialLogos } from './figurat-politike/ProfileSocialLogos';
import { maragonInternalPreview } from '../utils/maragonPublication';
import { ownerSuppliedMediaPortraitSrcSet, resolvePresentableMediaPhoto, type OfficialMediaPhotoSource } from '../utils/officialMediaPhoto';
import { mediaProfilePath } from '../utils/mediaNavigation';
import { ProfileShareButton } from './figurat-politike/ProfileShareButton';

/*
 * MARAGON® media personality card — COVER.
 * Shows preliminary identity details only. Clicking the cover opens the deeper profile page
 * (?page=vipProfilePage&id=…), the same flow as the political figures.
 * Gated: no mock genome, no SCORE 0, no "Compromised", no zodiac/age, no PARAGON® score.
 * Unknown = "Pa vlerësim". Indicative bands only under AM-09 (PROVIZOR) or in the dev preview.
 */

interface MediaPersonalityCardProps {
  profile: VipProfile;
  onNavigate: (profile: VipProfile) => void;
  onCompareToggle: (id: string | number) => void;
  onNavigateToAnalysis?: (id: string | number) => void;
  isSelectedForCompare: boolean;
  isCompareDisabled: boolean;
  lang?: 'sq' | 'en';
}

const T = {
  sq: {
    show: 'Emisioni', channel: 'Kanali', slot: 'Orari (Tiranë)', onAir: 'Në eter që prej', years: 'vite',
    overall: 'Vlerësimi i përgjithshëm', compare: 'KRAHASO', analysis: 'ANALIZA', dossier: 'DOSJA E PLOTË',
    compareLocked: 'Krahasimi hapet pas miratimit të vlerësimit', photoPending: 'Foto në pritje', open: 'Hap profilin e plotë',
    asOf: 'Gjendja më', notDocumented: 'Pa të dhëna',
  },
  en: {
    show: 'Show', channel: 'Channel', slot: 'Slot (Tirana)', onAir: 'On air since', years: 'years',
    overall: 'Overall assessment', compare: 'COMPARE', analysis: 'ANALYSIS', dossier: 'FULL DOSSIER',
    compareLocked: 'Comparison opens once the assessment is approved', photoPending: 'Photo pending', open: 'Open the full profile',
    asOf: 'As of', notDocumented: 'Not documented',
  },
};

export const MediaPersonalityCard: React.FC<MediaPersonalityCardProps> = ({
  profile,
  onNavigate,
  onCompareToggle,
  isSelectedForCompare,
  isCompareDisabled,
  lang = 'sq',
}) => {
  const t = T[lang];
  const rec = getPresenterRecord(profile);
  const mode: DisplayMode = maragonInternalPreview() ? 'internal' : 'public';
  const [imgFailed, setImgFailed] = useState(false);

  const status: MaragonAssessmentStatus =
    ((profile as { maragonAssessmentStatus?: MaragonAssessmentStatus }).maragonAssessmentStatus) ||
    (rec?.maragon.assessmentStatus as MaragonAssessmentStatus) ||
    'not_assessed';
  const published = isMaragonAssessmentPublished({ ...(profile as any), maragonAssessmentStatus: status });

  const displayName = rec ? formatNameSurname(rec.givenName, rec.familyName) : nameSurnameFromFull(profile.name);
  // Official-channel photos, or one of the 24 owner-supplied local portraits. Anything else shows the silhouette.
  const officialPhoto = resolvePresentableMediaPhoto(
    rec ? rec.photo : {
      imageUrl: profile.imageUrl,
      photoPending: (profile as { photoPending?: boolean }).photoPending,
      officialSource: (profile.officialPhoto ?? null) as Partial<OfficialMediaPhotoSource> | null,
      awaitingOwnerConfirmation: (profile as { awaitingOwnerConfirmation?: boolean | null }).awaitingOwnerConfirmation,
    },
    String(profile.id),
  );
  const photoUrl = officialPhoto ? officialPhoto.url : null;
  const showPhoto = !!photoUrl && !imgFailed;
  const photoCredit = showPhoto && officialPhoto ? officialPhoto.credit : '';

  const bands = rec ? rec.maragon.indicators.map((ind) => visibleIndicatorBand(rec, ind, mode)) : [];
  const anyIndicative = bands.some((b) => b.band && b.indicative);
  const yearsOnAir = rec && rec.show.onAirSinceYear != null
    ? Math.max(0, new Date(rec.maragon.asOf).getFullYear() - rec.show.onAirSinceYear)
    : null;

  const open = () => onNavigate(profile);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  };

  const Fact: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
    <div className="flex flex-col">
      <dt className={LABEL_CLASS} style={{ color: MUTED }}>{k}</dt>
      <dd className="text-[15px] leading-snug" style={{ color: NAVY }}>{children}</dd>
    </div>
  );

  const href = mediaProfilePath(profile.id);
  return (
    <a
      href={href || undefined}
      aria-label={`${displayName} — ${t.open}`}
      onClick={(event) => {
        if (!href) return;
        event.preventDefault();
        open();
      }}
      onKeyDown={onKey}
      className="group relative w-full cursor-pointer select-none rounded-lg overflow-hidden border flex flex-col no-underline transition-colors duration-150 hover:border-[#30384B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37bdee] focus-visible:ring-offset-2"
      style={{ backgroundColor: SURFACE, borderColor: LINE, color: NAVY, fontFamily: FONT }}
    >
      <ProfileShareButton id={profile.id} name={displayName} />
      <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: RED }} />

      <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-3" style={{ backgroundColor: NAVY }}>
        <div className="flex items-center gap-2">
          <NovaricLogo size={30} />
          <span className="text-[13px] font-bold leading-tight whitespace-nowrap text-white">
            <Mark text="NOVARIC® Media House" />
            <span className="block font-normal" style={{ color: CYAN }}><Mark text="MARAGON® v1.0" /></span>
          </span>
        </div>
        <StatusBadge status={status} lang={lang} dark />
      </header>
      {anyIndicative && <div className="px-4 pt-3"><ProvisionalRibbon /></div>}

      <div className="flex gap-4 px-4 pt-4">
        <div className="w-[140px] flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[148px]">
            <MediaPortrait
              src={showPhoto ? photoUrl : null}
              srcSet={showPhoto && photoUrl ? ownerSuppliedMediaPortraitSrcSet(photoUrl) : undefined}
              alt={displayName}
              portraitCutout={profile.portraitCutout === true}
              objectPosition={officialPhoto?.objectPosition || '50% 18%'}
              pendingLabel={t.photoPending}
            />
          </div>
          <p className="text-[12px] leading-tight text-center" style={{ color: MUTED }}>
            {showPhoto ? photoCredit : t.photoPending}
          </p>
          {mode === 'internal' && showPhoto && rec?.photo.awaitingOwnerConfirmation && <ConfirmationFlag lang={lang} />}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h3 className="text-[24px] font-bold leading-tight" style={{ color: NAVY }}>{displayName}</h3>
          {rec ? (
            <dl className="flex flex-col gap-2">
              <Fact k={t.show}>
                {rec.show.name
                  ? <><span className="font-bold">«{rec.show.name}»</span>{rec.show.channel ? <> · {rec.show.channel}</> : null}{rec.show.tenure === 'former' ? <span style={{ color: MUTED }}> · {lang === 'en' ? 'former' : 'ish-emision'}</span> : null}</>
                  : unverifiedLabel(lang)}
              </Fact>
              <Fact k={t.slot}>{factText(lang === 'en' ? rec.show.slot_en : rec.show.slot_sq, lang)}</Fact>
              <Fact k={t.onAir}>
                {rec.show.onAirSinceYear != null
                  ? <>{rec.show.onAirSinceYear}{yearsOnAir !== null ? ` · ${yearsOnAir} ${t.years}` : ''}</>
                  : unverifiedLabel(lang)}
              </Fact>
              {rec.activityStatus === 'inactive' && (
                <p className="text-[13px] font-bold" style={{ color: RED }}>
                  {lang === 'en' ? (rec.activityNote_en || 'Inactive') : (rec.activityNote_sq || 'Jo aktiv')}
                </p>
              )}
            </dl>
          ) : (
            <p className="text-[15px] leading-snug line-clamp-6" style={{ color: NAVY }}>{profile.shortBio || t.notDocumented}</p>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {rec && (
          <div className="flex flex-wrap gap-1.5">
            {rec.roles.slice(0, 2).map((r) => (
              <span key={r.sq} className="px-2 py-0.5 rounded border text-[13px]" style={{ borderColor: LINE, color: NAVY }}>
                {lang === 'en' ? r.en : r.sq}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 border-l-4 pl-3 py-1" style={{ borderColor: CYAN }}>
          {/* AM-02/AM-04: no composite until R, A, G and O are all officially scored. Never provisional. */}
          <span className={LABEL_CLASS} style={{ color: MUTED }}>{t.overall}</span>
          <BandPill v={{ band: null, confidence: null, indicative: false, notApplicable: false }} lang={lang} />
        </div>
        <div onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
          <ProfileSocialLogos name={displayName} mediaUrls={confirmedSocialUrls(String(profile.id))} />
          {Object.keys(confirmedSocialUrls(String(profile.id))).length === 0 && (
            <p className="mt-1 text-[12px] leading-snug" style={{ color: MUTED }}>
              {lang === 'en'
                ? 'No verified personal account (a matching name is not verification).'
                : 'Asnjë llogari personale e verifikuar (emri i njëjtë nuk është verifikim).'}
            </p>
          )}
        </div>
        <SevenPointPilotCard profileId={String(profile.id)} compact />
      </div>

      <footer className="mt-4 px-4 py-3 border-t flex flex-col gap-2" style={{ borderColor: LINE }}>
        <div className="flex justify-between items-center gap-2">
          <label
            className={`flex items-center gap-2 text-[13px] font-bold ${published ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ color: published ? NAVY : MUTED }}
            title={isCompareDisabled ? t.compareLocked : undefined}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              disabled={isCompareDisabled}
              onClick={(event) => event.stopPropagation()}
              onChange={() => onCompareToggle(profile.id)}
              className="w-4 h-4 accent-[#30384B]"
              aria-label={t.compare}
            />
            {t.compare}
          </label>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); open(); }}
            className="px-4 py-2 rounded text-[14px] font-bold text-white transition-colors hover:bg-[#e4191e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37bdee] focus-visible:ring-offset-2"
            style={{ backgroundColor: NAVY }}
          >
            {t.dossier} →
          </button>
        </div>
        <div className="flex items-center justify-between text-[12px]" style={{ color: MUTED }}>
          <span>ID {String(profile.id)}</span>
          <span>{rec ? `${t.asOf} ${rec.maragon.asOf.split('-').reverse().join('.')}` : 'media.novaric.al'}</span>
        </div>
      </footer>
    </a>
  );
};

export default MediaPersonalityCard;
