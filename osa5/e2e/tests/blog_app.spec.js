const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Testi Testaaja',
        username: 'testaaja',
        password: 'salasana'
      }
    })
    await page.goto('')
  })

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    await expect(locator).toBeVisible()
    await expect(page.getByText('log in to application')).toBeVisible()
    })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testaaja', 'salasana')
  
      await page.getByRole('button', { name: 'login' }).click()
    
      await expect(page.getByText('Testi Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testaaja', 'vääräsalasana')
  
      await page.getByRole('button', { name: 'login' }).click()
    
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    const viewButton = 'view'
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testaaja', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testiblogi', 'Testi Testaaja', 'www.testi.fi')
      
      await expect(page.getByText('a new blog Testiblogi by Testi Testaaja added')).toBeVisible()
      await expect(page.getByTestId('blog-list')).toHaveText('Testiblogi'+' '+viewButton)
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testiblogi', 'Testi Testaaja', 'www.testi.fi')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
