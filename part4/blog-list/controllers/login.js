const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username }) // Bay vô model User tìm theo username của request body
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash) // So sánh password hash của user với password hash của request body
    if (!(passwordCorrect && user)) {
        return response.status(401).json({ error: 'invalid username or password' })
    } // Nếu không tìm thấy user hoặc password không đúng, trả về 401
    const userForToken = {
        username: user.username,
        id: user._id,
    } // Tạo userForToken
    const token = jwt.sign(userForToken, process.env.SECRET) // Tạo token
    response
        .status(200)
        .json({ token, username: user.username, id: user._id }) // Trả về token, username và id
})

module.exports = loginRouter // Xuất loginRouter ra để dùng ở app.js