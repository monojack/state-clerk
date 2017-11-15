import invariant from 'invariant'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isNil from 'lodash/isNil'

import { validateCollection, } from './utils'

// PUT
function putInObject (collection, payload, key) {
  invariant(
    !isNil(key),
    `You are trying to update a resource but haven't specified the identifier. Try again with "clerk.put('${collection}', payload, identifier)"`
  )

  this[collection] = {
    ...(this[collection] || {}),
    [key]: payload,
  }

  return payload
}

function putInArray (collection, payload, key) {
  if (isNil(key)) {
    this[collection] = [ ...this[collection], payload, ]
    return payload
  }

  invariant(
    isPlainObject(key),
    'When updating a resource inside a list you have to specify an identifier object containing the key/value pair you want to match.'
  )

  const [ k, v, ] = Object.entries(key)[0]
  const idx = this[collection].findIndex(item => item[k] === v)

  this[collection] = [
    ...this[collection].slice(0, idx),
    payload,
    ...this[collection].slice(idx + 1),
  ]
  return payload
}

function put (state) {
  return function putState (collection, payload, key) {
    const col = this[collection]

    validateCollection(col, collection)

    if (isArray(col)) {
      return putInArray.call(this, collection, payload, key)
    }

    return putInObject.call(this, collection, payload, key)
  }
}

export default function (state) {
  return put(state)
}
