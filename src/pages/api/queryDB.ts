import type { APIRoute } from "astro";
// @ts-ignore
import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const sql = body.sql;

    let connection;

    try {
      connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectionString: process.env.ORACLE_CONNECTION_STRING,
      });

      console.log("Connected to Oracle Database");

      const result = await connection.execute(sql);

      return new Response(JSON.stringify(result.rows), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Error connecting to Oracle Database:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
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
};
