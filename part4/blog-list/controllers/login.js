const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    // Lấy body từ request của user gửi lên gán vào biến username và password
    const { username, password } = request.body
    // Tìm user trong database theo username của request body
    const user = await User.findOne({ username })
    // So sánh password hash của user với password hash của request body
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    // Nếu không tìm thấy user hoặc password không đúng, trả về 401
    if (!(passwordCorrect && user)) {
        return response.status(401).json({ error: 'invalid username or password' })
    }
    // Tạo userForToken
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    // Tạo token
    const token = jwt.sign(userForToken, process.env.SECRET)
    // Trả về token, username và id
    response
        .status(200)
        .json({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter // Xuất loginRouter ra để dùng ở app.js