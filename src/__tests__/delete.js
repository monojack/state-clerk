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
    [{}]: {
      _id: {},
      label: 'Learn Blips',
      completed: true,
    },
  },
  lists: [
    {
      id: 'x',
      name: 'Shopping',
      todos: [ 'a', ],
    },
    {
      id: 'y',
      name: 'Dev',
      todos: [ 'b', ],
    },
  ],
  size: '',
}

const clerk = new Clerk(state)

const noCollectionFn = () => {
  try {
    clerk.delete('users', {})
  } catch (e) {
    throw e
  }
}

const noObjectFn = () => {
  try {
    clerk.delete('size', 'a')
  } catch (e) {
    throw e
  }
}

/**
 * 1. It throws if the specified collection doesn't exist or it's not a collection.
 * 2. It returns undefined and doesn't remove anything if no identifier provided.
 * 3. It returns undefined and doesn't remove anything if no match found.
 *
 *  For collection objects:
 * 1. It removes the matching resource from the collection
 *
 * For collection arrays:
 * 1. It returns undefined and doesn't remove anything if identifier is not an object
 * 2. It removes the matching resource from the collection
 */
describe('delete', () => {
  test("It throws if the specified collection doesn't exist or it's not a collection.", () => {
    expect(noCollectionFn).to.throw('The "users" collection does not exist')
    expect(noObjectFn).to.throw(
      '"size" is not a collection. You can access it like any other property on the state object'
    )
  })

  test("It returns undefined and doesn't remove anything if no identifier provided", () => {
    // collection object
    expect(Object.values(state.todos)).to.have.length(3)
    expect(clerk.delete('todos')).to.be.undefined
    expect(Object.values(state.todos)).to.have.length(3)

    expect(state.lists).to.have.length(2)
    expect(clerk.delete('lists')).to.be.undefined
    expect(state.lists).to.have.length(2)
  })

  test("It returns undefined and doesn't remove anything if no match found", () => {
    expect(Object.values(state.todos)).to.have.length(3)
    expect(clerk.delete('todos', 'c')).to.be.undefined
    expect(Object.values(state.todos)).to.have.length(3)

    expect(state.lists).to.have.length(2)
    expect(clerk.delete('lists', { foo: 'bar', })).to.be.undefined
    expect(state.lists).to.have.length(2)
  })
})

describe('delete from collection object', () => {
  test('It removes the matching resource from the collection', () => {
    expect(Object.values(state.todos)).to.have.length(3)

    const todoA = state.todos.a
    expect(clerk.delete('todos', 'a')).to.equal(todoA)
    expect(state.todos).to.not.include(todoA)
    expect(Object.values(state.todos)).to.have.length(2)

    const todoB = state.todos.b
    expect(clerk.delete('todos', 'b')).to.equal(todoB)
    expect(state.todos).to.not.include(todoB)
    expect(Object.values(state.todos)).to.have.length(1)

    const todoC = state.todos[{}]
    expect(clerk.delete('todos', {})).to.equal(todoC)
    expect(Object.values(state.todos)).to.have.length(0)
  })
})

// * 1. It returns undefined and doesn't remove anything if identifier is not an object
// * 2. It removes the matching resource from the collection
describe('delete from collection array', () => {
  test("It returns undefined and doesn't remove anything if identifier is not an object", () => {
    expect(clerk.delete('lists', 'y')).to.be.undefined
  })

  test('It removes the matching resource from the collection', () => {
    expect(state.lists).to.have.length(2)

    const list0 = state.lists[0]
    expect(clerk.delete('lists', { id: 'x', })).to.equal(list0)
    expect(state.lists).to.not.include(list0)
    expect(state.lists).to.have.length(1)

    const list1 = state.lists[0]
    expect(clerk.delete('lists', { id: 'y', })).to.equal(list1)
    expect(state.lists).to.not.include(list1)
    expect(state.lists).to.have.length(0)
  })
})
