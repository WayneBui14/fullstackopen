require('dotenv').config() // Tải biến môi trường từ file .env

const PORT = process.env.PORT // Lấy PORT từ biến môi trường
const MONGODB_URI =
  process.env.NODE_ENV === 'test' // Kiểm tra môi trường
    ? process.env.TEST_MONGODB_URI // Nếu là môi trường test
    : process.env.MONGODB_URI // Nếu là môi trường production
module.exports = { MONGODB_URI, PORT }
