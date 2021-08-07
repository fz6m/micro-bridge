'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _get2 = require('lodash/get');
var _set2 = require('lodash/set');
var _isEqual2 = require('lodash/isEqual');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _get2__default = /*#__PURE__*/_interopDefaultLegacy(_get2);
var _set2__default = /*#__PURE__*/_interopDefaultLegacy(_set2);
var _isEqual2__default = /*#__PURE__*/_interopDefaultLegacy(_isEqual2);

var __MOUNT_PROPERTY__ = '_$store';
var __SCOPE_PREFIX__ = '_$';
var __INTERNAL_SCOPE_PREFIX__ = '__$$';
var __SUBSCRIBE_SCOPE__ = "__subscribe__";
var __VALUE_SUBSCRIBE_SCOPE__ = "__value_subscribe__";
var __INTERNAL_KEY__ = [__SUBSCRIBE_SCOPE__, __VALUE_SUBSCRIBE_SCOPE__];
var __ALL_SUBSCRIBE_KEY__ = '_$all';

var initStore = function initStore() {
  var isMounted = _get2__default['default'](window, __MOUNT_PROPERTY__);

  if (isMounted) {
    return;
  }

  _set2__default['default'](window, __MOUNT_PROPERTY__, {});
};

initStore();

var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
var isString = function isString(obj) {
  return typeof obj === 'string';
};
var isInternalKey = function isInternalKey(key) {
  return ~__INTERNAL_KEY__.indexOf(key);
};
var isAffiliateInternalKey = function isAffiliateInternalKey(key) {
  return __INTERNAL_KEY__.some(function (internalKey) {
    return key.startsWith(getScope(internalKey));
  });
};

var getScope = function getScope(scope) {
  var isInternal = isInternalKey(scope);
  return "" + (isInternal ? __INTERNAL_SCOPE_PREFIX__ : __SCOPE_PREFIX__) + scope;
};
var getKeyWithScope = function getKeyWithScope(scope, key) {
  var isInternal = isInternalKey(scope);
  return "" + (isInternal ? __INTERNAL_SCOPE_PREFIX__ : __SCOPE_PREFIX__) + scope + "." + key;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var getSubscribes = function getSubscribes(key, scope) {
  return getStoreScopeValue(key, scope) || [];
};
var addSubscribe = function addSubscribe(key, callback, scope) {
  var originSubscribes = getSubscribes(key, scope);

  if (~originSubscribes.indexOf(callback)) {
    return;
  }

  var newSubscribeList = __spreadArray(__spreadArray([], originSubscribes), [callback]);

  setStoreScopeValue(key, newSubscribeList, scope);
};
var addSubscribeToAll = function addSubscribeToAll(callback, scope) {
  addSubscribe(__ALL_SUBSCRIBE_KEY__, callback, scope);
};
var destorySubscribes = function destorySubscribes(key, scope) {
  setStoreScopeValue(key, [], scope);
};
var deleteSubscribe = function deleteSubscribe(key, callback, scope) {
  var originSubscribes = getSubscribes(key, scope);
  var targetIdx = originSubscribes.indexOf(callback);

  if (!~targetIdx) {
    return false;
  }

  originSubscribes.splice(targetIdx, 1);
  setStoreScopeValue(key, originSubscribes, scope);
  return true;
};
var dispacthSubscribes = function dispacthSubscribes(key, scope) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  var subscribes = getSubscribes(key, scope);
  subscribes.forEach(function (fun) {
    try {
      fun.apply(void 0, args);
    } catch (_a) {}
  });
};
var dispacthAllSubscribes = function dispacthAllSubscribes(scope) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }

  var allSubs = getSubscribes(__ALL_SUBSCRIBE_KEY__, scope);
  allSubs.forEach(function (func) {
    try {
      func.apply(void 0, args);
    } catch (_a) {}
  });
};
var getSubscribeBase = function getSubscribeBase(scope) {
  return {
    get: function get(key) {
      return getSubscribes(key, scope);
    },
    add: function add(key, callback) {
      return addSubscribe(key, callback, scope);
    },
    addToAll: function addToAll(callback) {
      return addSubscribeToAll(callback, scope);
    },
    destory: function destory(key) {
      return destorySubscribes(key, scope);
    },
    delete: function _delete(key, callback) {
      return deleteSubscribe(key, callback, scope);
    },
    dispacth: function dispacth(key) {
      var args = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }

      return dispacthSubscribes.apply(void 0, __spreadArray([key, scope], args));
    },
    dispatchAll: function dispatchAll() {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return dispacthAllSubscribes.apply(void 0, __spreadArray([scope], args));
    }
  };
};

var SubBaseForValueChange = getSubscribeBase(__VALUE_SUBSCRIBE_SCOPE__);
var dispatchValueSubscribes = function dispatchValueSubscribes(_a) {
  var key = _a.key,
      newValue = _a.newValue,
      oldValue = _a.oldValue,
      newStoreValue = _a.newStoreValue; // block internal key

  var isInternal = isAffiliateInternalKey(key);

  if (isInternal) {
    return;
  }

  if (!_isEqual2__default['default'](oldValue, newValue)) {
    // dispatch all
    SubBaseForValueChange.dispatchAll(newStoreValue); // dispatch current key

    SubBaseForValueChange.dispacth(key, newValue, oldValue);
  }
};

function onValueChange(keyOrCallback, callback) {
  // 1 param -> all monitor
  if (isFunction(keyOrCallback) && !callback) {
    SubBaseForValueChange.addToAll(keyOrCallback);
    return;
  } // 2 params -> key monitor


  if (isString(keyOrCallback) && isFunction(callback)) {
    SubBaseForValueChange.add(keyOrCallback, callback);
  }
}

var StoreChange = {
  $on: onValueChange,
  $destory: SubBaseForValueChange.destory,
  $delete: SubBaseForValueChange.delete
};

var clearInternalKey = function clearInternalKey(store) {
  var shallowClone = __assign({}, store);

  __INTERNAL_KEY__.forEach(function (key) {
    delete shallowClone[getScope(key)];
  });

  return shallowClone;
};

var getStore = function getStore() {
  return _get2__default['default'](window, __MOUNT_PROPERTY__) || {};
};
var getStoreForPublic = function getStoreForPublic() {
  var store = getStore();

  return clearInternalKey(store);
}; // 获取 store 某个 key 值

var getStoreValue = function getStoreValue(key) {
  var store = getStore();
  return _get2__default['default'](store, key);
}; // 设定 store 某个 key 值

var setStoreValue = function setStoreValue(key, value) {
  var oldValue = getStoreValue(key); // set

  var store = getStore();

  _set2__default['default'](store, key, value); // dispatch value change


  dispatchValueSubscribes({
    key: key,
    newValue: value,
    oldValue: oldValue,
    newStoreValue: getStoreForPublic()
  });
}; // 设定 store 下 scope 某个 key 值

var setStoreScopeValue = function setStoreScopeValue(key, value, scope) {
  var targetKey = getKeyWithScope(scope, key);
  setStoreValue(targetKey, value);
}; // 获取 store 下 scope 某个 key 值

var getStoreScopeValue = function getStoreScopeValue(key, scope) {
  var targetKey = getKeyWithScope(scope, key);
  return getStoreValue(targetKey);
}; // 获取 store 下整个 scope 对象值

var getStoreScopeObj = function getStoreScopeObj(scope) {
  var scopeKey = getScope(scope);
  return getStoreValue(scopeKey) || {};
}; // 设定 store 下整个 scope 对象值

var setStoreScopeObj = function setStoreScopeObj(value, scope) {
  var scopeKey = getScope(scope);
  setStoreValue(scopeKey, value);
};
var Store = {
  getStore: getStoreForPublic,
  get: getStoreValue,
  set: setStoreValue,
  getWithScope: getStoreScopeValue,
  setWithScope: setStoreScopeValue,
  getScope: getStoreScopeObj,
  setScope: setStoreScopeObj // only public

};

var SubBaseForEventBus = getSubscribeBase(__SUBSCRIBE_SCOPE__);
var dispacthEvents = function dispacthEvents(key, value) {
  SubBaseForEventBus.dispacth(key, value);
};
var StoreBus = {
  $on: SubBaseForEventBus.add,
  $off: SubBaseForEventBus.destory,
  $emit: dispacthEvents,
  $delete: SubBaseForEventBus.delete
};

exports.Store = Store;
exports.StoreBus = StoreBus;
exports.StoreChange = StoreChange;
