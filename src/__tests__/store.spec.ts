import { Store } from '../../dist/micro-birdge'

describe('Test Store', () => {
  it('get/set', () => {
    // empty get
    expect(Store.get('123')).toBe(undefined)

    // set/get test
    const [key, value] = ['a.b.c', 123]
    Store.set(key, value)
    expect(Store.get(key)).toBe(value)
  })

  it('scope get/set', () => {
    // empty get
    const scope = 'a'
    expect(Store.getWithScope('123', scope)).toBe(undefined)

    // set/get test
    const [key, value] = ['a.b.c', 123]
    Store.setWithScope(key, value, scope)
    expect(Store.getWithScope(key, scope)).toBe(value)
  })
})
