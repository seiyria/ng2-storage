
import { window } from '@angular/platform-browser/src/facade/browser';
import { Json } from '@angular/platform-browser/src/facade/lang';

const storageAvailable = (type) => {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  }
  catch(e) {
    return false;
  }
};

const buildProxy = (type, { prefix, serialize }) => {
  const service = window[type];

  const proxyData = {
    get: (target, key) => {

      // || null to prevent undefined errors
      return serialize.parse(target[`${prefix}-${key}`] || null);
    },

    set: (target, key, value) => {
      return target[`${prefix}-${key}`] = serialize.stringify(value);
    }
  };

  return new Proxy(service, proxyData);
};

export class StorageSettings {
  constructor() {}
}


export class StorageService {
  static get parameters() {
    return [[StorageSettings]];
  }

  constructor(storageSettings) {
    this.storageSettings = Object.assign({ prefix: 'ng2-storage', serialize: Json }, storageSettings);
    if(typeof this.storageSettings.prefix === 'undefined') {
      throw new Error('storageSettings.prefix must be a string');
    }

    if(!this.storageSettings.serialize) {
      throw new Error('storageSettings.serialize must be an object { stringify, parse }');
    }

    if(typeof this.storageSettings.serialize.stringify !== 'function') {
      throw new Error('storageSettings.serialize.stringify must be a function');
    }

    if(typeof this.storageSettings.serialize.parse !== 'function') {
      throw new Error('storageSettings.serialize.parse must be a function');
    }

    if(!storageAvailable('localStorage')) {
      console.warn('localStorage is not available!');
    } else {
      this.local = buildProxy('localStorage',   this.storageSettings);
    }

    if(!storageAvailable('sessionStorage')) {
      console.warn('sessionStorage is not available!');
    } else {
      this.session = buildProxy('sessionStorage', this.storageSettings);
    }

  }
}
