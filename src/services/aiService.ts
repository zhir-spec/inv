export async function generateMarketingContent(affiliateName: string, referralLink: string) {
  try {
    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ affiliateName, referralLink }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content via server");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback content
    return {
      instagram: [`Start your trading journey with Investment Affiliate! ${referralLink}`],
      tiktok: [{ title: "Trading Life", script: "Link in bio to join the elite traders!" }],
      ads: ["Join the Elite - 0.0 Pips Spreads"],
      imageUrl: `https://static.vecteezy.com/system/resources/previews/041/043/373/large_2x/ai-generated-rear-view-of-a-male-trader-sitting-in-front-of-the-monitor-with-stock-market-data-free-photo.jpg`
    };
  }
}
