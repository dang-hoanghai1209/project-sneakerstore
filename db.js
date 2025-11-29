const sql = require("mssql");

// ⚠ Thay đổi password cho đúng với bạn đặt lúc tạo login
const config = {
  user: "hai_user",
  password: "12344",       // <-- sửa thành pass thật của bạn
  server: "localhost",          // cùng máy thì để localhost là được
  database: "master",           // tạm thời test với master, lát nữa đổi sang ShoeStoreDB
  options: {
    encrypt: false,             // local nên false
    trustServerCertificate: true
  }
};

let pool;

/**
 * Lấy connection pool dùng chung.
 * Gọi getPool() ở bất kỳ đâu để dùng.
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