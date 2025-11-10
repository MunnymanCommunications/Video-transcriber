
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const transcribeVideo = async (mimeType: string, base64Data: string): Promise<string> => {
  try {
    const videoPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: "Transcribe this video. Provide only the spoken words as a single block of text without any formatting or additional comments.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [textPart, videoPart] },
    });

    const transcription = response.text;
    if (!transcription) {
      throw new Error("The API returned an empty transcription. The video might not contain clear speech or could be in an unsupported format.");
    }

    return transcription.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to transcribe video. Please check if the video format is supported and try again.");
  }
};
