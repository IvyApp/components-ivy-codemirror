"use strict";
var Component = require("./component")["default"] || require("./component");

exports["default"] = {
  name: 'ivy-codemirror',

  initialize: function(container) {
    container.register('component:ivy-codemirror', Component);
  }
};