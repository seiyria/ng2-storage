'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageService = exports.StorageSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _browser = require('@angular/platform-browser/src/facade/browser');

var _lang = require('@angular/platform-browser/src/facade/lang');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var storageAvailable = function storageAvailable(type) {
  try {
    var storage = _browser.window[type];
    var test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

var buildProxy = function buildProxy(type, _ref) {
  var prefix = _ref.prefix;
  var serialize = _ref.serialize;

  var service = _browser.window[type];

  var proxyData = {
    get: function get(target, key) {

      // || null to prevent undefined errors
      return serialize.parse(target[prefix + '-' + key] || null);
    },

    set: function set(target, key, value) {
      return target[prefix + '-' + key] = serialize.stringify(value);
    }
  };

  return new Proxy(service, proxyData);
};

var StorageSettings = exports.StorageSettings = function StorageSettings() {
  _classCallCheck(this, StorageSettings);
};

var StorageService = exports.StorageService = function () {
  _createClass(StorageService, null, [{
    key: 'parameters',
    get: function get() {
      return [[StorageSettings]];
    }
  }]);

  function StorageService(storageSettings) {
    _classCallCheck(this, StorageService);

    this.storageSettings = Object.assign({ prefix: 'ng2-storage', serialize: _lang.Json }, storageSettings);
    if (typeof this.storageSettings.prefix === 'undefined') {
      throw new Error('storageSettings.prefix must be a string');
    }

    if (!this.storageSettings.serialize) {
      throw new Error('storageSettings.serialize must be an object { stringify, parse }');
    }

    if (typeof this.storageSettings.serialize.stringify !== 'function') {
      throw new Error('storageSettings.serialize.stringify must be a function');
    }

    if (typeof this.storageSettings.serialize.parse !== 'function') {
      throw new Error('storageSettings.serialize.parse must be a function');
    }

    if (!storageAvailable('localStorage')) {
      console.warn('localStorage is not available!');
    } else {
      this.local = buildProxy('localStorage', this.storageSettings);
    }

    if (!storageAvailable('sessionStorage')) {
      console.warn('sessionStorage is not available!');
    } else {
      this.session = buildProxy('sessionStorage', this.storageSettings);
    }
  }

  return StorageService;
}();
