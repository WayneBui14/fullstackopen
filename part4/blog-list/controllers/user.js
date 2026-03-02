const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    // Bay vô model User tìm tất cả user
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
    // Trả về user đã tìm
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    // Mở cái body ra lấy các trường cần thiết
    const { username, password, name } = request.body
    // Kiểm tra độ dài mật khẩu trước khi đem đi băm
    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }
    // Thêm muối cho bảo mật "mặn mà"
    const saltRounds = 10
    // Băm cái mật khẩu lấy từ request.body trộn với muối
    const passwordHash = await bcrypt.hash(password, saltRounds)
    // Gói thông tin user lại theo model
    const user = new User({
        username,
        name,
        passwordHash
    })
    try {
        // Lưu user vô database
        const savedUser = await user.save()
        // Trả về user đã lưu
        response.status(201).json(savedUser)
    } catch (error) {
        // Trả về 400 nếu có lỗi từ Mongoose (ví dụ: ValidationError, MongoServerError trùng lặp)
        response.status(400).json({ error: error.message })
    }
})

module.exports = userRouter // Xuất cái userRouter ra để dùng ở app.js