const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 }) // Tìm tất cả user
    response.json(users) // Trả về user đã tìm
})

userRouter.post('/', async (request, response) => {
    const body = request.body // Cái này lấy body từ request của user gửi lên nè!
    const { username, password, name } = request.body // Mở cái body ra lấy các trường cần thiết
    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' })
    } // Kiểm tra độ dài mật khẩu trước khi đem đi băm
    const saltRounds = 10 // Thêm muối cho bảo mật "mặn mà"
    const passwordHash = await bcrypt.hash(password, saltRounds) // Băm cái mật khẩu lấy từ request.body trộn với muối
    const user = new User({
        username,
        name,
        passwordHash
    }) // Gói thông tin user lại theo model
    try {
        const savedUser = await user.save() // Lưu user vô database
        response.status(201).json(savedUser) // Trả về user đã lưu
    } catch (error) {
        response.status(400).json({ error: error.message }) // Trả về 400 nếu có lỗi từ Mongoose (ví dụ: ValidationError, MongoServerError trùng lặp)
    }
})

module.exports = userRouter // Xuất cái userRouter ra để dùng ở app.js