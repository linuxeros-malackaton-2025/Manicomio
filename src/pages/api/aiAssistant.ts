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
 * Endpoint para el asistente de IA
 * Responde preguntas sobre el sistema, SQL, datos médicos, etc.
 */
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Se requiere un mensaje" }),
        { status: 400 }
      );
    }

    const systemPrompt = `
Eres un asistente virtual experto del sistema "Malackaton - Explorador de Datos".

# TU ROL
Ayudas a usuarios a utilizar un sistema de análisis de datos hospitalarios en España.

# FUNCIONALIDADES DEL SISTEMA
1. Conversión de lenguaje natural a SQL
2. Ejecución de consultas en Oracle Database
3. Visualización de resultados en tablas
4. Generación automática de gráficos (barras, circular, líneas)
5. Análisis avanzado con IA (insights, anomalías, recomendaciones)

# BASE DE DATOS
El sistema trabaja con datos sanitarios:
- Tabla principal: "paciente" (pacientes hospitalizados)
- Datos: edad, sexo, comunidad autónoma, fecha ingreso, días estancia, coste, severidad, UCI
- Comunidades autónomas españolas (Andalucía, Madrid, Cataluña, etc.)
- Códigos médicos: CIE, GRD-APR
- Niveles de severidad: 1-4 (4 es el más grave)
- Tipos de alta: médica, voluntaria, traslado, fallecimiento

# CÓMO AYUDAR

## Para consultas SQL:
- Explica cómo escribir consultas en lenguaje natural
- Ejemplos: "Pacientes de Andalucía", "Mayores de 65 años", "Total por comunidad"
- Menciona que el sistema convierte automáticamente a SQL

## Para visualización:
- Explica que tras ejecutar una consulta aparecen botones de:
  - 📊 Ver Gráficos (visualizaciones automáticas)
  - 🧠 Ver Análisis Avanzado (insights con IA)

## Para datos médicos:
- Explica conceptos médicos básicos (GRD, CIE, severidad, mortalidad)
- Ayuda a interpretar resultados
- Sugiere análisis útiles

## Para problemas técnicos:
- Guía paso a paso
- Soluciones claras y concisas
- Ejemplos prácticos

# TU ESTILO
- Amigable y profesional
- Respuestas concisas (2-4 párrafos máximo)
- Usa emojis ocasionalmente 📊 🏥 💡
- Proporciona ejemplos concretos
- Si no sabes algo, admítelo y sugiere alternativas

# IMPORTANTE
- No inventes información sobre el sistema
- Si preguntan sobre funcionalidades que no existen, explica lo que SÍ puede hacer
- Siempre intenta ser útil y práctico

Ahora responde a la siguiente pregunta del usuario:
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: systemPrompt + "\n\n" + message,
      });

      const aiResponse = response.text?.trim();

      if (!aiResponse) {
        throw new Error("No se generó respuesta");
      }

      return new Response(
        JSON.stringify({
          response: aiResponse,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("Error en AI Assistant:", err);
      
      // Respuesta de fallback
      const fallbackResponse = getFallbackResponse(message);
      
      return new Response(
        JSON.stringify({
          response: fallbackResponse,
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
 * Respuestas de fallback cuando la IA no está disponible
 */
function getFallbackResponse(message: string): string {
  const messageLower = message.toLowerCase();

  // Preguntas sobre SQL
  if (messageLower.includes("sql") || messageLower.includes("consulta")) {
    return `Para hacer consultas, simplemente escribe en lenguaje natural en el campo de texto. Por ejemplo:

📝 Ejemplos:
• "Pacientes de Andalucía"
• "Mayores de 65 años"
• "Total de pacientes por comunidad"
• "Pacientes con alta severidad"

El sistema convertirá automáticamente tu pregunta a SQL y ejecutará la consulta. ¡Es muy fácil!`;
  }

  // Preguntas sobre gráficos
  if (messageLower.includes("gráfico") || messageLower.includes("visualiza")) {
    return `Después de ejecutar una consulta y ver los resultados en tabla, aparecerá un botón "📊 Ver Gráficos".

Haz clic en él y el sistema generará automáticamente visualizaciones relevantes:
• Gráficos de barras
• Gráficos circulares
• Gráficos de líneas

¡La IA elige los mejores gráficos para tus datos!`;
  }

  // Preguntas sobre análisis
  if (messageLower.includes("análisis") || messageLower.includes("insight")) {
    return `El botón "🧠 Ver Análisis Avanzado" te proporciona:

💡 Insights clave sobre los datos
⚠️ Detección de anomalías
📊 Estadísticas automáticas
📌 Recomendaciones de análisis adicionales

Todo generado automáticamente por IA. ¡Muy útil para descubrir patrones!`;
  }

  // Preguntas sobre datos
  if (messageLower.includes("datos") || messageLower.includes("tabla") || messageLower.includes("información")) {
    return `El sistema trabaja con datos de pacientes hospitalizados en España. Incluye:

🏥 Información de pacientes: edad, sexo, comunidad autónoma
📅 Fechas: ingreso, alta, estancia
💰 Costes de hospitalización
⚕️ Datos médicos: severidad, riesgo, diagnósticos
🏛️ Geografía: 17 comunidades autónomas

¿Qué te gustaría consultar?`;
  }

  // Pregunta genérica
  return `¡Hola! Estoy aquí para ayudarte con el sistema de análisis de datos. Puedo ayudarte con:

📊 Cómo hacer consultas en lenguaje natural
📈 Generar gráficos y visualizaciones
🧠 Interpretar análisis avanzados
💡 Entender los datos del sistema
🔍 Responder dudas técnicas

¿En qué puedo ayudarte específicamente?`;
}
