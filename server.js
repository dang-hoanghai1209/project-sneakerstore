// server.js
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const path = require("path");
const { getPool } = require("./db");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Test DB
app.get("/api/test-db", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error in /api/test-db:", err);
    res.status(500).json({ error: "DB error", detail: err.message });
  }
});

// PRODUCTS API
app.get("/api/products", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query(`
      SELECT id, name, brand, price, image_url
      FROM products
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error in /api/products:", err);
    res.status(500).json({ error: "DB error", detail: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
