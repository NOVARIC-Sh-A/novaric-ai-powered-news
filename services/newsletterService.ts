import { getApiEndpoint, isApiConfigurationMissing } from './apiConfig';

const SUBSCRIBE_ENDPOINT = getApiEndpoint('/subscribe');

/**
 * Submits an email to the newsletter subscription endpoint.
 * @param email The user's email address.
 * @returns A promise that resolves on success.
 * @throws An error with a user-friendly message on failure.
 */
export const subscribeToNewsletter = async (email: string): Promise<void> => {
  if (isApiConfigurationMissing()) {
      throw new Error("Shërbimi i abonimit nuk është i disponueshëm për shkak të një gabimi konfigurimi.");
  }
  try {
    const response = await fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Serveri u përgjigj me statusin ${response.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch(e) {
             if(errorText.length < 500 && errorText.length > 0) {
                errorMessage = errorText;
            }
        }
        throw new Error(errorMessage);
    }

    // No need to return anything on success, the function resolving is enough.
  } catch (error) {
    console.error('Gabim gjatë abonimit në buletin:', error);
    if (error instanceof Error) {
        throw error; // Re-throw the error with the custom message from the server or fetch failure
    }
    throw new Error('Ndodhi një gabim i panjohur gjatë abonimit.');
  }
};