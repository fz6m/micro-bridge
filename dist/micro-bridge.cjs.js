'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _set = require('lodash.set');
var _get = require('lodash.get');
var _isEqual = require('lodash.isequal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _set__default = /*#__PURE__*/_interopDefaultLegacy(_set);
var _get__default = /*#__PURE__*/_interopDefaultLegacy(_get);
var _isEqual__default = /*#__PURE__*/_interopDefaultLegacy(_isEqual);

var __MOUNT_PROPERTY__ = '_$store';
var __SCOPE_PREFIX__ = '_$';
var __SUBSCRIBE_SCOPE__ = 'subscribe';
var __VALUE_SUBSCRIBE_SCOPE__ = "value_" + __SUBSCRIBE_SCOPE__;

var initStore = function initStore() {
  var isMounted = _get__default['default'](window, __MOUNT_PROPERTY__);

  if (isMounted) {
    return;
  }

  _set__default['default'](window, __MOUNT_PROPERTY__, {});
};

initStore();

var getKeyWithScope = function getKeyWithScope(scope, key) {
  return "" + __SCOPE_PREFIX__ + scope + "." + key;
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
var getSubscribeBase = function getSubscribeBase(scope) {
  return {
    get: function get(key) {
      return getSubscribes(key, scope);
    },
    add: function add(key, callback) {
      return addSubscribe(key, callback, scope);
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
    }
  };
};

var SubBaseForValueChange = getSubscribeBase(__VALUE_SUBSCRIBE_SCOPE__);
var dispatchValueSubscribes = function dispatchValueSubscribes(key, newValue, oldValue) {
  if (_isEqual__default['default'](oldValue, newValue)) {
    return;
  }

  SubBaseForValueChange.dispacth(key, newValue, oldValue);
};
var StoreChange = {
  $on: SubBaseForValueChange.add,
  $destory: SubBaseForValueChange.destory,
  $delete: SubBaseForValueChange.delete
};

var getStore = function getStore() {
  return _get__default['default'](window, __MOUNT_PROPERTY__) || {};
};
var getStoreValue = function getStoreValue(key) {
  var store = getStore();
  return _get__default['default'](store, key);
};
var setStoreValue = function setStoreValue(key, value) {
  // dispatch
  var oldValue = getStoreValue(key);
  dispatchValueSubscribes(key, value, oldValue); // set

  var store = getStore();

  _set__default['default'](store, key, value);
};
var setStoreScopeValue = function setStoreScopeValue(key, value, scope) {
  var targetKey = getKeyWithScope(scope, key);
  setStoreValue(targetKey, value);
};
var getStoreScopeValue = function getStoreScopeValue(key, scope) {
  var targetKey = getKeyWithScope(scope, key);
  return getStoreValue(targetKey);
};
var Store = {
  getStore: getStore,
  get: getStoreValue,
  set: setStoreValue,
  getWithScope: getStoreScopeValue,
  setWithScope: setStoreScopeValue
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
