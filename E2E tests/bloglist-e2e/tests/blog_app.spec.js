const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Wayne',
        username: 'wayne',
        password: 'password123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginHeading = page.getByRole('heading', { name: 'login' })
    await expect(loginHeading).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('Login with incorrect credentials', async ({ page }) => {
    await page.locator('input[name="Username"]').fill('wayne')
    await page.locator('input[name="Password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('border-color', 'rgb(255, 0, 0)')
    await expect(page.getByText('welcome Wayne')).not.toBeVisible()
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.locator('input[name="Username"]').fill('wayne')
      await page.locator('input[name="Password"]').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('welcome Wayne')).toBeVisible()
    })
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Playwright is cool')
      await page.locator('input[name="Author"]').fill('Wayne E2E')
      await page.locator('input[name="Url"]').fill('http://localhost:3003')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog Playwright is cool by Wayne E2E added')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Testing like button')
      await page.locator('input[name="Author"]').fill('Wayne E2E')
      await page.locator('input[name="Url"]').fill('http://localhost:3003')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog Testing like button by Wayne E2E added')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1')).toBeVisible()
    })
    test('user who created a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Blog to be deleted')
      await page.locator('input[name="Author"]').fill('Wayne E2E')
      await page.locator('input[name="Url"]').fill('http://localhost:3003')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog Blog to be deleted by Wayne E2E added')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog to be deleted - Wayne E2E')).not.toBeVisible()
    })
    test('only creator can see the remove button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('A highly secure blog')
      await page.locator('input[name="Author"]').fill('Wayne E2E')
      await page.locator('input[name="Url"]').fill('https://wayne.dev')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('A highly secure blog - Wayne E2E')).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Guest User',
          username: 'guest',
          password: 'password456'
        }
      })
      await page.locator('input[name="Username"]').fill('guest')
      await page.locator('input[name="Password"]').fill('password456')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('welcome Guest User')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
    test('blogs are ordered by likes in descending order', async ({ page }) => {
      // 1. TẠO 3 BÀI BLOG ĐỂ TEST
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Blog with 1 like')
      await page.locator('input[name="Author"]').fill('Wayne')
      await page.locator('input[name="Url"]').fill('http://url1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog with 1 like - Wayne')).toBeVisible()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Blog with 3 likes')
      await page.locator('input[name="Author"]').fill('Wayne')
      await page.locator('input[name="Url"]').fill('http://url3.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog with 3 likes - Wayne')).toBeVisible()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.locator('input[name="Title"]').fill('Blog with 2 likes')
      await page.locator('input[name="Author"]').fill('Wayne')
      await page.locator('input[name="Url"]').fill('http://url2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Blog with 2 likes - Wayne')).toBeVisible()

      // 2. ĐỊNH VỊ TỪNG BÀI VIẾT (Sử dụng class .blog đã thêm ở bài 5.13)
      const blog1 = page.locator('.blog').filter({ hasText: 'Blog with 1 like' })
      const blog2 = page.locator('.blog').filter({ hasText: 'Blog with 3 likes' })
      const blog3 = page.locator('.blog').filter({ hasText: 'Blog with 2 likes' })

      // Mở nút view cho cả 3 bài để thấy nút like
      await blog1.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'view' }).click()

      // 3. THỰC HIỆN BẤM LIKE VÀ ĐỢI UI CẬP NHẬT
      // Bài số 1: 1 like
      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1.getByText('likes 1')).toBeVisible()

      // Bài số 2: 3 likes (Phải chờ text cập nhật xong mới bấm tiếp để không bị lỗi đồng bộ)
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 1')).toBeVisible()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 2')).toBeVisible()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 3')).toBeVisible()

      // Bài số 3: 2 likes
      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3.getByText('likes 1')).toBeVisible()
      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3.getByText('likes 2')).toBeVisible()

      // 4. KIỂM TRA THỨ TỰ SẮP XẾP TRÊN MÀN HÌNH
      // Lấy toàn bộ các phần tử có class .blog đang hiển thị
      const allBlogs = page.locator('.blog')

      // nth(0) là phần tử trên cùng, nth(1) là thứ hai...
      // Thứ tự kỳ vọng: 3 likes -> 2 likes -> 1 like
      await expect(allBlogs.nth(0)).toContainText('Blog with 3 likes')
      await expect(allBlogs.nth(1)).toContainText('Blog with 2 likes')
      await expect(allBlogs.nth(2)).toContainText('Blog with 1 like')
    })
  })
})
