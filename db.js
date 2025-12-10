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
    pool = new Pool(poolConfig);
    console.log("✅ Connected to Supabase Postgres");
  }
  return pool;
}

module.exports = {
  getPool,
};
