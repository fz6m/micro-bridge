import { getSubscribeBase } from '../subscribe'
import { __SUBSCRIBE_SCOPE__ } from '../constants'

export type EventBusCallback = (value?: any) => any

export const SubBaseForEventBus =
  getSubscribeBase<EventBusCallback>(__SUBSCRIBE_SCOPE__)

export const dispacthEvents = (key: string, value?: any) => {
  SubBaseForEventBus.dispacth(key, value)
}

export const StoreBus = {
  $on: SubBaseForEventBus.add,
  $off: SubBaseForEventBus.destory,
  $emit: dispacthEvents,
  $delete: SubBaseForEventBus.delete,
}
