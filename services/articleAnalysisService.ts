import { ArticleAnalysis } from '../types';
import { getApiEndpoint, isApiConfigurationMissing, getApiMissingConfigurationMessage } from './apiConfig';

const ANALYSIS_ENDPOINT = getApiEndpoint('/analyze-article');

export const isAnalysisServiceMisconfigured = (): boolean => {
    return isApiConfigurationMissing();
};

export const analyzeArticle = async (title: string, content: string): Promise<ArticleAnalysis> => {
  if (isAnalysisServiceMisconfigured()) {
    throw new Error(getApiMissingConfigurationMessage());
  }
  
  try {
    const response = await fetch(ANALYSIS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Analiza e artikullit dështoi me status: ${response.status}`;
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

    const data: ArticleAnalysis = await response.json();
    
    // Add runtime validation for the response data structure
    if (typeof data.title !== 'string' || typeof data.summary !== 'string' || typeof data.verdict !== 'string' || typeof data.authenticityRating !== 'string' || !Array.isArray(data.sources)) {
      throw new Error("Përgjigja e analizës së artikullit nga serveri ka format të papritur.");
    }

    return data;

  } catch (error) {
    console.error('Gabim gjatë thirrjes së shërbimit të analizës së artikullit:', error);
    if (error instanceof Error) {
        if (error.message.includes("GABIM KRITIK KONFIGURIMI")) {
             throw error;
        }
      throw new Error(`Dështoi marrja e analizës nga serveri: ${error.message}`);
    }
    throw new Error('Ndodhi një gabim i panjohur gjatë komunikimit me serverin.');
  }
};