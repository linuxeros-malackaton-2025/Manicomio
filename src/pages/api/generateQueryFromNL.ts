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
        "Convert the next text query into an sql Query:\n\n" +
        query +
        "\n\n Output format: \n```sql\n\tthe query\n```\nJust and only that, no explanation",
    });

    const AIresponse = response.text; //la respuesta de la IA

    if(!AIresponse){
      return new Response("No se generó una respuesta correctamente", { status: 400 });
    }

    const sqlMDQuery = AIresponse.match(/```sql\s*([\s\S]*?)```/); //la respuesta extraida desde la respuesta de la IA

    if(!sqlMDQuery){
      return new Response("No se generó una respuesta correctamente, la respuesta no contenia SQL", { status: 400 });
    }

    const cleanSQL = sqlMDQuery[1].trim();

    return new Response(
      JSON.stringify({
        sql: cleanSQL,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
