const sql = require("mssql");

// Config for Render – read everything from env vars
const config = {
  user: "process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,              // e.g. your public IP or cloud SQL host
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,                          // for cloud DBs usually true
    trustServerCertificate: true            // keep true to avoid TLS issues
  }
};

let pool;

/**
 * Get a shared connection pool.
 */
async function getPool() {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
}

module.exports = {
  sql,
  getPool
};
