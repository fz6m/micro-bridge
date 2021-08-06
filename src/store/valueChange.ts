import { getSubscribeBase } from '../subscribe'
import { __VALUE_SUBSCRIBE_SCOPE__ } from '../constants'

import _isEqual from 'lodash.isequal'

export type StoreValueChangeCallback = (newValue: any, oldValue: any) => any

export const SubBaseForValueChange = getSubscribeBase<StoreValueChangeCallback>(
  __VALUE_SUBSCRIBE_SCOPE__
)

export const dispatchValueSubscribes = (
  key: string,
  newValue: any,
  oldValue: any
) => {
  if (_isEqual(oldValue, newValue)) {
    return
  }
  SubBaseForValueChange.dispacth(key, newValue, oldValue)
}

export const StoreChange = {
  $on: SubBaseForValueChange.add,
  $destory: SubBaseForValueChange.destory,
  $delete: SubBaseForValueChange.delete,
}
