# micro-bridge

一个微前端多应用间通信的全局状态管理，支持值分类管理、动态监听、事件总线

### Install

在所有需要通信的应用内将其加入依赖：

```bash
  yarn add micro-bridge
```

##### CDN

```html
<body>
  <!-- ... -->
  <script src="https://cdn.jsdelivr.net/gh/fz6m/micro-bridge@1.1/dist/micro-bridge.min.js"></script>
  <script>
    MicroBridge.Store.set('key', 'value')
  </script>
</body>
```

### Usage

#### Store

`Store` 是一个含有操作全局数据方法的对象。

##### example

```ts
import { Store } from 'micro-bridge'

// set
Store.set('key', 'value')
// support path set
Store.set('object.key.key2', {})

// get
Store.get<string>('key')
Store.get('object.key.key2')

// get all data store
Store.getStore()

// scope data
Store.setWithScope('key', {}, 'some-scope')
Store.getWithScope<Record<string, any>>('key', 'some-scope')
```

##### methods

|        method        | description                |
| :------------------: | :------------------------- |
|     `Store.set`      | 设定值                     |
|     `Store.get`      | 获取值                     |
| `Store.setWithScope` | 带标识符设定值（方便管理） |
| `Store.getWithScope` | 带标识符获取值             |
|   `Store.getScope`   | 获取标识符下所有数据对象   |
|   `Store.setScope`   | 设定标识符下整个数据对象   |
|   `Store.getStore`   | 获取全部数据               |

#### StoreChange

`StoreChange` 被用于监听 `Store` 内数据的变化。

##### example

```ts
import { StoreChange } from 'micro-bridge'

StoreChange.$on((newStore) => {
  // ...
})
StoreChange.$on('path.key', (newValue, oldValue) => {
  // ...
})
```

##### methods

|         method         | description                          |
| :--------------------: | :----------------------------------- |
|   `StoreChange.$on`    | 监听某个属性上的值变化，支持监听路径 |
| `StoreChange.$delete`  | 删除某个监听函数                     |
| `StoreChange.$destory` | 销毁该属性的所有监听                 |

#### StoreBus

`StoreBus` 是一个事件总线。

##### example

```ts
import { StoreBus } from 'micro-bridge'

StoreBus.$emit('some-event', 'value')
StoreBus.$on('some-event', (value) => {
  // ...
})
```

##### methods

|       method       | description                |
| :----------------: | :------------------------- |
|   `StoreBus.$on`   | 根据事件名监听某个事件     |
|  `StoreBus.$emit`  | 事件广播                   |
| `StoreBus.$delete` | 移除某个正在监听的函数     |
|  `StoreBus.$off`   | 清空某个事件的所有监听函数 |

### Other

注：无论在使用变化监听还是事件总线时，请留意在组件 `unmount` 时销毁或删除你的监听函数。
