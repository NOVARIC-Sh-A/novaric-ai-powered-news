import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canonicalProfileShareUrl } from '../../utils/profileShare';
import { formatPersonName } from '../../utils/formatPersonName';

const SHARE_LABEL = 'Shpërndaj profilin';

function shareTargets(url: string, name: string): Array<{ id: string; label: string; href: string }> {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(name);
  return [
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { id: 'x', label: 'X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}` },
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encoded}` },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${encoded}&text=${text}` },
  ];
}

function stopCardNavigation(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function ProfileShareButton({ id, name }: { id: string | number; name: string }) {
  const url = canonicalProfileShareUrl(id);
  const displayName = formatPersonName(name) || name;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState<{ top: number; left: number } | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const onShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ title: displayName, text: displayName, url });
        setMenu(null);
        return;
      } catch (error) {
        if ((error as { name?: string })?.name === 'AbortError') return;
      }
    }
    setMenu((current) => {
      if (current) return null;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return null;
      return { top: rect.top, left: rect.right };
    });
  };

  const copyLink = async (event: React.MouseEvent<HTMLButtonElement>) => {
    stopCardNavigation(event);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setMenu(null);
    setToast(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        data-profile-share="true"
        aria-label={SHARE_LABEL}
        title={SHARE_LABEL}
        className="pointer-events-auto absolute bottom-2 right-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        onMouseDown={stopCardNavigation}
        onClick={onShare}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') stopCardNavigation(event);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="17" cy="7" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="17" cy="17" r="2.2" fill="currentColor" stroke="none" />
          <path d="M8 11.2 15 8.2M8 12.8l7 2.8" />
        </svg>
      </button>
      {menu && typeof document !== 'undefined' && createPortal(
        <div
          data-share-menu="true"
          className="fixed z-[80] w-44 -translate-x-full -translate-y-full rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg dark:border-slate-700 dark:bg-slate-900"
          style={{ top: menu.top - 4, left: menu.left }}
          onMouseDown={stopCardNavigation}
          onClick={stopCardNavigation}
        >
          {shareTargets(url, displayName).map((target) => (
            <a
              key={target.id}
              data-share-target={target.id}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={stopCardNavigation}
            >
              {target.label}
            </a>
          ))}
          <button
            type="button"
            data-share-target="copy"
            className="block w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={copyLink}
          >
            Kopjo lidhjen
          </button>
        </div>,
        document.body,
      )}
      {toast && typeof document !== 'undefined' && createPortal(
        <div
          role="status"
          data-share-toast="true"
          className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          Linku u kopjua
        </div>,
        document.body,
      )}
    </>
  );
}
