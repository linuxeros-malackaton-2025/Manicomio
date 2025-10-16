import type { APIRoute } from "astro";
// @ts-ignore
import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

/**
 * Endpoint para consultas SELECT que devuelven datos
 * Devuelve las filas resultantes de la consulta
 */
export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const sql = body.sql;

    if (!sql) {
      return new Response(JSON.stringify({ error: "SQL query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let connection;

    try {
      connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectionString: process.env.ORACLE_CONNECTION_STRING,
      });

      console.log("Connected to Oracle Database");

      // Ejecutar consulta SELECT
      const result = await connection.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // Devolver como objetos
      });

      return new Response(
        JSON.stringify({
          success: true,
          rows: result.rows || [],
          rowCount: result.rows?.length || 0,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("Error fetching data:", err);
      return new Response(
        JSON.stringify({
          success: false,
          error: err.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("Error closing connection:", err);
        }
      }
    }
  }

  return new Response(JSON.stringify({ error: "Invalid request" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};
