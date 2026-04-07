import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function generateMarketingContent(affiliateName: string, referralLink: string) {
  const prompt = `
    You are a world-class marketing strategist for a premium Investment Broker. 
    The broker is known for:
    - 1:300 Leverage
    - 0.0 Pips Spreads
    - Fast execution and institutional-grade liquidity
    - Gold and Black branding (Premium/Elite feel)

    Generate fresh, high-converting marketing content for an affiliate named "${affiliateName}".
    Their unique referral link is: ${referralLink}
    
    IMPORTANT: Provide unique and creative ideas that are different from common templates. Each time this is called, try to explore a different marketing angle (e.g., technical analysis, lifestyle, risk management, or platform features).

    Please provide:
    1. 3 Instagram Captions: One educational, one FOMO-driven, one lifestyle-success (but professional). Use emojis and relevant hashtags like #Trading #Forex #Investing.
    2. 2 TikTok Video Scripts: One "Day in the life of a trader" style, one "Why I chose this broker" style. Keep them under 30 seconds.
    3. 2 Ad Headlines: Short, punchy, and focused on the 0.0 pips or 1:300 leverage.

    CRITICAL: Ensure the content is professional, trustworthy, and avoids "get rich quick" schemes. Focus on the tools and conditions provided by the broker.

    Return the response in a structured JSON format like this:
    {
      "instagram": ["caption 1", "caption 2", "caption 3"],
      "tiktok": [{"title": "idea 1", "script": "script 1"}, {"title": "idea 2", "script": "script 2"}],
      "ads": ["headline 1", "headline 2"]
    }
  `;

  try {
    // Generate Text Content using Groq (Llama 3.1)
    const textResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }
    });
    
    const text = textResponse.choices[0]?.message?.content || "";
    let result: any = {
      instagram: [],
      tiktok: [],
      ads: []
    };
    
    try {
      const parsed = JSON.parse(text);
      // Ensure arrays and strings to avoid React child errors
      result.instagram = (parsed.instagram || []).map((item: any) => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
      result.tiktok = (parsed.tiktok || []).map((item: any) => ({
        title: String(item.title || 'Marketing Idea'),
        script: String(item.script || (typeof item === 'string' ? item : JSON.stringify(item)))
      }));
      result.ads = (parsed.ads || []).map((item: any) => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback: Extract JSON from the response if not strictly JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        result.instagram = (parsed.instagram || []).map((item: any) => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
        result.tiktok = (parsed.tiktok || []).map((item: any) => ({
          title: String(item.title || 'Marketing Idea'),
          script: String(item.script || (typeof item === 'string' ? item : JSON.stringify(item)))
        }));
        result.ads = (parsed.ads || []).map((item: any) => typeof item === 'string' ? item : (item.text || JSON.stringify(item)));
      } else {
        throw new Error("Failed to parse Groq response");
      }
    }

    // Generate Marketing Image using Gemini
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Please add it to the Secrets panel.");
      }
      
      const imageResponse = await (ai as any).models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          role: 'user',
          parts: [{
            text: `A professional, cinematic marketing image for a high-end investment broker. 
                   Subject: A modern, clean trading desk with multiple monitors showing financial charts (candlestick patterns). 
                   Style: Sleek, dark theme with gold accents. 
                   Atmosphere: Serious, institutional, high-tech. 
                   EXCLUDE: People drinking, partying, or irrelevant lifestyle shots. 
                   Focus on: Professionalism and financial technology.`,
          }]
        }]
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (imageError) {
      console.error("Image Generation Error:", imageError);
    }

    if (!result.imageUrl) {
        result.imageUrl = `https://static.vecteezy.com/system/resources/previews/041/043/373/large_2x/ai-generated-rear-view-of-a-male-trader-sitting-in-front-of-the-monitor-with-stock-market-data-free-photo.jpg`;
    }

    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
