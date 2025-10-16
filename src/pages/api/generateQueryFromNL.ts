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
        "knowing this is the schema for my Oracle Database:"+
        `CREATE TABLE "paciente" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"comunidad_autonoma_id" INTEGER NOT NULL,
	"nombre" VARCHAR2(255) NOT NULL,
	"fecha_nacimiento" DATE NOT NULL,
	"sexo_id" INTEGER NOT NULL,
	"fecha_ingreso" DATE NOT NULL,
	"circunstancia_contacto_id" INTEGER NOT NULL,
	"fecha_fin_contacto" DATE NOT NULL,
	"tipo_alta_id" INTEGER NOT NULL,
	"estancia_dias" INTEGER NOT NULL,
	"fecha_intervención" DATE NOT NULL,
	"GRD_APR" INTEGER NOT NULL,
	"CDM_APR" INTEGER NOT NULL,
	"nivel_severidad" INTEGER NOT NULL,
	"riesgo_mortalidad_APR" INTEGER NOT NULL,
	"servicio_id" INTEGER NOT NULL,
	"edad" INTEGER NOT NULL,
	"coste_APR" INTEGER NOT NULL,
	"CIE" INTEGER NOT NULL,
	"num_registro_anual" INTEGER NOT NULL,
	"centro_recod" NUMBER NOT NULL,
	"CIP_SNS_recod" NUMBER NOT NULL,
	"pais_nacimiento_id" INTEGER NOT NULL,
	"pais_residencia_id" INTEGER NOT NULL,
	"fecha_inicio_contacto" DATE NOT NULL,
	"regimen_finalizacion" INTEGER NOT NULL,
	"procedencia_id" INTEGER NOT NULL,
	"continualidad_asistencial_id" INTEGER NOT NULL,
	"ingreso_UCI_id" INTEGER NOT NULL,
	"dias_UCI" INTEGER,
	"GRD_APR_id" INTEGER NOT NULL,
	"peso_espanol_APR" NUMBER NOT NULL,
	"edad_en_ingreso" NUMBER NOT NULL,
	"year_ingreso" NUMBER NOT NULL,
	"mes_ingreso" NUMBER NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "diagnostico" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"paciente_id" INTEGER NOT NULL,
	"codigo" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "sexo" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "tipo_alta" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" INTEGER NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "circunstancia_contacto" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" INTEGER NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "servicio" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	PRIMARY KEY("id")
);


CREATE TABLE "pais" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "procedencia" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "continualidad_asistencial" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "ingreso_UCI" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "GRD_APR" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"GRD" INTEGER NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "comunidad_autonoma" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" VARCHAR2(255) NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "POA_diagnostico" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"paciente_id" INTEGER NOT NULL,
	"tipo_POA_id" INTEGER NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "tipo_POA" (
	"id" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
	"nombre" INTEGER NOT NULL,
	PRIMARY KEY("id")
);\n`+
        "Convert the next text query into an Oracle db sql Query:\n\n" +
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
