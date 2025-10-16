import { GoogleGenAI } from "@google/genai";
import type { APIRoute } from "astro";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/**
 * Endpoint para generar análisis avanzado de datos
 * - Detecta patrones y anomalías
 * - Genera insights estadísticos
 * - Proporciona recomendaciones
 */
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { sql, rows } = body;

    if (!rows || !Array.isArray(rows)) {
      return new Response(
        JSON.stringify({ error: "Datos de filas requeridos" }),
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({
          summary: "No hay datos para analizar",
          insights: [],
          statistics: {},
        }),
        { status: 200 }
      );
    }

    // Calcular estadísticas básicas
    const statistics = calculateStatistics(rows);

    // Generar análisis con IA
    const prompt = `
Eres un experto analista de datos con conocimientos en estadística y análisis sanitario.

Analiza los siguientes datos obtenidos de una consulta SQL y proporciona:
1. Un resumen ejecutivo breve (2-3 líneas)
2. 3-5 insights clave o patrones detectados
3. Posibles anomalías o valores atípicos
4. Recomendaciones para análisis adicionales

Datos estadísticos:
- Total de registros: ${statistics.totalRows}
- Columnas: ${statistics.columns.join(", ")}
- Valores únicos por columna: ${JSON.stringify(statistics.uniqueValues)}

Muestra de datos (primeras 5 filas):
${JSON.stringify(rows.slice(0, 5), null, 2)}

Consulta SQL ejecutada:
${sql}

Proporciona tu análisis en formato JSON con esta estructura:
{
  "summary": "Resumen ejecutivo",
  "insights": ["insight 1", "insight 2", ...],
  "anomalies": ["anomalía 1", ...],
  "recommendations": ["recomendación 1", ...]
}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: prompt,
      });

      const aiText = response.text?.trim();
      
      if (!aiText) {
        throw new Error("No se generó respuesta de IA");
      }

      // Intentar extraer JSON de la respuesta
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      let analysis;

      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback si no devuelve JSON
        analysis = {
          summary: aiText,
          insights: [],
          anomalies: [],
          recommendations: [],
        };
      }

      return new Response(
        JSON.stringify({
          ...analysis,
          statistics,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("Error en análisis avanzado:", err);
      return new Response(
        JSON.stringify({
          error: "Error al generar análisis",
          message: err.message,
          statistics,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Invalid request" }), {
    status: 400,
  });
};

/**
 * Calcula estadísticas básicas de los datos
 */
function calculateStatistics(rows: any[]) {
  if (rows.length === 0) {
    return {
      totalRows: 0,
      columns: [],
      uniqueValues: {},
    };
  }

  const columns = Object.keys(rows[0]);
  const uniqueValues: Record<string, number> = {};

  // Contar valores únicos por columna
  columns.forEach((col) => {
    const uniqueSet = new Set(rows.map((row) => row[col]));
    uniqueValues[col] = uniqueSet.size;
  });

  return {
    totalRows: rows.length,
    columns,
    uniqueValues,
  };
}
