// The canonical URL for the application, used for SEO and sharing.
export const CANONICAL_URL = "https://media.novaric.al/";

// The default image URL for SEO and sharing, typically the brand logo.
export const DEFAULT_SEO_IMAGE_URL = "https://novaricstorage.blob.core.windows.net/media/AdobeStock_1030253027.jpeg";

// Newsletter (Azure Blob)
export const NEWSLETTER_JSON_URL: string =
  (typeof process !== "undefined" && process.env?.REACT_APP_NEWSLETTER_JSON_URL) || ""; // SAS URL from env; never commit keys