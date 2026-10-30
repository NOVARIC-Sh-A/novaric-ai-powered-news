
import { getApiEndpoint } from './apiConfig';
import { FactCheckResult } from '../types';

// This function is not particularly useful as it always returns false,
// but it's kept to match the existing app structure.
// A proper implementation would check environment variables.
export function isFactCheckEngineMisconfigured(): boolean {
  return false;
}

/**
 * Calls the backend API to analyze an article's integrity, with a built-in retry mechanism.
 * @param articleText The text of the article to be analyzed.
 * @param onRetryAttempt Optional callback to inform the UI about a retry attempt.
 * @returns A promise that resolves with a FactCheckResult object.
 * @throws An error with a descriptive message on failure.
 */
export async function analyzeArticleIntegrity(articleText: string, onRetryAttempt?: (attempt: number, delaySeconds: number) => void): Promise<FactCheckResult> {
  const endpoint = getApiEndpoint('/fact-check-integrity');
  const MAX_RETRIES = 2; // Initial attempt + 2 retries = 3 total

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ articleText })
        });

        // Case 1: Service is warming up and returns HTML
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('application/json')) {
            const text = await res.text();
            if (text.includes("The service you requested is not available yet")) {
                throw new Error("SERVICE_UNAVAILABLE"); // Throw a specific error to trigger retry
            }
            // If it's another non-JSON error, it's a hard failure
            throw new Error(`Përgjigje jo-JSON nga serveri (${res.status}). Fragment: ${text.slice(0, 400)}...`);
        }
        
        // Case 2: Server error (5xx)
        if (res.status >= 500) {
            throw new Error(`SERVER_ERROR_${res.status}`); // Throw specific error for retry
        }

        const data = await res.json();

        // Case 3: Other client errors (4xx) or success (2xx)
        if (!res.ok) {
            throw new Error(data.message || data.error || `Kërkesa dështoi me status ${res.status}.`);
        }

        // Validate successful response
        if (!('verdict' in data) || !('summary' in data)) {
            throw new Error('Formati i JSON-it nuk përputhet me pritshmëritë e klientit.');
        }

        return data as FactCheckResult; // SUCCESS

    } catch (err) {
        if (attempt < MAX_RETRIES) {
            let delaySeconds = 5; // Default delay for generic errors
            let reason = 'Gabim rrjeti';

            if (err instanceof Error) {
                if (err.message === "SERVICE_UNAVAILABLE") {
                    delaySeconds = 30;
                    reason = 'Shërbimi po ngrohet';
                } else if (err.message.startsWith("SERVER_ERROR")) {
                    delaySeconds = 10;
                    reason = 'Gabim serveri';
                }
            }

            console.warn(`${reason}. Duke provuar përsëri pas ${delaySeconds} sekondash... (Përpjekja ${attempt + 1}/${MAX_RETRIES + 1})`);
            if (onRetryAttempt) onRetryAttempt(attempt + 1, delaySeconds);
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            continue; // Go to next attempt
        }
        
        // Last attempt failed, throw the final error to be caught by the UI
        throw err;
    }
  }

  // Fallback, should not be reached
  throw new Error("Analiza dështoi pas disa përpjekjesh.");
}
