import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author, but doesn\'t show url or likes by default', () => {
    const blog = {
        title: 'Testing React Components is Fun',
        author: 'Wayne',
        url: 'https://fullstackopen.com/part5/testing_react_applications',
        likes: 10
    }
    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.blog-details')

    const titleAndAuthor = screen.getByText('Testing React Components is Fun - Wayne')
    expect(titleAndAuthor).toBeDefined()

    const url = screen.queryByText('https://fullstackopen.com/part5/testing_react_applications')
    expect(url).toBeNull()

    const likes = screen.queryByText('like')
    expect(likes).toBeNull()

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).toBeNull()
    //screen.debug()
})

test('clicking the view button displays url and number of likes', async () => {
    const blog = {
        title: 'Testing React Components is Fun',
        author: 'Wayne',
        url: 'https://fullstackopen.com/part5/testing_react_applications',
        likes: 10
    }
    render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const url = screen.getByText('https://fullstackopen.com/part5/testing_react_applications', { exact: false })
    expect(url).toBeDefined()
    const likes = screen.getByText('like', { exact: false })
    expect(likes).toBeDefined()
    //screen.debug()
})

test('if the click button is clicked twice, the event handler is called twice', async () => {
    const blog = {
        title: 'Testing React Components is Fun',
        author: 'Wayne',
        url: 'https://fullstackopen.com/part5/testing_react_applications',
        likes: 10
    }
    const mockHandler = vi.fn()
    render(<Blog blog={blog} addLike={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
    //screen.debug()
})

