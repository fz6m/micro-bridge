import { getStoreScopeValue, setStoreScopeValue } from '../store/changeStore'
import { __SUBSCRIBE_SCOPE__, __VALUE_SUBSCRIBE_SCOPE__ } from '../constants'

export const getSubscribes = <T extends unknown = any>(
  key: string,
  scope: string
) => {
  return getStoreScopeValue<T[]>(key, scope) || []
}

export const addSubscribe = <T extends unknown = any>(
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

export const destorySubscribes = (key: string, scope: string) => {
  setStoreScopeValue(key, [], scope)
}

export const deleteSubscribe = <T extends unknown = any>(
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

export const getSubscribeBase = <T extends unknown = any>(scope: string) => {
  return {
    get: (key: string) => getSubscribes<T>(key, scope),
    add: (key: string, callback: T) => addSubscribe<T>(key, callback, scope),
    destory: (key: string) => destorySubscribes(key, scope),
    delete: (key: string, callback: T) =>
      deleteSubscribe<T>(key, callback, scope),
    dispacth: (key: string, ...args: any[]) =>
      dispacthSubscribes(key, scope, ...args),
  }
}
