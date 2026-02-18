
import { GoogleGenAI, Type } from "@google/genai";
import { Photo, PhotoMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    objects: { type: Type.ARRAY, items: { type: Type.STRING } },
    faces: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Short descriptions of faces/people" },
    scene: { type: Type.STRING },
    text: { type: Type.STRING, description: "Any OCR text found" },
    isSensitive: { type: Type.BOOLEAN, description: "True if document, ID, bank card, or secret info" },
    riskClassification: { type: Type.STRING, description: "ID, Financial, Medical, Secret, or None" },
    riskReason: { type: Type.STRING },
    dominantEmotion: { type: Type.STRING },
    sentiment: { type: Type.STRING, description: "positive, neutral, or negative" },
    locationEstimate: { type: Type.STRING },
    temporalContext: { type: Type.STRING, description: "e.g., Morning, Summer, Holiday, Event" }
  },
  required: ["objects", "scene", "isSensitive", "dominantEmotion", "sentiment"]
};

/**
 * Robustly calls the Gemini API with exponential backoff for 429 errors.
 */
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3, initialDelay = 1500): Promise<any> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimit && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`DrishyaMitra: Rate limit hit. Attempt ${attempt + 1}/${maxRetries}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export class DrishyaMitraAgents {
  static async analyzePhoto(photoUrl: string, base64Data: string): Promise<PhotoMetadata> {
    return callWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: "System Role: Vision Agent + Privacy Guardian. Extract visual metadata, OCR text, and emotional sentiment. Critical: If this is an ID, Credit Card, or Document, set isSensitive to true and classify it." },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      });

      const data = JSON.parse(response.text);
      return {
        ...data,
        timestamp: new Date().toISOString()
      };
    });
  }

  static async clusterMemories(photos: Photo[]): Promise<any> {
    return callWithRetry(async () => {
      const photoData = photos.map(p => ({
        id: p.id,
        meta: p.metadata
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Role: Memory Agent. Analyze these photo metadata entries. Group them into distinct "Memory Albums" or "Events".
        Be creative with titles like 'Summer Joy' or 'Productive Workdays'.
        Data: ${JSON.stringify(photoData)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              albums: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    photoIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    category: { type: Type.STRING, description: "event, timeline, emotion, or privacy" }
                  },
                  required: ["title", "photoIds", "category"]
                }
              }
            }
          }
        }
      });

      return JSON.parse(response.text);
    });
  }

  static async planOptimization(photos: Photo[]): Promise<string[]> {
    return callWithRetry(async () => {
      const context = photos.map(p => ({ id: p.id, scene: p.metadata?.scene, objects: p.metadata?.objects }));
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Role: Planner Agent. Look for potential duplicates or very similar photos in this list. Suggest actions.
        Context: ${JSON.stringify(context)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      return JSON.parse(response.text).suggestions || [];
    });
  }

  static async semanticSearch(query: string, photoContext: Photo[]): Promise<string[]> {
    return callWithRetry(async () => {
      const context = photoContext.map(p => ({ 
        id: p.id, 
        desc: `${p.metadata?.scene} ${p.metadata?.objects.join(' ')} ${p.metadata?.text} emotion: ${p.metadata?.dominantEmotion} risk: ${p.metadata?.isSensitive} classification: ${p.metadata?.riskClassification}` 
      }));
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Role: Natural Language Interface Agent. Query: "${query}". 
        Analyze query intent: Is the user looking for specific categories (Documents, Faces, Emotions, Scenes)?
        Return IDs of photos that match the sentiment, category, or specific content of the query.
        Context: ${JSON.stringify(context)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchingIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      return JSON.parse(response.text).matchingIds || [];
    });
  }
}
