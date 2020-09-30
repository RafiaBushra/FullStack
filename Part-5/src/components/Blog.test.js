import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component

  beforeEach(() => {
    const blog = {
      title: 'Title',
      author: 'Author',
      url: `url.com`,
      likes: 0,
      user: {
        name: 'Tester',
        username: 'tester',
        id: 'tester'
      }
    }

    component = render(
      <Blog blog={blog}
        currentUser={{
          name: 'Tester',
          username: 'tester',
          id: 'tester'
        }}
      />
    )

  })

  test('renders only blog title and author by default.', () => {
    component.debug()

    expect(
      component.container.querySelector('.blog')
    ).toBeDefined()
    expect(
      component.container.querySelector('.visible')
    ).toHaveStyle('display: none')
  })

  test('renders more info when view button is pressed.', () => {
    const viewButton = component.getByText('View')
    fireEvent.click(viewButton)

    const div = component.container.querySelector('.visible')
    expect(div).not.toHaveStyle('display: none')
  })
})

test('Clicking the like button twice calls event handler twice.', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: `url.com`,
    likes: 0,
    user: {
      name: 'Tester',
      username: 'tester',
      id: 'tester'
    }
  }

  const mockHandler = jest.fn()
  const component = render(
    <Blog
      blog={blog}
      currentUser={{
        name: 'Tester',
        username: 'tester',
        id: 'tester'
      }}
      addLikes={mockHandler}
    />
  )

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
