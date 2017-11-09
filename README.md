# State-Clerk

Perform immutable CRUD operation on your application state.

## Table of contents
  - [Installation](#installation)
  - [Creating an instance](#creating-an-instance)
  - [Methods](#methods)
    - [get](#get)
    - [post](#post)
    - [put](#put)
    - [patch](#patch)
    - [delete](#delete)
    - [getCollection](#getCollection)
    - [addCollection](#addCollection)
    - [removeCollection](#removeCollection)

### Installation
```bash
npm install state-clerk
```


### Creating an instance

Creating a clerk instance is straight-forward.

```js
import Clerk from 'state-clerk'

const clerk = new Clerk(state /* the state object */)
```

### Methods

The following mock data will be used in the examples:

```js
import Clerk from 'state-clerk'

const state = {
  todos: {
    a: {
      _id: 'a',
      label: 'Buy milk',
      completed: false
    },
    b: {
      _id: 'b',
      label: 'Use state-clerk',
      completed: true
    },
    c: {
      _id: 'c',
      label: 'Do stuff',
      completed: true
    }
  },
  lists: [
    {
      _id: 'x',
      name: 'Shopping',
      todos: ['a']
    },
    {
      _id: 'y',
      name: 'Dev',
      todos: ['b']
    },
    {
      _id: 'z',
      name: 'Random',
      todos: ['c']
    }
  ],
  foo: 'bar'
}

const clerk = new Clerk(state)
```

Throughout the examples we'll be referring to:
- `collection object`: a collection of type Object ({})
- `collection array`: a collection of type Array ([])
- `payload`: resource or data to be created/updated/patched
- `identifier`: a _string|number_ or an _object_ (`{ id: 1 }`) used to identify a specific resource.
  - _string|number_ would represent a key inside a collection object
  - _object_ is a _key/value_ pair used for matching a resource inside a collection array

The **Clerk** instance has the following API:

#### get

_`clerk.get(collection [, identifier])`_

- It throws if the specified collection doesn't exist or it's not a collection.
- It returns the entire collection if identifier is null or undefined.

For collection objects:
- It returns the resource found at the specified key (identifier).
- It returns an object of resources that have a matching key/value pair with the one of the identifier object (e.g.: `{ completed: true }`).
- It returns undefined if no resource found with the provided identifier.

For collection arrays:
- It returns a list of resources that have a matching key/value pair with the one of the identifier object (e.g.: { completed: true }).
- It returns an empty list if identifier is not an object.
- It returns an empty list if no resource found with the provided identifier.


```js

// Valid:

clerk.get('todos', 'a')
// Returns: { id: 'a', label: 'Buy milk', completed: false }

clerk.get('todos', { completed: true })
// Returns:
//  {
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }

clerk.get('todos')
// Returns:
//  {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }

clerk.get('lists', {name: 'Shopping'})
// Returns: [{ _id: 'x', name: 'Shopping', todos: ['a'] }]

clerk.get('lists', 'y'})
//  not a valid identifier for lists
// Returns: []

clerk.get('lists')
// Returns:
//  [
//    { _id: 'x', name: 'Shopping', todos: ['a'] },
//    { _id: 'y', name: 'Dev', todos: ['b'] },
//    { _id: 'z', name: 'Random', todos: ['c'] }
//  ]


// Invalid:

clerk.get('users')
// Throws: The "users" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('users'))

clerk.get('foo')
// Throws: "foo" is not a collection. You can access it like any other property on the state object

```

#### post

_`clerk.post(collection, payload [, identifier])`_

- It throws if the specified collection doesn't exist or it's not a collection.
- It throws if not providing a payload.

For collection objects:
- It throws if trying to post to a collection object without specifying an identifier.
- It adds to the collection at the specified identifier and returns the new resource.
- It adds the resource for any type of identifier.

For collection arrays:
- It adds the resource without the need of an identifier.

```js
// Valid:

clerk.post('todos', { label: 'Git gud!' }, 'd')
// Returns: { _id: 'd', label: 'Git gud!', completed: false }
//
// state.todos:
// {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true },
//    d: { _id: 'd', label: 'Git gud!' },
//  }

clerk.post('lists', { _id: 'w', name: 'Groceries' })
// Returns: { _id: 'w', name: 'Groceries' }
//
// state.lists:
//  [
//    { _id: 'x', name: 'Shopping', todos: ['a'] },
//    { _id: 'y', name: 'Dev', todos: ['b'] },
//    { _id: 'z', name: 'Random', todos: ['c'] },
//    { _id: 'w', name: 'Groceries' }
//  ]


// Invalid:

clerk.post('users')
// Throws: The "users" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('users'))

clerk.post('foo')
// Throws: "foo" is not a collection. You can access it like any other property on the state object

clerk.post('todos')
// Throws: You forgot to specify the payload

clerk.post('todos', {...})
// Throws: You are trying to post to a collection object but haven't specified an identifier. Try again with "clerk.post('todos', payload, identifier)"

```

#### put

_`clerk.put(collection, payload, identifier)`_

- It throws if the specified collection doesn't exist or it's not a collection.

For collection objects:
- It throws when trying to update a resource without specifying an identifier.
- It creates and returns the resource if no match found.
- It replaces an existing resource and returns the new data.

For collection arrays:
- It throws if the identifier is not an object.
- It creates and returns the resource if no identifier provided.
- It creates and returns the resource if no match found.
- It replaces an existing resource and returns the new data.

```js
// Valid:

clerk.put('todos', { label: 'Buy food', }, 'a')
// Returns: { id: 'a', label: 'Buy food' }
//
// state.todos:
// {
//    a: { label: 'Buy food' },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true },
//  }

clerk.put('list', { name: 'Foobar', }, { name: 'Random' })
// Returns: { name: 'Foobar' }
//
// state.lists:
//  [
//    { _id: 'x', name: 'Shopping', todos: ['a'] },
//    { _id: 'y', name: 'Dev', todos: ['b'] }
//    { name: 'Foobar' }
//  ]


// Invalid:

clerk.put('users')
// Throws: The "users" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('users'))

clerk.put('foo')
// Throws: "foo" is not a collection. You can access it like any other property on the state object

clerk.put('todos', {...})
// You are trying to update a resource but haven't specified the identifier. Try again with "clerk.put('todos', payload, identifier)"

clerk.put('lists', {...}, 'x')
// Throws: When updating a resource inside a list you have to specify an identifier object containing the key/value pair you want to match.

```

#### patch

_`clerk.patch(collection, payload, identifier)`_

- It throws if the specified collection doesn't exist or it's not a collection.
- It throws if no identifier provided.
- It returns undefined if no match found.

For collection objects:
- It partially updates an existing resource and returns it.

For collection arrays:
- It throws if the identifier is not an object.
- It partially updates an existing resource and returns it.

```js
// Valid:

clerk.patch('todos', { completed: true }, 'e')
// Returns: undefined
//
// state.todos:
// {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true },
//  }

clerk.patch('todos', { completed: true }, 'a')
// Returns: { _id: 'a', label: 'Buy milk', completed: true }
//
// state.todos:
// {
//    a: { _id: 'a', label: 'Buy milk', completed: true },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true },
//  }

clerk.patch('list', { name: 'Programming', }, { name: 'Dev' })
// Returns: { name: 'Foobar' }
//
// state.lists:
//  [
//    { _id: 'x', name: 'Shopping', todos: ['a'] },
//    { _id: 'y', name: 'Programming', todos: ['b'] },
//    { _id: 'z', name: 'Random', todos: ['c'] }
//  ]

// Invalid:

clerk.patch('users')
// Throws: The "users" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('users'))

clerk.patch('foo')
// Throws: "foo" is not a collection. You can access it like any other property on the state object

clerk.patch('todos', {...})
// You are trying to patch a resource but haven't specified the identifier. Try again with "clerk.patch('todos', payload, identifier)"

clerk.patch('lists', {...}, 'x')
// Throws: When patching a resource inside a list you have to specify an identifier object containing the key/value pair you want to match.

```

#### delete

_`clerk.delete(collection, identifier)`_

- It throws if the specified collection doesn't exist or it's not a collection.
- It returns undefined and doesn't remove anything if no identifier provided.
- It returns undefined and doesn't remove anything if no match found.

For collection objects:
- It removes the matching resource from the collection

For collection arrays:
- It returns undefined and doesn't remove anything if identifier is not an object
- It removes the matching resource from the collection

```js
// Valid:

clerk.delete('todos') || clerk.delete('todos', 'e')
// Returns: undefined
//
// state.todos:
//  {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }
//  
clerk.delete('todos', 'a')
// Returns: { _id: 'a', label: 'Buy milk', completed: false }
//
// state.todos:
//  {
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }

clerk.delete('lists') || clerk.delete('lists', { _id: 'w' }) || clerk.delete('lists', 'x')
// Returns: undefined
//
// state.lists
//  [
//    { _id: 'x', name: 'Shopping', todos: ['a'] },
//    { _id: 'y', name: 'Dev', todos: ['b'] },
//    { _id: 'z', name: 'Random', todos: ['c'] }
//  ]

clerk.delete('lists', { _id: 'x' })
// Returns: { _id: 'x', name: 'Shopping', todos: ['a'] }
//
// state.lists
//  [
//    { _id: 'y', name: 'Dev', todos: ['b'] },
//    { _id: 'z', name: 'Random', todos: ['c'] }
//  ]


// Invalid:

clerk.delete('users')
// Throws: The "users" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('users'))

clerk.delete('foo')
// Throws: "foo" is not a collection. You can access it like any other property on the state object
```

#### getCollection

_`clerk.getCollection(collectionName)`_

```js
clerk.getCollection('todos')
// Returns:
//  {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }

clerk.getCollection('users')
// Returns: undefined
```

#### addCollection

_`clerk.addCollection(collectionName [, type = Object])`_

```js
clerk.addCollection('users')
// state:
// {
//  todos: {...},
//  lists: [...],
//  foo: 'bar',
//  users: {},
// }

clerk.addCollection('comments', Array)
// state:
// {
//  todos: {...},
//  lists: [...],
//  foo: 'bar',
//  users: {},
//  comments: [],
// }
```

#### removeCollection

_`clerk.removeCollection(collectionName [, type = Object])`_

```js
clerk.removeCollection('todos')
// Returns:
//  {
//    a: { _id: 'a', label: 'Buy milk', completed: false },
//    b: { _id: 'b', label: 'Use state-clerk', completed: true },
//    c: { _id: 'c', label: 'Do stuff', completed: true }
//  }
//  
// state:
// {
//  lists: [...],
//  foo: 'bar'
// }

clerk.removeCollection('users')
// Returns: undefined
//
// state:
// {
//  todos: {...},
//  lists: [...],
//  foo: 'bar'
// }
```
