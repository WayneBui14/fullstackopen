const jwt = require('jsonwebtoken') // jsonwebtoken là thư viện dùng để xử lý token
const User = require('../models/user') // User là model dùng để xử lý user

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    // CastError lỗi từ Mongoose, xảy ra khi id không đúng định dạng
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // ValidationError lỗi từ Mongoose, xảy ra khi dữ liệu không thỏa mãn điều kiện Schema
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    // JsonWebTokenError lỗi từ jsonwebtoken, xảy ra khi token sai, bị giả mạo hoặc không hợp lệ
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    // TokenExpiredError lỗi từ jsonwebtoken, xảy ra khi token hết hạn
    return response.status(401).json({ error: 'token expired' })
  }
  next(error) // Nếu không khớp với bất kỳ lỗi nào trên thì chuyển sang cho Express mặc định xử lý
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization') // Lấy giá trị từ header authorization
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // Kiểm tra xem authorization có tồn tại và có bắt đầu bằng 'bearer ' không
    request.token = authorization.substring(7) // Cắt bỏ 'bearer ' để lấy token
  } else {
    request.token = null // Nếu không có token, gán null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    // Kiểm tra xem token có tồn tại hay không
    const decodedToken = jwt.verify(request.token, process.env.SECRET) // Dùng SECRET để giải mã token
    if (decodedToken.id) {
      // Kiểm tra xem id có tồn tại hay không
      request.user = await User.findById(decodedToken.id) // Tìm user theo id trong database
    }
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}
