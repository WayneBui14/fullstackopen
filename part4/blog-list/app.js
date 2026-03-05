const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const morgan = require('morgan')

mongoose.set('strictQuery', false) // Khi strictQuery: true (mặc định), Mongoose sẽ tự động loại bỏ các field không có trong Schema khi query
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error.message)
  })

app.use(cors()) // Middleware để cho phép request từ các domain khác
app.use(express.json()) // Middleware để parse JSON request sang JavaScript object
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
}) // Tạo token để log body request
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // Log request ra console
app.use(middleware.tokenExtractor) // Middleware để lấy token từ header authorization
app.use('/api/blogs', middleware.userExtractor, blogsRouter) // Nhét userExtractor vào trước blogsRouter để lấy user từ token, middleware này chỉ chạy cho mỗi route api/blogs
app.use('/api/users', userRouter) // Router lấy danh sách user
app.use('/api/login', loginRouter) // Router đăng nhập
app.use(middleware.errorHandler) // Middleware xử lý lỗi
module.exports = app // Xuất app ra ngoài