import { GoogleGenAI } from "@google/genai";

export async function generateMarketingContent(affiliateName: string, referralLink: string) {
  // 1. Get Text Content from Backend (Groq)
  let result: any = {
    instagram: [],
    tiktok: [],
    ads: [],
    imageUrl: null
  };

  try {
    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ affiliateName, referralLink }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate text content via server");
    }

    const textData = await response.json();
    result = { ...result, ...textData };
  } catch (error) {
    console.error("Text Generation Error:", error);
    // Fallback text content
    result.instagram = [`Start your trading journey with Investment Affiliate! ${referralLink}`];
    result.tiktok = [{ title: "Trading Life", script: "Link in bio to join the elite traders!" }];
    result.ads = ["Join the Elite - 0.0 Pips Spreads"];
  }

  // 2. Generate Image Content in Frontend (Gemini) - REQUIRED by platform guidelines
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional, cinematic marketing image for a high-end investment broker. 
                   Subject: A modern, clean trading desk with multiple monitors showing financial charts (candlestick patterns). 
                   Style: Sleek, dark theme with gold accents. 
                   Atmosphere: Serious, institutional, high-tech. 
                   EXCLUDE: People drinking, partying, or irrelevant lifestyle shots. 
                   Focus on: Professionalism and financial technology.`,
          },
        ],
      },
    });

    if (imageResponse.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }
  } catch (imageError) {
    console.error("Frontend Image Generation Error:", imageError);
    // Fallback image
    if (!result.imageUrl) {
      result.imageUrl = `https://static.vecteezy.com/system/resources/previews/041/043/373/large_2x/ai-generated-rear-view-of-a-male-trader-sitting-in-front-of-the-monitor-with-stock-market-data-free-photo.jpg`;
    }
  }

  return result;
}
