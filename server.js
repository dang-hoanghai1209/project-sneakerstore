const express = require('express');
const path = require('path');
const cors = require('cors');
const products = require('./data/products'); // import dữ liệu giày

const app = express();
const PORT = 3000;

// Cho phép gọi API từ trình duyệt
app.use(cors());
// Cho phép server đọc JSON body (khi POST)
app.use(express.json());

// Serve file tĩnh (frontend) trong thư mục /public
app.use(express.static(path.join(__dirname, 'public')));

// ====== API PRODUCTS ======

// Lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Thử endpoint đơn giản để test
app.get('/api/hello', (req, res) => {
  res.send('Server Node.js đang chạy OK!');
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${PORT}`);
});