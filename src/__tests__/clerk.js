/* eslint-disable no-unused-expressions */

const { expect, } = require('chai')
const Clerk = require('..').default

const state = {
  todos: {
    a: {
      _id: 'a',
      label: 'Buy milk',
      completed: false,
    },
    b: {
      _id: 'b',
      label: 'Use state-clerk',
      completed: true,
    },
  },
}

const clerk = new Clerk(state)

describe('getCollection', () => {
  test('It return the specified collection', () => {
    expect(clerk.getCollection('todos')).to.equal(state.todos)
  })

  test('It returns undefined if no collection found', () => {
    expect(clerk.getCollection('lists')).to.be.undefined
  })
})

describe('addCollection', () => {
  test('It adds a new collection with the specified name and of the specified type', () => {
    !clerk.getCollection('lists') && clerk.addCollection('lists', Array)
    expect(state).to.have.own.property('lists')
    expect(state.lists).to.be.an('array')
  })

  test('It replaces any existing collection with the same name', () => {
    expect(state).to.have.own.property('todos')
    expect(state.todos).to.be.an('object')

    clerk.addCollection('todos', Array)
    expect(state).to.have.own.property('todos')
    expect(state.todos).to.be.an('array')
    expect(state.todos).to.deep.equal([])
  })

  test('If no type provided, the added collection will be an object', () => {
    clerk.addCollection('todos')
    expect(state).to.have.own.property('todos')
    expect(state.todos).to.be.an('object')
    expect(state.todos).to.deep.equal({})
  })
})

describe('removeCollection', () => {
  test('It removes a collection from the state', () => {
    const todos = state.todos
    expect(clerk.removeCollection('todos')).to.equal(todos)
    expect(state).to.not.have.own.property('todos')

    expect(clerk.removeCollection('users')).to.be.undefined
  })
})
