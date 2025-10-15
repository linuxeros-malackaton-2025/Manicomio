import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const GET: APIRoute = async ({ params, request }) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: "Why is the sky blue?",
  });

  return new Response(
    JSON.stringify({
      sql: response.text,
    })
  );
};
