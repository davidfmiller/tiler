/* jshint undef: true,strict:true,trailing:true,loopfunc:true */
/* global document,window,HTMLElement */

(function() {

  'use strict';

  // prevent duplicate declaration
  if (window.Tiler) { return; }

  var

  //
  VERSION = '0.0.1',


  /*
   * Generate a unique string suitable for id attributes
   *
   * @param basename (String)
   * @return string
   */
  guid = function(basename) {
    return basename + '-' + parseInt(Math.random() * 100, 10) + '-' + parseInt(Math.random() * 1000, 10);
  },

  /*
   * Merge two objects into one, values in b take precedence over values in a
   *
   * @param a {Object}
   * @param b {Object}

   * @return Object
   */
  merge = function(a, b) {
    var o = {};
    for (var i in a) {
      o[i] = a[i];
    }
    if (! b) { return o; }
    for (i in b) {
      o[i] = b[i];
    }
    return o;
  },

  /*
   * Convert an array-like thing (ex: NodeList or arguments object) into a proper array
   *
   * @param list (array-like thing)
   * @return Array
   */
  arr = function(list) {
    var ret = [], i = 0;

    if (! list.length) { return ret; }

    for (i = 0; i < list.length; i++) {
      ret.push(list[i]);
    }

    return ret;
  },

  /*
   * Create an element with a set of attributes/values
   *
   * @param type (String)
   * @param attrs {Object}
   *
   * @return HTMLElement
   */
  makeElement = function(type, attrs) {
     var
     n = document.createElement(type),
     i = null;

     for (i in attrs) {
       n.setAttribute(i, attrs[i]);
     }
     return n;
  },

  /*
   * Retrieve an object containing { top : xx, left : xx, bottom: xx, right: xx, width: xx, height: xx }
   *
   * @param node (DOMNode)
   */
  getRect = function(node) {

    var
    rect = node.getBoundingClientRect(),
    ret = { top : rect.top, left : rect.left, bottom: rect.bottom, right : rect.right }; // create a new object that is not read-only

    ret.top += window.pageYOffset;
    ret.left += window.pageXOffset;

    ret.bottom += window.pageYOffset;
    ret.right += window.pageYOffset;

    ret.width = rect.right - rect.left;
    ret.height = rect.bottom - rect.top;

    return ret;
  },

  /*
   * Retrieve object containing popover data for an element on the page
   *
   * @param scope {Popover}
   * @param node {
   * @return {Object}
   */
  getDataForNode = function(scope, node) {

    var
    val = scope.factory ? scope.factory(node) : node.getAttribute(ATTR),
    data = scope.defaults;

    if (typeof val != "object") {
      try {
        val = JSON.parse(val);

        if (typeof val === 'number') {
          val = { content : val };
        }

      } catch (err) {
        val = { content : val };
      }
    }

    return merge(data, val);
  },

  /**
   * Greatest common divisor
   *
   * @param a
   * @param b
   * @return 
   */
  gcd = function(a, b) {
    if ( ! b) {
      return a;
    }
    return gcd(b, a % b);
  },

  /*
   *
   * @param node {HTMLElement}
   * @param styles {Object}
   */
  setStyles  = function(node, styles) {
    for (var i in styles) {
      node.style[i] = styles[i];
    }
  };

  /**
   *
   *
   * @param node (node, optional) - the root element containing all elements with attached popovers
   * @param options (Object, optional) method to retrieve the popover's data for a given node
   */
  window.Tiler = function(config, defaults) {

    var
    $ = this,
    nodes,
    i = 0,
    n,
    node,
    on,
    l,
    data,
    defaultConfig = {
      debug : false,
      root : document.body,
      interval: 1000
    }/*,
    defaultProperties = {
      'color' : COLOR,
      'margin' : MARGIN,
      'class' : ''
    }*/;

    config = merge(defaultConfig, config);
//    this.defaults = merge(defaultProperties, defaults);

    // two events are fired
    this.events = {
      'pop' : function(target, popover) { },
      'unpop' : function(target, popover) { }
    };

    this.enabled = true;
    this.interval = config.interval;
    this.debug = config.debug;
    this.data = config.data;
//    this.listeners = {};

    node = config.root ? (config.root instanceof HTMLElement ? config.root : document.querySelector(config.root)) : document.body;

    if (! node) {
      throw Error('Invalid Tiler root [' + config.root + ']');
    }

    this.root = node;

    var
    styles = window.getComputedStyle(node),
    width = parseInt(styles.width),
    height = parseInt(styles.height),
    dimension = gcd(width, height),
    numberOfTiles = width * height / dimension / dimension,
    i = 0,
    tile = null,
    index = 0;

    console.log(dimension, width, height, numberOfTiles);

    // initialize tiles
    for (i = 0; i < numberOfTiles; i++) {

      tile = document.createElement('div');
      index = Math.floor(Math.random() * this.data.length);

      tile.style.width = dimension + 'px';
      tile.style.height = dimension + 'px';

      tile.className = this.data[index];
      this.root.appendChild(tile);

      window.setTimeout(function() { this.classList.add('on'); }.bind(tile), i * 100);
    }

    this.timeout = window.setInterval(function() {

      var scope = arguments[0];
//      scope.randomize();

    }, this.interval, this);

    this.randomize = function() {

      var tiles = this.root.querySelectorAll('div');
      var tileIndex = Math.floor(Math.random() * tiles.length);

//      tiles[tileIndex].classList.remove(tiles[tileIndex].classList.item(1));

      var dataIndex = Math.floor(Math.random() * this.data.length);
      tiles[tileIndex].className = this.data[dataIndex] +  ' on';

      console.log(this.data[dataIndex], tileIndex);
    };

    this.destroy = function() {

//      var n;
      // remove resize listener
      window.removeEventListener('resize', this.windowResizer);
      return this;
    };

    if (this.debug) { window.console.log(this.toString()); }
  };

  /*!
   * Attach a listener to `pop`/`unpop` events
   *
   * @param event {String} - one of `pop` or `unpop`
   * @param method {Function} - the method that will be invoked on the relevant event
   * @chainable
  window.Tiler.prototype.on = function(event, method) {
    this.events[event] = method;
    return this;
  };
   */

  /**
   * Return a string representation of the instance
   *
   * @return {String}
   */
  window.Tiler.prototype.toString = function() {
    return 'Tiler ' + JSON.stringify({root : '' + this.root, enabled : this.enabled, delay : this.interval, debug : this.debug});
  };

}());
