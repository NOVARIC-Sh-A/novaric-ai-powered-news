import { DeconstructedArticle } from '../types';

/**
 * Indicates whether the hermeneutic service is misconfigured.
 * Since all Gemini operations are handled server-side with securely managed credentials,
 * the service is always available to clients.
 */
export const isHermeneuticServiceMisconfigured = (): boolean => {
  return false;
};

/**
 * Deconstructs an article text through the server-side Gemini hermeneutic endpoint.
 */
export async function deconstructArticle(articleText: string): Promise<DeconstructedArticle> {
  if (!articleText || !articleText.trim()) {
    throw new Error("Artikulli është bosh.");
  }

  try {
    const response = await fetch('/api/gemini/deconstruct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleText }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Kërkesa dështoi me status ${response.status}`);
    }

    const data: DeconstructedArticle = await response.json();
    if (!data.analyzedText || !Array.isArray(data.segments)) {
      throw new Error("Struktura e të dhënave të pranuara nga IA është e pavlefshme.");
    }

    return data;
  } catch (error: any) {
    console.error("Gabim gjatë analizës së artikullit:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ndodhi një gabim i panjohur gjatë analizës së artikullit.");
  }
}