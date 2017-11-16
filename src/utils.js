import invariant from 'invariant'
import isNil from 'ramda/src/isNil'
import isEmpty from 'ramda/src/isEmpty'
import compose from 'ramda/src/compose'
import typeOf from 'ramda/src/type'
import equals from 'ramda/src/equals'

export const isNilOrEmpty = value => isNil(value) || isEmpty(value)

const isType = type => compose(equals(type), typeOf)

export const isArray = isType('Array')

export const isObject = isType('Object')

export const isPlainObject = isType('Object')

export const validateCollection = (col, collection) => {
  invariant(
    !isNil(col),
    `The "${
      collection
    }" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('${
      collection
    }'))`
  )

  invariant(
    typeof col === 'object',
    `"${
      collection
    }" is not a collection. You can access it like any other property on the state object`
  )
}
