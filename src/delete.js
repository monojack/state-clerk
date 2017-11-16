import isNil from 'ramda/src/isNil'
import omit from 'ramda/src/omit'

import { validateCollection, isArray, isPlainObject, } from './utils'

function removeFromObject (collection, key) {
  const resource = this[collection][key]
  if (isNil(resource)) return

  this[collection] = omit([ key, ], this[collection])
  return resource
}

function removeFromArray (collection, key) {
  if (!isPlainObject(key)) return

  const [ k, v, ] = Object.entries(key)[0]

  const idx = this[collection].findIndex(item => item[k] === v)
  if (idx < 0) return

  const resource = this[collection][idx]
  this[collection] = [
    ...this[collection].slice(0, idx),
    ...this[collection].slice(idx + 1),
  ]

  return resource
}

function remove (state) {
  return function removeState (collection, key) {
    if (isNil(key)) return

    const col = this[collection]

    validateCollection(col, collection)

    if (isArray(col)) {
      return removeFromArray.call(this, collection, key)
    }

    return removeFromObject.call(this, collection, key)
  }
}

export default function (state) {
  return remove(state)
}
