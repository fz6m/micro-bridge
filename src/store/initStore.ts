import _set from 'lodash.set'
import _get from 'lodash.get'

import { __MOUNT_PROPERTY__ } from '../constants'

export const initStore = () => {
  const isMounted = _get(window, __MOUNT_PROPERTY__)
  if (isMounted) {
    return
  }
  _set(window, __MOUNT_PROPERTY__, {})
}
