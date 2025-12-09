const { Pool } = require('pg');

let pool;

async function getPool() {
  if (pool) return pool;

  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false, // Render yêu cầu SSL
    },
  });

  // Log thử 1 lần khi kết nối
  try {
    const res = await pool.query('SELECT NOW() AS now');
    console.log('✅ Connected to PostgreSQL:', res.rows[0]);
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
  }

  return pool;
}

module.exports = { getPool };
