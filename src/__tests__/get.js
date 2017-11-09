/* eslint-disable no-unused-expressions */

import { expect, } from 'chai'
import Clerk from '../'

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
    c: {
      _id: 'c',
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
    {
      id: 'z',
      name: 'Dev',
      todos: [ 'c', ],
    },
  ],
  size: 3,
}

const clerk = new Clerk(state)

const noCollectionFn = () => {
  try {
    clerk.get('users', {})
  } catch (e) {
    throw e
  }
}

const noObjectFn = () => {
  try {
    clerk.get('size')
  } catch (e) {
    throw e
  }
}

/**
 * 1. It throws if the specified collection doesn't exist or it's not a collection.
 * 2. It returns the entire collection if identifier is null or undefined.
 *
 * For collection objects:
 * 1. It returns the resource found at the specified key (identifier).
 * 2. It returns an object of resources that have a matching key/value pair with the one of the identifier object (e.g.: { completed: true }).
 * 3. It returns undefined if no resource found with the provided identifier.
 *
 * For collection arrays:
 * 1. It returns a list of resources that have a matching key/value pair with the one of the identifier object (e.g.: { completed: true }).
 * 2. It returns an empty list if identifier is not an object.
 * 3. It returns an empty list if no resource found with the provided identifier.
 */

describe('get', () => {
  test('It throws if the specified collection doesn`t exist or it`s not a collection', () => {
    expect(noCollectionFn).to.throw('The "users" collection does not exist.')
    expect(noObjectFn).to.throw(
      '"size" is not a collection. You can access it like any other property on the state object'
    )
  })

  test('It returns the entire collection if identifier is null or undefined', () => {
    expect(clerk.get('todos')).to.equal(state.todos)
    expect(clerk.get('lists')).to.equal(state.lists)
  })
})

describe('get from collection object', () => {
  test('It returns the resource found at the specified key (identifier)', () => {
    expect(clerk.get('todos', 'a')).to.equal(state.todos.a)
  })

  test('It returns a object of resources that have a matching key/value pair with the one of the identifier object', () => {
    expect(clerk.get('todos', { completed: true, })).to.deep.equal({
      b: state.todos.b,
      c: state.todos.c,
    })

    expect(clerk.get('todos', { completed: false, })).to.deep.equal({
      a: state.todos.a,
    })
  })

  test('It returns undefined if no resource found with the provided identifier', () => {
    expect(clerk.get('todos', 'd')).to.be.undefined
  })
})

describe('get from collection array', () => {
  test('It returns a list of resources that have a matching key/value pair with the one of the identifier object', () => {
    expect(clerk.get('lists', { name: 'Shopping', })).to.deep.equal([ state.lists[0], ])
    expect(clerk.get('lists', { name: 'Dev', })).to.deep.equal([ state.lists[1], state.lists[2], ])
  })

  test('It returns an empty list if identifier is not an object', () => {
    expect(clerk.get('lists', 'y')).to.deep.equal([])
  })

  test('It returns an empty list if no resource found with the provided identifier', () => {
    expect(clerk.get('lists', { name: 'Groceries', })).to.deep.equal([])
  })
})
