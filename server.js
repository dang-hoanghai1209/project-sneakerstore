const express = require("express");
const cors = require("cors");
const path = require("path");
const { getPool } = require("./db");   // <-- lấy hàm kết nối SQL

const app = express();

// ❗ PORT phải lấy từ môi trường, mặc định 8080
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve frontend tĩnh trong thư mục /public
app.use(express.static(path.join(__dirname, "public")));

// Route test đơn giản xem server Node chạy chưa
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ✅ ROUTE TEST KẾT NỐI SQL
app.get("/api/test-db", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        @@SERVERNAME AS serverName,
        DB_NAME()     AS currentDatabase,
        GETDATE()     AS serverTime
    `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error in /api/test-db:", err);
    res.status(500).json({ error: "Lỗi kết nối database", detail: err.message });
  }
});

// ❗ BẮT BUỘC: listen trên 0.0.0.0 chứ không phải localhost
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
