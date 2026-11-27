import React from 'react';
import type { VipProfile } from '../../types';
import { nameSurnameFromFull, FONT, NAVY, RED, SURFACE, LINE, MUTED, Mark, getPresenterRecord } from './maragonPresenterUi';
import { MediaPortrait } from './MediaPortrait';
import { ownerSuppliedMediaPortraitSrcSet, resolvePresentableMediaPhoto } from '../../utils/officialMediaPhoto';
import { SevenPointPilotCard } from './SevenPointPilotCard';

/**
 * Side-by-side MARAGON® comparison. Order is the order the caller passes
 * (selection order). Nothing is sorted by a score.
 */
export const MaragonCompareModal: React.FC<{
  profiles: VipProfile[];
  onClose: () => void;
  lang?: 'sq' | 'en';
}> = ({ profiles, onClose, lang = 'sq' }) => {
  if (profiles.length < 2) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="maragon-compare-title">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl" style={{ fontFamily: FONT }} onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: LINE }}>
          <div>
            <h2 id="maragon-compare-title" className="text-[18px] font-bold" style={{ color: NAVY }}>
              <Mark text="Krahasim MARAGON®" />
            </h2>
            <p className="text-[13px]" style={{ color: MUTED }}>
              Në rendin e zgjedhur. Pa renditje sipas pikëve. / In the order selected. Not ordered by score.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-[14px] font-bold text-white" style={{ backgroundColor: NAVY }} aria-label="Mbyll">
            Mbyll
          </button>
        </header>
        <div className="overflow-y-auto p-5">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${profiles.length}, minmax(0, 1fr))` }}>
            {profiles.map((profile) => {
              const rec = getPresenterRecord(profile);
              const name = nameSurnameFromFull(profile.name);
              const photo = resolvePresentableMediaPhoto(rec ? rec.photo : { imageUrl: profile.imageUrl }, String(profile.id));
              return (
                <section key={String(profile.id)} className="rounded-lg border p-3" style={{ borderColor: LINE, backgroundColor: SURFACE }} data-compare-profile={profile.id}>
                  <div className="mx-auto mb-2 w-28">
                    <MediaPortrait src={photo?.url} srcSet={photo?.url ? ownerSuppliedMediaPortraitSrcSet(photo.url) : undefined} alt={name} portraitCutout={profile.portraitCutout === true} objectPosition={photo?.objectPosition} />
                  </div>
                  <h3 className="text-center text-[18px] font-bold" style={{ color: NAVY }}>{name}</h3>
                  <p className="mb-2 text-center text-[12px]" style={{ color: MUTED }}>
                    {lang === 'en' ? 'Overall: Not assessed' : 'Vlerësimi i përgjithshëm: Pa vlerësim'}
                  </p>
                  <SevenPointPilotCard profileId={String(profile.id)} compact />
                </section>
              );
            })}
          </div>
          <p className="mt-4 text-[12px]" style={{ color: RED }}>
            Krahasimi nuk rendit askënd. Një qelizë pa vlerë mbetet «Pa vlerësim / Not assessed», jo zero.
          </p>
        </div>
      </div>
    </div>
  );
};
