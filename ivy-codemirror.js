(function() {;
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }

  function unsupportedModule(length) {
    throw new Error("an unsupported module was defined, expected `define(name, deps, module)` instead got: `" + length + "` arguments to define`");
  }

  var defaultDeps = ['require', 'exports', 'module'];

  function Module(name, deps, callback, exports) {
    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
    this._require  = undefined;
  }


  Module.prototype.makeRequire = function() {
    var name = this.name;

    return this._require || (this._require = function(dep) {
      return require(resolve(dep, name));
    });
  }

  define = function(name, deps, callback) {
    if (arguments.length < 2) {
      unsupportedModule(arguments.length);
    }

    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  // we don't support all of AMD
  // define.amd = {};
  // we will support petals...
  define.petal = { };

  function Alias(path) {
    this.name = path;
  }

  define.alias = function(path) {
    return new Alias(path);
  };

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = mod.makeRequire();
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = requireFrom(resolve(dep, name), name);
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  function requireFrom(name, origin) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module `' + name + '` imported from `' + origin + '`');
    }
    return require(name);
  }

  function missingModule(name) {
    throw new Error('Could not find module ' + name);
  }
  requirejs = require = requireModule = function(name) {
    var mod = registry[name];


    if (mod && mod.callback instanceof Alias) {
      mod = registry[mod.callback.name];
    }

    if (!mod) { missingModule(name); }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    var obj;
    if (module === undefined && reified.module.exports) {
      obj = reified.module.exports;
    } else {
      obj = seen[name] = module;
    }

    if (obj !== null &&
        (typeof obj === 'object' || typeof obj === 'function') &&
          obj['default'] === undefined) {
      obj['default'] = obj;
    }

    return (seen[name] = obj);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        if (parentBase.length === 0) {
          throw new Error('Cannot access parent module of root');
        }
        parentBase.pop();
      } else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ivy-codemirror/components/ivy-codemirror", 
  ["codemirror","ember","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var CodeMirror = __dependency1__["default"];
    var Ember = __dependency2__["default"];

    __exports__["default"] = Ember.Component.extend({
      /**
       * The value of the editor.
       *
       * @property value
       * @type {String}
       * @default null
       */
      value: null,

      autofocus: false,
      coverGutterNextToScrollbar: false,
      electricChars: true,
      extraKeys: null,
      firstLineNumber: 1,
      fixedGutter: true,
      historyEventDelay: 1250,
      indentUnit: 2,
      indentWithTabs: false,
      keyMap: 'default',
      lineNumbers: false,
      lineWrapping: false,
      mode: null,
      readOnly: false,
      rtlMoveVisually: true,
      showCursorWhenSelecting: false,
      smartIndent: true,
      tabSize: 4,
      tabindex: null,
      theme: 'default',
      undoDepth: 200,

      tagName: 'textarea',

      /**
       * Force CodeMirror to refresh.
       *
       * @method refresh
       */
      refresh: function() {
        this.get('codeMirror').refresh();
      },

      _initCodemirror: Ember.on('didInsertElement', function() {
        var codeMirror = CodeMirror.fromTextArea(this.get('element'));

        // Stash away the CodeMirror instance.
        this.set('codeMirror', codeMirror);

        // Set up handlers for CodeMirror events.
        this._bindCodeMirrorEvent('change', this, '_updateValue');

        // Set up bindings for CodeMirror options.
        this._bindCodeMirrorOption('autofocus');
        this._bindCodeMirrorOption('coverGutterNextToScrollbar');
        this._bindCodeMirrorOption('electricChars');
        this._bindCodeMirrorOption('extraKeys');
        this._bindCodeMirrorOption('firstLineNumber');
        this._bindCodeMirrorOption('fixedGutter');
        this._bindCodeMirrorOption('historyEventDelay');
        this._bindCodeMirrorOption('indentUnit');
        this._bindCodeMirrorOption('indentWithTabs');
        this._bindCodeMirrorOption('keyMap');
        this._bindCodeMirrorOption('lineNumbers');
        this._bindCodeMirrorOption('lineWrapping');
        this._bindCodeMirrorOption('mode');
        this._bindCodeMirrorOption('readOnly');
        this._bindCodeMirrorOption('rtlMoveVisually');
        this._bindCodeMirrorOption('showCursorWhenSelecting');
        this._bindCodeMirrorOption('smartIndent');
        this._bindCodeMirrorOption('tabSize');
        this._bindCodeMirrorOption('tabindex');
        this._bindCodeMirrorOption('theme');
        this._bindCodeMirrorOption('undoDepth');

        this._bindCodeMirrorProperty('value', this, '_valueDidChange');
        this._valueDidChange();

        // Force a refresh on `becameVisible`, since CodeMirror won't render itself
        // onto a hidden element.
        this.on('becameVisible', this, 'refresh');
      }),

      /**
       * Bind a handler for `event`, to be torn down in `willDestroyElement`.
       *
       * @private
       * @method _bindCodeMirrorEvent
       */
      _bindCodeMirrorEvent: function(event, target, method) {
        var callback = Ember.run.bind(target, method);

        this.get('codeMirror').on(event, callback);

        this.on('willDestroyElement', this, function() {
          this.get('codeMirror').off(event, callback);
        });
      },

      /**
       * @private
       * @method _bindCodeMirrorProperty
       */
      _bindCodeMirrorOption: function(key) {
        this._bindCodeMirrorProperty(key, this, '_optionDidChange');

        // Set the initial option synchronously.
        this._optionDidChange(this, key);
      },

      /**
       * Bind an observer on `key`, to be torn down in `willDestroyElement`.
       *
       * @private
       * @method _bindCodeMirrorProperty
       */
      _bindCodeMirrorProperty: function(key, target, method) {
        this.addObserver(key, target, method);

        this.on('willDestroyElement', this, function() {
          this.removeObserver(key, target, method);
        });
      },

      /**
       * Sync a local option value with CodeMirror.
       *
       * @private
       * @method _optionDidChange
       */
      _optionDidChange: function(sender, key) {
        this.get('codeMirror').setOption(key, this.get(key));
      },

      /**
       * Update the `value` property when a CodeMirror `change` event occurs.
       *
       * @private
       * @method _updateValue
       */
      _updateValue: function(instance) {
        this.set('value', instance.getValue());
      },

      _valueDidChange: function() {
        var codeMirror = this.get('codeMirror'),
            value = this.get('value');

        if (value !== codeMirror.getValue()) {
          codeMirror.setValue(value || '');
        }
      }
    });
  });
;define("ivy-codemirror/index", 
  ["ivy-codemirror/components/ivy-codemirror","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyCodemirrorComponent = __dependency1__["default"];

    __exports__.IvyCodemirrorComponent = IvyCodemirrorComponent;
  });
;/* global define, require */
define('ivy-codemirror-shim', ['exports'], function(__exports__) {
  'use strict';
  __exports__['default'] = function(container) {
    container.register('component:ivy-codemirror', require('ivy-codemirror/components/ivy-codemirror')['default']);
  };
});
;/* global define, require, window */
var addonName = 'ivy-codemirror';

define('codemirror', ['exports'], function(__exports__) {
  __exports__['default'] = window.CodeMirror;
});

define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

var index = addonName + '/index';
define(addonName, ['exports'], function(__exports__) {
  var library = require(index);
  Object.keys(library).forEach(function(key) {
    __exports__[key] = library[key];
  });
});

// Glue library to a global var
window.IvyCodemirror = require(index);

// Register library items in the container
var shim = addonName + '-shim';
window.Ember.Application.initializer({
  name: shim,

  initialize: function(container) {
    require(shim)['default'](container);
  }
});
})();