import oracledb from 'oracledb';
import fs from 'fs';

async function run() {
  try {
    // Ruta al wallet descargado de Oracle Autonomous Database
    const walletPath = '/home/mrdarip/oracle/network/admin';
    const configDir = walletPath;

    // Cargar configuración
    oracledb.initOracleClient({ configDir });

    // Credenciales (pueden estar en un archivo .env)
    const connection = await oracledb.getConnection({
      user: 'ADMIN',
      password: 'AshambOneCKhompSHAYR!ç1',
      connectString: 'g2d0c285165a299_saluddatabase_high' // definido en tnsnames.ora dentro del wallet
    });

    const result = await connection.execute(`SELECT sysdate FROM dual`);
    console.log(result.rows);

    await connection.close();
  } catch (err) {
    console.error(err);
  }
}

run();
export default async function handler(req, res) {
    try {
        // Ruta al wallet descargado de Oracle Autonomous Database
        const walletPath = '/home/mrdarip/oracle/network/admin';
        const configDir = walletPath;

        // Cargar configuración
        oracledb.initOracleClient({ configDir });

        // Credenciales (pueden estar en un archivo .env)
        const connection = await oracledb.getConnection({
            user: 'ADMIN',
            password: 'AshambOneCKhompSHAYR!ç1',
            connectString: 'g2d0c285165a299_saluddatabase_high'
        });

        const result = await connection.execute(`SELECT * FROM test`);
        await connection.close();

        res.status(200).json({ rows: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
