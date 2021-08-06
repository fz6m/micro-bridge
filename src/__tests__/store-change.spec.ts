import { StoreChange, Store } from '../../dist/micro-birdge'

describe('Test Store Change', () => {
  it('on/delete/destory', () => {
    const key = 'a'
    const onChange = (newValue: any, oldValue: any) => {}
    StoreChange.$on(key, onChange)

    // add one func
    const store = Store.getStore()
    const subObj = store[`_$value_subscribe`]
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
})
