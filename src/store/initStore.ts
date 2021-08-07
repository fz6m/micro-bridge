import { set as _set, get as _get } from 'lodash'

import { __MOUNT_PROPERTY__ } from '../constants'

export const initStore = () => {
  const isMounted = _get(window, __MOUNT_PROPERTY__)
  if (isMounted) {
    return
  }
  _set(window, __MOUNT_PROPERTY__, {})
}
