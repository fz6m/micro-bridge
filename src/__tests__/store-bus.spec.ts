import { StoreBus, Store } from '../../dist/micro-birdge'

describe('Test Store Bus', () => {
  it('on/off/emit/delete', () => {
    const key = 'a'
    const onChange = (value: any) => {}
    StoreBus.$on(key, onChange)

    // add one func
    const store = Store.getStore()
    const subObj = store[`_$subscribe`]
    let arr = subObj[key]
    expect(arr.length).toBe(1)

    // can not repeat add
    StoreBus.$on(key, onChange)
    arr = subObj[key]
    expect(arr.length).toBe(1)

    // add two func
    let changingValue = null
    const onChange2 = (value: any) => {
      changingValue = value
    }
    StoreBus.$on(key, onChange2)
    arr = subObj[key]
    expect(arr.length).toBe(2)

    // emit
    const emitValue = 'emit value'
    StoreBus.$emit(key, emitValue)
    expect(changingValue).toBe(emitValue)

    // delete change2 func
    StoreBus.$delete(key, onChange2)
    arr = subObj[key]
    expect(arr.length).toBe(1)
    expect(arr[0]).toBe(onChange)

    // off
    StoreBus.$off(key)
    arr = subObj[key]
    expect(arr.length).toBe(0)
  })
})
