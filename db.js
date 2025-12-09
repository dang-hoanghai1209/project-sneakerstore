const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Render yêu cầu SSL
  },
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
}

testConnection();

module.exports = pool;
