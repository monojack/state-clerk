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
  size: Symbol('foo'),
}

const clerk = new Clerk(state)

const noCollectionFn = () => {
  try {
    clerk.patch('users', {})
  } catch (e) {
    throw e
  }
}

const noIdentifierObjectCollectionFn = () => {
  try {
    clerk.patch('todos', {})
  } catch (e) {
    throw e
  }
}

const noIdentifierArrayCollectionFn = () => {
  try {
    clerk.patch('lists', {})
  } catch (e) {
    throw e
  }
}

const noObjectIdentifier = () => {
  try {
    clerk.patch('lists', { name: 'foo', }, 'a')
  } catch (e) {
    throw e
  }
}

const noObjectFn = () => {
  try {
    clerk.patch('size')
  } catch (e) {
    throw e
  }
}

const newTodo = { label: 'Git gud!', }
const newList = { todos: [ 'b', ], }

/**
 * 1. It throws if the specified collection doesn't exist or it's not a collection.
 * 2. It throws if no identifier provided.
 * 3. It returns undefined if no match found.
 *
 *  For collection objects:
 * 1. It partially updates an existing resource and returns it.
 *
 * For collection arrays:
 * 1. It throws if the identifier is not an object.
 * 2. It partially updates an existing resource and returns it.
 */
describe('patch', () => {
  test("It throws if the specified collection doesn't exist or it's not a collection", () => {
    expect(noCollectionFn).to.throw('The "users" collection does not exist')
    expect(noObjectFn).to.throw(
      '"size" is not a collection. You can access it like any other property on the state object'
    )
  })

  test('It throws if no identifier provided', () => {
    expect(noIdentifierObjectCollectionFn).to.throw(
      "You are trying to patch a resource but haven't specified the identifier."
    )
    expect(noIdentifierArrayCollectionFn).to.throw(
      "You are trying to patch a resource but haven't specified the identifier."
    )
  })

  test('It returns undefined if no match found', () => {
    expect(clerk.patch('todos', newTodo, 'q')).to.be.undefined
    expect(clerk.patch('lists', newList, { id: 'q', })).to.be.undefined
  })
})

describe('patch in collection object', () => {
  test('It partially updates an existing resource', () => {
    expect(clerk.patch('todos', newTodo, 'b')).to.deep.equal({
      _id: 'b',
      label: 'Git gud!',
      completed: true,
    })
    expect(Object.values(state.todos)).to.have.length(2)
  })
})

describe('patch in collection array', () => {
  test('It throws if the identifier is not an object', () => {
    expect(noObjectIdentifier).to.throw(
      'When patching a resource inside a list you have to specify an identifier object'
    )
  })

  test('It partially updates an existing resource', () => {
    expect(clerk.patch('lists', newList, { id: 'x', })).to.deep.equal({
      id: 'x',
      name: 'Shopping',
      todos: [ 'b', ],
    })
    expect(state.lists).to.have.length(2)
  })
})
