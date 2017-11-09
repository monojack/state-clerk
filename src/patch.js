import invariant from 'invariant'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import merge from 'lodash/merge'
import isNil from 'lodash/isNil'

import { validateCollection, } from './utils'

// PATCH
function patchInObject (collection, payload, key) {
  invariant(
    !isNil(key),
    `You are trying to update a resource but haven't specified the identifier. Try again with "clerk.put('${collection}', payload, identifier)"`
  )

  if (isNil(this[collection][key])) return

  this[collection] = {
    ...(this[collection] || {}),
    [key]: merge(this[collection[key]], payload),
  }
  return payload
}

function patchInArray (collection, payload, key) {
  invariant(
    isObject(key),
    'When patching a resource inside a list you have to specify an identifier object containing the key/value pair you want to match.'
  )

  const [ k, v, ] = Object.entries(key)[0]
  const idx = this[collection].findIndex(item => item[k] === v)

  if (idx < 0) return

  const resource = { ...(this[collection][idx] || {}), ...payload, }
  this[collection] = [
    ...this[collection].slice(0, idx),
    resource,
    ...this[collection].slice(idx + 1),
  ]

  return resource
}

function patch (state) {
  return function patchState (collection, payload, key) {
    const col = this[collection]

    validateCollection(col, collection)

    invariant(
      !isNil(key),
      `You are trying to patch a resource but haven't specified the identifier. Try again with "clerk.patch('${collection}', payload, key)"`
    )

    if (isArray(col)) {
      return patchInArray.call(this, collection, payload, key)
    }

    return patchInObject.call(this, collection, payload, key)
  }
}

export default function (state) {
  return patch(state)
}
