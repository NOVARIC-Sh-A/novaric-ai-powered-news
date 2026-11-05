import React from 'react';

export const SHARE_CARD_DOWNLOAD_LABEL = 'Shkarko kartën';

export function shareCardDownload(slug: string | null | undefined): { href: string; filename: string } | null {
  const clean = String(slug ?? '').trim();
  if (!clean) return null;
  return {
    href: `/og/profiles/${clean}.png`,
    filename: `${clean}-novaric-card.png`,
  };
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 11 4 4 4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19h14" />
    </svg>
  );
}

function prefersNewTab(): boolean {
  if (typeof document === 'undefined') return true;
  const probe = document.createElement('a');
  if (!('download' in probe)) return true;
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

/** Saves the profile share card. Browsers that ignore the download attribute open the image instead. */
export function ShareCardDownload({ slug }: { slug?: string | null }) {
  const card = shareCardDownload(slug);
  if (!card) return null;

  const openInTab = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!prefersNewTab()) return;
    event.preventDefault();
    window.open(card.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={card.href}
      download={card.filename}
      data-share-card-download="true"
      aria-label={SHARE_CARD_DOWNLOAD_LABEL}
      title={SHARE_CARD_DOWNLOAD_LABEL}
      onClick={openInTab}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
    >
      <DownloadIcon />
      <span>Shkarko kartën</span>
    </a>
  );
}
