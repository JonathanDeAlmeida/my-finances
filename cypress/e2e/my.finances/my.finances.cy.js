/// <reference types="cypress" />

describe('my.finance app', () => {

    beforeEach(() => {
      cy.visit('https://my-finances-online.netlify.app/')
    })

    it('inbound transaction', () => {
      cy.get('#main-tbody tr').should('have.length', 0)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste de entrada')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(55.50)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('1')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 1)
    })

    it('outbound transaction', () => {
      cy.get('#main-tbody tr').should('have.length', 0)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste de saida')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(10.25)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('2')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 1)
    })

    it('inbound and outbound transactions', () => {
      cy.get('#main-tbody tr').should('have.length', 0)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste dois de entrada')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(120.50)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('1')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 1)

      cy.get('#main-tbody tr').should('have.length', 1)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste dois de saida')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(15.25)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('2')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 2)
    })

    it('remove inbound and outbound transactions', () => {
      cy.get('#main-tbody tr').should('have.length', 0)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste tres de entrada')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(120.50)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('1')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 1)

      cy.get('#main-tbody tr').should('have.length', 1)
      cy.get('.btn-add button').click()
      cy.get('[name=description]').type('teste tres de saida')
      cy.get('.btn-add button').click()
      cy.get('[name=value]').type(15.25)
      cy.get('.btn-add button').click()
      cy.get('[name=date]').type('2023-05-15')
      cy.get('select').select('2')
      cy.get('.btn-add button').click()
      cy.get('#main-tbody tr').should('have.length', 2)

      cy.contains('teste tres de entrada').parent().find('#remove-transaction').click()
      cy.get('#main-tbody tr').should('have.length', 1)
      cy.contains('teste tres de saida').parent().find('#remove-transaction').click()
      cy.get('#main-tbody tr').should('have.length', 0)
    })
})
  