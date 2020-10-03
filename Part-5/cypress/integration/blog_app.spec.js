describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown.', function () {
    cy.contains('Login').click()
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials.', function () {
      cy.contains('Login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials.', function () {
      cy.contains('Login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(250, 177, 177)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a blog can be created.', function () {
      cy.contains('New entry').click()
      cy.get('#title').type('Test blog')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('cypress.io')
      cy.get('#createButton').click()
      cy.contains('Test blog by Cypress')
      cy.get('.success')
        .should('contain', 'A new blog entry for Test blog by Cypress added!')
        .and('have.css', 'color', 'rgb(138, 170, 49)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'First', author: 'Author 1', url: 'first.com' })
        cy.createBlog({ title: 'Second', author: 'Author 2', url: 'second.fi' })
        cy.createBlog({ title: 'Third', author: 'Author 3', url: 'third.com' })
      })

      it('user can add likes.', function () {
        cy.contains('Second by Author 2')
          .contains('View')
          .click()
        cy.contains('Second by Author 2')
          .contains('Like')
          .click()

        cy.contains('Second by Author 2')
          .contains('Likes:')
          .contains('1')
        cy.get('.success')
          .should('contain', 'Updated likes for Second!')
          .and('have.css', 'color', 'rgb(138, 170, 49)')
          .and('have.css', 'border-style', 'solid')
      })

      it('user can remove their own entry.', function () {
        cy.contains('Third by Author 3')
          .contains('View')
          .click()

        cy.contains('Matti Luukkainen logged in.')
        cy.contains('Third by Author 3')
          .contains('Matti Luukkainen')
        cy.contains('Third by Author 3')
          .contains('Remove').click()
        cy.get('html').should('not.contain', 'Third by Author 3')
      })

      it('blogs are ordered by number of likes in descending order.', function () {
        cy.contains('Second by Author 2')
          .contains('View')
          .click()
        cy.contains('Second by Author 2')
          .contains('Like')
          .click()
        cy.contains('Second by Author 2')
          .contains('Like')
          .click()
        cy.contains('Second by Author 2')
          .contains('Like')
          .click()

        cy.contains('Third by Author 3')
          .contains('View')
          .click()
        cy.contains('Third by Author 3')
          .contains('Like')
          .click()

        cy.get('.blog')
          .should(($div) => {
            expect($div.eq(0)).to.contain('Second by Author 2')
            expect($div.eq(1)).to.contain('Third by Author 3')
            expect($div.eq(2)).to.contain('First by Author 1')
          })
      })
    })
  })
  describe('When another user logs in', function () {
    describe('and several blogs from another user exist', function () {
      beforeEach(function () {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({ title: 'First', author: 'Author 1', url: 'first.com' })
        cy.createBlog({ title: 'Second', author: 'Author 2', url: 'second.fi' })
        cy.createBlog({ title: 'Third', author: 'Author 3', url: 'third.com' })
        cy.contains('Log out').click()
        const user = {
          name: 'Superuser',
          username: 'root',
          password: 'sekret'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.login({ username: 'root', password: 'sekret' })

      })
      it(`user cannot remove someone else's entry.`, function () {
        cy.contains('Superuser logged in')
        cy.contains('Third by Author 3')
          .contains('View')
          .click()

        cy.contains('Third by Author 3')
          .contains('Matti Luukkainen')

        cy.get('Third by Author 3').should('not.contain', 'Remove')
      })
    })
  })
})