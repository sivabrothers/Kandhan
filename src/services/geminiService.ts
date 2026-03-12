import { GoogleGenAI, Type } from "@google/genai";
import { Profile } from "../types";

// @ts-ignore
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function getCompatibilityScore(userProfile: Profile, targetProfile: Profile) {
  try {
    const prompt = `
      Analyze the compatibility between two individuals for marriage based on their profiles.
      
      User Profile:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - Religion: ${userProfile.religion}
      - Caste: ${userProfile.caste}
      - Education: ${userProfile.education}
      - Profession: ${userProfile.profession}
      - Income: ${userProfile.income}
      - Location: ${userProfile.city}, ${userProfile.state}
      - Lifestyle: ${userProfile.food}
      
      Target Profile:
      - Name: ${targetProfile.name}
      - Age: ${targetProfile.age}
      - Religion: ${targetProfile.religion}
      - Caste: ${targetProfile.caste}
      - Education: ${targetProfile.education}
      - Profession: ${targetProfile.profession}
      - Income: ${targetProfile.income}
      - Location: ${targetProfile.city}, ${targetProfile.state}
      - Lifestyle: ${targetProfile.food}
      
      Return a JSON object with:
      1. score: A number from 0 to 100.
      2. reasoning: A brief explanation (max 2 sentences) of why they are a good match or what the challenges might be.
      3. keyMatches: An array of strings highlighting shared traits.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            keyMatches: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "reasoning", "keyMatches"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Compatibility Error:", error);
    return { score: 75, reasoning: "Standard compatibility based on basic parameters.", keyMatches: ["Community", "Education"] };
  }
}
