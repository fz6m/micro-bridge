import { __INTERNAL_KEY__ } from '../constants'
import { getScope } from '../store/scope'

export const isFunction = (obj: any) => typeof obj === 'function'

export const isString = (obj: any) => typeof obj === 'string'

export const isInternalKey = (key: string) => ~__INTERNAL_KEY__.indexOf(key)

export const isAffiliateInternalKey = (key: string) => {
  return __INTERNAL_KEY__.some((internalKey) => {
    return key.startsWith(getScope(internalKey))
  })
}
