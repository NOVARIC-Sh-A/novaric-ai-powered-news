export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Sends a chat message to Nora through the server-side Gemini proxy endpoint.
 */
export const sendChatMessage = async (history: ChatMessage[], message: string): Promise<string> => {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history,
        message,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data.text || '';
  } catch (error: any) {
    console.error("Chat Error:", error);
    throw new Error(error.message || "Më vjen keq, pati një problem me lidhjen me asistentin Nora.");
  }
};

/**
 * Streams a chat response from Nora using Server-Sent Events from the server-side endpoint.
 */
export const sendChatMessageStream = async (
  history: ChatMessage[],
  message: string,
  onChunk: (accumulatedText: string) => void
): Promise<string> => {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        history,
        message,
        stream: true,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP error ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error("No response stream available.");
    }

    const decoder = new TextDecoder();
    let accumulated = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const payload = trimmed.slice(6);
          if (payload === '[DONE]') break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              accumulated += parsed.text;
              onChunk(accumulated);
            }
          } catch (_) {}
        }
      }
    }

    return accumulated;
  } catch (error: any) {
    console.error("Chat Stream Error:", error);
    throw new Error(error.message || "Më vjen keq, pati një problem me lidhjen me asistentin Nora.");
  }
};
