import type { APIRoute } from 'astro';
// @ts-ignore
import oracledb from 'oracledb';

export const GET: APIRoute = async () => {
  let connection;

  try {
    // Inicializar cliente Oracle (solo si usas Thick mode)
    // await oracledb.initOracleClient({ libDir: "/path/to/instant/client" });

    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER || "ADMIN",
      password: process.env.ORACLE_PASSWORD || "AshambOneCKhompSHAYR!ç1",
      connectionString: process.env.ORACLE_CONNECT || "adb.eu-madrid-1.oraclecloud.com:1522/g2d0c285165a299_saluddatabase_high.adb.oraclecloud.com",
    });

    console.log("Connected to Oracle Database");

    const result = await connection.execute(`SELECT * FROM test`);

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

