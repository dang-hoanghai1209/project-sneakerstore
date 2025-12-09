const express = require("express");
const cors = require("cors");
const path = require("path");
const { getPool } = require("./db"); // db.js sẽ trả về Pool của PostgreSQL

const app = express();

// PORT do Render cấp, nếu không có thì fallback 10000 (giống ENV bạn đang set)
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Route kiểm tra server chạy chưa
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Route test kết nối PostgreSQL
app.get("/api/test-db", async (req, res) => {
  try {
    const pool = await getPool();

    // PostgreSQL: dùng pool.query, không còn request().query như MSSQL
    const result = await pool.query("SELECT NOW() AS server_time");

    res.json(result.rows[0]); // { server_time: ... }
  } catch (err) {
    console.error("❌ Error in /api/test-db:", err);
    res.status(500).json({ error: "DB error", detail: err.message });
  }
});

// BẮT BUỘC: listen trên 0.0.0.0 để Render/Fly map được
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
