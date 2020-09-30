import React, { createContext } from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('<BlogForm /> calls createBlog with the correct parameters.', () => {
    const createBlog = jest.fn()

    const component = render(<BlogForm createBlog={createBlog} />)

    component.debug()
    const form = component.container.querySelector('form')

    const titleInput = component.container.querySelector('#title')
    fireEvent.change(titleInput, {
      target: { value: 'Title' }
    })
    const authorInput = component.container.querySelector('#author')
    fireEvent.change(authorInput, {
      target: { value: 'Author' }
    })
    const urlInput = component.container.querySelector('#url')
    fireEvent.change(urlInput, {
      target: { value: 'URL' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Title')
    expect(createBlog.mock.calls[0][0].author).toBe('Author')
    expect(createBlog.mock.calls[0][0].url).toBe('URL')

    console.log(createBlog.mock.calls[0][0])
  })
})
