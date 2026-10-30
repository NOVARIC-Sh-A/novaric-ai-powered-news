

// FIX: Corrected import path for types.
import { PoliticianAnalysisResult } from '../types';

// Use environment variables for Supabase credentials. This is more secure and flexible.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;


export const isAnalysisServiceMisconfigured = (): boolean => {
    // Check if the environment variables are set.
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error(`
            CRITICAL CONFIGURATION ERROR [analysisService]: Supabase credentials are not set correctly.
            Please set the REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY environment variables for your application deployment.
            
            For local development, you can create a .env file in the root directory and add them there.
            Example .env file:
            REACT_APP_SUPABASE_URL=https://xhryczkrddsawksqxgrx.supabase.co
            REACT_APP_SUPABASE_ANON_KEY=your_public_anon_key
        `);
        return true;
    }
    return false;
};

// Fetches all politician analyses from the Supabase table.
export const fetchAnalyses = async (): Promise<PoliticianAnalysisResult[]> => {
    if (isAnalysisServiceMisconfigured()) {
        throw new Error("Shërbimi i analizës nuk është konfiguruar siç duhet. Ju lutemi, kontaktoni administratorin.");
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/politician_analysis?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY as string, // Cast as string since check ensures it's not undefined
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Kërkesa te Supabase dështoi me statusin: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // The data from Supabase might have different field names. We need to map them.
        // Assuming Supabase columns are: id, name, claim, verdict, explanation, source, sentiment, transparency
        const formattedData: PoliticianAnalysisResult[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            factCheckSummary: {
                claim: item.claim,
                verdict: item.verdict,
                explanation: item.explanation,
                source: item.source
            },
            sentiment: item.sentiment, // Assuming this is already a correct JSON object { positive, neutral, negative }
            transparencyScore: item.transparency // Assuming this is { score, label, justification }
        }));
        
        return formattedData.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave nga Supabase:", error);
        if (error instanceof Error) {
            throw new Error(`Dështoi marrja e analizës nga serveri: ${error.message}`);
        }
        throw new Error('Ndodhi një gabim i panjohur gjatë komunikimit me serverin.');
    }
};