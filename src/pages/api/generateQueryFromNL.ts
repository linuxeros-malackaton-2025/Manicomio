import { GoogleGenAI } from "@google/genai";
import type { APIRoute } from "astro";
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

    // Prompt mejorado con contexto completo del dominio
    const prompt = `
Eres un experto en SQL para bases de datos Oracle especializado en datos sanitarios españoles.

# CONTEXTO DEL SISTEMA
Este es un sistema de gestión de pacientes hospitalarios en España. Los datos incluyen información sobre:
- Pacientes hospitalizados
- Comunidades autónomas españolas
- Diagnósticos médicos (códigos CIE)
- Grupos relacionados de diagnóstico (GRD-APR)
- Estancias hospitalarias y costes

# ESQUEMA DE BASE DE DATOS ORACLE

## Tabla Principal: paciente
Contiene información de cada paciente hospitalizado.
Columnas importantes:
- id: Identificador único del paciente
- nombre: Nombre del paciente
- edad: Edad del paciente en años
- sexo_id: Referencia a tabla sexo (1=Hombre, 2=Mujer)
- comunidad_autonoma_id: Referencia a tabla comunidad_autonoma
- fecha_ingreso: Fecha de ingreso al hospital
- fecha_fin_contacto: Fecha de salida del hospital
- estancia_dias: Número de días de hospitalización
- tipo_alta_id: Tipo de alta hospitalaria
- servicio_id: Servicio hospitalario donde estuvo
- coste_APR: Coste estimado de la atención
- nivel_severidad: Nivel de severidad (1-4, siendo 4 el más grave)
- riesgo_mortalidad_APR: Riesgo de mortalidad (1-4)
- ingreso_UCI_id: Si ingresó en UCI
- dias_UCI: Días en UCI
- year_ingreso: Año de ingreso
- mes_ingreso: Mes de ingreso (1-12)

## Tablas de Referencia:

### comunidad_autonoma
Comunidades autónomas de España:
- Andalucía, Aragón, Asturias, Baleares, Canarias, Cantabria, 
  Castilla y León, Castilla-La Mancha, Cataluña, Valencia, 
  Extremadura, Galicia, Madrid, Murcia, Navarra, País Vasco, La Rioja

### sexo
- 1: Hombre
- 2: Mujer

### diagnostico
Diagnósticos asociados a cada paciente (puede haber múltiples por paciente)
- codigo: Código CIE del diagnóstico

### tipo_alta
Tipos de alta hospitalaria:
- 1: Alta médica
- 2: Alta voluntaria
- 3: Traslado
- 4: Fallecimiento
- 5: Otros

# ESQUEMA COMPLETO SQL

CREATE TABLE paciente (
    id INTEGER PRIMARY KEY,
    comunidad_autonoma_id INTEGER NOT NULL,
    nombre VARCHAR2(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo_id INTEGER NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_fin_contacto DATE NOT NULL,
    tipo_alta_id INTEGER NOT NULL,
    estancia_dias INTEGER NOT NULL,
    edad INTEGER NOT NULL,
    coste_APR INTEGER NOT NULL,
    nivel_severidad INTEGER NOT NULL,
    riesgo_mortalidad_APR INTEGER NOT NULL,
    servicio_id INTEGER NOT NULL,
    ingreso_UCI_id INTEGER NOT NULL,
    dias_UCI INTEGER,
    year_ingreso NUMBER NOT NULL,
    mes_ingreso NUMBER NOT NULL,
    FOREIGN KEY (comunidad_autonoma_id) REFERENCES comunidad_autonoma(id),
    FOREIGN KEY (sexo_id) REFERENCES sexo(id),
    FOREIGN KEY (tipo_alta_id) REFERENCES tipo_alta(id)
);

CREATE TABLE comunidad_autonoma (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR2(255) NOT NULL
);

CREATE TABLE sexo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR2(255) NOT NULL
);

CREATE TABLE diagnostico (
    id INTEGER PRIMARY KEY,
    paciente_id INTEGER NOT NULL,
    codigo VARCHAR2(255) NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES paciente(id)
);

CREATE TABLE tipo_alta (
    id INTEGER PRIMARY KEY,
    nombre INTEGER NOT NULL
);

# REGLAS IMPORTANTES PARA SQL EN ORACLE:
1. Usa JOINs cuando necesites nombres de comunidades o sexo
2. Para buscar por comunidad, usa: JOIN comunidad_autonoma ca ON p.comunidad_autonoma_id = ca.id WHERE ca.nombre = 'Andalucía'
3. Para buscar por sexo, usa: JOIN sexo s ON p.sexo_id = s.id WHERE s.nombre = 'Hombre'
4. Usa GROUP BY para agregaciones
5. Usa TO_DATE() para fechas en formato Oracle
6. Los costes están en euros
7. Para limitar resultados usa: WHERE ROWNUM <= 100

# EJEMPLOS DE CONVERSIÓN:

Entrada: "Pacientes de Andalucía"
Salida SQL:
\`\`\`sql
SELECT p.*, ca.nombre as comunidad
FROM paciente p
JOIN comunidad_autonoma ca ON p.comunidad_autonoma_id = ca.id
WHERE ca.nombre = 'Andalucía'
\`\`\`

Entrada: "Pacientes mayores de 65 años"
Salida SQL:
\`\`\`sql
SELECT * FROM paciente WHERE edad > 65
\`\`\`

Entrada: "Total de pacientes por comunidad autónoma"
Salida SQL:
\`\`\`sql
SELECT ca.nombre, COUNT(*) as total
FROM paciente p
JOIN comunidad_autonoma ca ON p.comunidad_autonoma_id = ca.id
GROUP BY ca.nombre
ORDER BY total DESC
\`\`\`

Entrada: "Coste promedio de hospitalización"
Salida SQL:
\`\`\`sql
SELECT AVG(coste_APR) as coste_promedio FROM paciente
\`\`\`

Entrada: "Pacientes con alta severidad"
Salida SQL:
\`\`\`sql
SELECT * FROM paciente WHERE nivel_severidad = 4
\`\`\`

Entrada: "Pacientes que ingresaron en UCI"
Salida SQL:
\`\`\`sql
SELECT p.*, iu.nombre as tipo_ingreso_uci
FROM paciente p
JOIN ingreso_UCI iu ON p.ingreso_UCI_id = iu.id
WHERE p.dias_UCI > 0
\`\`\`

# TU TAREA:
Convierte la siguiente consulta en lenguaje natural a SQL de Oracle:

"${query}"

IMPORTANTE:
- Genera SOLO el código SQL, sin explicaciones
- Usa el formato: \`\`\`sql\n[tu_sql]\n\`\`\`
- Asegúrate de usar los nombres correctos de las tablas y columnas
- Usa JOINs cuando necesites nombres legibles
- Limita resultados si es necesario con ROWNUM
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
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
