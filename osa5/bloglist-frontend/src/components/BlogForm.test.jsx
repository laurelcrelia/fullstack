import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Component testing',
  author: 'Test User',
  url: 'https://test.com',
  user: { name: 'Test User' },
  likes: 0,
}

const testUser = 'Test User'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const mockHandler = vi.fn()
  const { container } = render(<BlogForm createBlog={mockHandler} />)

  const user = userEvent.setup()

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(sendButton)

  console.log(mockHandler.mock.calls)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe(blog.title)
  expect(mockHandler.mock.calls[0][0].author).toBe(blog.author)
  expect(mockHandler.mock.calls[0][0].url).toBe(blog.url)
})
