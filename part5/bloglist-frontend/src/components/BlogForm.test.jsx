import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls onSubmit with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={createBlog} />)
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'Testing React Components is Fun')
    await user.type(inputs[1], 'Wayne')
    await user.type(inputs[2], 'https://fullstackopen.com/part5/testing_react_applications')
    const submitButton = screen.getByText('create')
    await user.click(submitButton)
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Testing React Components is Fun',
        author: 'Wayne',
        url: 'https://fullstackopen.com/part5/testing_react_applications'
    })
    screen.debug()
})