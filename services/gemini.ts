
import { GoogleGenAI, Type } from "@google/genai";
import { Restaurant, MenuItem, AIRecommendation, Review } from "../types";

export class FoodAIService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing Gemini client with process.env.API_KEY as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getSmartRecommendations(
    restaurants: Restaurant[],
    userInput: string
  ): Promise<AIRecommendation[]> {
    const context = restaurants.map(r => ({
      id: r.id,
      name: r.name,
      menu: r.menu.map(m => ({ id: m.id, name: m.name, desc: m.description, category: m.category }))
    }));

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is looking for: "${userInput}". Based on the following restaurant menu data, suggest the top 3 best matching items. 
      Data: ${JSON.stringify(context)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              restaurantId: { type: Type.STRING },
              menuItemId: { type: Type.STRING },
              reason: { type: Type.STRING, description: "Short catchy reason why this fits the user's request" },
            },
            required: ["restaurantId", "menuItemId", "reason"]
          }
        },
        systemInstruction: "You are a gourmet food expert assistant. Be precise and suggest the most relevant dishes based on user preference, mood, or dietary descriptions."
      }
    });

    try {
      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse AI recommendations", e);
      return [];
    }
  }

  async getReviewSummary(reviews: Review[]): Promise<string> {
    if (!reviews || reviews.length === 0) return "No reviews yet. Be the first to share your thoughts!";
    
    const reviewTexts = reviews.map(r => `Rating: ${r.rating}/5 - ${r.comment}`).join('\n');
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the overall customer sentiment based on these reviews. Highlight what people love and any common complaints. Keep it under 60 words. 
      Reviews:
      ${reviewTexts}`,
      config: {
        systemInstruction: "You are a helpful food critic assistant who summarizes community feedback accurately and concisely."
      }
    });
    
    return response.text || "Customers generally enjoy the atmosphere and food quality.";
  }

  async getDishInsight(menuItem: MenuItem): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a mouth-watering, appetizing description (max 2 sentences) for the dish "${menuItem.name}" which is described as "${menuItem.description}". Mention its flavor profile.`,
    });
    return response.text || "A delicious choice prepared with fresh ingredients!";
  }
}

export const foodAIService = new FoodAIService();
