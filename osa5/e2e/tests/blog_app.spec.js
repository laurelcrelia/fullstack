const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Testaaja',
        username: 'testaaja',
        password: 'salasana'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    await expect(locator).toBeVisible()
    await expect(page.getByText('log in to application')).toBeVisible()
    })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salasana')
  
      await page.getByRole('button', { name: 'login' }).click()
    
      await expect(page.getByText('Testi Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('vääräsalasana')
  
      await page.getByRole('button', { name: 'login' }).click()
    
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    const viewButton = 'view'
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByTestId('title').fill('Testiblogi')
      await page.getByTestId('author').fill('Testi Testaaja')
      await page.getByTestId('url').fill('www.testiblogi.fi')

      await page.getByRole('button', { name: 'create' }).click()
      
      await expect(page.getByText('a new blog Testiblogi by Testi Testaaja added')).toBeVisible()
      await expect(page.getByTestId('blog-list')).toHaveText('Testiblogi'+' '+viewButton)
    })
  })
})
