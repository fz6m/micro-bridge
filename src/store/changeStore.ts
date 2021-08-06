import _set from 'lodash.set'
import _get from 'lodash.get'

import { __MOUNT_PROPERTY__ } from '../constants'
import { getKeyWithScope } from './scope'
import { dispatchValueSubscribes } from './valueChange'

export type BridgeStore = Record<string, any>

export const getStore = (): BridgeStore => {
  return _get(window, __MOUNT_PROPERTY__) || {}
}

export const getStoreValue = <T extends unknown = any>(key: string) => {
  const store = getStore()
  return _get(store, key) as T
}

export const setStoreValue = (key: string, value: any) => {
  // dispatch
  const oldValue = getStoreValue(key)
  dispatchValueSubscribes(key, value, oldValue)
  // set
  const store = getStore()
  _set(store, key, value)
}

export const setStoreScopeValue = (key: string, value: any, scope: string) => {
  const targetKey = getKeyWithScope(scope, key)
  setStoreValue(targetKey, value)
}

export const getStoreScopeValue = <T extends unknown = any>(
  key: string,
  scope: string
) => {
  const targetKey = getKeyWithScope(scope, key)
  return getStoreValue<T>(targetKey)
}

export const Store = {
  getStore,
  get: getStoreValue,
  set: setStoreValue,
  getWithScope: getStoreScopeValue,
  setWithScope: setStoreScopeValue,
}
