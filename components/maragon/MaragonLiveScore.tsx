import React from 'react';
import { liveProfile } from '../../data/maragon/scoring/publicLiveScoring';
import { DRAFT_VALUE_LABEL, type PublicLiveIndicator } from '../../utils/maragonLiveScoring';
import { MUTED, NAVY } from './maragonPresenterUi';

export function liveIndicatorText(item: PublicLiveIndicator, lang: 'sq' | 'en'): string {
  if (!item.band) return lang === 'en' ? 'Not assessed' : 'Pa vlerësim';
  const band = lang === 'en' ? `${item.labelEn} / ${item.labelSq}` : `${item.labelSq} / ${item.labelEn}`;
  return typeof item.draftValue === 'number' ? `${item.draftValue} · ${band}` : band;
}

export const DraftValueLabel: React.FC = () => (
  <p data-draft-label="true" className="text-[12px] font-bold leading-snug" style={{ color: '#e4191e' }}>
    {DRAFT_VALUE_LABEL.sq}
    <span className="font-normal"> / {DRAFT_VALUE_LABEL.en}</span>
  </p>
);

/** Ten indicators from the live scoring file. Null stays “Pa vlerësim”, never zero. */
export const LiveIndicatorList: React.FC<{ profileId: string; lang?: 'sq' | 'en' }> = ({ profileId, lang = 'sq' }) => {
  const profile = liveProfile(profileId);
  if (!profile) return null;
  const anyDraft = profile.indicators.some((item) => item.band);
  return (
    <div className="flex flex-col gap-1" data-live-scoring={profileId}>
      {anyDraft ? <DraftValueLabel /> : null}
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[13px] leading-snug" style={{ color: NAVY }}>
        {profile.indicators.map((item) => (
          <li key={item.id}>
            <span className="font-bold">{item.code}</span>
            <span style={{ color: MUTED }}>{' · '}{item.band ? liveIndicatorText(item, lang) : 'Pa vlerësim / Not assessed'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
