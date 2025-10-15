import oracledb from 'oracledb';
async function connectToDatabase() {
   try {
       // Initialize Oracle Client if needed
       await oracledb.initOracleClient({ libDir: "path-to-oracle-client-lib" }); // Optional for Thin mode
       const connection = await oracledb.getConnection({
           user: "ADMIN",
           password: "AshambOneCKhompSHAYR!ç1",
           connectionString: "g2d0c285165a299_saluddatabase_high"
       });
       console.log("Connected to Oracle Database");
       return connection;
   } catch (err) {
       console.error("Error connecting to Oracle Database:", err);
   }
}

module.exports = connectToDatabase;