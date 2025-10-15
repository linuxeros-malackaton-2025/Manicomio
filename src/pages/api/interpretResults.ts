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
    const columns = body.columns;
    const rows = body.rows;

    if (!columns) {
      return new Response("No se proporcionaron las columnas", { status: 400 });
    }
    if (!rows) {
      return new Response("No se proporcionaron las filas", { status: 400 });
    }

    const prompt = `
Eres un asistente especializado en análisis de datos que recibe el resultado de una consulta SQL en formato de tabla.

Tu tarea es interpretar los resultados y generar un texto descriptivo breve y claro para un usuario no técnico.

Reglas:
- No inventes información que no esté en la tabla.
- Usa un tono informativo y conciso, sin frases como "Aquí tienes".
- Añade observaciones simples frases separadas por \n, como insights.

Ahora interpreta la siguiente tabla:
${JSON.stringify([columns, ...rows], null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    const AIresponse = response.text?.trim(); //la respuesta de la IA

    if (!AIresponse) {
      return new Response("No se generó una respuesta correctamente", {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        summary: AIresponse,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
};
