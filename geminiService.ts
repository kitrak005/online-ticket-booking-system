import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
// Initialize loosely; if API key is missing, we'll handle gracefully in the UI.
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const getMovieInsights = async (movieTitle: string, query: string): Promise<string> => {
    if (!ai) return "AI services are currently unavailable. Please check your API configuration.";

    try {
        const model = "gemini-2.5-flash";
        const prompt = `
        You are a helpful cinema assistant for a movie booking website.
        The user is looking at the movie: "${movieTitle}".
        
        User Query: "${query}"
        
        Provide a concise, engaging answer (max 100 words). 
        Focus on helping them decide if they want to watch it. 
        If asking for recommendations, suggest similar movies based on genre and tone.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "I couldn't generate a response at this time.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I'm having trouble connecting to the AI brain right now.";
    }
};