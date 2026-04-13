const jwt = require('jsonwebtoken') // jsonwebtoken là thư viện dùng để xử lý token
const blogsRouter = require('express').Router() // blogsRouter là router dùng để xử lý blog
const Blog = require('../models/blog') // Blog là model dùng để xử lý blog
const User = require('../models/user') // User là model dùng để xử lý user

blogsRouter.get('/', async (request, response) => {
  // Bay vô model Blog tìm tất cả các blog
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs) // Trả về cho user data của Blog
})

blogsRouter.post('/', async (request, response) => {
  // Lấy body từ request của user gửi lên
  const body = request.body
  // Kiểm tra title và url có tồn tại không và trả về thông báo lỗi cụ thể
  if (!body.title && !body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  } else if (!body.title) {
    return response.status(400).json({ error: 'title is required' })
  } else if (!body.url) {
    return response.status(400).json({ error: 'url is required' })
  }
  // Lấy user từ request đã được userExtractor xử lý
  const user = request.user
  // Nếu không có user thì trả về 401
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  // Tạo blog mới theo model Blog
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id // Gán ID user vô blog
  })
  // Lưu blog mới này vô database
  const savedBlog = await blog.save()
  // Thêm blog vô trường blog của user
  user.blogs = user.blogs.concat(savedBlog._id)
  // Lưu user vô database
  await user.save()
  // Trả về blog đã lưu, nhớ populate thông tin user để frontend hiển thị đúng "added by..."
  await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // Lấy user từ request đã được userExtractor xử lý
  const user = request.user
  // Nếu không có user thì trả về 401
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  // Tìm blog trong database theo ID của blog có trong request
  const blog = await Blog.findById(request.params.id)
  // Nếu không tìm thấy blog thì trả về 404
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  // Kiểm tra user có phải là chủ sở hữu của blog không
  if (blog.user.toString() === user.id.toString()) {
    // Xóa blog
    await Blog.findByIdAndDelete(request.params.id)
    // Trả về 204
    response.status(204).end()
  } else {
    // Nếu không phải chủ sở hữu thì trả về 401
    return response
      .status(401)
      .json({ error: 'you are not the owner of this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  // Lấy body từ request của user gửi lên
  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).end()
  }
  // Kiểm tra user
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  // Kiểm tra blog tồn tại
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Tạo blog mới từ body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  // Tìm blog trong database với id trùng với id của blog có trong request và cập nhật lại blog
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  }).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog) // Trả về blog đã cập nhật
})
blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  // Tìm bài blog hiện tại
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Khởi tạo mảng comments nếu blog cũ chưa có, sau đó nhét comment mới vào
  blog.comments = blog.comments ? blog.comments.concat(comment) : [comment]

  // Lưu lại vào database
  const savedBlog = await blog.save()

  // (Tùy chọn) Populate lại user để frontend không bị lỗi hiển thị tên người đăng
  await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})
module.exports = blogsRouter
