import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'Component testing',
    author: 'Test User',
    url: 'https://test.com',
    user: { name: 'Test User' },
    likes: 0,
  }

  const user = 'Test User'

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      addLike={mockHandler}
      removeBlog={mockHandler}
      user={user}
    />
  )

  const element = screen.findByText('Component testing')
  expect(element).toBeDefined()
})
