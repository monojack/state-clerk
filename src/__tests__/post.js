/* eslint-disable no-unused-expressions */

const { expect, } = require('chai')
const Clerk = require('..').default

const buyMilkTodo = {
  _id: 'a',
  label: 'Buy milk',
  completed: false,
}

const useClerkTodo = {
  _id: 'b',
  label: 'Use state-clerk',
  completed: true,
}

const shoppingList = {
  id: 'x',
  name: 'Shopping',
  todos: [ 'a', ],
}

const devList = {
  id: 'y',
  name: 'Dev',
  todos: [ 'b', ],
}

const state = {
  todos: {},
  lists: [],
  label: 'foo',
}

const clerk = new Clerk(state)

const noCollectionFn = () => {
  try {
    clerk.post('users', buyMilkTodo)
  } catch (e) {
    throw e
  }
}

const noPayloadFn = () => {
  try {
    clerk.post('todos')
  } catch (e) {
    throw e
  }
}

const noIdentifierFn = () => {
  try {
    clerk.post('todos', buyMilkTodo)
  } catch (e) {
    throw e
  }
}

const noObjectFn = () => {
  try {
    clerk.post('label')
  } catch (e) {
    throw e
  }
}

/**
 * 1. It throws if the specified collection doesn't exist or it's not a collection.
 * 2. It throws if not providing a payload.
 *
 * For collection objects:
 * 1. It throws if trying to post to a collection object without specifying an identifier.
 * 2. It adds to the collection at the specified identifier and returns the new resource.
 * 3. It adds the resource for any type of identifier.
 *
 * For collection arrays:
 * 1. It adds the resource without the need of an identifier.
 */

describe('post', () => {
  test("It throws if the specified collection doesn't exist or it's not a collection", () => {
    expect(noCollectionFn).to.throw('The "users" collection does not exist')
    expect(noObjectFn).to.throw(
      '"label" is not a collection. You can access it like any other property on the state object'
    )
  })

  test('It throws if not providing a payload', () => {
    expect(noPayloadFn).to.throw('You forgot to specify the payload')
  })
})

describe('post to collection object', () => {
  test('It throws if trying to post to a collection object without specifying an identifier', () => {
    expect(noIdentifierFn).to.throw(
      "You are trying to post to a collection object but haven't specified an identifier"
    )
  })

  test('It correctly adds the provided payload to a collection object under the specified key', () => {
    expect(clerk.post('todos', buyMilkTodo, buyMilkTodo._id)).to.equal(buyMilkTodo)
    expect(Object.values(state.todos)).to.have.length(1)
    expect(state.todos).to.have.own.property(buyMilkTodo._id)
    expect(state.todos).to.include({ [buyMilkTodo._id]: buyMilkTodo, })
  })

  test('It adds the resource for any type of identifier', () => {
    expect(clerk.post('todos', useClerkTodo, {})).to.equal(useClerkTodo)
    expect(Object.values(state.todos)).to.have.length(2)
    expect(state.todos).to.have.own.property({})
    expect(state.todos).to.include({ [{}]: useClerkTodo, })
  })
})

describe('post to collection array', () => {
  test('It adds the resource without the need of an identifier', () => {
    expect(clerk.post('lists', shoppingList)).to.equal(shoppingList)
    expect(state.lists).to.have.length(1)
    expect(state.lists).to.include(shoppingList)

    expect(clerk.post('lists', devList)).to.equal(devList)
    expect(state.lists).to.have.length(2)
    expect(state.lists).to.include(shoppingList)
  })
})
