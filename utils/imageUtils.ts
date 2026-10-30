/**
 * NOVARIC® Image Resilience & Domain Sanitization Utilities
 */

export const DEFAULT_NEWS_FALLBACK_IMAGE =
  'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg';

export const DEFAULT_PLACEHOLDER_IMAGE =
  'https://media.novaric.al/politicians/placeholder-pending.jpg';

/**
 * Sanitizes image URLs to prevent ERR_CERT_COMMON_NAME_INVALID and 403 Forbidden.
 * Rewrites broken legacy domain 'novaric.al/wp-content' and Photon wrappers 'i*.wp.com/novaric.al'
 * to the working WordPress domain 'https://novaric.co/wp-content/'.
 */
export function sanitizeImageUrl(url?: string | null, fallback = DEFAULT_NEWS_FALLBACK_IMAGE): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  let clean = url.trim();

  // Dead assets on old host that 404 or fail SSL
  if (clean.includes('c0e0554e-3fe8-11f0-90a6-0242ac110002')) {
    return fallback;
  }

  // Strip broken Jetpack Photon wrappers attempting to proxy broken novaric.al
  // e.g. https://i0.wp.com/novaric.al/wp-content/... -> https://novaric.co/wp-content/...
  clean = clean.replace(
    /^https?:\/\/i[0-9]\.wp\.com\/novaric\.al\/wp-content\//i,
    'https://novaric.co/wp-content/'
  );

  // Rewrite naked novaric.al/wp-content to valid novaric.co/wp-content
  clean = clean.replace(
    /^https?:\/\/novaric\.al\/wp-content\//i,
    'https://novaric.co/wp-content/'
  );

  return clean;
}

/**
 * Image error handler that replaces broken image sources with a resilient fallback.
 */
export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = DEFAULT_NEWS_FALLBACK_IMAGE
) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.onerror = null; // Prevent infinite loop if fallback also fails
    target.src = fallback;
  }
}
