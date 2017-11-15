import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isNil from 'lodash/isNil'
import omit from 'lodash/omit'

import { validateCollection, } from './utils'

function removeFromObject (collection, key) {
  const resource = this[collection][key]
  if (isNil(resource)) return

  this[collection] = omit(this[collection], key)
  return resource
}

function removeFromArray (collection, key) {
  if (!isPlainObject(key)) return

  const [ k, v, ] = Object.entries(key)[0]

  const idx = this[collection].findIndex(item => item[k] === v)
  if (idx < 0) return

  const resource = this[collection][idx]
  this[collection] = [ ...this[collection].slice(0, idx), ...this[collection].slice(idx + 1), ]

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
