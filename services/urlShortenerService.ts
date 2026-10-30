const API_ENDPOINT = 'https://cleanuri.com/api/v1/shorten';

/**
 * Shortens a given URL using the cleanuri.com API.
 * @param longUrl The URL to shorten.
 * @returns A promise that resolves with the shortened URL string.
 * @throws An error with a user-friendly message on failure.
 */
export const shortenUrl = async (longUrl: string): Promise<string> => {
  if (!longUrl || !longUrl.trim()) {
    throw new Error("Ju lutemi, shkruani një URL për ta shkurtuar.");
  }

  // Basic URL validation
  try {
    new URL(longUrl);
  } catch (_) {
    throw new Error("URL-ja e dhënë është e pavlefshme. Sigurohuni që të përfshijë http:// ose https://");
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: longUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Kërkesa dështoi me statusin ${response.status}`);
    }

    if (!data.result_url) {
      throw new Error("Përgjigja nga serveri ishte e papritur.");
    }

    return data.result_url;
  } catch (error) {
    console.error("Gabim gjatë shkurtimit të URL-së:", error);
    if (error instanceof Error) {
      // Re-throw the specific error message
      throw error;
    }
    throw new Error("Ndodhi një gabim i panjohur gjatě komunikimit me shërbimin.");
  }
};