// db.js
const { Pool } = require("pg");

const poolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Supabase yêu cầu SSL, Render OK
  },
};

let pool;

function getPool() {
  if (!pool) {
    // check nhanh xem có thiếu env nào không
    if (!poolConfig.host) {
      console.error("❌ DB_HOST is missing");
    }
    if (!poolConfig.database) {
      console.error("❌ DB_NAME is missing");
    }
    if (!poolConfig.user) {
      console.error("❌ DB_USER is missing");
    }

    pool = new Pool(poolConfig);
    console.log("✅ Pool to Supabase Postgres created");
  }
  return pool;
}

module.exports = { getPool };
