import { getSubscribeBase } from '../subscribe'
import { __VALUE_SUBSCRIBE_SCOPE__ } from '../constants'
import { isFunction, isString, isAffiliateInternalKey } from '../utils'

import { isEqual as _isEqual } from 'lodash'

export type StoreValueChangeCallback = (newValue: any, oldValue: any) => any

export const SubBaseForValueChange = getSubscribeBase<StoreValueChangeCallback>(
  __VALUE_SUBSCRIBE_SCOPE__
)

export type IStoreDispatchValueSubParams = {
  key: string
  newValue: any
  oldValue: any
  newStoreValue: any
}

export const dispatchValueSubscribes = ({
  key,
  newValue,
  oldValue,
  newStoreValue,
}: IStoreDispatchValueSubParams) => {
  // block internal key
  const isInternal = isAffiliateInternalKey(key)
  if (isInternal) {
    return
  }
  if (!_isEqual(oldValue, newValue)) {
    // dispatch all
    SubBaseForValueChange.dispatchAll(newStoreValue)
    // dispatch current key
    SubBaseForValueChange.dispacth(key, newValue, oldValue)
  }
}

function onValueChange(callback: StoreValueChangeCallback): any
function onValueChange(key: string, callback: StoreValueChangeCallback): any
function onValueChange(
  keyOrCallback: string | StoreValueChangeCallback,
  callback?: StoreValueChangeCallback
) {
  // 1 param -> all monitor
  if (isFunction(keyOrCallback) && !callback) {
    SubBaseForValueChange.addToAll(keyOrCallback as StoreValueChangeCallback)
    return
  }
  // 2 params -> key monitor
  if (isString(keyOrCallback) && isFunction(callback)) {
    SubBaseForValueChange.add(
      keyOrCallback as string,
      callback as StoreValueChangeCallback
    )
  }
}

export const StoreChange = {
  $on: onValueChange,
  $destory: SubBaseForValueChange.destory,
  $delete: SubBaseForValueChange.delete,
}
