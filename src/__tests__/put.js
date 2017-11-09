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
  size: false,
}

const clerk = new Clerk(state)

const noCollectionFn = () => {
  try {
    clerk.put('users', {})
  } catch (e) {
    throw e
  }
}

const noIdentifier = () => {
  try {
    clerk.put('todos')
  } catch (e) {
    throw e
  }
}

const noObjectIdentifier = () => {
  try {
    clerk.put('lists', newListReplacement, 'a')
  } catch (e) {
    throw e
  }
}

const noObjectFn = () => {
  try {
    clerk.put('size')
  } catch (e) {
    throw e
  }
}

const newTodo = { _id: 'c', label: 'Git gud!', }
const newList = { id: 'z', name: 'Learn', todos: [ 'c', ], }
const newTodoReplacement = { _id: 'd', label: 'Foo', completed: true, }
const newListReplacement = { id: 'w', name: 'Bar', }

/**
 * 1. It throws if the specified collection doesn't exist or it's not a collection.
 *
 * For collection objects:
 * 1. It throws when trying to update a resource without specifying an identifier.
 * 2. It creates and returns the resource if no match found.
 * 3. It replaces an existing resource and returns the new data.
 *
 * For collection arrays:
 * 1. It throws if the identifier is not an object.
 * 2. It creates and returns the resource if no identifier provided.
 * 3. It creates and returns the resource if no match found.
 * 4. It replaces an existing resource and returns the new data.
 */

describe('put', () => {
  test("It throws if the specified collection doesn't exist or it's not a collection.", () => {
    expect(noCollectionFn).to.throw('The "users" collection does not exist')
    expect(noObjectFn).to.throw(
      '"size" is not a collection. You can access it like any other property on the state object'
    )
  })
})

describe('put in collection object', () => {
  test('It throws when trying to put a resource without specifying an identifier', () => {
    expect(noIdentifier).to.throw(
      "You are trying to update a resource but haven't specified the identifier."
    )
  })

  test('It creates and returns the resource if no match found', () => {
    expect(clerk.put('todos', newTodo, 'c')).to.equal(newTodo)
    expect(state.todos).to.have.own.property('c')
    expect(state.todos.c).to.equal(newTodo)
  })

  test('It replaces an existing resource and returns the new data', () => {
    expect(clerk.put('todos', newTodoReplacement, 'c')).to.equal(newTodoReplacement)
    expect(state.todos).to.have.own.property('c')
    expect(state.todos.c).to.not.equal(newTodo)
    expect(state.todos.c).to.equal(newTodoReplacement)
  })
})

describe('put in collection array', () => {
  test('It throws if the identifier is not an object', () => {
    expect(noObjectIdentifier).to.throw(
      'When updating a resource inside a list you have to specify an identifier object'
    )
  })

  test('It creates and returns the resource if no identifier provided', () => {
    expect(clerk.put('lists', newList)).to.equal(newList)
    expect(state.lists).to.have.length(3)
    expect(state.lists).to.include(newList)
  })

  test('It creates and returns the resource if no match found', () => {
    const fooList = { name: 'foo', }
    expect(clerk.put('lists', fooList)).to.equal(fooList)
    expect(state.lists).to.have.length(4)
    expect(state.lists).to.include(fooList)
    expect(state.lists).to.include(newList)
  })

  test('It replaces an existing resource and returns the new data.', () => {
    expect(clerk.put('lists', newListReplacement, { id: 'z', })).to.equal(newListReplacement)
    expect(state.lists).to.have.length(4)
    expect(state.lists).to.not.include(newList)
    expect(state.lists).to.include(newListReplacement)
  })
})
