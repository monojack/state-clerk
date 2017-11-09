import invariant from 'invariant'
import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'

import { validateCollection, } from './utils'

// POST
function postToObject (collection, payload, key) {
  invariant(!isNil(payload), `You forgot to specify the payload`)

  invariant(
    !isNil(key),
    `You are trying to post to a collection object but haven't specified an identifier. Try again with "clerk.post('${collection}', payload, identifier)"`
  )
  this[collection] = {
    ...(this[collection] || {}),
    [key]: payload,
  }
  return payload
}

function postToArray (collection, payload) {
  this[collection] = [ ...(this[collection] || []), payload, ]
  return payload
}

function post (state) {
  return function postState (collection, payload, key) {
    const col = this[collection]

    validateCollection(col, collection)

    if (isArray(col)) {
      return postToArray.call(this, collection, payload)
    }

    return postToObject.call(this, collection, payload, key)
  }
}

export default function (state) {
  return post(state)
}
