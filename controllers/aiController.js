import { GoogleGenAI } from "@google/genai";

// Helper function to force a delay (used for exponential backoff)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePost = async (req, res) => {
  try {
    const { prompt, tone } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    console.log("CONTROLLER KEY AT RUNTIME:", process.env.GEMINI_API_KEY ? "Loaded Successfully" : "MISSING");

    // Initialize the client
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const finalPrompt = `
You are a professional social media content writer.

Generate a social media post based on:

Topic: ${prompt}
Tone: ${tone || "casual"}

Rules:
- 2 to 4 lines
- Natural human tone
- Engaging and simple
- No hashtags unless necessary
`;

    let response;
    
    // List of models ordered by priority and free tier quota allowances
    // 2.5-flash-lite gives you 30 RPM & 1,000 Daily Requests vs 2.5-flash's tight 10 RPM / 250 Daily limits.
    const modelsToTry = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
    
    // Loop through fallback models if rate-limited or busy
    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      
      try {
        console.log(`Attempt ${i + 1}: Trying ${currentModel}...`);
        
        response = await ai.models.generateContent({
          model: currentModel,
          contents: finalPrompt,
        });

        console.log(`Success with ${currentModel}`);
        break; // Successfully got data, break out of the fallback loop!

      } catch (error) {
        const isRateLimitedOrBusy = error.status === 429 || error.status === 503;
        const hasMoreFallbacks = i < modelsToTry.length - 1;

        if (isRateLimitedOrBusy && hasMoreFallbacks) {
          // Calculate an exponential wait time (e.g., 2 seconds, then 4 seconds)
          const waitTime = (i + 1) * 2000; 
          console.warn(`Model ${currentModel} returned ${error.status}. Waiting ${waitTime / 1000}s before falling back to ${modelsToTry[i + 1]}...`);
          
          await delay(waitTime);
          continue; // Move to the next model in the array
        } else {
          // If it's a structural error (like bad API key) or we ran out of fallbacks, rethrow it
          throw error;
        }
      }
    }

    return res.status(200).json({
      success: true,
      text: response.text,
    });

  } catch (error) {
    console.error("AI Generation Error:", error);

    if (error.status === 503 || error.status === 429) {
      return res.status(error.status).json({
        success: false,
        message: "All free AI tier routes are currently congested. Please try again in a few moments.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI generation failed, Please try again in a few moments.",
      error: error.message,
    });
  }
};