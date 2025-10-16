import type { APIRoute } from "astro";
// @ts-ignore
import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

/**
 * Endpoint para ejecutar comandos SQL que modifican datos
 * (INSERT, UPDATE, DELETE, CREATE TABLE, etc.)
 * No devuelve filas, solo confirma la ejecución
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

      // Ejecutar SQL (INSERT, UPDATE, DELETE, etc.)
      const result = await connection.execute(sql, [], { autoCommit: true });

      return new Response(
        JSON.stringify({
          success: true,
          rowsAffected: result.rowsAffected || 0,
          message: "SQL executed successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("Error executing SQL:", err);
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
