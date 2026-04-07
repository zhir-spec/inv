import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMarketingContent(affiliateName: string, referralLink: string) {
  const prompt = `
    You are a marketing expert for a top-tier Investment Broker. 
    The broker offers 1:300 leverage and 0.0 pips spreads.
    Generate marketing content for an affiliate named "${affiliateName}".
    Their referral link is: ${referralLink}

    Please provide:
    1. 3 Instagram Captions (engaging, with emojis and hashtags)
    2. 2 TikTok Video Ideas/Scripts (short, viral style)
    3. 2 Ad Headlines (punchy, high conversion)

    Return the response in a structured JSON format like this:
    {
      "instagram": ["caption 1", "caption 2", "caption 3"],
      "tiktok": [{"title": "idea 1", "script": "script 1"}, {"title": "idea 2", "script": "script 2"}],
      "ads": ["headline 1", "headline 2"]
    }
  `;

  try {
    // Generate Text Content
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = textResponse.text || "";
    let result: any = {};
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse AI response");
    }

    // Generate Marketing Image
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `A high-end, professional marketing image for an investment broker. 
                     Theme: Luxury, financial success, gold accents, professional trading setup. 
                     Text overlay (optional): "Trade with the Best", "1:300 Leverage".`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (imageError) {
      console.error("Image Generation Error:", imageError);
      result.imageUrl = `https://picsum.photos/seed/trading/1280/720`;
    }

    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      instagram: [`Start your trading journey! ${referralLink}`],
      tiktok: [{ title: "Trading Life", script: "Link in bio!" }],
      ads: ["Join the Elite"],
      imageUrl: `https://picsum.photos/seed/trading/1280/720`
    };
  }
}
