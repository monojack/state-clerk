import { default as get, } from './get'
import { default as post, } from './post'
import { default as put, } from './put'
import { default as patch, } from './patch'
import { default as remove, } from './delete'

export default class Clerk {
  constructor (state) {
    this.state = state
    this.get = get(state).bind(state)
    this.post = post(state).bind(state)
    this.put = put(state).bind(state)
    this.patch = patch(state).bind(state)
    this.delete = remove(state).bind(state)
  }

  getCollection (collection) {
    return this.state[collection]
  }

  addCollection (collection, Type = Object) {
    this.state[collection] = new Type()
    return this.state[collection]
  }

  removeCollection (collection) {
    const col = this.state[collection]
    col != null && delete this.state[collection]
    return col
  }
}
