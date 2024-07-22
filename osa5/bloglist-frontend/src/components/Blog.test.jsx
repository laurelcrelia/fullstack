import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing',
  author: 'Test User',
  url: 'https://test.com',
  user: { name: 'Test User' },
  likes: 0,
}

const testUser = 'Test User'

const mockHandler = vi.fn()

test('renders title', () => {
  render(
    <Blog
      blog={blog}
      addLike={mockHandler}
      removeBlog={mockHandler}
      user={testUser}
    />
  )

  const element = screen.findByText(blog.title)
  expect(element).toBeDefined()
})

test('clicking the view button opens blog content', async () => {
  render(
    <Blog
      blog={blog}
      addLike={mockHandler}
      removeBlog={mockHandler}
      user={testUser}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.findByText(blog.url)
  screen.findByText(blog.likes)
  screen.findByText(blog.user.name)
})
