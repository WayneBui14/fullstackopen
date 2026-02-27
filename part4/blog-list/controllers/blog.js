const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }) // Bay vô model Blog tìm hết
    response.json(blogs) // Trả về cho user data của Blog
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body // Lấy body từ request của user gửi lên
    if (!body.title || !body.url) { // Kiểm tra title và url có tồn tại không
        return response.status(400).end() // Nếu không tồn tại thì trả về 400
    }
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id // Gán ID user vô blog
    })
    const savedBlog = await blog.save() // Lưu blog vô database
    user.blogs = user.blogs.concat(savedBlog._id) // Thêm blog vô user
    await user.save() // Lưu user vô database
    response.status(201).json(savedBlog) // Trả về blog đã lưu
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'you are not the owner of this blog' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true }
    )
    response.json(updatedBlog)
})

module.exports = blogsRouter