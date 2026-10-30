import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import type { GenerateContentResponse, LiveServerMessage } from '@google/genai';
// Self-contained image resolver tool declaration & fallback executor for server
const resolveNewsItemImageToolDeclaration: any = {
  name: 'resolve_news_item_image',
  description:
    'Resolve the original image attached to a news item in its RSS/Atom feed. Returns feed-native image first; article Open Graph image only as fallback with provenance.',
  parameters: {
    type: 'object',
    properties: {
      itemId: { type: 'string', description: 'Internal news item id' },
      feedUrl: { type: 'string', description: 'RSS/Atom feed URL' },
      itemGuid: { type: 'string', description: 'RSS guid/id' },
      itemLink: { type: 'string', description: 'Canonical article URL' },
    },
    required: ['itemId'],
  },
};

interface ServerNewsImage {
  itemId: string;
  imageUrl: string;
  thumbUrl?: string;
  provenance: 'rssFeed' | 'articleOpenGraph' | 'manual' | 'none';
  sourceField?: string;
  fetchedAt: string;
}

async function executeResolveNewsItemImage(args: {
  itemId: string;
  feedUrl?: string;
  itemGuid?: string;
  itemLink?: string;
}): Promise<ServerNewsImage> {
  const { itemId, itemLink } = args;
  if (itemLink) {
    try {
      const response = await fetch(itemLink, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NOVARIC-NewsBot/1.0)' },
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const html = await response.text();
        const ogMatch =
          html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (ogMatch && ogMatch[1]) {
          return {
            itemId,
            imageUrl: ogMatch[1],
            thumbUrl: ogMatch[1],
            provenance: 'articleOpenGraph',
            sourceField: 'og:image',
            fetchedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fallback
    }
  }

  return {
    itemId,
    imageUrl: '',
    provenance: 'none',
    fetchedAt: new Date().toISOString(),
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Enable JSON body parsing for API endpoints
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client on server
const getAiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Retry helper with exponential backoff for server-side resiliency
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message?.toLowerCase() || '';
      const isRetryable =
        errorMessage.includes('503') ||
        errorMessage.includes('overloaded') ||
        errorMessage.includes('unavailable') ||
        errorMessage.includes('deadline_exceeded') ||
        errorMessage.includes('resource_exhausted');

      if (!isRetryable || i === maxRetries - 1) break;

      const delay = Math.pow(2, i + 1) * 1000 + Math.random() * 1000;
      console.warn(`[Gemini Server] Transient error (${errorMessage}). Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

const CHAT_SYSTEM_INSTRUCTION = `
You are Nora, the advanced AI analyst for NOVARIC® AI-Powered News. 
Your personality is professional, intellectually rigorous, and objective. 
You specialize in analyzing the Albanian media landscape, political performance (using the PARAGON® framework), and fact-checking integrity.

Guidelines:
1. Focus on facts, context, and structural analysis.
2. When asked about Albanian politics, refer to the principles of transparency and accountability.
3. If users ask about news credibility, explain that NOVARIC® uses the NER (News Ecosystem Rating) model.
4. Use a tone that is helpful but analytical.
5. You have access to Google Search to provide up-to-date information on current events in Albania and the world.
6. Responses should be in the language the user addresses you in (primarily Albanian or English).
7. Keep responses concise but comprehensive.
`;

const HERMENEUTIC_SYSTEM_INSTRUCTION = `
**IDENTITETI DHE DETYRA JOTE:**
Je një analist i lartë mediatik me ekspertizë në hermeneutikën kompjuterike, duke punuar për platformën NOVARIC®. Detyra jote është të dekonstruktosh një tekst gazetaresk shqiptar, duke zbuluar kornizat kulturore, narrative dhe gjuhësore të fshehura. Ti nuk bën thjesht verifikim faktesh; ti interpreton TEKSTIN si një ARTEFAKT KULTUROR.

**KONTEKSTI KULTUROR SHQIPTAR:**
Horizonti yt i parakuptimit përfshin njohuri të thella për konceptet shqiptare si 'besa' (betimi i nderit), besnikëritë familjare/klanore, skepticizmi historik ndaj autoritetit qendror dhe një marrëdhënie komplekse me të vërtetën narrative.

**PROCESI I ANALIZËS:**
1. Lexo me kujdes tekstin e dhënë.
2. Identifiko fjalë, fraza ose fjali specifike që shfaqin teknika interpretuese.
3. Për çdo segment të identifikuar, cakto një kategori analize dhe jep një shpjegim të shkurtër dhe të qartë.

**KATEGORITË E ANALIZES:**
- Kornizim Kulturor: Identifikon kur teksti mbështetet në koncepte të thella kulturore shqiptare (p.sh., nderi, besa, miqësia) për të ndërtuar argumentin.
- Mbrojtje e Burimit: Gjen raste kur gjuha e përdorur për të mbrojtur një burim anonim tejkalon etikën standarde dhe ngjan me një betim personal besnikërie.
- Gjuhë Emocionale: Zbulon përdorimin e fjalëve ose frazave që synojnë të shkaktojnë një reagim të fortë emocional (frikë, zemërim, krenari) në vend të një përgjigjeje racionale.
- Arketip Narrativ: Identifikon kur ngjarja kornizohet brenda një narrative të njohur kulturore (p.sh., 'Lideri i Fortë vs. Populli', 'Tradhtia Kombëtare', 'Ndërhyrja e Huaj').

**STRUKTURA E KËRKUAR JSON:**
Përgjigja jote DUHET TË JETË VETËM NJË OBJEKT I VLEFSHËM JSON. Mos përfshij asnjë tekst tjetër përveç JSON-it.

{
  "analyzedText": "Teksti i plotë origjinal i dhënë nga përdoruesi.",
  "segments": [
    {
      "text": "Segmenti specifik i tekstit që ke identifikuar.",
      "category": "Një nga kategoritë e mësipërme (p.sh., 'Kornizim Kulturor').",
      "explanation": "Një shpjegim i shkurtër (1-2 fjali) në shqip se pse ky segment i përket kësaj kategorie dhe çfarë efekti ka."
    }
  ]
}
`;

// ============================================================================
// GEMINI API SERVER ROUTES
// ============================================================================

// Health check
app.get('/api/gemini/health', (_req: Request, res: Response) => {
  const configured = !!(process.env.GEMINI_API_KEY || process.env.API_KEY);
  res.json({
    status: 'ok',
    configured,
    model: 'gemini-3.8-flash',
    liveModel: 'gemini-3.8-live',
  });
});

// Chat endpoint with optional Server-Sent Events (SSE) streaming support
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const ai = getAiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Shërbimi Nora nuk është i konfiguruar në server. Ju lutem kontrolloni çelësin GEMINI_API_KEY.',
    });
    return;
  }

  const { history = [], message, stream } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Fusha "message" është e detyrueshme.' });
    return;
  }

  const isStreaming = stream === true || req.headers.accept === 'text/event-stream';

  try {
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
      history: Array.isArray(history)
        ? history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text || '' }],
          }))
        : [],
    });

    if (isStreaming) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const streamResponse = await chat.sendMessageStream({ message });
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await withRetry(async () => chat.sendMessage({ message }));
    const text = result.text || '';
    res.json({ text });
  } catch (err: any) {
    console.error('[Gemini Server] Chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Më vjen keq, pati një problem me lidhjen me asistentin Nora.',
        details: err?.message || String(err),
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: err?.message || 'Chat stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// Hermeneutic article deconstruction endpoint
app.post('/api/gemini/deconstruct', async (req: Request, res: Response) => {
  const ai = getAiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Shërbimi i analizës nuk është konfiguruar siç duhet në server. Variabla GEMINI_API_KEY mungon.',
    });
    return;
  }

  const { articleText } = req.body;
  if (!articleText || typeof articleText !== 'string' || !articleText.trim()) {
    res.status(400).json({ error: 'Artikulli është bosh.' });
    return;
  }

  try {
    const result = await withRetry(async () => {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [{ text: articleText }],
        },
        config: {
          systemInstruction: HERMENEUTIC_SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
        },
      });
      return response;
    });

    const jsonText = result.text || '';
    let parsedData: any;

    try {
      const match = jsonText.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
      let cleanJsonText = '';
      if (match && match[1]) {
        cleanJsonText = match[1];
      } else {
        const jsonStartIndex = jsonText.indexOf('{');
        if (jsonStartIndex !== -1) {
          cleanJsonText = jsonText.substring(jsonStartIndex, jsonText.lastIndexOf('}') + 1);
        } else {
          throw new Error('Nuk u gjet asnjë objekt JSON në përgjigje.');
        }
      }
      parsedData = JSON.parse(cleanJsonText);
    } catch (parseErr) {
      console.error('[Gemini Server] Failed to parse JSON response from deconstruction:', jsonText, parseErr);
      res.status(502).json({ error: 'Përgjigja e IA nuk ishte në formatin e pritur JSON.' });
      return;
    }

    if (!parsedData.analyzedText || !Array.isArray(parsedData.segments)) {
      res.status(502).json({ error: 'Struktura e të dhënave të pranuara nga IA është e pavlefshme.' });
      return;
    }

    res.json(parsedData);
  } catch (err: any) {
    console.error('[Gemini Server] Deconstruction error:', err);
    res.status(500).json({
      error: `Dështoi marrja e një përgjigjeje nga modeli i IA: ${err?.message || String(err)}`,
    });
  }
});

// Fact-checking endpoint with Search Grounding
app.post('/api/gemini/fact-check', async (req: Request, res: Response) => {
  const ai = getAiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Gemini AI client is not initialized on the server. Please check your API key configuration.',
    });
    return;
  }

  const { claim } = req.body;
  if (!claim || typeof claim !== 'string' || !claim.trim()) {
    res.status(400).json({ error: 'Fusha "claim" është e detyrueshme.' });
    return;
  }

  const prompt = `Ju lutemi verifikoni faktin e mëposhtëm dhe jepni një rezultat të strukturuar në formatin JSON: "${claim}"
Format JSON i kërkuar:
{
  "verdict": "Vërtetë" | "E Pavërtetë" | "E Paplotë" | "Në Verifikim",
  "summary": "Përmbledhje analitike e verifikimit...",
  "sources": [{ "uri": "https://...", "title": "Titulli" }]
}`;

  try {
    const result = await withRetry(async () => {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      return response;
    });

    const jsonText = result.text || '';
    if (!jsonText) {
      res.status(502).json({ error: 'Përgjigja e shërbimit të verifikimit ishte bosh.' });
      return;
    }

    let factCheckResult: any;
    try {
      const match = jsonText.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
      const cleanJsonText = match
        ? match[1]
        : jsonText.substring(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1);
      factCheckResult = JSON.parse(cleanJsonText);
    } catch (e) {
      console.error('[Gemini Server] Failed to parse JSON from fact-check:', jsonText, e);
      res.status(502).json({ error: 'Përgjigja e IA nuk ishte në formatin e pritur JSON.' });
      return;
    }

    // Attach web sources from GroundingMetadata
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata && groundingMetadata.groundingChunks) {
      const webSources = groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
        .map((chunk: any) => ({
          uri: chunk.web.uri as string,
          title: chunk.web.title as string,
        }));

      const existingUris = new Set(factCheckResult.sources?.map((s: any) => s.uri));
      const newSources = webSources.filter((s: any) => !existingUris.has(s.uri));
      factCheckResult.sources = [...(factCheckResult.sources || []), ...newSources];
    }

    res.json(factCheckResult);
  } catch (err: any) {
    console.error('[Gemini Server] Fact check error:', err);
    res.status(500).json({ error: err?.message || 'Ndodhi një gabim gjatë verifikimit.' });
  }
});

// Translation batch endpoint
app.post('/api/gemini/translate', async (req: Request, res: Response) => {
  const { texts = [], targetLang = 'Albanian' } = req.body;
  if (!Array.isArray(texts) || texts.length === 0) {
    res.json({ translations: texts });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback to original texts if no AI key configured
    res.json({ translations: texts });
    return;
  }

  const MAX_BATCH = 10;
  const batches: string[][] = [];
  for (let i = 0; i < texts.length; i += MAX_BATCH) {
    batches.push(texts.slice(i, i + MAX_BATCH));
  }

  const allTranslated: string[] = [];

  for (const batch of batches) {
    const prompt = `Translate the following strings into ${targetLang}. Return ONLY a JSON array of strings. Input: ${JSON.stringify(batch)}`;
    try {
      const translatedBatch = await withRetry(async () => {
        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        });
        const text = result.text || '';
        const match = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
        const cleanJson = match ? match[1] : text;
        return JSON.parse(cleanJson);
      });

      if (Array.isArray(translatedBatch)) {
        allTranslated.push(...translatedBatch);
      } else {
        allTranslated.push(...batch);
      }
    } catch (err) {
      console.warn('[Gemini Server] Translation batch failed, falling back to original:', err);
      allTranslated.push(...batch);
    }
  }

  res.json({ translations: allTranslated });
});

// AI-assisted image resolution endpoint
app.post('/api/gemini/resolve-image', async (req: Request, res: Response) => {
  const { id, title, feedUrl, link } = req.body;
  if (!id) {
    res.status(400).json({ error: 'Fusha "id" është e detyrueshme.' });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    const local = await executeResolveNewsItemImage({
      itemId: id,
      feedUrl,
      itemLink: link,
    });
    res.json(local);
    return;
  }

  try {
    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Resolve the original feed image for news item "${title || id}" (id: "${id}", feedUrl: "${feedUrl || ''}", link: "${link || ''}"). Call the resolve_news_item_image tool.`,
        config: {
          tools: [{ functionDeclarations: [resolveNewsItemImageToolDeclaration] }],
        },
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'resolve_news_item_image') {
          const args = call.args as any;
          return await executeResolveNewsItemImage({
            itemId: args?.itemId || id,
            feedUrl: args?.feedUrl || feedUrl,
            itemGuid: args?.itemGuid,
            itemLink: args?.itemLink || link,
          });
        }
      }

      return await executeResolveNewsItemImage({
        itemId: id,
        feedUrl,
        itemLink: link,
      });
    });

    res.json(result);
  } catch (err) {
    console.warn('[Gemini Server] AI image resolution fallback to local:', err);
    const fallback = await executeResolveNewsItemImage({
      itemId: id,
      feedUrl,
      itemLink: link,
    });
    res.json(fallback);
  }
});

// ============================================================================
// GEMINI LIVE API WEBSOCKET SERVER
// ============================================================================

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Gemini Live] Client connected');
  const ai = getAiClient();

  if (!ai) {
    clientWs.send(
      JSON.stringify({
        error: 'Gemini Live API is not configured on the server. Please check GEMINI_API_KEY.',
      })
    );
    clientWs.close(1011, 'Missing Gemini API Key');
    return;
  }

  let liveSession: any = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: {
          parts: [{ text: CHAT_SYSTEM_INSTRUCTION }],
        },
      },
      callbacks: {
        onopen: () => {
          console.log('[Gemini Live] Gemini session opened');
        },
        onmessage: (message: LiveServerMessage) => {
          // Model audio return
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          // Interruption notification
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err: any) => {
          console.error('[Gemini Live] Session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err?.message || String(err) }));
          }
        },
        onclose: () => {
          console.log('[Gemini Live] Gemini session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && liveSession) {
          // 16kHz PCM audio chunk
          liveSession.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (payload.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (e) {
        console.error('[Gemini Live] Client message parse error:', e);
      }
    });

    clientWs.on('close', () => {
      console.log('[Gemini Live] Client disconnected');
      try {
        if (liveSession) {
          liveSession.close();
        }
      } catch (_) {}
    });
  } catch (err: any) {
    console.error('[Gemini Live] Connection setup failure:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: `Dështoi lidhja Live: ${err?.message || String(err)}` }));
      clientWs.close();
    }
  }
});

// Upgrade HTTP connection to WebSocket for /api/gemini/live and /live
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  if (pathname === '/api/gemini/live' || pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// ============================================================================
// ENVIRONMENT INTEGRATION (Vite in Dev / Static in Production)
// ============================================================================

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    // In development mode, mount Vite dev server as middleware on Express
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production, serve built static assets from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    // Express 5 compatible fallback for SPA routing
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[NOVARIC Server] Server running on http://0.0.0.0:${PORT} (Node ${process.version})`);
  });
}

startServer().catch((err) => {
  console.error('[NOVARIC Server] Failed to start server:', err);
  process.exit(1);
});
