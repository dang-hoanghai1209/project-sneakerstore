const express = require("express");
const cors = require("cors");
const path = require("path");
const { getPool } = require("./db");

const app = express();

// ❗ PORT PHẢI LÀ 8080 TRÊN FLY.IO
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

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
    res.status(500).json({ error: err.message });
  }
});

// ❗ BẮT BUỘC: 0.0.0.0 chứ không phải localhost
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
