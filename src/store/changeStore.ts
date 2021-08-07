import { set as _set, get as _get } from 'lodash'

import { __MOUNT_PROPERTY__ } from '../constants'
import { getKeyWithScope, getScope } from './scope'
import { dispatchValueSubscribes } from './valueChange'
import { clearInternalKey } from '../utils/clear'

export type BridgeStore = Record<string, any>

// 获取整个 store
export const getStore = (): BridgeStore => {
  return _get(window, __MOUNT_PROPERTY__) || {}
}

export const getStoreForPublic = (): BridgeStore => {
  const store = getStore()
  if (__DEV__) {
    return store
  }
  return clearInternalKey(store)
}

// 获取 store 某个 key 值
export const getStoreValue = <T extends unknown = any>(key: string) => {
  const store = getStore()
  return _get(store, key) as T
}

// 设定 store 某个 key 值
export const setStoreValue = (key: string, value: any) => {
  const oldValue = getStoreValue(key)
  // set
  const store = getStore()
  _set(store, key, value)
  // dispatch value change
  dispatchValueSubscribes({
    key,
    newValue: value,
    oldValue,
    newStoreValue: getStoreForPublic(),
  })
}

// 设定 store 下 scope 某个 key 值
export const setStoreScopeValue = (key: string, value: any, scope: string) => {
  const targetKey = getKeyWithScope(scope, key)
  setStoreValue(targetKey, value)
}

// 获取 store 下 scope 某个 key 值
export const getStoreScopeValue = <T extends unknown = any>(
  key: string,
  scope: string
) => {
  const targetKey = getKeyWithScope(scope, key)
  return getStoreValue<T>(targetKey)
}

// 获取 store 下整个 scope 对象值
export const getStoreScopeObj = <T extends Record<string, any> = {}>(
  scope: string
) => {
  const scopeKey = getScope(scope)
  return getStoreValue<T>(scopeKey) || {}
}

// 设定 store 下整个 scope 对象值
export const setStoreScopeObj = (value: any, scope: string) => {
  const scopeKey = getScope(scope)
  setStoreValue(scopeKey, value)
}

export const Store = {
  getStore: getStoreForPublic,
  get: getStoreValue,
  set: setStoreValue,
  getWithScope: getStoreScopeValue,
  setWithScope: setStoreScopeValue,
  getScope: getStoreScopeObj, // only public
  setScope: setStoreScopeObj, // only public
}
