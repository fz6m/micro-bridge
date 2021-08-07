import { getStoreScopeValue, setStoreScopeValue } from '../store/changeStore'
import { __ALL_SUBSCRIBE_KEY__ } from '../constants'

export type CommonFunc = (...args: any[]) => any

export const getSubscribes = <T extends CommonFunc = CommonFunc>(
  key: string,
  scope: string
) => {
  return getStoreScopeValue<T[]>(key, scope) || []
}

export const addSubscribe = <T extends CommonFunc = CommonFunc>(
  key: string,
  callback: T,
  scope: string
) => {
  const originSubscribes = getSubscribes<T>(key, scope)
  if (~originSubscribes.indexOf(callback)) {
    return
  }
  const newSubscribeList = [...originSubscribes, callback]
  setStoreScopeValue(key, newSubscribeList, scope)
}

export const addSubscribeToAll = <T extends CommonFunc = CommonFunc>(
  callback: T,
  scope: string
) => {
  addSubscribe(__ALL_SUBSCRIBE_KEY__, callback, scope)
}

export const destorySubscribes = (key: string, scope: string) => {
  setStoreScopeValue(key, [], scope)
}

export const deleteSubscribe = <T extends CommonFunc = CommonFunc>(
  key: string,
  callback: T,
  scope: string
) => {
  const originSubscribes = getSubscribes(key, scope)
  const targetIdx = originSubscribes.indexOf(callback)
  if (!~targetIdx) {
    return false
  }
  originSubscribes.splice(targetIdx, 1)
  setStoreScopeValue(key, originSubscribes, scope)
  return true
}

export const dispacthSubscribes = (
  key: string,
  scope: string,
  ...args: any[]
) => {
  const subscribes = getSubscribes(key, scope)
  subscribes.forEach((fun) => {
    try {
      fun(...args)
    } catch {}
  })
}

export const dispacthAllSubscribes = (scope: string, ...args: any[]) => {
  const allSubs = getSubscribes(__ALL_SUBSCRIBE_KEY__, scope)
  allSubs.forEach((func) => {
    try {
      func(...args)
    } catch {}
  })
}

export const getSubscribeBase = <T extends CommonFunc = CommonFunc>(
  scope: string
) => {
  return {
    get: (key: string) => getSubscribes<T>(key, scope),
    add: (key: string, callback: T) => addSubscribe<T>(key, callback, scope),
    addToAll: (callback: T) => addSubscribeToAll<T>(callback, scope),
    destory: (key: string) => destorySubscribes(key, scope),
    delete: (key: string, callback: T) =>
      deleteSubscribe<T>(key, callback, scope),
    dispacth: (key: string, ...args: any[]) =>
      dispacthSubscribes(key, scope, ...args),
    dispatchAll: (...args: any[]) => dispacthAllSubscribes(scope, ...args),
  }
}
