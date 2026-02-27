const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('initial users', () => {
    beforeEach(async () => {
        await User.deleteMany({}) // Xóa sạch user trước mỗi test
        const passwordHash = await bcrypt.hash('sekret', 10) // Tạo mật khẩu đã băm giả định với chuỗi "sekret"
        const user = new User({ username: 'root', passwordHash }) // Tạo user mẫu
        await user.save() // Lưu user vô database
    })
    test('create user succeeds with valid data', async () => {
        const userAtStart = await User.find({}) // Lấy danh sách user trước khi thêm
        const newUser = {
            username: 'wayne',
            name: 'Wayne',
            password: 'password123'
        } // User test với valid data
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/) // Kêu supertest kiểm tra
        const userAtEnd = await User.find({}) // Lấy danh sách user sau khi thêm
        assert.strictEqual(userAtEnd.length, userAtStart.length + 1) // Kiểm tra số lượng user tăng lên 1
        const usernames = userAtEnd.map(u => u.username) // Lấy danh sách username
        assert(usernames.includes(newUser.username)) // Kiểm tra username mới có trong danh sách
    })
    test('create user fails with status code 400 if password is too short', async () => {
        const userAtStart = await User.find({})
        const newUser = {
            username: 'wayne',
            name: 'Wayne',
            password: '12'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const userAtEnd = await User.find({})
        assert.strictEqual(userAtEnd.length, userAtStart.length)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const userAtStart = await User.find({})
        const newUser = {
            username: 'root',
            name: 'Wayne',
            password: 'password123'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const userAtEnd = await User.find({})
        assert.strictEqual(userAtEnd.length, userAtStart.length)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})