!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.ivy||(o.ivy={})).codemirror=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var CodeMirror = window.CodeMirror["default"] || window.CodeMirror;
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
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
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Component = _dereq_("./component")["default"] || _dereq_("./component");

exports["default"] = {
  name: 'ivy-codemirror',

  initialize: function(container) {
    container.register('component:ivy-codemirror', Component);
  }
};
},{"./component":1}],3:[function(_dereq_,module,exports){
"use strict";
var Component = _dereq_("./component")["default"] || _dereq_("./component");
var initializer = _dereq_("./initializer")["default"] || _dereq_("./initializer");

exports.Component = Component;
exports.initializer = initializer;
},{"./component":1,"./initializer":2}]},{},[3])
(3)
});