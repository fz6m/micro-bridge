import { __SCOPE_PREFIX__, __INTERNAL_SCOPE_PREFIX__ } from '../constants'
import { isInternalKey } from '../utils'

export const getScope = (scope: string) => {
  const isInternal = isInternalKey(scope)
  return `${isInternal ? __INTERNAL_SCOPE_PREFIX__ : __SCOPE_PREFIX__}${scope}`
}

export const getKeyWithScope = (scope: string, key: string) => {
  const isInternal = isInternalKey(scope)
  return `${
    isInternal ? __INTERNAL_SCOPE_PREFIX__ : __SCOPE_PREFIX__
  }${scope}.${key}`
}
