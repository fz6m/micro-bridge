import { __INTERNAL_KEY__ } from '../constants'
import { getScope } from '../store/scope'

export const clearInternalKey = (store: Record<string, any>) => {
  const shallowClone = {
    ...store,
  }
  __INTERNAL_KEY__.forEach((key) => {
    delete shallowClone[getScope(key)]
  })
  return shallowClone
}
