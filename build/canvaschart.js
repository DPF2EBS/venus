if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError("this is null or not defined");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
    if (thisArg) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n != n) {
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}
if (!Object.keys) Object.keys = function (o) {
  if (o !== Object(o)) throw new TypeError('Object.keys called on a non-object');
  var k = [],
    p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
  return k;
};
var Kinetic = {};
Kinetic.Filters = {};
Kinetic.Global = {
  BUBBLE_WHITELIST: ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'click', 'dblclick', 'touchstart', 'touchmove', 'touchend', 'tap', 'dbltap', 'dragstart', 'dragmove', 'dragend'],
  stages: [],
  idCounter: 0,
  tempNodes: [],
  maxDragTimeInterval: 20,
  drag: {
    moving: false,
    offset: {
      x: 0,
      y: 0
    },
    lastDrawTime: 0
  },
  warn: function (str) {
    if (console && console.warn) {
      console.warn('Kinetic warning: ' + str);
    }
  },
  _pullNodes: function (stage) {
    var tempNodes = this.tempNodes;
    for (var n = 0; n < tempNodes.length; n++) {
      var node = tempNodes[n];
      if (node.getStage() !== undefined && node.getStage()._id === stage._id) {
        stage._addId(node);
        stage._addName(node);
        this.tempNodes.splice(n, 1);
        n -= 1;
      }
    }
  }
};
Kinetic.Type = {
  _isElement: function (obj) {
    return !!(obj && obj.nodeType == 1);
  },
  _isFunction: function (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },
  _isObject: function (obj) {
    return ( !! obj && obj.constructor == Object);
  },
  _isArray: function (obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  },
  _isNumber: function (obj) {
    return Object.prototype.toString.call(obj) == '[object Number]';
  },
  _isString: function (obj) {
    return Object.prototype.toString.call(obj) == '[object String]';
  },
  _hasMethods: function (obj) {
    var names = [];
    for (var key in obj) {
      if (this._isFunction(obj[key])) names.push(key);
    }
    return names.length > 0;
  },
  _getXY: function (arg) {
    if (this._isNumber(arg)) {
      return {
        x: arg,
        y: arg
      };
    } else if (this._isArray(arg)) {
      if (arg.length === 1) {
        var val = arg[0];
        if (this._isNumber(val)) {
          return {
            x: val,
            y: val
          };
        } else if (this._isArray(val)) {
          return {
            x: val[0],
            y: val[1]
          };
        } else if (this._isObject(val)) {
          return val;
        }
      } else if (arg.length >= 2) {
        return {
          x: arg[0],
          y: arg[1]
        };
      }
    } else if (this._isObject(arg)) {
      return arg;
    }
    return {
      x: 0,
      y: 0
    };
  },
  _getSize: function (arg) {
    if (this._isNumber(arg)) {
      return {
        width: arg,
        height: arg
      };
    } else if (this._isArray(arg)) {
      if (arg.length === 1) {
        var val = arg[0];
        if (this._isNumber(val)) {
          return {
            width: val,
            height: val
          };
        } else if (this._isArray(val)) {
          if (val.length >= 4) {
            return {
              width: val[2],
              height: val[3]
            };
          } else if (val.length >= 2) {
            return {
              width: val[0],
              height: val[1]
            };
          }
        } else if (this._isObject(val)) {
          return val;
        }
      } else if (arg.length >= 4) {
        return {
          width: arg[2],
          height: arg[3]
        };
      } else if (arg.length >= 2) {
        return {
          width: arg[0],
          height: arg[1]
        };
      }
    } else if (this._isObject(arg)) {
      return arg;
    }
    return {
      width: 0,
      height: 0
    };
  },
  _getPoints: function (arg) {
    if (arg === undefined) {
      return [];
    }
    if (this._isObject(arg[0])) {
      return arg;
    } else {
      var arr = [];
      for (var n = 0; n < arg.length; n += 2) {
        arr.push({
          x: arg[n],
          y: arg[n + 1]
        });
      }
      return arr;
    }
  },
  _getImage: function (arg, callback) {
    if (!arg) {
      callback(null);
    } else if (this._isElement(arg)) {
      callback(arg);
    } else if (this._isString(arg)) {
      var imageObj = new Image();
      imageObj.onload = function () {
        callback(imageObj);
      }
      imageObj.src = arg;
    } else if (arg.data) {
      var canvas = document.createElement('canvas');
      canvas.width = arg.width;
      canvas.height = arg.height;
      var context = canvas.getContext('2d');
      context.putImageData(arg, 0, 0);
      var dataUrl = canvas.toDataURL();
      var imageObj = new Image();
      imageObj.onload = function () {
        callback(imageObj);
      }
      imageObj.src = dataUrl;
    } else {
      callback(null);
    }
  }
};
Kinetic.Canvas = function (width, height) {
  this.element = document.createElement('canvas');
  this.context = this.element.getContext('2d');
  this.element.width = width;
  this.element.height = height;
};
Kinetic.Canvas.prototype = {
  clear: function () {
    var context = this.getContext();
    var el = this.getElement();
    context.clearRect(0, 0, el.width, el.height);
  },
  getElement: function () {
    return this.element;
  },
  getContext: function () {
    return this.context;
  },
  setWidth: function (width) {
    this.element.width = width;
  },
  setHeight: function (height) {
    this.element.height = height;
  },
  getWidth: function () {
    return this.element.width;
  },
  getHeight: function () {
    return this.element.height;
  },
  setSize: function (width, height) {
    this.setWidth(width);
    this.setHeight(height);
  },
  strip: function () {
    var context = this.context;
    context.stroke = function () {};
    context.fill = function () {};
    context.fillRect = function (x, y, width, height) {
      context.rect(x, y, width, height);
    };
    context.strokeRect = function (x, y, width, height) {
      context.rect(x, y, width, height);
    };
    context.drawImage = function () {};
    context.fillText = function () {};
    context.strokeText = function () {};
  },
  toDataURL: function (mimeType, quality) {
    try {
      return this.element.toDataURL(mimeType, quality);
    } catch (e) {
      return this.element.toDataURL();
    }
  }
};
(function () {
  var initializing = false;
  Kinetic.Class = function () {};
  Kinetic.Class.extend = function (prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" ? (function (name, fn) {
        return function () {
          var tmp = this._super;
          this._super = _super[name];
          var ret = fn.apply(this, arguments);
          this._super = tmp;
          return ret;
        };
      })(name, prop[name]) : prop[name];
    }

    function Class() {
      if (!initializing && this.init) this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
})();
Kinetic.Animation = {
  animations: [],
  animIdCounter: 0,
  animRunning: false,
  frame: {
    time: 0,
    timeDiff: 0,
    lastTime: 0
  },
  _addAnimation: function (anim) {
    anim.id = this.animIdCounter++;
    this.animations.push(anim);
  },
  _removeAnimation: function (anim) {
    var id = anim.id;
    var animations = this.animations;
    for (var n = 0; n < animations.length; n++) {
      if (animations[n].id === id) {
        this.animations.splice(n, 1);
        return false;
      }
    }
  },
  _runFrames: function () {
    var nodes = {};
    for (var n = 0; n < this.animations.length; n++) {
      var anim = this.animations[n];
      if (anim.node && anim.node._id !== undefined) {
        nodes[anim.node._id] = anim.node;
      }
      if (anim.func) {
        anim.func(this.frame);
      }
    }
    for (var key in nodes) {
      nodes[key].draw();
    }
  },
  _updateFrameObject: function () {
    var date = new Date();
    var time = date.getTime();
    if (this.frame.lastTime === 0) {
      this.frame.lastTime = time;
    } else {
      this.frame.timeDiff = time - this.frame.lastTime;
      this.frame.lastTime = time;
      this.frame.time += this.frame.timeDiff;
    }
  },
  _animationLoop: function () {
    if (this.animations.length > 0) {
      this._updateFrameObject();
      this._runFrames();
      var that = this;
      requestAnimFrame(function () {
        that._animationLoop();
      });
    } else {
      this.animRunning = false;
      this.frame.lastTime = 0;
    }
  },
  _handleAnimation: function () {
    var that = this;
    if (!this.animRunning) {
      this.animRunning = true;
      that._animationLoop();
    } else {
      this.frame.lastTime = 0;
    }
  }
};
requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();
Kinetic.Node = Kinetic.Class.extend({
  init: function (config) {
    this.defaultNodeAttrs = {
      visible: true,
      listening: true,
      name: undefined,
      alpha: 1,
      x: 0,
      y: 0,
      scale: {
        x: 1,
        y: 1
      },
      rotation: 0,
      offset: {
        x: 0,
        y: 0
      },
      dragConstraint: 'none',
      dragBounds: {},
      draggable: false
    };
    this.setDefaultAttrs(this.defaultNodeAttrs);
    this.eventListeners = {};
    this.setAttrs(config);
    this.on('draggableChange.kinetic', function () {
      this._onDraggableChange();
    });
    var that = this;
    this.on('idChange.kinetic', function (evt) {
      var stage = that.getStage();
      if (stage) {
        stage._removeId(evt.oldVal);
        stage._addId(that);
      }
    });
    this.on('nameChange.kinetic', function (evt) {
      var stage = that.getStage();
      if (stage) {
        stage._removeName(evt.oldVal, that._id);
        stage._addName(that);
      }
    });
    this._onDraggableChange();
  },
  on: function (typesStr, handler) {
    var types = typesStr.split(' ');
    for (var n = 0; n < types.length; n++) {
      var type = types[n];
      var event = type;
      var parts = event.split('.');
      var baseEvent = parts[0];
      var name = parts.length > 1 ? parts[1] : '';
      if (!this.eventListeners[baseEvent]) {
        this.eventListeners[baseEvent] = [];
      }
      this.eventListeners[baseEvent].push({
        name: name,
        handler: handler
      });
    }
  },
  off: function (typesStr) {
    var types = typesStr.split(' ');
    for (var n = 0; n < types.length; n++) {
      var type = types[n];
      var event = type;
      var parts = event.split('.');
      var baseEvent = parts[0];
      if (this.eventListeners[baseEvent] && parts.length > 1) {
        var name = parts[1];
        for (var i = 0; i < this.eventListeners[baseEvent].length; i++) {
          if (this.eventListeners[baseEvent][i].name === name) {
            this.eventListeners[baseEvent].splice(i, 1);
            if (this.eventListeners[baseEvent].length === 0) {
              delete this.eventListeners[baseEvent];
              break;
            }
            i--;
          }
        }
      } else {
        delete this.eventListeners[baseEvent];
      }
    }
  },
  getAttrs: function () {
    return this.attrs;
  },
  setDefaultAttrs: function (config) {
    if (this.attrs === undefined) {
      this.attrs = {};
    }
    if (config) {
      for (var key in config) {
        if (this.attrs[key] === undefined) {
          this.attrs[key] = config[key];
        }
      }
    }
  },
  setAttrs: function (config) {
    var type = Kinetic.Type;
    var that = this;
    if (config !== undefined) {
      function setAttrs(obj, c, level) {
        for (var key in c) {
          var val = c[key];
          var oldVal = obj[key];
          if (level === 0) {
            that._fireBeforeChangeEvent(key, oldVal, val);
          }
          if (obj[key] === undefined && val !== undefined) {
            obj[key] = {};
          }
          if (type._isObject(val) && !type._isArray(val) && !type._isElement(val) && !type._hasMethods(val)) {
            if (!Kinetic.Type._isObject(obj[key])) {
              obj[key] = {};
            }
            setAttrs(obj[key], val, level + 1);
          } else {
            switch (key) {
            case 'rotationDeg':
              that._setAttr(obj, 'rotation', c[key] * Math.PI / 180);
              key = 'rotation';
              break;
            case 'offset':
              var pos = type._getXY(val);
              that._setAttr(obj[key], 'x', pos.x);
              that._setAttr(obj[key], 'y', pos.y);
              break;
            case 'scale':
              var pos = type._getXY(val);
              that._setAttr(obj[key], 'x', pos.x);
              that._setAttr(obj[key], 'y', pos.y);
              break;
            case 'points':
              that._setAttr(obj, key, type._getPoints(val));
              break;
            case 'crop':
              var pos = type._getXY(val);
              var size = type._getSize(val);
              that._setAttr(obj[key], 'x', pos.x);
              that._setAttr(obj[key], 'y', pos.y);
              that._setAttr(obj[key], 'width', size.width);
              that._setAttr(obj[key], 'height', size.height);
              break;
            default:
              that._setAttr(obj, key, val);
              break;
            }
          }
          if (level === 0) {
            that._fireChangeEvent(key, oldVal, val);
          }
        }
      }
      setAttrs(this.attrs, config, 0);
    }
  },
  isVisible: function () {
    if (this.attrs.visible && this.getParent() && !this.getParent().isVisible()) {
      return false;
    }
    return this.attrs.visible;
  },
  show: function () {
    this.setAttrs({
      visible: true
    });
  },
  hide: function () {
    this.setAttrs({
      visible: false
    });
  },
  getZIndex: function () {
    return this.index;
  },
  getAbsoluteZIndex: function () {
    var level = this.getLevel();
    var stage = this.getStage();
    var that = this;
    var index = 0;
    function addChildren(children) {
      var nodes = [];
      for (var n = 0; n < children.length; n++) {
        var child = children[n];
        index++;
        if (child.nodeType !== 'Shape') {
          nodes = nodes.concat(child.getChildren());
        }
        if (child._id === that._id) {
          n = children.length;
        }
      }
      if (nodes.length > 0 && nodes[0].getLevel() <= level) {
        addChildren(nodes);
      }
    }
    if (that.nodeType !== 'Stage') {
      addChildren(that.getStage().getChildren());
    }
    return index;
  },
  getLevel: function () {
    var level = 0;
    var parent = this.parent;
    while (parent) {
      level++;
      parent = parent.parent;
    }
    return level;
  },
  setPosition: function () {
    var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    this.setAttrs(pos);
  },
  getPosition: function () {
    return {
      x: this.attrs.x,
      y: this.attrs.y
    };
  },
  getAbsolutePosition: function () {
    var trans = this.getAbsoluteTransform();
    var o = this.getOffset();
    trans.translate(o.x, o.y);
    return trans.getTranslation();
  },
  setAbsolutePosition: function () {
    var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    var trans = this._clearTransform();
    this.attrs.x = trans.x;
    this.attrs.y = trans.y;
    delete trans.x;
    delete trans.y;
    var it = this.getAbsoluteTransform();
    it.invert();
    it.translate(pos.x, pos.y);
    pos = {
      x: this.attrs.x + it.getTranslation().x,
      y: this.attrs.y + it.getTranslation().y
    };
    this.setPosition(pos.x, pos.y);
    this._setTransform(trans);
  },
  move: function () {
    var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    var x = this.getX();
    var y = this.getY();
    if (pos.x !== undefined) {
      x += pos.x;
    }
    if (pos.y !== undefined) {
      y += pos.y;
    }
    this.setAttrs({
      x: x,
      y: y
    });
  },
  getRotationDeg: function () {
    return this.attrs.rotation * 180 / Math.PI;
  },
  rotate: function (theta) {
    this.setAttrs({
      rotation: this.getRotation() + theta
    });
  },
  rotateDeg: function (deg) {
    this.setAttrs({
      rotation: this.getRotation() + (deg * Math.PI / 180)
    });
  },
  moveToTop: function () {
    var index = this.index;
    this.parent.children.splice(index, 1);
    this.parent.children.push(this);
    this.parent._setChildrenIndices();
  },
  moveUp: function () {
    var index = this.index;
    this.parent.children.splice(index, 1);
    this.parent.children.splice(index + 1, 0, this);
    this.parent._setChildrenIndices();
  },
  moveDown: function () {
    var index = this.index;
    if (index > 0) {
      this.parent.children.splice(index, 1);
      this.parent.children.splice(index - 1, 0, this);
      this.parent._setChildrenIndices();
    }
  },
  moveToBottom: function () {
    var index = this.index;
    this.parent.children.splice(index, 1);
    this.parent.children.unshift(this);
    this.parent._setChildrenIndices();
  },
  setZIndex: function (zIndex) {
    var index = this.index;
    this.parent.children.splice(index, 1);
    this.parent.children.splice(zIndex, 0, this);
    this.parent._setChildrenIndices();
  },
  getAbsoluteAlpha: function () {
    var absAlpha = 1;
    var node = this;
    while (node.nodeType !== 'Stage') {
      absAlpha *= node.attrs.alpha;
      node = node.parent;
    }
    return absAlpha;
  },
  isDragging: function () {
    var go = Kinetic.Global;
    return go.drag.node !== undefined && go.drag.node._id === this._id && go.drag.moving;
  },
  moveTo: function (newContainer) {
    var parent = this.parent;
    parent.children.splice(this.index, 1);
    parent._setChildrenIndices();
    newContainer.children.push(this);
    this.index = newContainer.children.length - 1;
    this.parent = newContainer;
    newContainer._setChildrenIndices();
  },
  getParent: function () {
    return this.parent;
  },
  getLayer: function () {
    if (this.nodeType === 'Layer') {
      return this;
    } else {
      return this.getParent().getLayer();
    }
  },
  getStage: function () {
    if (this.nodeType !== 'Stage' && this.getParent()) {
      return this.getParent().getStage();
    } else if (this.nodeType === 'Stage') {
      return this;
    } else {
      return undefined;
    }
  },
  simulate: function (eventType) {
    this._handleEvent(eventType, {});
  },
  transitionTo: function (config) {
    var a = Kinetic.Animation;
    if (this.transAnim) {
      a._removeAnimation(this.transAnim);
      this.transAnim = null;
    }
    var node = this.nodeType === 'Stage' ? this : this.getLayer();
    var that = this;
    var trans = new Kinetic.Transition(this, config);
    var anim = {
      func: function () {
        trans._onEnterFrame();
      },
      node: node
    };
    this.transAnim = anim;
    a._addAnimation(anim);
    trans.onFinished = function () {
      a._removeAnimation(anim);
      that.transAnim = null;
      if (config.callback !== undefined) {
        config.callback();
      }
      anim.node.draw();
    };
    trans.start();
    a._handleAnimation();
    return trans;
  },
  getAbsoluteTransform: function () {
    var am = new Kinetic.Transform();
    var family = [];
    var parent = this.parent;
    family.unshift(this);
    while (parent) {
      family.unshift(parent);
      parent = parent.parent;
    }
    for (var n = 0; n < family.length; n++) {
      var node = family[n];
      var m = node.getTransform();
      am.multiply(m);
    }
    return am;
  },
  getTransform: function () {
    var m = new Kinetic.Transform();
    if (this.attrs.x !== 0 || this.attrs.y !== 0) {
      m.translate(this.attrs.x, this.attrs.y);
    }
    if (this.attrs.rotation !== 0) {
      m.rotate(this.attrs.rotation);
    }
    if (this.attrs.scale.x !== 1 || this.attrs.scale.y !== 1) {
      m.scale(this.attrs.scale.x, this.attrs.scale.y);
    }
    if (this.attrs.offset && (this.attrs.offset.x !== 0 || this.attrs.offset.y !== 0)) {
      m.translate(-1 * this.attrs.offset.x, -1 * this.attrs.offset.y);
    }
    return m;
  },
  clone: function (obj) {
    var classType = this.shapeType || this.nodeType;
    var node = new Kinetic[classType](this.attrs);
    for (var key in this.eventListeners) {
      var allListeners = this.eventListeners[key];
      for (var n = 0; n < allListeners.length; n++) {
        var listener = allListeners[n];
        if (listener.name.indexOf('kinetic') < 0) {
          if (!node.eventListeners[key]) {
            node.eventListeners[key] = [];
          }
          node.eventListeners[key].push(listener);
        }
      }
    }
    node.setAttrs(obj);
    return node;
  },
  saveImageData: function (width, height) {
    try {
      var canvas;
      if (width && height) {
        canvas = new Kinetic.Canvas(width, height);
      } else {
        var stage = this.getStage();
        canvas = stage.bufferCanvas;
      }
      var context = canvas.getContext();
      canvas.clear();
      this._draw(canvas);
      var imageData = context.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
      this.imageData = imageData;
    } catch (e) {
      Kinetic.Global.warn('Image data could not saved because canvas is dirty.');
    }
  },
  clearImageData: function () {
    delete this.imageData;
  },
  getImageData: function () {
    return this.imageData;
  },
  toDataURL: function (config) {
    var mimeType = config && config.mimeType ? config.mimeType : null;
    var quality = config && config.quality ? config.quality : null;
    var canvas;
    if (config && config.width && config.height) {
      canvas = new Kinetic.Canvas(config.width, config.height);
    } else {
      canvas = this.getStage().bufferCanvas;
    }
    var context = canvas.getContext();
    canvas.clear();
    this._draw(canvas);
    return canvas.toDataURL(mimeType, quality);
  },
  toImage: function (config) {
    Kinetic.Type._getImage(this.toDataURL(config), function (img) {
      config.callback(img);
    });
  },
  _clearTransform: function () {
    var trans = {
      x: this.attrs.x,
      y: this.attrs.y,
      rotation: this.attrs.rotation,
      scale: {
        x: this.attrs.scale.x,
        y: this.attrs.scale.y
      },
      offset: {
        x: this.attrs.offset.x,
        y: this.attrs.offset.y
      }
    };
    this.attrs.x = 0;
    this.attrs.y = 0;
    this.attrs.rotation = 0;
    this.attrs.scale = {
      x: 1,
      y: 1
    };
    this.attrs.offset = {
      x: 0,
      y: 0
    };
    return trans;
  },
  _setTransform: function (trans) {
    for (var key in trans) {
      this.attrs[key] = trans[key];
    }
  },
  _setImageData: function (imageData) {
    if (imageData && imageData.data) {
      this.imageData = imageData;
    }
  },
  _fireBeforeChangeEvent: function (attr, oldVal, newVal) {
    this._handleEvent('before' + attr.toUpperCase() + 'Change', {
      oldVal: oldVal,
      newVal: newVal
    });
  },
  _fireChangeEvent: function (attr, oldVal, newVal) {
    this._handleEvent(attr + 'Change', {
      oldVal: oldVal,
      newVal: newVal
    });
  },
  _setAttr: function (obj, attr, val) {
    if (val !== undefined) {
      if (obj === undefined) {
        obj = {};
      }
      obj[attr] = val;
    }
  },
  _listenDrag: function () {
    this._dragCleanup();
    var go = Kinetic.Global;
    var that = this;
    this.on('mousedown.kinetic touchstart.kinetic', function (evt) {
      that._initDrag();
    });
  },
  _initDrag: function () {
    var go = Kinetic.Global;
    var stage = this.getStage();
    var pos = stage.getUserPosition();
    if (pos) {
      var m = this.getTransform().getTranslation();
      var am = this.getAbsoluteTransform().getTranslation();
      var ap = this.getAbsolutePosition();
      go.drag.node = this;
      go.drag.offset.x = pos.x - ap.x;
      go.drag.offset.y = pos.y - ap.y;
    }
  },
  _onDraggableChange: function () {
    if (this.attrs.draggable) {
      this._listenDrag();
    } else {
      this._dragCleanup();
      var stage = this.getStage();
      var go = Kinetic.Global;
      if (stage && go.drag.node && go.drag.node._id === this._id) {
        stage._endDrag();
      }
    }
  },
  _dragCleanup: function () {
    this.off('mousedown.kinetic');
    this.off('touchstart.kinetic');
  },
  _handleEvent: function (eventType, evt) {
    if (this.nodeType === 'Shape') {
      evt.shape = this;
    }
    var stage = this.getStage();
    var mover = stage ? stage.mouseoverShape : null;
    var mout = stage ? stage.mouseoutShape : null;
    var el = this.eventListeners;
    var okayToRun = true;
    if (eventType === 'mouseover' && mout && mout._id === this._id) {
      okayToRun = false;
    } else if (eventType === 'mouseout' && mover && mover._id === this._id) {
      okayToRun = false;
    }
    if (okayToRun) {
      if (el[eventType]) {
        var events = el[eventType];
        for (var i = 0; i < events.length; i++) {
          events[i].handler.apply(this, [evt]);
        }
      }
      if (stage && mover && mout) {
        stage.mouseoverShape = mover.parent;
        stage.mouseoutShape = mout.parent;
      }
      if (Kinetic.Global.BUBBLE_WHITELIST.indexOf(eventType) >= 0 && !evt.cancelBubble && this.parent) {
        this._handleEvent.call(this.parent, eventType, evt);
      }
    }
  }
});
Kinetic.Node.addSetters = function (constructor, arr) {
  for (var n = 0; n < arr.length; n++) {
    var attr = arr[n];
    this._addSetter(constructor, attr);
  }
};
Kinetic.Node.addGetters = function (constructor, arr) {
  for (var n = 0; n < arr.length; n++) {
    var attr = arr[n];
    this._addGetter(constructor, attr);
  }
};
Kinetic.Node.addGettersSetters = function (constructor, arr) {
  this.addSetters(constructor, arr);
  this.addGetters(constructor, arr);
};
Kinetic.Node._addSetter = function (constructor, attr) {
  var that = this;
  var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
  constructor.prototype[method] = function () {
    if (arguments.length == 1) {
      arg = arguments[0];
    } else {
      arg = Array.prototype.slice.call(arguments);
    }
    var obj = {};
    obj[attr] = arg;
    this.setAttrs(obj);
  };
};
Kinetic.Node._addGetter = function (constructor, attr) {
  var that = this;
  var method = 'get' + attr.charAt(0).toUpperCase() + attr.slice(1);
  constructor.prototype[method] = function (arg) {
    return this.attrs[attr];
  };
};
Kinetic.Node.addGettersSetters(Kinetic.Node, ['x', 'y', 'scale', 'detectionType', 'rotation', 'alpha', 'name', 'id', 'offset', 'draggable', 'dragConstraint', 'dragBounds', 'listening']);
Kinetic.Node.addSetters(Kinetic.Node, ['rotationDeg']);
Kinetic.Container = Kinetic.Node.extend({
  init: function (config) {
    this.children = [];
    this._super(config);
  },
  getChildren: function () {
    return this.children;
  },
  removeChildren: function () {
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
  },
  add: function (child) {
    child._id = Kinetic.Global.idCounter++;
    child.index = this.children.length;
    child.parent = this;
    this.children.push(child);
    var stage = child.getStage();
    if (stage === undefined) {
      var go = Kinetic.Global;
      go.tempNodes.push(child);
    } else {
      stage._addId(child);
      stage._addName(child);
      var go = Kinetic.Global;
      go._pullNodes(stage);
    }
    if (this._add !== undefined) {
      this._add(child);
    }
    return this;
  },
  remove: function (child) {
    if (child && child.index !== undefined && this.children[child.index]._id == child._id) {
      var stage = this.getStage();
      if (stage !== undefined) {
        stage._removeId(child.getId());
        stage._removeName(child.getName(), child._id);
      }
      var go = Kinetic.Global;
      for (var n = 0; n < go.tempNodes.length; n++) {
        var node = go.tempNodes[n];
        if (node._id === child._id) {
          go.tempNodes.splice(n, 1);
          break;
        }
      }
      this.children.splice(child.index, 1);
      this._setChildrenIndices();
      while (child.children && child.children.length > 0) {
        child.remove(child.children[0]);
      }
      if (this._remove !== undefined) {
        this._remove(child);
      }
    }
    return this;
  },
  get: function (selector) {
    var stage = this.getStage();
    var arr;
    var key = selector.slice(1);
    if (selector.charAt(0) === '#') {
      arr = stage.ids[key] !== undefined ? [stage.ids[key]] : [];
    } else if (selector.charAt(0) === '.') {
      arr = stage.names[key] !== undefined ? stage.names[key] : [];
    } else if (selector === 'Shape' || selector === 'Group' || selector === 'Layer') {
      return this._getNodes(selector);
    } else {
      return false;
    }
    var retArr = [];
    for (var n = 0; n < arr.length; n++) {
      var node = arr[n];
      if (this.isAncestorOf(node)) {
        retArr.push(node);
      }
    }
    return retArr;
  },
  isAncestorOf: function (node) {
    if (this.nodeType === 'Stage') {
      return true;
    }
    var parent = node.getParent();
    while (parent) {
      if (parent._id === this._id) {
        return true;
      }
      parent = parent.getParent();
    }
    return false;
  },
  getIntersections: function () {
    var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    var arr = [];
    var shapes = this.get('Shape');
    for (var n = 0; n < shapes.length; n++) {
      var shape = shapes[n];
      if (shape.isVisible() && shape.intersects(pos)) {
        arr.push(shape);
      }
    }
    return arr;
  },
  _getNodes: function (sel) {
    var arr = [];
    function traverse(cont) {
      var children = cont.getChildren();
      for (var n = 0; n < children.length; n++) {
        var child = children[n];
        if (child.nodeType === sel) {
          arr.push(child);
        } else if (child.nodeType !== 'Shape') {
          traverse(child);
        }
      }
    }
    traverse(this);
    return arr;
  },
  _drawChildren: function (canvas) {
    var stage = this.getStage();
    var children = this.children;
    for (var n = 0; n < children.length; n++) {
      var child = children[n];
      if (child.nodeType === 'Shape') {
        if (child.isVisible() && stage.isVisible()) {
          child._draw(canvas);
        }
      } else {
        child.draw(canvas);
      }
    }
  },
  _setChildrenIndices: function () {
    for (var n = 0; n < this.children.length; n++) {
      this.children[n].index = n;
    }
  }
});
Kinetic.Stage = Kinetic.Container.extend({
  init: function (config) {
    this.setDefaultAttrs({
      width: 400,
      height: 200,
      throttle: 80
    });
    if (typeof config.container === 'string') {
      config.container = document.getElementById(config.container);
    }
    this._super(config);
    this._setStageDefaultProperties();
    this._id = Kinetic.Global.idCounter++;
    this._buildDOM();
    this._bindContentEvents();
    this.on('widthChange.kinetic', function () {
      this._resizeDOM();
    });
    this.on('heightChange.kinetic', function () {
      this._resizeDOM();
    });
    var go = Kinetic.Global;
    go.stages.push(this);
    this._addId(this);
    this._addName(this);
  },
  onFrame: function (func) {
    this.anim = {
      func: func
    };
  },
  start: function () {
    if (!this.animRunning) {
      var a = Kinetic.Animation;
      a._addAnimation(this.anim);
      a._handleAnimation();
      this.animRunning = true;
    }
  },
  stop: function () {
    Kinetic.Animation._removeAnimation(this.anim);
    this.animRunning = false;
  },
  draw: function (canvas) {
    this._draw(canvas);
  },
  setSize: function () {
    var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(size);
  },
  getSize: function () {
    return {
      width: this.attrs.width,
      height: this.attrs.height
    };
  },
  clear: function () {
    var layers = this.children;
    for (var n = 0; n < layers.length; n++) {
      layers[n].clear();
    }
  },
  toJSON: function () {
    var type = Kinetic.Type;
    function addNode(node) {
      var obj = {};
      obj.attrs = {};
      for (var key in node.attrs) {
        var val = node.attrs[key];
        if (!type._isFunction(val) && !type._isElement(val) && !type._hasMethods(val)) {
          obj.attrs[key] = val;
        }
      }
      obj.nodeType = node.nodeType;
      obj.shapeType = node.shapeType;
      if (node.nodeType !== 'Shape') {
        obj.children = [];
        var children = node.getChildren();
        for (var n = 0; n < children.length; n++) {
          var child = children[n];
          obj.children.push(addNode(child));
        }
      }
      return obj;
    }
    return JSON.stringify(addNode(this));
  },
  reset: function () {
    this.removeChildren();
    this._setStageDefaultProperties();
    this.setAttrs(this.defaultNodeAttrs);
  },
  load: function (json) {
    this.reset();
    function loadNode(node, obj) {
      var children = obj.children;
      if (children !== undefined) {
        for (var n = 0; n < children.length; n++) {
          var child = children[n];
          var type;
          if (child.nodeType === 'Shape') {
            if (child.shapeType === undefined) {
              type = 'Shape';
            } else {
              type = child.shapeType;
            }
          } else {
            type = child.nodeType;
          }
          var no = new Kinetic[type](child.attrs);
          node.add(no);
          loadNode(no, child);
        }
      }
    }
    var obj = JSON.parse(json);
    this.attrs = obj.attrs;
    loadNode(this, obj);
    this.draw();
  },
  getMousePosition: function (evt) {
    return this.mousePos;
  },
  getTouchPosition: function (evt) {
    return this.touchPos;
  },
  getUserPosition: function (evt) {
    return this.getTouchPosition() || this.getMousePosition();
  },
  getContainer: function () {
    return this.attrs.container;
  },
  getStage: function () {
    return this;
  },
  getDOM: function () {
    return this.content;
  },
  toDataURL: function (config) {
    var mimeType = config && config.mimeType ? config.mimeType : null;
    var quality = config && config.quality ? config.quality : null;
    var width = config && config.width ? config.width : this.attrs.width;
    var height = config && config.height ? config.height : this.attrs.height;
    var canvas = new Kinetic.Canvas(width, height);
    var context = canvas.getContext();
    var layers = this.children;
    function drawLayer(n) {
      var layer = layers[n];
      var layerUrl = layer.getCanvas().toDataURL(mimeType, quality);
      var imageObj = new Image();
      imageObj.onload = function () {
        context.drawImage(imageObj, 0, 0);
        if (n < layers.length - 1) {
          drawLayer(n + 1);
        } else {
          config.callback(canvas.toDataURL(mimeType, quality));
        }
      };
      imageObj.src = layerUrl;
    }
    drawLayer(0);
  },
  toImage: function (config) {
    this.toDataURL({
      callback: function (dataUrl) {
        Kinetic.Type._getImage(dataUrl, function (img) {
          config.callback(img);
        });
      }
    });
  },
  _resizeDOM: function () {
    var width = this.attrs.width;
    var height = this.attrs.height;
    this.content.style.width = width + 'px';
    this.content.style.height = height + 'px';
    this.bufferCanvas.setSize(width, height);
    this.pathCanvas.setSize(width, height);
    var layers = this.children;
    for (var n = 0; n < layers.length; n++) {
      var layer = layers[n];
      layer.getCanvas().setSize(width, height);
      layer.draw();
    }
  },
  _remove: function (layer) {
    try {
      this.content.removeChild(layer.canvas);
    } catch (e) {}
  },
  _add: function (layer) {
    layer.canvas.setSize(this.attrs.width, this.attrs.height);
    layer.draw();
    this.content.appendChild(layer.canvas.element);
    layer.lastDrawTime = 0;
  },
  _detectEvent: function (shape, evt) {
    var isDragging = Kinetic.Global.drag.moving;
    var go = Kinetic.Global;
    var pos = this.getUserPosition();
    var el = shape.eventListeners;
    var that = this;
    if (this.targetShape && shape._id === this.targetShape._id) {
      this.targetFound = true;
    }
    if (shape.isVisible() && pos !== undefined && shape.intersects(pos)) {
      if (!isDragging && this.mouseDown) {
        this.mouseDown = false;
        this.clickStart = true;
        shape._handleEvent('mousedown', evt);
        return true;
      } else if (this.mouseUp) {
        this.mouseUp = false;
        shape._handleEvent('mouseup', evt);
        if (this.clickStart) {
          if ((!go.drag.moving) || !go.drag.node) {
            shape._handleEvent('click', evt);
            if (this.inDoubleClickWindow) {
              shape._handleEvent('dblclick', evt);
            }
            this.inDoubleClickWindow = true;
            setTimeout(function () {
              that.inDoubleClickWindow = false;
            }, this.dblClickWindow);
          }
        }
        return true;
      } else if (!isDragging && this.touchStart && !this.touchMove) {
        this.touchStart = false;
        this.tapStart = true;
        shape._handleEvent('touchstart', evt);
        return true;
      } else if (this.touchEnd) {
        this.touchEnd = false;
        shape._handleEvent('touchend', evt);
        if (this.tapStart) {
          if ((!go.drag.moving) || !go.drag.node) {
            shape._handleEvent('tap', evt);
            if (this.inDoubleClickWindow) {
              shape._handleEvent('dbltap', evt);
            }
            this.inDoubleClickWindow = true;
            setTimeout(function () {
              that.inDoubleClickWindow = false;
            }, this.dblClickWindow);
          }
        }
        return true;
      } else if (!isDragging && this.touchMove) {
        shape._handleEvent('touchmove', evt);
        return true;
      } else if (!isDragging && this._isNewTarget(shape, evt)) {
        if (this.mouseoutShape) {
          this.mouseoverShape = shape;
          this.mouseoutShape._handleEvent('mouseout', evt);
          this.mouseoverShape = undefined;
        }
        shape._handleEvent('mouseover', evt);
        this._setTarget(shape);
        return true;
      } else {
        if (!isDragging && this.mouseMove) {
          shape._handleEvent('mousemove', evt);
          return true;
        }
      }
    } else if (!isDragging && this.targetShape && this.targetShape._id === shape._id) {
      this._setTarget(undefined);
      this.mouseoutShape = shape;
      return true;
    }
    return false;
  },
  _setTarget: function (shape) {
    this.targetShape = shape;
    this.targetFound = true;
  },
  _isNewTarget: function (shape, evt) {
    if (!this.targetShape || (!this.targetFound && shape._id !== this.targetShape._id)) {
      if (this.targetShape) {
        var oldEl = this.targetShape.eventListeners;
        if (oldEl) {
          this.mouseoutShape = this.targetShape;
        }
      }
      return true;
    } else {
      return false;
    }
  },
  _traverseChildren: function (obj, evt) {
    var children = obj.children;
    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if (child.getListening()) {
        if (child.nodeType === 'Shape') {
          var exit = this._detectEvent(child, evt);
          if (exit) {
            return true;
          }
        } else {
          var exit = this._traverseChildren(child, evt);
          if (exit) {
            return true;
          }
        }
      }
    }
    return false;
  },
  _handleStageEvent: function (evt) {
    var date = new Date();
    var time = date.getTime();
    this.lastEventTime = time;
    var go = Kinetic.Global;
    if (!evt) {
      evt = window.event;
    }
    this._setMousePosition(evt);
    this._setTouchPosition(evt);
    this.pathCanvas.clear();
    this.targetFound = false;
    var shapeDetected = false;
    for (var n = this.children.length - 1; n >= 0; n--) {
      var layer = this.children[n];
      if (layer.isVisible() && n >= 0 && layer.getListening()) {
        if (this._traverseChildren(layer, evt)) {
          shapeDetected = true;
          break;
        }
      }
    }
    if (!shapeDetected && this.mouseoutShape) {
      this.mouseoutShape._handleEvent('mouseout', evt);
      this.mouseoutShape = undefined;
    }
  },
  _bindContentEvents: function () {
    var go = Kinetic.Global;
    var that = this;
    var events = ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'touchstart', 'touchmove', 'touchend'];
    for (var n = 0; n < events.length; n++) {
      var pubEvent = events[n];
      (function () {
        var event = pubEvent;
        that.content.addEventListener(event, function (evt) {
          that['_' + event](evt);
        }, false);
      }());
    }
  },
  _mouseover: function (evt) {
    this._handleStageEvent(evt);
  },
  _mouseout: function (evt) {
    var targetShape = this.targetShape;
    if (targetShape) {
      targetShape._handleEvent('mouseout', evt);
      this.targetShape = undefined;
    }
    this.mousePos = undefined;
    this._endDrag(evt);
  },
  _mousemove: function (evt) {
    var throttle = this.attrs.throttle;
    var date = new Date();
    var time = date.getTime();
    var timeDiff = time - this.lastEventTime;
    var tt = 1000 / throttle;
    if (timeDiff >= tt || throttle > 200) {
      this.mouseDown = false;
      this.mouseUp = false;
      this.mouseMove = true;
      this._handleStageEvent(evt);
    }
    this._startDrag(evt);
  },
  _mousedown: function (evt) {
    this.mouseDown = true;
    this.mouseUp = false;
    this.mouseMove = false;
    this._handleStageEvent(evt);
    if (this.attrs.draggable) {
      this._initDrag();
    }
  },
  _mouseup: function (evt) {
    this.mouseDown = false;
    this.mouseUp = true;
    this.mouseMove = false;
    this._handleStageEvent(evt);
    this.clickStart = false;
    this._endDrag(evt);
  },
  _touchstart: function (evt) {
    evt.preventDefault();
    this.touchStart = true;
    this.touchEnd = false;
    this.touchMove = false;
    this._handleStageEvent(evt);
    if (this.attrs.draggable) {
      this._initDrag();
    }
  },
  _touchend: function (evt) {
    this.touchStart = false;
    this.touchEnd = true;
    this.touchMove = false;
    this._handleStageEvent(evt);
    this.tapStart = false;
    this._endDrag(evt);
  },
  _touchmove: function (evt) {
    var that = this;
    var throttle = this.attrs.throttle;
    var date = new Date();
    var time = date.getTime();
    var timeDiff = time - this.lastEventTime;
    var tt = 1000 / throttle;
    if (timeDiff >= tt || throttle > 200) {
      evt.preventDefault();
      that.touchEnd = false;
      that.touchMove = true;
      that._handleStageEvent(evt);
    }
    this._startDrag(evt);
  },
  _setMousePosition: function (evt) {
    var mouseX = evt.offsetX || (evt.clientX - this._getContentPosition().left + window.pageXOffset);
    var mouseY = evt.offsetY || (evt.clientY - this._getContentPosition().top + window.pageYOffset);
    this.mousePos = {
      x: mouseX,
      y: mouseY
    };
  },
  _setTouchPosition: function (evt) {
    if (evt.touches !== undefined && evt.touches.length === 1) {
      var touch = evt.touches[0];
      var touchX = touch.clientX - this._getContentPosition().left + window.pageXOffset;
      var touchY = touch.clientY - this._getContentPosition().top + window.pageYOffset;
      this.touchPos = {
        x: touchX,
        y: touchY
      };
    }
  },
  _getContentPosition: function () {
    var rect = this.content.getBoundingClientRect(),
      root = document.documentElement;
    return {
      top: rect.top + root.scrollTop,
      left: rect.left + root.scrollLeft
    };
  },
  _endDrag: function (evt) {
    var go = Kinetic.Global;
    if (go.drag.node) {
      if (go.drag.moving) {
        go.drag.moving = false;
        go.drag.node._handleEvent('dragend', evt);
      }
    }
    go.drag.node = undefined;
  },
  _startDrag: function (evt) {
    var that = this;
    var go = Kinetic.Global;
    var node = go.drag.node;
    if (node) {
      var pos = that.getUserPosition();
      var dc = node.attrs.dragConstraint;
      var db = node.attrs.dragBounds;
      var lastNodePos = {
        x: node.attrs.x,
        y: node.attrs.y
      };
      var newNodePos = {
        x: pos.x - go.drag.offset.x,
        y: pos.y - go.drag.offset.y
      };
      if (db.left !== undefined && newNodePos.x < db.left) {
        newNodePos.x = db.left;
      }
      if (db.right !== undefined && newNodePos.x > db.right) {
        newNodePos.x = db.right;
      }
      if (db.top !== undefined && newNodePos.y < db.top) {
        newNodePos.y = db.top;
      }
      if (db.bottom !== undefined && newNodePos.y > db.bottom) {
        newNodePos.y = db.bottom;
      }
      node.setAbsolutePosition(newNodePos);
      if (dc === 'horizontal') {
        node.attrs.y = lastNodePos.y;
      } else if (dc === 'vertical') {
        node.attrs.x = lastNodePos.x;
      }
      if (go.drag.node.nodeType === 'Stage') {
        go.drag.node.draw();
      } else {
        go.drag.node.getLayer().draw();
      }
      if (!go.drag.moving) {
        go.drag.moving = true;
        go.drag.node._handleEvent('dragstart', evt);
      }
      go.drag.node._handleEvent('dragmove', evt);
    }
  },
  _buildDOM: function () {
    this.content = document.createElement('div');
    this.content.style.position = 'relative';
    this.content.style.display = 'inline-block';
    this.content.className = 'kineticjs-content';
    this.attrs.container.appendChild(this.content);
    this.bufferCanvas = new Kinetic.Canvas({
      width: this.attrs.width,
      height: this.attrs.height
    });
    this.pathCanvas = new Kinetic.Canvas({
      width: this.attrs.width,
      height: this.attrs.height
    });
    this.pathCanvas.strip();
    this._resizeDOM();
  },
  _addId: function (node) {
    if (node.attrs.id !== undefined) {
      this.ids[node.attrs.id] = node;
    }
  },
  _removeId: function (id) {
    if (id !== undefined) {
      delete this.ids[id];
    }
  },
  _addName: function (node) {
    var name = node.attrs.name;
    if (name !== undefined) {
      if (this.names[name] === undefined) {
        this.names[name] = [];
      }
      this.names[name].push(node);
    }
  },
  _removeName: function (name, _id) {
    if (name !== undefined) {
      var nodes = this.names[name];
      if (nodes !== undefined) {
        for (var n = 0; n < nodes.length; n++) {
          var no = nodes[n];
          if (no._id === _id) {
            nodes.splice(n, 1);
          }
        }
        if (nodes.length === 0) {
          delete this.names[name];
        }
      }
    }
  },
  _onContent: function (typesStr, handler) {
    var types = typesStr.split(' ');
    for (var n = 0; n < types.length; n++) {
      var baseEvent = types[n];
      this.content.addEventListener(baseEvent, handler, false);
    }
  },
  _setStageDefaultProperties: function () {
    this.nodeType = 'Stage';
    this.lastEventTime = 0;
    this.dblClickWindow = 400;
    this.targetShape = undefined;
    this.targetFound = false;
    this.mouseoverShape = undefined;
    this.mouseoutShape = undefined;
    this.mousePos = undefined;
    this.mouseDown = false;
    this.mouseUp = false;
    this.mouseMove = false;
    this.clickStart = false;
    this.touchPos = undefined;
    this.touchStart = false;
    this.touchEnd = false;
    this.touchMove = false;
    this.tapStart = false;
    this.ids = {};
    this.names = {};
    this.anim = undefined;
    this.animRunning = false;
  },
  _draw: function (canvas) {
    this._drawChildren(canvas);
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Stage, ['width', 'height', 'throttle']);
Kinetic.Layer = Kinetic.Container.extend({
  init: function (config) {
    this.setDefaultAttrs({
      throttle: 80,
      clearBeforeDraw: true
    });
    this.nodeType = 'Layer';
    this.lastDrawTime = 0;
    this.beforeDrawFunc = undefined;
    this.afterDrawFunc = undefined;
    this.canvas = new Kinetic.Canvas();
    this.canvas.getElement().style.position = 'absolute';
    this._super(config);
  },
  draw: function (canvas) {
    var throttle = this.attrs.throttle;
    var date = new Date();
    var time = date.getTime();
    var timeDiff = time - this.lastDrawTime;
    var tt = 1000 / throttle;
    if (timeDiff >= tt || throttle > 200) {
      this._draw(canvas);
      if (this.drawTimeout !== undefined) {
        clearTimeout(this.drawTimeout);
        this.drawTimeout = undefined;
      }
    } else if (this.drawTimeout === undefined) {
      var that = this;
      this.drawTimeout = setTimeout(function () {
        that.draw(canvas);
      }, 17);
    }
  },
  beforeDraw: function (func) {
    this.beforeDrawFunc = func;
  },
  afterDraw: function (func) {
    this.afterDrawFunc = func;
  },
  getCanvas: function () {
    return this.canvas;
  },
  getContext: function () {
    return this.canvas.context;
  },
  clear: function () {
    this.getCanvas().clear();
  },
  toDataURL: function (config) {
    var canvas;
    var mimeType = config && config.mimeType ? config.mimeType : null;
    var quality = config && config.quality ? config.quality : null;
    if (config && config.width && config.height) {
      canvas = new Kinetic.Canvas(config.width, config.height);
    } else {
      canvas = this.getCanvas();
    }
    return canvas.toDataURL(mimeType, quality);
  },
  _draw: function (canvas) {
    if (!canvas) {
      canvas = this.getCanvas();
    }
    var date = new Date();
    var time = date.getTime();
    this.lastDrawTime = time;
    if (this.beforeDrawFunc !== undefined) {
      this.beforeDrawFunc.call(this);
    }
    if (this.attrs.clearBeforeDraw) {
      canvas.clear();
    }
    if (this.isVisible()) {
      if (this.attrs.drawFunc !== undefined) {
        this.attrs.drawFunc.call(this);
      }
      this._drawChildren(canvas);
    }
    if (this.afterDrawFunc !== undefined) {
      this.afterDrawFunc.call(this);
    }
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Layer, ['clearBeforeDraw', 'throttle']);
Kinetic.Group = Kinetic.Container.extend({
  init: function (config) {
    this.nodeType = 'Group';
    this._super(config);
  },
  draw: function (canvas) {
    this._draw(canvas);
  },
  _draw: function (canvas) {
    if (this.attrs.visible) {
      this._drawChildren(canvas);
    }
  }
});
Kinetic.Shape = Kinetic.Node.extend({
  init: function (config) {
    this.setDefaultAttrs({
      detectionType: 'path'
    });
    this.nodeType = 'Shape';
    this.appliedShadow = false;
    this._super(config);
  },
  getContext: function () {
    return this.getLayer().getContext();
  },
  getCanvas: function () {
    return this.getLayer().getCanvas();
  },
  stroke: function (context) {
    var go = Kinetic.Global;
    var appliedShadow = false;
    if (this.attrs.stroke || this.attrs.strokeWidth) {
      context.save();
      if (this.attrs.shadow && !this.appliedShadow) {
        appliedShadow = this._applyShadow(context);
      }
      var stroke = this.attrs.stroke ? this.attrs.stroke : 'black';
      var strokeWidth = this.attrs.strokeWidth ? this.attrs.strokeWidth : 2;
      context.lineWidth = strokeWidth;
      context.strokeStyle = stroke;
      context.stroke(context);
      context.restore();
    }
    if (appliedShadow) {
      this.stroke(context);
    }
  },
  fill: function (context) {
    var appliedShadow = false;
    var fill = this.attrs.fill;
    if (fill) {
      context.save();
      if (this.attrs.shadow && !this.appliedShadow) {
        appliedShadow = this._applyShadow(context);
      }
      var s = fill.start;
      var e = fill.end;
      var f = null;
      if (typeof fill == 'string') {
        f = this.attrs.fill;
        context.fillStyle = f;
        context.fill(context);
      } else if (fill.image) {
        var repeat = !fill.repeat ? 'repeat' : fill.repeat;
        f = context.createPattern(fill.image, repeat);
        context.save();
        if (fill.scale) {
          context.scale(fill.scale.x, fill.scale.y);
        }
        if (fill.offset) {
          context.translate(fill.offset.x, fill.offset.y);
        }
        context.fillStyle = f;
        context.fill(context);
        context.restore();
      } else if (!s.radius && !e.radius) {
        var grd = context.createLinearGradient(s.x, s.y, e.x, e.y);
        var colorStops = fill.colorStops;
        for (var n = 0; n < colorStops.length; n += 2) {
          grd.addColorStop(colorStops[n], colorStops[n + 1]);
        }
        f = grd;
        context.fillStyle = f;
        context.fill(context);
      } else if ((s.radius || s.radius === 0) && (e.radius || e.radius === 0)) {
        var grd = context.createRadialGradient(s.x, s.y, s.radius, e.x, e.y, e.radius);
        var colorStops = fill.colorStops;
        for (var n = 0; n < colorStops.length; n += 2) {
          grd.addColorStop(colorStops[n], colorStops[n + 1]);
        }
        f = grd;
        context.fillStyle = f;
        context.fill(context);
      } else {
        f = 'black';
        context.fillStyle = f;
        context.fill(context);
      }
      context.restore();
    }
    if (appliedShadow) {
      this.fill(context);
    }
  },
  fillText: function (context, text) {
    var appliedShadow = false;
    if (this.attrs.textFill) {
      context.save();
      if (this.attrs.shadow && !this.appliedShadow) {
        appliedShadow = this._applyShadow(context);
      }
      context.fillStyle = this.attrs.textFill;
      context.fillText(text, 0, 0);
      context.restore();
    }
    if (appliedShadow) {
      this.fillText(contex, text, 0, 0);
    }
  },
  strokeText: function (context, text) {
    var appliedShadow = false;
    if (this.attrs.textStroke || this.attrs.textStrokeWidth) {
      context.save();
      if (this.attrs.shadow && !this.appliedShadow) {
        appliedShadow = this._applyShadow(context);
      }
      var textStroke = this.attrs.textStroke ? this.attrs.textStroke : 'black';
      var textStrokeWidth = this.attrs.textStrokeWidth ? this.attrs.textStrokeWidth : 2;
      context.lineWidth = textStrokeWidth;
      context.strokeStyle = textStroke;
      context.strokeText(text, 0, 0);
      context.restore();
    }
    if (appliedShadow) {
      this.strokeText(context, text, 0, 0);
    }
  },
  drawImage: function () {
    var appliedShadow = false;
    var context = arguments[0];
    context.save();
    var a = Array.prototype.slice.call(arguments);
    if (a.length === 6 || a.length === 10) {
      if (this.attrs.shadow && !this.appliedShadow) {
        appliedShadow = this._applyShadow(context);
      }
      if (a.length === 6) {
        context.drawImage(a[1], a[2], a[3], a[4], a[5]);
      } else {
        context.drawImage(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
      }
    }
    context.restore();
    if (appliedShadow) {
      this.drawImage.apply(this, a);
    }
  },
  applyLineJoin: function (context) {
    if (this.attrs.lineJoin) {
      context.lineJoin = this.attrs.lineJoin;
    }
  },
  _applyShadow: function (context) {
    var s = this.attrs.shadow;
    if (s) {
      var aa = this.getAbsoluteAlpha();
      var color = s.color ? s.color : 'black';
      var blur = s.blur ? s.blur : 5;
      var offset = s.offset ? s.offset : {
        x: 0,
        y: 0
      };
      if (s.alpha) {
        context.globalAlpha = s.alpha * aa;
      }
      context.shadowColor = color;
      context.shadowBlur = blur;
      context.shadowOffsetX = offset.x;
      context.shadowOffsetY = offset.y;
      this.appliedShadow = true;
      return true;
    }
    return false;
  },
  intersects: function () {
    var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
    var stage = this.getStage();
    if (this.attrs.detectionType === 'path') {
      var pathCanvas = stage.pathCanvas;
      var pathCanvasContext = pathCanvas.getContext();
      this._draw(pathCanvas);
      return pathCanvasContext.isPointInPath(pos.x, pos.y);
    }
    if (this.imageData) {
      var w = stage.attrs.width;
      var alpha = this.imageData.data[((w * pos.y) + pos.x) * 4 + 3];
      return (alpha);
    }
    return false;
  },
  _draw: function (canvas) {
    if (this.attrs.drawFunc) {
      var stage = this.getStage();
      var context = canvas.getContext();
      var family = [];
      var parent = this.parent;
      family.unshift(this);
      while (parent) {
        family.unshift(parent);
        parent = parent.parent;
      }
      context.save();
      for (var n = 0; n < family.length; n++) {
        var node = family[n];
        var t = node.getTransform();
        var m = t.getMatrix();
        context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      var absAlpha = this.getAbsoluteAlpha();
      if (absAlpha !== 1) {
        context.globalAlpha = absAlpha;
      }
      this.applyLineJoin(context);
      this.appliedShadow = false;
      this.attrs.drawFunc.call(this, canvas.getContext());
      context.restore();
    }
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Shape, ['fill', 'stroke', 'lineJoin', 'strokeWidth', 'shadow', 'drawFunc', 'filter']);
Kinetic.Rect = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      width: 0,
      height: 0,
      cornerRadius: 0
    });
    this.shapeType = "Rect";
    config.drawFunc = function (context) {
      context.beginPath();
      if (this.attrs.cornerRadius === 0) {
        context.rect(0, 0, this.attrs.width, this.attrs.height);
      } else {
        context.moveTo(this.attrs.cornerRadius, 0);
        context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
        context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
        context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
        context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
        context.lineTo(this.attrs.cornerRadius, this.attrs.height);
        context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
        context.lineTo(0, this.attrs.cornerRadius);
        context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
      }
      context.closePath();
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
  },
  setSize: function () {
    var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(size);
  },
  getSize: function () {
    return {
      width: this.attrs.width,
      height: this.attrs.height
    };
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Rect, ['width', 'height', 'cornerRadius']);
Kinetic.Ellipse = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      radius: {
        x: 0,
        y: 0
      }
    });
    this.shapeType = "Ellipse";
    config.drawFunc = function (context) {
      var r = this.getRadius();
      context.beginPath();
      context.save();
      if (r.x !== r.y) {
        context.scale(1, r.y / r.x);
      }
      context.arc(0, 0, r.x, 0, Math.PI * 2, true);
      context.restore();
      context.closePath();
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
    this._convertRadius();
    var that = this;
    this.on('radiusChange.kinetic', function () {
      that._convertRadius();
    });
  },
  _convertRadius: function () {
    var type = Kinetic.Type;
    var radius = this.getRadius();
    if (type._isObject(radius)) {
      return false;
    }
    this.attrs.radius = type._getXY(radius);
  }
});
Kinetic.Circle = Kinetic.Ellipse;
Kinetic.Node.addGettersSetters(Kinetic.Ellipse, ['radius']);
Kinetic.Image = Kinetic.Shape.extend({
  init: function (config) {
    this.shapeType = "Image";
    config.drawFunc = function (context) {
      if ( !! this.attrs.image) {
        var width = this.getWidth();
        var height = this.getHeight();
        context.beginPath();
        context.rect(0, 0, width, height);
        context.closePath();
        this.fill(context);
        this.stroke(context);
        if (this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
          var cropX = this.attrs.crop.x ? this.attrs.crop.x : 0;
          var cropY = this.attrs.crop.y ? this.attrs.crop.y : 0;
          var cropWidth = this.attrs.crop.width;
          var cropHeight = this.attrs.crop.height;
          this.drawImage(context, this.attrs.image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
        } else {
          this.drawImage(context, this.attrs.image, 0, 0, width, height);
        }
      }
    };
    this._super(config);
  },
  setSize: function () {
    var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
    this.setAttrs(size);
  },
  getSize: function () {
    return {
      width: this.attrs.width,
      height: this.attrs.height
    };
  },
  getWidth: function () {
    if (this.attrs.width) {
      return this.attrs.width;
    }
    if (this.attrs.image) {
      return this.attrs.image.width;
    }
    return 0;
  },
  getHeight: function () {
    if (this.attrs.height) {
      return this.attrs.height;
    }
    if (this.attrs.image) {
      return this.attrs.image.height;
    }
    return 0;
  },
  applyFilter: function (config) {
    try {
      var trans = this._clearTransform();
      this.saveImageData(this.getWidth(), this.getHeight());
      this._setTransform(trans);
      config.filter.call(this, config);
      var that = this;
      Kinetic.Type._getImage(this.getImageData(), function (imageObj) {
        that.setImage(imageObj);
        if (config.callback) {
          config.callback();
        }
      });
    } catch (e) {
      Kinetic.Global.warn('Unable to apply filter.');
    }
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Image, ['image', 'crop', 'filter']);
Kinetic.Node.addSetters(Kinetic.Image, ['width', 'height']);
Kinetic.Sprite = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      index: 0,
      frameRate: 17
    });
    config.drawFunc = function (context) {
      if ( !! this.attrs.image) {
        var anim = this.attrs.animation;
        var index = this.attrs.index;
        var f = this.attrs.animations[anim][index];
        context.beginPath();
        context.rect(0, 0, f.width, f.height);
        context.closePath();
        this.drawImage(context, this.attrs.image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
      }
    };
    this._super(config);
    var that = this;
    this.on('animationChange.kinetic', function () {
      that.setIndex(0);
    });
  },
  start: function () {
    var that = this;
    var layer = this.getLayer();
    var ka = Kinetic.Animation;
    if (this.anim) {
      ka._removeAnimation(this.anim);
      this.anim = null;
    }
    this.anim = {
      node: layer
    };
    ka._addAnimation(this.anim);
    this.interval = setInterval(function () {
      var index = that.attrs.index;
      that._updateIndex();
      if (that.afterFrameFunc && index === that.afterFrameIndex) {
        that.afterFrameFunc();
      }
    }, 1000 / this.attrs.frameRate);
    ka._handleAnimation();
  },
  stop: function () {
    var ka = Kinetic.Animation;
    if (this.anim) {
      ka._removeAnimation(this.anim);
      this.anim = null;
    }
    clearInterval(this.interval);
  },
  afterFrame: function (index, func) {
    this.afterFrameIndex = index;
    this.afterFrameFunc = func;
  },
  _updateIndex: function () {
    var i = this.attrs.index;
    var a = this.attrs.animation;
    if (i < this.attrs.animations[a].length - 1) {
      this.attrs.index++;
    } else {
      this.attrs.index = 0;
    }
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Sprite, ['animation', 'animations', 'index']);
Kinetic.Polygon = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      points: []
    });
    this.shapeType = "Polygon";
    config.drawFunc = function (context) {
      context.beginPath();
      context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
      for (var n = 1; n < this.attrs.points.length; n++) {
        context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
      }
      context.closePath();
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Polygon, ['points']);
Kinetic.RegularPolygon = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      radius: 0,
      sides: 0
    });
    this.shapeType = "RegularPolygon";
    config.drawFunc = function (context) {
      context.beginPath();
      context.moveTo(0, 0 - this.attrs.radius);
      for (var n = 1; n < this.attrs.sides; n++) {
        var x = this.attrs.radius * Math.sin(n * 2 * Math.PI / this.attrs.sides);
        var y = -1 * this.attrs.radius * Math.cos(n * 2 * Math.PI / this.attrs.sides);
        context.lineTo(x, y);
      }
      context.closePath();
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
  }
});
Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ['radius', 'sides']);
Kinetic.Star = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      numPoints: 0,
      innerRadius: 0,
      outerRadius: 0
    });
    this.shapeType = "Star";
    config.drawFunc = function (context) {
      context.beginPath();
      context.moveTo(0, 0 - this.attrs.outerRadius);
      for (var n = 1; n < this.attrs.numPoints * 2; n++) {
        var radius = n % 2 === 0 ? this.attrs.outerRadius : this.attrs.innerRadius;
        var x = radius * Math.sin(n * Math.PI / this.attrs.numPoints);
        var y = -1 * radius * Math.cos(n * Math.PI / this.attrs.numPoints);
        context.lineTo(x, y);
      }
      context.closePath();
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Star, ['numPoints', 'innerRadius', 'outerRadius']);
Kinetic.Text = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      fontFamily: 'Calibri',
      text: '',
      fontSize: 12,
      align: 'left',
      verticalAlign: 'top',
      fontStyle: 'normal',
      padding: 0,
      width: 'auto',
      height: 'auto',
      detectionType: 'path',
      cornerRadius: 0,
      lineHeight: 1.2
    });
    this.dummyCanvas = document.createElement('canvas');
    this.shapeType = "Text";
    config.drawFunc = function (context) {
      context.beginPath();
      var boxWidth = this.getBoxWidth();
      var boxHeight = this.getBoxHeight();
      if (this.attrs.cornerRadius === 0) {
        context.rect(0, 0, boxWidth, boxHeight);
      } else {
        context.moveTo(this.attrs.cornerRadius, 0);
        context.lineTo(boxWidth - this.attrs.cornerRadius, 0);
        context.arc(boxWidth - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
        context.lineTo(boxWidth, boxHeight - this.attrs.cornerRadius);
        context.arc(boxWidth - this.attrs.cornerRadius, boxHeight - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
        context.lineTo(this.attrs.cornerRadius, boxHeight);
        context.arc(this.attrs.cornerRadius, boxHeight - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
        context.lineTo(0, this.attrs.cornerRadius);
        context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
      }
      context.closePath();
      this.fill(context);
      this.stroke(context);
      var p = this.attrs.padding;
      var lineHeightPx = this.attrs.lineHeight * this.getTextHeight();
      var textArr = this.textArr;
      context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
      context.textBaseline = 'middle';
      context.textAlign = 'left';
      context.save();
      context.translate(p, 0);
      context.translate(0, p + this.getTextHeight() / 2);
      for (var n = 0; n < textArr.length; n++) {
        var text = textArr[n];
        context.save();
        if (this.attrs.align === 'right') {
          context.translate(this.getBoxWidth() - this._getTextSize(text).width - p * 2, 0);
        } else if (this.attrs.align === 'center') {
          context.translate((this.getBoxWidth() - this._getTextSize(text).width - p * 2) / 2, 0);
        }
        this.fillText(context, text);
        this.strokeText(context, text);
        context.restore();
        context.translate(0, lineHeightPx);
      }
      context.restore();
    };
    this._super(config);
    var attrs = ['width', 'height', 'padding', 'text', 'textStroke', 'textStrokeWidth'];
    var that = this;
    for (var n = 0; n < attrs.length; n++) {
      var attr = attrs[n];
      this.on(attr + 'Change.kinetic', that._setTextData);
    }
    that._setTextData();
  },
  getBoxWidth: function () {
    return this.attrs.width === 'auto' ? this.getTextWidth() + this.attrs.padding * 2 : this.attrs.width;
  },
  getBoxHeight: function () {
    return this.attrs.height === 'auto' ? (this.getTextHeight() * this.textArr.length * this.attrs.lineHeight) + this.attrs.padding * 2 : this.attrs.height;
  },
  getTextWidth: function () {
    return this.textWidth;
  },
  getTextHeight: function () {
    return this.textHeight;
  },
  _getTextSize: function (text) {
    var dummyCanvas = this.dummyCanvas;
    var context = dummyCanvas.getContext('2d');
    context.save();
    context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
    var metrics = context.measureText(text);
    context.restore();
    return {
      width: metrics.width,
      height: parseInt(this.attrs.fontSize, 10)
    };
  },
  _setTextData: function () {
    var charArr = this.attrs.text.split('');
    var arr = [];
    var row = 0;
    var addLine = true;
    this.textWidth = 0;
    this.textHeight = this._getTextSize(this.attrs.text).height;
    var lineHeightPx = this.attrs.lineHeight * this.textHeight;
    while (charArr.length > 0 && addLine && (this.attrs.height === 'auto' || lineHeightPx * (row + 1) < this.attrs.height - this.attrs.padding * 2)) {
      var index = 0;
      var line = undefined;
      addLine = false;
      while (index < charArr.length) {
        if (charArr.indexOf('\n') === index) {
          charArr.splice(index, 1);
          line = charArr.splice(0, index).join('');
          break;
        }
        var lineArr = charArr.slice(0, index);
        if (this.attrs.width !== 'auto' && this._getTextSize(lineArr.join('')).width > this.attrs.width - this.attrs.padding * 2) {
          if (index == 0) {
            break;
          }
          var lastSpace = lineArr.lastIndexOf(' ');
          var lastDash = lineArr.lastIndexOf('-');
          var wrapIndex = Math.max(lastSpace, lastDash);
          if (wrapIndex >= 0) {
            line = charArr.splice(0, 1 + wrapIndex).join('');
            break;
          }
          line = charArr.splice(0, index).join('');
          break;
        }
        index++;
        if (index === charArr.length) {
          line = charArr.splice(0, index).join('');
        }
      }
      this.textWidth = Math.max(this.textWidth, this._getTextSize(line).width);
      if (line !== undefined) {
        arr.push(line);
        addLine = true;
      }
      row++;
    }
    this.textArr = arr;
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'lineHeight', 'text', 'width', 'height', 'cornerRadius', 'fill', 'stroke', 'strokeWidth', 'shadow']);
Kinetic.Line = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      points: [],
      lineCap: 'butt',
      dashArray: [],
      detectionType: 'pixel'
    });
    this.shapeType = "Line";
    config.drawFunc = function (context) {
      var lastPos = {};
      context.beginPath();
      context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
      for (var n = 1; n < this.attrs.points.length; n++) {
        var x = this.attrs.points[n].x;
        var y = this.attrs.points[n].y;
        if (this.attrs.dashArray.length > 0) {
          var lastX = this.attrs.points[n - 1].x;
          var lastY = this.attrs.points[n - 1].y;
          this._dashedLine(context, lastX, lastY, x, y, this.attrs.dashArray);
        } else {
          context.lineTo(x, y);
        }
      }
      if ( !! this.attrs.lineCap) {
        context.lineCap = this.attrs.lineCap;
      }
      this.stroke(context);
    };
    this._super(config);
  },
  _dashedLine: function (context, x, y, x2, y2, dashArray) {
    var dashCount = dashArray.length;
    var dx = (x2 - x),
      dy = (y2 - y);
    var xSlope = dx > dy;
    var slope = (xSlope) ? dy / dx : dx / dy;
    if (slope > 9999) {
      slope = 9999;
    } else if (slope < -9999) {
      slope = -9999;
    }
    var distRemaining = Math.sqrt(dx * dx + dy * dy);
    var dashIndex = 0,
      draw = true;
    while (distRemaining >= 0.1 && dashIndex < 10000) {
      var dashLength = dashArray[dashIndex++ % dashCount];
      if (dashLength === 0) {
        dashLength = 0.001;
      }
      if (dashLength > distRemaining) {
        dashLength = distRemaining;
      }
      var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
      if (xSlope) {
        x += dx < 0 && dy < 0 ? step * -1 : step;
        y += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
      } else {
        x += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
        y += dx < 0 && dy < 0 ? step * -1 : step;
      }
      context[draw ? 'lineTo' : 'moveTo'](x, y);
      distRemaining -= dashLength;
      draw = !draw;
    }
    context.moveTo(x2, y2);
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Line, ['dashArray', 'lineCap', 'points']);
Kinetic.Path = Kinetic.Shape.extend({
  init: function (config) {
    this.shapeType = "Path";
    this.dataArray = [];
    var that = this;
    config.drawFunc = function (context) {
      var ca = this.dataArray;
      context.beginPath();
      for (var n = 0; n < ca.length; n++) {
        var c = ca[n].command;
        var p = ca[n].points;
        switch (c) {
        case 'L':
          context.lineTo(p[0], p[1]);
          break;
        case 'M':
          context.moveTo(p[0], p[1]);
          break;
        case 'C':
          context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
          break;
        case 'Q':
          context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
          break;
        case 'A':
          var cx = p[0],
            cy = p[1],
            rx = p[2],
            ry = p[3],
            theta = p[4],
            dTheta = p[5],
            psi = p[6],
            fs = p[7];
          var r = (rx > ry) ? rx : ry;
          var scaleX = (rx > ry) ? 1 : rx / ry;
          var scaleY = (rx > ry) ? ry / rx : 1;
          context.translate(cx, cy);
          context.rotate(psi);
          context.scale(scaleX, scaleY);
          context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
          context.scale(1 / scaleX, 1 / scaleY);
          context.rotate(-psi);
          context.translate(-cx, -cy);
          break;
        case 'z':
          context.closePath();
          break;
        }
      }
      this.fill(context);
      this.stroke(context);
    };
    this._super(config);
    this.dataArray = this._getDataArray();
    this.on('dataChange', function () {
      that.dataArray = that._getDataArray();
    });
  },
  _getDataArray: function () {
    var cs = this.attrs.data;
    if (!this.attrs.data) {
      return [];
    }
    var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
    cs = cs.replace(new RegExp(' ', 'g'), ',');
    for (var n = 0; n < cc.length; n++) {
      cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
    }
    var arr = cs.split('|');
    var ca = [];
    var cpx = 0;
    var cpy = 0;
    for (var n = 1; n < arr.length; n++) {
      var str = arr[n];
      var c = str.charAt(0);
      str = str.slice(1);
      str = str.replace(new RegExp(',-', 'g'), '-');
      str = str.replace(new RegExp('-', 'g'), ',-');
      var p = str.split(',');
      if (p.length > 0 && p[0] === '') {
        p.shift();
      }
      for (var i = 0; i < p.length; i++) {
        p[i] = parseFloat(p[i]);
      }
      while (p.length > 0) {
        if (isNaN(p[0])) break;
        var cmd = undefined;
        var points = [];
        switch (c) {
        case 'l':
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'L';
          points.push(cpx, cpy);
          break;
        case 'L':
          cpx = p.shift();
          cpy = p.shift();
          points.push(cpx, cpy);
          break;
        case 'm':
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'M';
          points.push(cpx, cpy);
          c = 'l';
          break;
        case 'M':
          cpx = p.shift();
          cpy = p.shift();
          cmd = 'M';
          points.push(cpx, cpy);
          c = 'L';
          break;
        case 'h':
          cpx += p.shift();
          cmd = 'L';
          points.push(cpx, cpy);
          break;
        case 'H':
          cpx = p.shift();
          cmd = 'L';
          points.push(cpx, cpy);
          break;
        case 'v':
          cpy += p.shift();
          cmd = 'L';
          points.push(cpx, cpy);
          break;
        case 'V':
          cpy = p.shift();
          cmd = 'L';
          points.push(cpx, cpy);
          break;
        case 'C':
          points.push(p.shift(), p.shift(), p.shift(), p.shift());
          cpx = p.shift();
          cpy = p.shift();
          points.push(cpx, cpy);
          break;
        case 'c':
          points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'C'
          points.push(cpx, cpy);
          break;
        case 'S':
          var ctlPtx = cpx,
            ctlPty = cpy;
          var prevCmd = ca[ca.length - 1];
          if (prevCmd.command === 'C') {
            ctlPtx = cpx + (cpx - prevCmd.points[2]);
            ctlPty = cpy + (cpy - prevCmd.points[3]);
          }
          points.push(ctlPtx, ctlPty, p.shift(), p.shift())
          cpx = p.shift();
          cpy = p.shift();
          cmd = 'C';
          points.push(cpx, cpy);
          break;
        case 's':
          var ctlPtx = cpx,
            ctlPty = cpy;
          var prevCmd = ca[ca.length - 1];
          if (prevCmd.command === 'C') {
            ctlPtx = cpx + (cpx - prevCmd.points[2]);
            ctlPty = cpy + (cpy - prevCmd.points[3]);
          }
          points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift())
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'C';
          points.push(cpx, cpy);
          break;
        case 'Q':
          points.push(p.shift(), p.shift());
          cpx = p.shift();
          cpy = p.shift();
          points.push(cpx, cpy);
          break;
        case 'q':
          points.push(cpx + p.shift(), cpy + p.shift());
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'Q'
          points.push(cpx, cpy);
          break;
        case 'T':
          var ctlPtx = cpx,
            ctlPty = cpy;
          var prevCmd = ca[ca.length - 1];
          if (prevCmd.command === 'Q') {
            ctlPtx = cpx + (cpx - prevCmd.points[0]);
            ctlPty = cpy + (cpy - prevCmd.points[1]);
          }
          cpx = p.shift();
          cpy = p.shift();
          cmd = 'Q';
          points.push(ctlPtx, ctlPty, cpx, cpy);
          break;
        case 't':
          var ctlPtx = cpx,
            ctlPty = cpy;
          var prevCmd = ca[ca.length - 1];
          if (prevCmd.command === 'Q') {
            ctlPtx = cpx + (cpx - prevCmd.points[0]);
            ctlPty = cpy + (cpy - prevCmd.points[1]);
          }
          cpx += p.shift();
          cpy += p.shift();
          cmd = 'Q';
          points.push(ctlPtx, ctlPty, cpx, cpy);
          break;
        case 'A':
          var rx = p.shift(),
            ry = p.shift(),
            psi = p.shift(),
            fa = p.shift(),
            fs = p.shift();
          var x1 = cpx,
            y1 = cpy;
          cpx = p.shift(), cpy = p.shift();
          cmd = 'A';
          points = this._convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
          break;
        case 'a':
          var rx = p.shift(),
            ry = p.shift(),
            psi = p.shift(),
            fa = p.shift(),
            fs = p.shift();
          var x1 = cpx,
            y1 = cpy;
          cpx += p.shift(), cpy += p.shift();
          cmd = 'A';
          points = this._convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
          break;
        }
        ca.push({
          command: cmd || c,
          points: points
        });
      }
      if (c === 'z' || c === 'Z') ca.push({
        command: 'z',
        points: []
      });
    }
    return ca;
  },
  _convertEndpointToCenterParameterization: function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
    var psi = psiDeg * (Math.PI / 180.0);
    var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
    var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;
    var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
    if (lambda > 1) {
      rx *= Math.sqrt(lambda);
      ry *= Math.sqrt(lambda);
    }
    var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));
    if (fa == fs) f *= -1;
    if (isNaN(f)) f = 0;
    var cxp = f * rx * yp / ry;
    var cyp = f * -ry * xp / rx;
    var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
    var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
    var vMag = function (v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
      }
    var vRatio = function (u, v) {
        return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v))
      }
    var vAngle = function (u, v) {
        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
      }
    var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
    var u = [(xp - cxp) / rx, (yp - cyp) / ry];
    var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
    var dTheta = vAngle(u, v);
    if (vRatio(u, v) <= -1) dTheta = Math.PI;
    if (vRatio(u, v) >= 1) dTheta = 0;
    if (fs == 0 && dTheta > 0) dTheta = dTheta - 2 * Math.PI;
    if (fs == 1 && dTheta < 0) dTheta = dTheta + 2 * Math.PI;
    return [cx, cy, rx, ry, theta, dTheta, psi, fs];
  }
});
Kinetic.Node.addGettersSetters(Kinetic.Path, ['data']);
Kinetic.Transform = function () {
  this.m = [1, 0, 0, 1, 0, 0];
}
Kinetic.Transform.prototype = {
  translate: function (x, y) {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;
  },
  scale: function (sx, sy) {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
  },
  rotate: function (rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.m[0] * c + this.m[2] * s;
    var m12 = this.m[1] * c + this.m[3] * s;
    var m21 = this.m[0] * -s + this.m[2] * c;
    var m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
  },
  getTranslation: function () {
    return {
      x: this.m[4],
      y: this.m[5]
    };
  },
  multiply: function (matrix) {
    var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
    var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
    var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;
  },
  invert: function () {
    var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    var m0 = this.m[3] * d;
    var m1 = -this.m[1] * d;
    var m2 = -this.m[2] * d;
    var m3 = this.m[0] * d;
    var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
  },
  getMatrix: function () {
    return this.m;
  }
};
Kinetic.Transition = function (node, config) {
  this.node = node;
  this.config = config;
  this.tweens = [];
  var that = this;
  function addTween(c, attrs, obj, rootObj) {
    for (var key in c) {
      if (key !== 'duration' && key !== 'easing' && key !== 'callback') {
        if (Kinetic.Type._isObject(c[key])) {
          obj[key] = {};
          addTween(c[key], attrs[key], obj[key], rootObj);
        } else {
          that._add(that._getTween(attrs, key, c[key], obj, rootObj));
        }
      }
    }
  }
  var obj = {};
  addTween(config, node.attrs, obj, obj);
  var finishedTweens = 0;
  for (var n = 0; n < this.tweens.length; n++) {
    var tween = this.tweens[n];
    tween.onFinished = function () {
      finishedTweens++;
      if (finishedTweens >= that.tweens.length) {
        that.onFinished();
      }
    };
  }
};
Kinetic.Transition.prototype = {
  start: function () {
    for (var n = 0; n < this.tweens.length; n++) {
      this.tweens[n].start();
    }
  },
  stop: function () {
    for (var n = 0; n < this.tweens.length; n++) {
      this.tweens[n].stop();
    }
  },
  resume: function () {
    for (var n = 0; n < this.tweens.length; n++) {
      this.tweens[n].resume();
    }
  },
  _onEnterFrame: function () {
    for (var n = 0; n < this.tweens.length; n++) {
      this.tweens[n].onEnterFrame();
    }
  },
  _add: function (tween) {
    this.tweens.push(tween);
  },
  _getTween: function (attrs, prop, val, obj, rootObj) {
    var config = this.config;
    var node = this.node;
    var easing = config.easing;
    if (easing === undefined) {
      easing = 'linear';
    }
    var tween = new Kinetic.Tween(node, function (i) {
      obj[prop] = i;
      node.setAttrs(rootObj);
    }, Kinetic.Tweens[easing], attrs[prop], val, config.duration);
    return tween;
  }
};
Kinetic.Tween = function (obj, propFunc, func, begin, finish, duration) {
  this._listeners = [];
  this.addListener(this);
  this.obj = obj;
  this.propFunc = propFunc;
  this.begin = begin;
  this._pos = begin;
  this.setDuration(duration);
  this.isPlaying = false;
  this._change = 0;
  this.prevTime = 0;
  this.prevPos = 0;
  this.looping = false;
  this._time = 0;
  this._position = 0;
  this._startTime = 0;
  this._finish = 0;
  this.name = '';
  this.func = func;
  this.setFinish(finish);
};
Kinetic.Tween.prototype = {
  setTime: function (t) {
    this.prevTime = this._time;
    if (t > this.getDuration()) {
      if (this.looping) {
        this.rewind(t - this._duration);
        this.update();
        this.broadcastMessage('onLooped', {
          target: this,
          type: 'onLooped'
        });
      } else {
        this._time = this._duration;
        this.update();
        this.stop();
        this.broadcastMessage('onFinished', {
          target: this,
          type: 'onFinished'
        });
      }
    } else if (t < 0) {
      this.rewind();
      this.update();
    } else {
      this._time = t;
      this.update();
    }
  },
  getTime: function () {
    return this._time;
  },
  setDuration: function (d) {
    this._duration = (d === null || d <= 0) ? 100000 : d;
  },
  getDuration: function () {
    return this._duration;
  },
  setPosition: function (p) {
    this.prevPos = this._pos;
    this.propFunc(p);
    this._pos = p;
    this.broadcastMessage('onChanged', {
      target: this,
      type: 'onChanged'
    });
  },
  getPosition: function (t) {
    if (t === undefined) {
      t = this._time;
    }
    return this.func(t, this.begin, this._change, this._duration);
  },
  setFinish: function (f) {
    this._change = f - this.begin;
  },
  getFinish: function () {
    return this.begin + this._change;
  },
  start: function () {
    this.rewind();
    this.startEnterFrame();
    this.broadcastMessage('onStarted', {
      target: this,
      type: 'onStarted'
    });
  },
  rewind: function (t) {
    this.stop();
    this._time = (t === undefined) ? 0 : t;
    this.fixTime();
    this.update();
  },
  fforward: function () {
    this._time = this._duration;
    this.fixTime();
    this.update();
  },
  update: function () {
    this.setPosition(this.getPosition(this._time));
  },
  startEnterFrame: function () {
    this.stopEnterFrame();
    this.isPlaying = true;
    this.onEnterFrame();
  },
  onEnterFrame: function () {
    if (this.isPlaying) {
      this.nextFrame();
    }
  },
  nextFrame: function () {
    this.setTime((this.getTimer() - this._startTime) / 1000);
  },
  stop: function () {
    this.stopEnterFrame();
    this.broadcastMessage('onStopped', {
      target: this,
      type: 'onStopped'
    });
  },
  stopEnterFrame: function () {
    this.isPlaying = false;
  },
  continueTo: function (finish, duration) {
    this.begin = this._pos;
    this.setFinish(finish);
    if (this._duration !== undefined) {
      this.setDuration(duration);
    }
    this.start();
  },
  resume: function () {
    this.fixTime();
    this.startEnterFrame();
    this.broadcastMessage('onResumed', {
      target: this,
      type: 'onResumed'
    });
  },
  yoyo: function () {
    this.continueTo(this.begin, this._time);
  },
  addListener: function (o) {
    this.removeListener(o);
    return this._listeners.push(o);
  },
  removeListener: function (o) {
    var a = this._listeners;
    var i = a.length;
    while (i--) {
      if (a[i] == o) {
        a.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  broadcastMessage: function () {
    var arr = [];
    for (var i = 0; i < arguments.length; i++) {
      arr.push(arguments[i]);
    }
    var e = arr.shift();
    var a = this._listeners;
    var l = a.length;
    for (var i = 0; i < l; i++) {
      if (a[i][e]) {
        a[i][e].apply(a[i], arr);
      }
    }
  },
  fixTime: function () {
    this._startTime = this.getTimer() - this._time * 1000;
  },
  getTimer: function () {
    return new Date().getTime() - this._time;
  }
};
Kinetic.Tweens = {
  'back-ease-in': function (t, b, c, d, a, p) {
    var s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  'back-ease-out': function (t, b, c, d, a, p) {
    var s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  'back-ease-in-out': function (t, b, c, d, a, p) {
    var s = 1.70158;
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  'elastic-ease-in': function (t, b, c, d, a, p) {
    var s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d) == 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  'elastic-ease-out': function (t, b, c, d, a, p) {
    var s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d) == 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
  },
  'elastic-ease-in-out': function (t, b, c, d, a, p) {
    var s = 0;
    if (t === 0) {
      return b;
    }
    if ((t /= d / 2) == 2) {
      return b + c;
    }
    if (!p) {
      p = d * (0.3 * 1.5);
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  },
  'bounce-ease-out': function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
  },
  'bounce-ease-in': function (t, b, c, d) {
    return c - Kinetic.Tweens['bounce-ease-out'](d - t, 0, c, d) + b;
  },
  'bounce-ease-in-out': function (t, b, c, d) {
    if (t < d / 2) {
      return Kinetic.Tweens['bounce-ease-in'](t * 2, 0, c, d) * 0.5 + b;
    } else {
      return Kinetic.Tweens['bounce-ease-out'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  },
  'ease-in': function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  'ease-out': function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  'ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  'strong-ease-in': function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  'strong-ease-out': function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  'strong-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  'linear': function (t, b, c, d) {
    return c * t / d + b;
  }
};
Kinetic.Filters.Grayscale = function () {
  var data = this.imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    data[i] = brightness;
    data[i + 1] = brightness;
    data[i + 2] = brightness;
  }
};;
this.Venus = {
  _Venus: this.Venus
};
Venus.util = {};
Venus.config = {
  version: 1.0,
  debug: false
};;;
(function () {
  var util = Venus.util || {};
  var _hsv2rgb = function (h, s, v) {
      var hi, f, p, q, t, result = [];
      hi = Math.floor(h / 60) % 6;
      f = hi % 2 ? h / 60 - hi : 1 - (h / 60 - hi);
      p = v * (1 - s);
      q = v * (1 - f * s);
      switch (hi) {
      case 0:
        result = [v, q, p];
        break;
      case 1:
        result = [q, v, p];
        break;
      case 2:
        result = [p, v, q];
        break;
      case 3:
        result = [p, q, v];
        break;
      case 4:
        result = [q, p, v];
        break;
      case 5:
        result = [v, p, q];
        break;
      }
      for (var j = 0, L = result.length; j < L; j++) {
        result[j] = Math.floor(result[j] * 255);
      }
      return result;
    }
  util.getColors = function (colorCount) {
    var H = [.6, .2, .05, .1333, .75, 0],
      S = [0.75, 0.75, 0.45, 1, 0.35],
      V = [0.75, 0.45, 0.9, 0.6, 0.9],
      colors = [],
      L;
    colorCount = parseInt(colorCount, 10) || 10;
    L = Math.min(colorCount, Math.max(colorCount / S.length, 12));
    for (var c = 0; c < colorCount; c++) {
      if (c < H.length && colorCount <= H.length) {
        colors.push('rgba(' + _hsv2rgb(H[c] * 360, S[0], V[0]).join(',') + ', 1)');
      } else {
        colors.push('rgba(' + _hsv2rgb(c % L * 360 / L, S[Math.floor(c / L)], V[Math.floor(c / L)]).join(',') + ', 1)');
      }
    }
    return colors;
  }
  util.mix = function (o1, o2) {
    for (var attr in o2) {
      if (typeof o2[attr] !== "object" || o1[attr] === undefined || typeof o1[attr] !== 'object') {
        o1[attr] = o2[attr];
      } else {
        util.mix(o1[attr], o2[attr]);
      }
    }
    return o1;
  }
  util.isArray = function (arr) {
    return __type(arr, "array");
  }
  util.isObject = function (obj) {
    return __type(obj, "object");
  }
  util.isNumber = function (nub) {
    return __type(nub, "number");
  }
  util.isFunction = function (func) {
    return __type(func, "function");
  }

  function __type(target, type) {
    var clas = Object.prototype.toString.call(target).slice(8, -1);
    clas = clas.toLowerCase();
    return !type ? clas : target !== undefined && target !== null && clas === type;
  };
})();;;
(function () {
  var namespace = Venus.util || {};
  var slice = Array.prototype.slice
  var CustomEvent = function () {
      this.events = {};
    };
  var createWhenNone = function (obj, eventName) {
      return (obj.events[eventName]) || (obj.events[eventName] = {
        callbacks: []
      });
    },
    bind = function (obj, eventName, fn) {
      createWhenNone(obj, eventName).callbacks.push(fn);
    };
  CustomEvent.prototype.on = function (eventName, callback) {
    if (typeof callback !== "function") {
      return;
    }
    bind(this, eventName, callback);
  };
  CustomEvent.prototype.off = function (eventName, fn) {
    if (!fn) {
      this.events[eventName] = {
        callbacks: []
      };
    } else {
      var cb, i = 0,
        cbs = createWhenNone(this, eventName).callbacks;
      while (cb = cbs[i++]) {
        if (cb === fn) {
          cbs.splice(--i, 1);
        }
      }
    }
  };
  CustomEvent.prototype.one = function (eventName, callback) {
    if (typeof callback !== "function") {
      return;
    }
    var self = this;
    bind(this, eventName, function () {
      callback.apply(eventName, slice.call(arguments, 0));
      self.off(eventName, arguments.callee);
    });
  };
  CustomEvent.prototype.fire = function () {
    var event = arguments[0],
      data = slice.call(arguments, 1),
      callback, i = 0;
    if (this.events[event] && this.events[event].callbacks) {
      while (callback = this.events[event].callbacks[i++]) {
        callback.apply(event, data);
      }
    }
    return this;
  };
  CustomEvent.prototype.clear = function () {
    this.events = {};
  };
  namespace.CustomEvent = CustomEvent;
})();;
Kinetic.SimpleText = Kinetic.Shape.extend({
  init: function (config) {
    this.setDefaultAttrs({
      text: "",
      font: "12",
      textAlign: "left",
      textBaseline: "top"
    });
    this.shapeType = "SimpleText";
    config.drawFunc = function (context) {
      var text = this.attrs.text;
      context.save();
      context.font = this.attrs.font, context.textAlign = this.attrs.textAlign;
      context.textBaseline = this.attrs.textBaseline;
      this.fillText(context, text);
      this.stroke(context, text);
      context.restore();
    };
    this._super(config);
  }
});;
(function (global, undefined) {
  var V = global.Venus,
    util = V.util;
  var mix = util.mix,
    PI = Math.PI,
    charts = {};
  function DPChart(container, data, options) {
    if (!container || !container.nodeType) {
      return;
    }
    var defaultOptions = {
      width: container.clientWidth,
      height: container.clientHeight,
      margin: 10
    };
    this.container = container;
    this.data = data || [];
    this.events = new DPChart.CustomEvent();
    this.options = mix(defaultOptions, options || {});
    this._initCanvas();
    this.fire('onCanvasInit', this.stage, this.layer);
    this._initData();
    this.fire('onDataInit', this.series);
    this._initAxis();
    this.fire('onAxisInit', {});
    this._initLegend();
    this.fire('onLegendInit', this.legend);
    this._initGrid();
    this.fire('onGridInit', this.grid);
    this.draw();
    this._initEvents();
    this.events.fire('onFinish');
  }
  mix(DPChart, util);
  DPChart.prototype = {
    constructor: DPChart,
    _initCanvas: function () {
      this.stage = new Kinetic.Stage({
        container: this.container,
        width: this.options.width,
        height: this.options.height
      });
      this.layer = new Kinetic.Layer();
    },
    _initData: function () {
      this.series = new Series(this.data);
    },
    _initAxis: function () {
      var opt = this.options,
        axisOption = opt.axis,
        axises = {},
        axis, thisAxisOption, range, beginX, beginY;
      if (typeof axisOption == "undefined") {
        return;
      }
      for (var axis in axisOption) {
        if ((thisAxisOption = axisOption[axis])) {
          thisAxisOption.axisType = axis;
          if (axis == "y" && (!thisAxisOption.ticks || thisAxisOption.ticks.length == 0)) {
            range = this.series.getRange();
            if (thisAxisOption.max === undefined) {
              thisAxisOption.max = range.max
            }
            if (thisAxisOption.min === undefined) {
              thisAxisOption.min = range.min;
            }
          }
          if (axis == "x") {
            if (!thisAxisOption.ticks) {
              thisAxisOption.ticks = this.series.getLabels();
            }
          }
          thisAxisOption.canvasWidth = this.options.width;
          thisAxisOption.canvasHeight = this.options.height;
          thisAxisOption.margin = this.options.margin;
          axises[axis] = new Axis(this.options, thisAxisOption, this.series, this.layer);
        }
      }
      this.axises = axises;
    },
    _initLegend: function () {
      var options = this.options;
      if (options.legend) {
        this.legend = new Legend(options, this.series, this.layer);
      }
    },
    _initGrid: function () {
      var options = this.options;
      if (options.grid) {
        this.grid = new Grid(options, this.layer);
      }
    },
    _initEvents: function () {},
    draw: function () {
      for (var chart in charts) {
        if (this.options[chart]) {
          charts[chart].draw && charts[chart].draw.call(this);
        }
      }
      this.stage.add(this.layer);
      this.percentLayer && this.stage.add(this.percentLayer);
    },
    update: function () {},
    fire: function () {
      this.events.fire.apply(this.events, arguments);
    },
    on: function () {
      this.events.on.apply(this.events, arguments);
    }
  };
  DPChart.addChart = function (name, graphType) {
    charts[name] = graphType;
  }
  var Series = function (data) {
      this.data = data;
      this.__prepareData();
    };
  Series.prototype = {
    constructor: Series,
    __prepareData: function () {
      var series = this.series = [],
        tempArr, data = this.data,
        colors;
      if (DPChart.isArray(data)) {
        data.forEach(function (item) {
          if (DPChart.isArray(item)) {
            series.push({
              name: item[0],
              data: item[1]
            });
          } else if (DPChart.isObject(item)) {
            series.push({
              name: (typeof item.name === "undefined" ? item.label : item.name),
              data: item.data
            });
          } else {
            series.push({
              data: item
            });
            this.__nolabel = true;
          }
        });
      } else if (DPChart.isObject(data)) {
        Object.keys(data).forEach(function (key) {
          series.push({
            name: key,
            data: data[key]
          });
        });
      } else {}
      colors = DPChart.getColors(series.length);
      series.forEach(function (item, index) {
        item.color = colors[index];
      });
      tempArr = series.map(function (item) {
        return item.data;
      });
      this._range = {
        min: Math.min.apply(Math, tempArr),
        max: Math.max.apply(Math, tempArr)
      };
    },
    getRange: function () {
      return this._range;
    },
    getSeries: function () {
      return this.series;
    },
    getLabels: function () {
      if ( !! this.__nolabel) {
        return;
      } else {
        return this.series.forEach(function (item) {
          return item.name;
        });
      }
    }
  }
  var Axis = function (globalOptions, options, series, layer) {
      var defaultOptions = {
        axisType: "x",
        max: 0,
        min: 0,
        tickSize: 1,
        tickWidth: 30,
        ticks: []
      },
        axisElement, labelElements = [],
        opt = this.options = mix(defaultOptions, options),
        i, l, label;
      if (opt.axisType == "x") {
        opt.beginX = opt.margin;
        opt.beginY = opt.canvasHeight - opt.margin;
        opt.endX = opt.canvasWidth - opt.margin;
        opt.endY = opt.margin;
        opt.length = opt.canvasWidth - 2 * opt.margin;
        opt.scaleSize = opt.length / (opt.ticks[opt.ticks.length - 1] - opt.ticks[0]);
        opt.tickWidth = opt.length / opt.ticks.length;
      } else if (opt.axisType == "y") {
        opt.beginX = opt.margin;
        opt.beginY = opt.canvasHeight - opt.margin;
        opt.endX = opt.margin;
        opt.endY = opt.margin;
        opt.length = opt.canvasHeight - 2 * opt.margin;
        opt.scaleSize = opt.length / (opt.ticks[opt.ticks.length - 1] - opt.ticks[0]);
        opt.tickWidth = opt.length / (opt.ticks.length - 1);
      }
      globalOptions = mix(globalOptions, {
        originX: opt.beginX,
        originY: opt.beginY
      });
      if (opt.axisType == "x") {
        globalOptions.axis.x = mix(globalOptions.axis.x, opt);
        layer.add(new Kinetic.Line({
          points: [opt.beginX, opt.beginY, opt.endX, opt.beginY],
          stroke: "red",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round"
        }));
        for (i = 0, l = opt.ticks.length; i < l; i++) {
          label = new Kinetic.SimpleText({
            x: opt.beginX + (i + .5) * opt.tickWidth,
            y: opt.beginY + 5,
            text: opt.ticks[i] + "",
            textFill: "#000000",
            textAlign: "center"
          });
          layer.add(label);
        }
      } else if (opt.axisType == "y") {
        globalOptions.axis.y = mix(globalOptions.axis.y, opt);
        layer.add(new Kinetic.Line({
          points: [opt.beginX, opt.beginY, opt.beginX, opt.endY],
          stroke: "red",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round"
        }));
        for (i = 0, l = opt.ticks.length; i < l; i++) {
          label = new Kinetic.SimpleText({
            x: opt.beginX - 10,
            y: opt.beginY - i * opt.tickWidth,
            text: opt.ticks[i] + "",
            textFill: "#000000",
            textBaseline: "middle",
            textAlign: "right"
          });
          layer.add(label);
        }
      }
    };
  Axis.prototype = {
    constructor: Axis,
    getX: function (index) {
      var opt = this.options;
      return opt.beginX + (index + .5) * opt.tickWidth;
    },
    getY: function (data) {
      var opt = this.options;
      return data * opt.scaleSize;
    },
    getOrigin: function () {
      return {
        x: this.beginX,
        y: this.beginY
      }
    }
  }
  var Legend = function (options, series, layer) {
      var defaultOptions = {
        legendWrap: {
          fillColor: '#EFEFEF',
          strokeColor: '#CCCCCC',
          strokeWidth: '1'
        },
        itemType: 'rect',
        position: ["right", "top"],
        width: '80',
        height: '100'
      };
      options.legend = mix(defaultOptions, options.legend);
      var colors = ["skyblue", "orangered", "yellow", "orange", "violet", "fuchsia", "yellowgreen", "khaki"];
      var legendOptions = options.legend,
        legendWidth = legendOptions.width,
        legendHeight = legendOptions.height,
        positions = legendOptions.position,
        pos, positionTable = {
          'left-top': {
            x: 0,
            y: 0
          },
          'right-top': {
            x: options.width - legendWidth,
            y: 0
          },
          'right-bottom': {
            x: options.width - legendWidth,
            y: options.height - legendHeight
          }
        },
        itemType = {
          'rect': 'Rect',
          'circle': 'Circle'
        };
      if (DPChart.isNumber(positions[0])) {
        pos = {
          x: positions[0],
          y: positions[1]
        }
      } else {
        positions = positions.join("-");
        for (pos in positionTable) {
          if (positions == pos) {
            pos = positionTable[pos];
            break;
          }
        }
      }
      var showType;
      for (var type in itemType) {
        if (legendOptions.itemType == type) {
          showType = itemType[type];
          break;
        }
      }
      var seriesLen = series.series.length,
        labelTexts = [],
        lineHeight = Math.ceil(legendHeight / seriesLen);
      series.series = series.series.sort(function (a, b) {
        return b.data - a.data
      });
      for (var ii = 0; ii < seriesLen; ii++) {
        labelTexts.push(series.series[ii].name);
      }
      for (var jj = 0; jj < seriesLen; jj++) {
        var itype;
        if (showType == "Circle") {
          itype = new Kinetic[showType]({
            x: pos.x + 5,
            y: pos.y + jj * lineHeight + 12,
            radius: 8,
            fill: colors[jj]
          })
        } else if (showType == "Rect") {
          itype = new Kinetic[showType]({
            x: pos.x + 5,
            y: pos.y + jj * lineHeight + 5,
            width: 10,
            height: 10,
            fill: colors[jj]
          })
        }
        var itext = new Kinetic.Text({
          x: pos.x + 12 + 5 + 5,
          y: pos.y + (jj - 1) * lineHeight + lineHeight + 5,
          text: labelTexts[jj] + "",
          fontSize: 10,
          fontFamily: "Curier",
          textFill: "#000"
        });
        layer.add(itype);
        layer.add(itext);
      }
    };
  var Grid = function (options, layer) {
      var defaultOption = {
        'color': '#CCCCCC',
        'columns': [],
        'strokeWidth': 1,
        'opacity': 0.4,
        'lineCap': 'round'
      };
      options.grid = mix(defaultOption, options.grid);
      var beginX = this.beginX = options.originX,
        beginY = this.beginY = options.originY,
        xAxises = options.axis.x,
        yAxises = options.axis.y,
        enableXGrid = options.grid.enableXGrid,
        enableYGrid = options.grid.enableYGrid;
      var yTickWidth = yAxises.tickWidth,
        yTickLength = yAxises.ticks.length,
        xTickWidth = xAxises.tickWidth,
        xTickLength = xAxises.ticks.length;
      if (enableXGrid) {
        for (var kk = 1; kk < yTickLength; kk++) {
          var yAxis = new Kinetic.Line({
            points: [beginX, beginY - yTickWidth * kk, xTickWidth * (xTickLength + 1), beginY - yTickWidth * kk],
            stroke: options.grid.color,
            strokeWidth: options.grid.strokeWidth,
            lineCap: options.grid.lineCap,
            alpha: options.grid.opacity
          });
          layer.add(yAxis);
        }
      }
      if (enableYGrid) {
        for (var k = 1; k <= xTickLength; k++) {
          var xAxis = new Kinetic.Line({
            points: [beginX + xTickWidth * k, beginY, beginX + xTickWidth * k, beginY - yTickWidth * (yTickLength - 1)],
            stroke: options.grid.color,
            strokeWidth: options.grid.strokeWidth,
            lineCap: options.grid.lineCap,
            alpha: options.grid.opacity
          });
          layer.add(xAxis);
        }
      }
    }
  var tooltipslayer = null;
  function tooltips(x, y, texts, side) {
    if (tooltipslayer == null) {
      tooltipslayer = new Kinetic.Layer();
    } else {
      tooltipslayer.clear();
    }(side == undefined) && (side = 'top');
    (side == 'top') && (y = y - 10);
    (side == 'left') && (x = x - 10);
    (side == 'right') && (x = x + 10);
    (side == 'bottom') && (y = y + 10);
    var path = function (width, height, padding) {
        var p = ['M', x, y],
          arrowWidth = 5,
          left, top
          height += (2 * padding || 0);
        width += (2 * padding || 0);
        switch (side) {
        case 'right':
          height = Math.max(arrowWidth * 2, height);
          p.push('l', arrowWidth, -arrowWidth);
          p.push('v', -(height / 2 - arrowWidth));
          p.push('h', width);
          p.push('v', height, 'h', -width);
          p.push('v', -(height / 2 - arrowWidth));
          p.push('l', -arrowWidth, -arrowWidth);
          left = x + arrowWidth;
          top = y - height / 2;
          break;
        case 'top':
          width = Math.max(arrowWidth * 2, width);
          p.push('l', -arrowWidth, -arrowWidth);
          p.push('h', -(width / 2 - arrowWidth));
          p.push('v', -height, 'h', width, 'v', height);
          p.push('h', -(width / 2 - arrowWidth));
          p.push('l', -arrowWidth, arrowWidth);
          left = x - width / 2;
          top = y - arrowWidth - height;
          break;
        case 'left':
          height = Math.max(arrowWidth * 2, height);
          p.push('l', -arrowWidth, arrowWidth);
          p.push('v', height / 2 - arrowWidth);
          p.push('h', -width, 'v', -height, 'h', width);
          p.push('v', height / 2 - arrowWidth);
          p.push('l', arrowWidth, arrowWidth);
          left = x - arrowWidth - width;
          top = y - height / 2;
          break;
        case 'bottom':
          width = Math.max(arrowWidth * 2, width);
          p.push('l', arrowWidth, arrowWidth);
          p.push('h', width / 2 - arrowWidth);
          p.push('v', height, 'h', -width, 'v', -height);
          p.push('h', width / 2 - arrowWidth);
          p.push('l', arrowWidth, -arrowWidth);
          left = x - width / 2;
          top = y + arrowWidth;
          break;
        }
        p.push('z')
        return {
          path: p,
          box: {
            left: left,
            top: top,
            width: width,
            height: height
          }
        };
      };
    var preWord = new Kinetic.Text({
      x: x,
      y: -200,
      fontSize: 12,
      text: '' + texts
    }),
      wd = preWord.getTextWidth(),
      hd = preWord.getTextHeight();
    var pathObj = path(wd, hd, 10),
      pathString = pathObj.path,
      boxInfo = pathObj.box;
    pathString = pathString.join(',');
    if (texts) {
      var tipWord = new Kinetic.Text({
        x: boxInfo.left + 10,
        y: boxInfo.top + 10,
        text: '' + texts,
        align: 'center',
        fontSize: 12,
        textFill: "#FF7018"
      });
    }
    var path = new Kinetic.Path({
      data: pathString,
      stroke: '#EFEFEF',
      scale: 1,
      fill: '#FFFFFF',
      draggable: true,
      shadow: {
        color: "#000",
        blur: 5,
        alpha: 0.4,
        offset: [2, 2]
      }
    });
    tooltipslayer.removeChildren();
    tooltipslayer.add(path);
    tooltipslayer.add(tipWord);
    return tooltipslayer;
  }

  function toolTipHide(newLayer) {
    newLayer.clear();
  }
  DPChart.tooltips = tooltips;
  DPChart.toolTipHide = toolTipHide;
  V.CanvasChart = DPChart;
})(this);