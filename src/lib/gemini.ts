import { GoogleGenAI, Type } from "@google/genai";
import { TermResult, VocabItem, DomainResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async researchTerm(term: string, sourceLang: string): Promise<TermResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Research the term "${term}" (source language: ${sourceLang}) for a conference interpreter. 
      A word can have multiple meanings (polysemy). Provide ALL relevant technical or professional meanings/senses.
      For each meaning:
      1. Provide precise translations in Italian, English, and French.
      2. If an exact equivalent does not exist in a target language, provide the closest possible alternative or a descriptive translation and explain this in a 'note'.
      3. Provide a clear definition (in ${sourceLang}), an example sentence in context, and a few synonyms.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            meanings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  definition: { type: Type.STRING },
                  translations: {
                    type: Type.OBJECT,
                    properties: {
                      it: { type: Type.STRING },
                      en: { type: Type.STRING },
                      fr: { type: Type.STRING },
                    },
                    required: ["it", "en", "fr"],
                  },
                  context: { type: Type.STRING },
                  synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  note: { type: Type.STRING, description: "Explanation if no exact equivalent exists" },
                },
                required: ["definition", "translations", "context", "synonyms"],
              },
            },
          },
          required: ["term", "meanings"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  },

  async buildVocabulary(domain: string, sourceLang: string, count: number = 20): Promise<VocabItem[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional trilingual vocabulary list for the domain "${domain}" (source language: ${sourceLang}). 
      Include exactly ${count} essential technical terms. For each term, provide:
      1. The term in the source language.
      2. Precise translations in Italian, English, and French.
      3. A brief usage note in ${sourceLang}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              translations: {
                type: Type.OBJECT,
                properties: {
                  it: { type: Type.STRING },
                  en: { type: Type.STRING },
                  fr: { type: Type.STRING },
                },
                required: ["it", "en", "fr"],
              },
              usage: { type: Type.STRING },
            },
            required: ["term", "translations", "usage"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  },

  async identifyDomain(text: string): Promise<DomainResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following text and identify its domain for an interpreter's preparation. 
      Provide the main domain, specific sub-domains, key concepts mentioned, and suggested resources for further study.
      
      Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainDomain: { type: Type.STRING },
            subDomains: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["mainDomain", "subDomains", "keyConcepts", "suggestedResources"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  },
};
