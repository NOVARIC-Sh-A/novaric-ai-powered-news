// services/apiConfig.ts
// ===============================================================
// NOVARIC® Frontend → API Configuration
// ===============================================================

const env = (import.meta as any)?.env ?? {};

export const API_BASE_URL =
  (env.VITE_API_BASE_URL as string | undefined)?.trim() || "";

export const API_PREFIX =
  (env.VITE_API_PREFIX as string | undefined)?.trim() || "/api/v1";

/**
 * Standard utility to construct a versioned API URL.
 * e.g. apiUrl("news") -> /api/v1/news (relative) or https://api.media.novaric.al/api/v1/news
 */
export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const prefix = API_PREFIX.replace(/^\/+|\/+$/g, "");
  const cleanPath = path.replace(/^\/+/, "");
  return base ? `${base}/${prefix}/${cleanPath}` : `/${prefix}/${cleanPath}`;
}

/**
 * Advanced helper to resolve API endpoints.
 * It detects if the provided 'path' is already fully qualified (starting with 'api/')
 * and prevents incorrect version prefixing.
 */
export function getApiEndpoint(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  const cleanPrefix = API_PREFIX.replace(/^\/+|\/+$/g, "");
  const base = API_BASE_URL.replace(/\/+$/, "");
  
  // Case 1: Path already starts with the specific versioned prefix (e.g. "api/v1/news")
  if (cleanPath.startsWith(cleanPrefix)) {
      return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
  }

  // Case 2: Path starts with 'api/' (e.g. "api/politicians/cards")
  // We join it directly to the base to hit the root-level API routes.
  if (cleanPath.startsWith('api/')) {
      return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
  }
  
  // Case 3: Standard relative path, use default versioned prefix logic
  return apiUrl(path);
}

/**
 * Compatibility helper for existing error handling logic.
 */
export function isApiConfigurationMissing(): boolean {
  return !(env.VITE_API_BASE_URL);
}

/**
 * Compatibility helper for existing error reporting.
 */
export function getApiMissingConfigurationMessage(): string {
  return env.VITE_API_BASE_URL ? "" : "Njoftim: VITE_API_BASE_URL nuk u gjet, duke përdorur serverin prodhimit.";
}
