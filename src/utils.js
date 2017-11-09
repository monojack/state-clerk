import invariant from 'invariant'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'

export const isNilOrEmpty = value => isNil(value) || isEmpty(value)

export const validateCollection = (col, collection) => {
  invariant(
    !isNil(col),
    `The "${collection}" collection does not exist. You can create one using your clerk instance by running(clerk.addCollection('${collection}'))`
  )

  invariant(
    isObject(col),
    `"${collection}" is not a collection. You can access it like any other property on the state object`
  )
}
