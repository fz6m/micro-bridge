import { StoreChange, Store } from '../../dist/micro-bridge'
import { __VALUE_SUBSCRIBE_SCOPE__, __MOUNT_PROPERTY__ } from '../constants'
import { getScope } from '../store/scope'

beforeEach(() => {
  window[__MOUNT_PROPERTY__] = {}
})

describe('Test Store Change', () => {
  it('on/delete/destory', () => {
    const key = 'a'
    const onChange = (newValue: any, oldValue: any) => {}
    StoreChange.$on(key, onChange)

    const store = window[__MOUNT_PROPERTY__]
    const subObj = store[getScope(__VALUE_SUBSCRIBE_SCOPE__)]
    // add one func
    let arr = subObj[key]
    expect(arr.length).toBe(1)

    // can not repeat add
    StoreChange.$on(key, onChange)
    arr = subObj[key]
    expect(arr.length).toBe(1)

    // add two func
    let changingValue = null
    let calledCount = 0
    const onChange2 = (newValue: any, oldValue: any) => {
      calledCount++
      changingValue = newValue
    }
    StoreChange.$on(key, onChange2)
    arr = subObj[key]
    expect(arr.length).toBe(2)

    // change value
    const newValue = 'new value'
    Store.set(key, newValue)
    // set equal value
    Store.set(key, newValue)
    expect(calledCount).toBe(1)
    expect(changingValue).toBe(newValue)

    // delete change2 func
    StoreChange.$delete(key, onChange2)
    arr = subObj[key]
    expect(arr.length).toBe(1)
    expect(arr[0]).toBe(onChange)

    // destory
    StoreChange.$destory(key)
    arr = subObj[key]
    expect(arr.length).toBe(0)
  })

  it('hide internal key', () => {
    const key = 'a'
    StoreChange.$on(key, () => {})

    const publickStore = Store.getStore()
    const store = window[__MOUNT_PROPERTY__]
    const subObj = store[getScope(__VALUE_SUBSCRIBE_SCOPE__)]

    expect(publickStore).toEqual({})
    expect(subObj[key].length).toBe(1)
  })

  it('monitor all value change', () => {
    let expectValue = null
    let calledCounts = 0
    const onChange = (newStore: any) => {
      calledCounts++
      expectValue = newStore
    }

    expect(Store.getStore()).toEqual({})

    StoreChange.$on(onChange)

    // change value
    const key = 'a'
    const value = 123
    Store.set(key, value)
    Store.set(key, value)
    expect(expectValue).toEqual({
      [key]: value,
    })
    // not repeat call
    expect(calledCounts).toBe(1)
  })
})
