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
    await request.post('/api/users', {
      data: {
        name: 'Tauno Temmeltäjä',
        username: 'temmeltäjä',
        password: 'salainen'
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
      await createBlog(page, 'Luontiblogi', 'Testi Testaaja', 'www.luontitesti.fi')
      
      await expect(page.getByText('a new blog Luontiblogi by Testi Testaaja added')).toBeVisible()
      await expect(page.getByTestId('blog-list')).toHaveText('Luontiblogi'+' '+viewButton)
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Tykkäysblogi', 'Testi Testaaja', 'www.tykkäystesti.fi')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be removed by its creator', async ({ page }) => {
      await createBlog(page, 'Poistoblogi', 'Testi Testaaja', 'www.poistotesti.fi')
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('blog named Poistoblogi was successfully deleted')).toBeVisible()
      await expect(page.getByTestId('blog-list')).not.toHaveText('Poistoblogi')
    })
  })

  describe('When removing a blog', () => {

    test('only creator can see remove button', async ({ page }) => {
      // Login as testaaja and create a blog
      await loginWith(page, 'testaaja', 'salasana')
      await createBlog(page, 'Testiblogi', 'Testi Testaaja', 'www.testiblogi.fi')

      // testaaja sees remove button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      // Logout and login as temmeltäjä
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'temmeltäjä', 'salainen')

      // temmeltäjä does not see remove button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
