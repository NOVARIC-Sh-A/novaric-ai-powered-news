import { FactCheckResult } from '../types';
import { 
  resolveNewsItemImageToolDeclaration, 
  executeResolveNewsItemImage 
} from './imageResolverService';

export { 
  resolveNewsItemImageToolDeclaration, 
  executeResolveNewsItemImage 
};

/**
 * Fact-checks a given claim via the server-side Gemini endpoint with Search Grounding.
 */
export const performFactCheck = async (claim: string): Promise<FactCheckResult> => {
  if (!claim || !claim.trim()) {
    throw new Error("Pretendimi për verifikim nuk mund të jetë bosh.");
  }

  const response = await fetch('/api/gemini/fact-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ claim }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Fact-check request failed with status ${response.status}`);
  }

  return response.json();
};

/**
 * Translates texts to target language using the server-side Gemini proxy endpoint.
 */
export const translateTexts = async (
  texts: string[],
  targetLang: string = 'Albanian'
): Promise<string[]> => {
  if (!texts || texts.length === 0) return texts;

  try {
    const response = await fetch('/api/gemini/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texts, targetLang }),
    });

    if (!response.ok) {
      console.warn(`Translation request failed (${response.status}), returning original texts`);
      return texts;
    }

    const data = await response.json();
    return Array.isArray(data.translations) ? data.translations : texts;
  } catch (err) {
    console.warn("Translation failed due to network error, returning originals:", err);
    return texts;
  }
};

/**
 * Resolves a news article image with server-assisted verification.
 */
export const resolveArticleImageWithGemini = async (item: {
  id: string;
  title: string;
  feedUrl?: string;
  link?: string;
}) => {
  try {
    const response = await fetch('/api/gemini/resolve-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Server-side image resolution fallback to local:", err);
  }

  return executeResolveNewsItemImage({
    itemId: item.id,
    feedUrl: item.feedUrl,
    itemLink: item.link,
  });
};

/**
 * Real-time Live API client session helper connecting to the server-side Live API bridge.
 */
export interface LiveSessionController {
  sendAudioChunk: (pcm16Data: string) => void;
  sendTextMessage: (text: string) => void;
  close: () => void;
}

export const connectGeminiLiveSession = (callbacks: {
  onAudioChunk?: (base64Audio: string) => void;
  onInterrupted?: () => void;
  onError?: (err: string) => void;
  onClose?: () => void;
}): LiveSessionController => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/api/gemini/live`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.audio && callbacks.onAudioChunk) {
        callbacks.onAudioChunk(msg.audio);
      }
      if (msg.interrupted && callbacks.onInterrupted) {
        callbacks.onInterrupted();
      }
      if (msg.error && callbacks.onError) {
        callbacks.onError(msg.error);
      }
    } catch (e) {
      console.error("Live WebSocket parse error:", e);
    }
  };

  ws.onerror = (e) => {
    console.error("Live WebSocket connection error:", e);
    callbacks.onError?.("Lidhja Live me serverin dështoi.");
  };

  ws.onclose = () => {
    callbacks.onClose?.();
  };

  return {
    sendAudioChunk: (pcm16Data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ audio: pcm16Data }));
      }
    },
    sendTextMessage: (text: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ text }));
      }
    },
    close: () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    },
  };
};