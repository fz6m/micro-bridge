import { __MOUNT_PROPERTY__ } from '../src/constants'

declare global {
  const __DEV__: boolean

  interface Window {
    [__MOUNT_PROPERTY__]: Record<string, any>
  }
}

export {}
