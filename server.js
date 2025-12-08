const express = require("express");
const cors = require("cors");
const path = require("path");
const { getPool } = require("./db");   // <-- lấy hàm kết nối SQL

const app = express();

// ❗ RẤT QUAN TRỌNG: dùng PORT của môi trường (Fly.io sẽ set biến này)
const PORT = process.env.PORT || 3000;

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

    // Query thử 1 câu rất đơn giản
    const result = await pool.request().query(`
      SELECT 
        @@SERVERNAME AS serverName,
        DB_NAME()     AS currentDatabase,
        GETDATE()     AS serverTime
    `);

    res.json(result.recordset[0]); // trả về 1 object JSON
  } catch (err) {
    console.error("❌ Error in /api/test-db:", err);
    res.status(500).json({ error: "Lỗi kết nối database", detail: err.message });
  }
});

// (Sau này bạn thêm /api/products, /api/orders ở phía dưới)

// ❗ Với Fly.io nên listen trên 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
