const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let token = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({
        username: 'root',
        name: 'root',
        passwordHash
    })
    await user.save()
    const userForToken = {
        username: user.username,
        id: user.id
    }
    token = jwt.sign(userForToken, process.env.SECRET)
    const blogObjects = helper.initialBlogs.map(blog => new Blog({
        ...blog,
        user: user.id
    }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(Array.isArray(response.body), true)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogToVerify = response.body[0]
    assert('id' in blogToVerify)
    assert.strictEqual(blogToVerify._id, undefined)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Async/await simplifies making async calls',
        auythor: 'Wayne',
        url: 'https://fullstackopen.com/',
        likes: 10
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newBlog.title))
})

test('a blog without likes defaults to 0', async () => {
    const newBlog = {
        title: 'Async/await simplifies making async calls',
        auythor: 'Wayne',
        url: 'https://fullstackopen.com/',
    }
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: 'Wayne',
        url: 'https://fullstackopen.com/',
        likes: 10
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'Async/await simplifies making async calls',
        author: 'Wayne',
        likes: 10
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

describe('delete blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1)

        const titles = blogAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))
    })
})
test('adding a blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
        title: 'This blog should not be added',
        author: 'Hacker',
        url: 'http://hacker.com'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})
describe('update blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

        assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
    })
})


after(async () => {
    await mongoose.connection.close()
})