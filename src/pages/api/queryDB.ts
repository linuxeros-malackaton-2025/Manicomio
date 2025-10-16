import type { APIRoute } from 'astro';
// @ts-ignore
import oracledb from 'oracledb';


export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    console.log("Connected to Oracle Database");

    const result = await connection.execute(``);

    return new Response(JSON.stringify(result.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error("Error connecting to Oracle Database:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

