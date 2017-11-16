import isNil from 'ramda/src/isNil'

import { validateCollection, isArray, isPlainObject, } from './utils'

// GET
function getFromObject (collection, id) {
  if (isPlainObject(id)) {
    const entries = Object.entries(id)
    const [ key, value, ] = entries[0] || {}
    return Object.entries(collection)
      .filter(([ , resource, ]) => resource[key] === value)
      .reduce(
        (acc, [ k, v, ]) => ({
          ...acc,
          [k]: v,
        }),
        {}
      )
  }
  return collection[id]
}

function getFromArray (collection, id) {
  if (!isPlainObject(id)) return []

  const [ key, value, ] = Object.entries(id)[0]
  return collection.filter(resource => resource[key] === value)
}

function get (state) {
  return function getState (collection, id) {
    const col = this[collection]

    validateCollection(col, collection)

    if (isArray(col)) {
      return isNil(id) ? col : getFromArray(col, id)
    }
    return isNil(id) ? col : getFromObject(col, id)
  }
}

export default function (state) {
  return get(state)
}
