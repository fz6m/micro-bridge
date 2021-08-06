import { __SCOPE_PREFIX__ } from '../constants'

export const getKeyWithScope = (scope: string, key: string) => {
  return `${__SCOPE_PREFIX__}${scope}.${key}`
}
