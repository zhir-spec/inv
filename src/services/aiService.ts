import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMarketingContent(affiliateName: string, referralLink: string) {
  // @ts-ignore - The SDK types might be slightly different in this environment
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (Gemini sometimes wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse AI response");
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback content
    return {
      instagram: [
        `Start your trading journey with the best! 📈 Use my link: ${referralLink} #Forex #Trading`,
        `Financial freedom is just a click away. 💸 Join me here: ${referralLink}`,
        `Master the markets with our expert tools. 🚀 Sign up: ${referralLink}`
      ],
      tiktok: [
        { title: "Day in the life of a trader", script: "Show your setup, then point to the link in bio!" },
        { title: "Why I chose this broker", script: "List 3 benefits: low spreads, fast withdrawals, great support." }
      ],
      ads: [
        "Trade Forex Like a Pro - Low Spreads!",
        "Join the Elite Trading Community Today"
      ]
    };
  }
}
