import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const query = body.query;

    if (!query) {
      return new Response("No se proporcionó una query", { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents:
        "Generate a short and descriptive title for the a table that will contain the results of the next query:\n\n" +
        query +
        "\n\n Output format: Just and only the title, no explanation",
    });

    const AIresponse = response.text?.trim(); //la respuesta de la IA

    if(!AIresponse){
      return new Response("No se generó una respuesta correctamente", { status: 400 });
    }

    return new Response(
      JSON.stringify({
        title: AIresponse,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
