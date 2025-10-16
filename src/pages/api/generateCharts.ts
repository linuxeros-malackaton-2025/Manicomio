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
 * Endpoint para generar configuraciones de gráficos basadas en datos
 * Analiza los datos y sugiere las mejores visualizaciones
 */
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { rows, sql } = body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Se requieren datos válidos" }),
        { status: 400 }
      );
    }

    // Analizar estructura de datos
    const columns = Object.keys(rows[0]);
    const analysis = analyzeDataStructure(rows, columns);

    // Si hay suficientes datos, usar IA para sugerir visualizaciones
    const prompt = `
Eres un experto en visualización de datos. Analiza la siguiente estructura de datos y sugiere las mejores visualizaciones.

Estructura de datos:
- Total registros: ${rows.length}
- Columnas: ${columns.join(", ")}
- Análisis: ${JSON.stringify(analysis, null, 2)}

Muestra de datos (primeras 3 filas):
${JSON.stringify(rows.slice(0, 3), null, 2)}

Consulta SQL original:
${sql || "N/A"}

Genera configuraciones de gráficos en formato JSON. Devuelve SOLO el JSON sin texto adicional.
Usa EXACTAMENTE este formato:

{
  "charts": [
    {
      "type": "bar|pie|line|doughnut",
      "title": "Título del gráfico",
      "description": "Breve descripción",
      "dataColumn": "nombre_columna_con_valores",
      "labelColumn": "nombre_columna_con_etiquetas",
      "reason": "Por qué este gráfico es útil"
    }
  ],
  "recommendations": ["recomendación 1", "recomendación 2"]
}

Reglas:
- Máximo 3 gráficos
- Solo usa columnas que existan en los datos
- Prioriza gráficos que muestren distribuciones, comparaciones o tendencias
- Para datos numéricos usa bar o line
- Para categorías usa pie o doughnut
- Si hay fechas, usa line para tendencias temporales
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

      // Extraer JSON de la respuesta
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      let chartConfig;

      if (jsonMatch) {
        chartConfig = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: generar configuración automática
        chartConfig = generateAutomaticCharts(rows, columns, analysis);
      }

      // Validar y procesar configuraciones
      const processedCharts = processChartConfigs(chartConfig.charts, rows);

      return new Response(
        JSON.stringify({
          charts: processedCharts,
          recommendations: chartConfig.recommendations || [],
          totalRows: rows.length,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("Error generando gráficos:", err);
      
      // Fallback: generar gráficos automáticos sin IA
      const autoCharts = generateAutomaticCharts(rows, columns, analysis);
      
      return new Response(
        JSON.stringify({
          charts: processChartConfigs(autoCharts.charts, rows),
          recommendations: ["Gráficos generados automáticamente"],
          totalRows: rows.length,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
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
 * Analiza la estructura de los datos
 */
function analyzeDataStructure(rows: any[], columns: string[]) {
  const analysis: any = {};

  columns.forEach((col) => {
    const values = rows.map((row) => row[col]).filter((v) => v != null);
    const uniqueValues = new Set(values);
    const isNumeric = values.every((v) => !isNaN(Number(v)));
    const isDate = values.some((v) => !isNaN(Date.parse(v)));

    analysis[col] = {
      type: isNumeric ? "numeric" : isDate ? "date" : "categorical",
      uniqueCount: uniqueValues.size,
      sampleValues: Array.from(uniqueValues).slice(0, 5),
    };
  });

  return analysis;
}

/**
 * Genera configuraciones de gráficos automáticamente
 */
function generateAutomaticCharts(rows: any[], columns: string[], analysis: any) {
  const charts: any[] = [];

  // Buscar columnas categóricas y numéricas
  const categoricalCols = columns.filter(
    (col) => analysis[col]?.type === "categorical" && analysis[col]?.uniqueCount < 20
  );
  const numericCols = columns.filter((col) => analysis[col]?.type === "numeric");

  // Gráfico 1: Distribución de categoría principal
  if (categoricalCols.length > 0 && rows.length > 0) {
    charts.push({
      type: "bar",
      title: `Distribución por ${categoricalCols[0]}`,
      description: `Cantidad de registros por cada ${categoricalCols[0]}`,
      dataColumn: "count",
      labelColumn: categoricalCols[0],
      reason: "Muestra la distribución de los datos por categoría",
    });
  }

  // Gráfico 2: Si hay dos categorías, hacer comparación
  if (categoricalCols.length > 1) {
    charts.push({
      type: "doughnut",
      title: `Proporción por ${categoricalCols[1]}`,
      description: `Distribución porcentual`,
      dataColumn: "count",
      labelColumn: categoricalCols[1],
      reason: "Visualiza las proporciones de manera clara",
    });
  }

  // Gráfico 3: Si hay numéricos, mostrar comparación
  if (numericCols.length > 0 && categoricalCols.length > 0) {
    charts.push({
      type: "bar",
      title: `${numericCols[0]} por ${categoricalCols[0]}`,
      description: `Comparación de valores numéricos`,
      dataColumn: numericCols[0],
      labelColumn: categoricalCols[0],
      reason: "Compara valores numéricos entre categorías",
    });
  }

  return { charts: charts.slice(0, 3), recommendations: [] };
}

/**
 * Procesa y prepara datos para los gráficos
 */
function processChartConfigs(charts: any[], rows: any[]) {
  return charts.map((chart) => {
    const { labelColumn, dataColumn } = chart;

    // Agrupar datos por etiqueta
    const grouped: any = {};
    
    rows.forEach((row) => {
      const label = row[labelColumn];
      if (label) {
        if (dataColumn === "count") {
          grouped[label] = (grouped[label] || 0) + 1;
        } else {
          const value = Number(row[dataColumn]);
          if (!isNaN(value)) {
            grouped[label] = (grouped[label] || 0) + value;
          }
        }
      }
    });

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    return {
      ...chart,
      chartData: {
        labels,
        datasets: [
          {
            label: chart.title,
            data,
            backgroundColor: generateColors(labels.length),
            borderColor: generateColors(labels.length, 1),
            borderWidth: 1,
          },
        ],
      },
    };
  });
}

/**
 * Genera colores para los gráficos
 */
function generateColors(count: number, alpha: number = 0.6) {
  const colors = [
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
    `rgba(201, 203, 207, ${alpha})`,
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
}
