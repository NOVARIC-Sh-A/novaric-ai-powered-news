/**
 * Written approvals recorded 27 Nov 2026. These records do not flip
 * methodologyApproved, authorizedForPublicDisplay, or assessment status.
 * They authorise showing draft MARAGON® values (with the DRAFT label)
 * and, separately, verified personal social accounts.
 */

export interface Am09DraftApproval {
  id: string;
  signer: 'Dr Alban Gj. THIKA';
  date: '2026-11-27';
  profileIds: readonly string[];
  names: readonly string[];
  scope: string;
  note?: string;
}

export const AM09_DUMA: Am09DraftApproval = {
  id: 'AM-09-GRIDA-DUMA-20261127',
  signer: 'Dr Alban Gj. THIKA',
  date: '2026-11-27',
  profileIds: ['vip_m2'],
  names: ['Grida DUMA'],
  scope: 'Draft MARAGON® values for Grida DUMA, shown with the DRAFT label. The bands-only toggle still applies.',
};

export const AM09_BALLA: Am09DraftApproval = {
  id: 'AM-09-SOKOL-BALLA-20261127',
  signer: 'Dr Alban Gj. THIKA',
  date: '2026-11-27',
  profileIds: ['vip_m9'],
  names: ['Sokol BALLA'],
  scope: 'Draft MARAGON® values for Sokol BALLA, shown with the DRAFT label. The bands-only toggle still applies.',
};

export const AM09_FEVZIU: Am09DraftApproval = {
  id: 'AM-09-BLENDI-FEVZIU-20261127',
  signer: 'Dr Alban Gj. THIKA',
  date: '2026-11-27',
  profileIds: ['vip_m1'],
  names: ['Blendi FEVZIU'],
  scope: 'Draft MARAGON® values for Blendi FEVZIU, shown with the DRAFT label. The bands-only toggle still applies.',
};

export const AM09_VASILI: Am09DraftApproval = {
  id: 'AM-09-ENI-VASILI-20261127',
  signer: 'Dr Alban Gj. THIKA',
  date: '2026-11-27',
  profileIds: ['vip_m10'],
  names: ['Eni VASILI'],
  scope: 'Draft MARAGON® values for Eni VASILI, shown with the DRAFT label. The bands-only toggle still applies.',
};

/** One record for the other 20. Their v0.2 values are not in the file yet, so v0.1 leaves them Pa vlerësim. */
export const AM09_COHORT_20: Am09DraftApproval = {
  id: 'AM-09-COHORT-20-20261127',
  signer: 'Dr Alban Gj. THIKA',
  date: '2026-11-27',
  profileIds: [
    'vip_m16', 'vip_m15', 'vip_m14', 'vip_m21', 'vip_m22', 'vip_m26', 'vip_m20',
    'vip_m5', 'vip_m27', 'vip_m12', 'vip_m18', 'vip_m17', 'vip_m23', 'vip_m11',
    'vip_m24', 'vip_m32', 'vip_m19', 'vip_m28', 'vip_m25', 'vip_m13',
  ],
  names: [
    'Adi KRASTA', 'Arbana OSMANI', 'Arian ÇANI', 'Armina MEVLANI', 'Bledi MANE',
    'Dalina BUZI', 'Enkel DEMI', 'Ardit GJEBREA', 'Ledion LIÇO', 'Ermal MAMAQI',
    'Marin MEMA', 'Sonila MEÇO', 'Mustafa NANO', 'Inva MULA', 'Ermal PEÇI',
    'Ylli RAKIPI', 'Blendi SALAJ', 'Dritan SHAKOHOXHA', 'Ilva TARE', 'Alketa VEJSIU',
  ],
  scope: 'Draft MARAGON® values for these 20 profiles from scoring run v0.2, shown with the DRAFT label. The bands-only toggle still applies. Until v0.2 is supplied, v0.1 leaves every indicator Pa vlerësim.',
  note: 'values reviewed by owner in this PR before merge',
};

export const AM09_DRAFT_APPROVALS: readonly Am09DraftApproval[] = [
  AM09_DUMA,
  AM09_BALLA,
  AM09_FEVZIU,
  AM09_VASILI,
  AM09_COHORT_20,
];

const APPROVED_IDS = new Set(AM09_DRAFT_APPROVALS.flatMap((record) => record.profileIds));

export function isDraftDisplayApproved(profileId: string): boolean {
  return APPROVED_IDS.has(profileId);
}

export interface SocialAccountsEditorialApproval {
  id: string;
  signer: 'Dr Alban Gj. THIKA';
  role: string;
  date: '2026-11-27';
  excludedProfileIds: readonly string[];
  scope: string;
}

export const SOCIAL_ACCOUNTS_EDITORIAL_APPROVAL: SocialAccountsEditorialApproval = {
  id: 'ED-SOC-MARAGON-23-20261127',
  signer: 'Dr Alban Gj. THIKA',
  role: 'editor and final authority',
  date: '2026-11-27',
  excludedProfileIds: ['vip_m2'],
  scope: 'Personal social accounts on the 23 MARAGON® profile cards other than Grida DUMA, where the account meets the verification standard (official broadcaster page, the profile’s own sources, a credible outlet link, or a platform badge whose bio names their show). An UNCERTAIN account is shown only when Dr Alban Gj. THIKA confirms that account (ownerConfirmed). Grida DUMA is outside this record.',
};
