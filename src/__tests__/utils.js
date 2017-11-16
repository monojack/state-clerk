/* eslint-disable no-unused-expressions */

const utils = require('../utils')
const { expect, } = require('chai')

describe('removeUndefined', () => {
  test('It removes all keys with undefined value', () => {
    expect(utils.removeUndefined({ foo: 0, bar: undefined, })).to.deep.equal({
      foo: 0,
    })
  })
})

describe('isNilOrEmpty', () => {
  test('It returns true for empty array', () => {
    expect(utils.isNilOrEmpty([ 1, ])).to.be.false
    expect(utils.isNilOrEmpty([])).to.be.true
  })

  test('It returns true for empty object', () => {
    expect(utils.isNilOrEmpty({ a: 1, })).to.be.false
    expect(utils.isNilOrEmpty({})).to.be.true
  })

  test('It returns true only for null or undefined', () => {
    const foo = null
    const zero = 0
    const one = 1
    const string = 'string'
    const emptyString = 'string'
    const symbol = Symbol('foo')
    const fls = false
    const tru = true
    const undef = undefined
    let bar

    expect(utils.isNilOrEmpty(foo)).to.be.true
    expect(utils.isNilOrEmpty(bar)).to.be.true
    expect(utils.isNilOrEmpty(undef)).to.be.true
    expect(utils.isNilOrEmpty(fls)).to.be.false
    expect(utils.isNilOrEmpty(tru)).to.be.false
    expect(utils.isNilOrEmpty(zero)).to.be.false
    expect(utils.isNilOrEmpty(one)).to.be.false
    expect(utils.isNilOrEmpty(string)).to.be.false
    expect(utils.isNilOrEmpty(emptyString)).to.be.false
    expect(utils.isNilOrEmpty(symbol)).to.be.false
  })
})
