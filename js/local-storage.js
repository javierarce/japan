module.exports = (function () {
  var mainStorageKey;
  var storageName = 'javier.is';
  var version = '0.1.0';
  var initialized = false;

  function init (key) {
    initialized = true;
    mainStorageKey = key;
  }

  function getKey (key) {
    return [storageName, version, mainStorageKey, key].join('.');
  }

  function isSupported () {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  return {
    init: function (key) {
      if (!isSupported()) throw new Error('localStorage not supported in your browser');
      init(key);
    },

    get: function (key) {
      if (!initialized) {
        init();
      }
      var storageKey = getKey(key);
      var value = localStorage[storageKey];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      return value;
    },

    set: function (key, value) {
      if (!initialized) {
        init();
      }
      var storageKey = getKey(key);
      localStorage[storageKey] = value;
    },

    delete: function (key) {
      if (!initialized) {
        init();
      }

      var storageKey = getKey(key);
      delete localStorage[storageKey];
    }
  };
})();
