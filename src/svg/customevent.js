/**
 * Created with JetBrains WebStorm.
 * User: allanma
 * Date: 12-5-18
 * Time: 下午6:38
 * customevent.js
 */

var slice = Array.prototype.slice,
    splice = Array.prototype.splice;

var isArray = function (obj) {
    return obj && Object.prototype.toString.call(obj) === "[object Array]"
}

var CustomEvent = function () {
    /*
     * events format like
     * {
     *   event1:{
     *      callbacks:[fn1,fn2...]
     *   },
     *   event2:{}..
     * }
     */
    this.events = {};
};

var createWhenNone = function (obj, eventName) {
        return (obj.events[eventName]) || (obj.events[eventName] = {callbacks:[]});
    },
    bind = function (obj, eventName, fn) {
        createWhenNone(obj, eventName).callbacks.push(fn);
    };

CustomEvent.prototype.on = function (eventName, callback) {
    //@param eventName:String name of event
    //@param callback:Function the callback function
    //call callback when eventName fired
    if (typeof callback !== "function") {
        return;
    }
    bind(this, eventName, callback);
};
CustomEvent.prototype.bind = CustomEvent.prototype.subscribe = CustomEvent.prototype.on;

CustomEvent.prototype.off = function (eventName, fn) {
    if (!fn) {
        //remove all eventName callbacks
        this.events[eventName] = {callbacks:[]};
    } else {
        var cb, i = 0, cbs = createWhenNone(this, eventName).callbacks;
        while (cb = cbs[i++]) {
            if (cb === fn) {
                cbs.splice(--i, 1);
            }
        }
    }
};
CustomEvent.prototype.unbind = CustomEvent.prototype.off;

CustomEvent.prototype.once = function (eventName, callback) {
    //@param eventName:String name of event
    //@param callback:Function the callback function
    //当event fire之后触发callback，只触发一次，触发完之后remove
    if (typeof callback !== "function") {
        return;
    }
    var self = this;
    bind(this, eventName, function () {
        callback.apply(eventName, slice.call(arguments, 0));
        self.off(eventName, arguments.callee);
    });
};

CustomEvent.prototype.when = function () {
    //@param eventName1,eventName2....,callback 或者 [eventName1,eventName2...],callback
    //当所有event都fire之后回调callback，所有都触发过之后，任意event再触发，会触发callback
    if (isArray(arguments[0])) {
        params = arguments[0];
        params.push(arguments[arguments.length - 1])
    } else {
        params = arguments;
    }
    var i, l = params.length,
        callback = params[l - 1],
        event,
        current = 0,
        all = Math.pow(2, l - 1) - 1,
        self = this,
        params;
    if (typeof callback !== "function") {
        return;
    }

    for (i = 0; i < l - 1; i++) {
        event = params[i];
        (function (k, e) {
            //闭包以避免i,event的值问题
            bind(self, event, function () {
                current |= Math.pow(2, k);
                if (current === all) {
                    callback.apply(e, slice.call(arguments, 0));
                }
            });
        })(i, event);
    }
};

CustomEvent.prototype.whenOnce = function () {
    //@param eventName1,eventName2....,callback
    //当所有event都fire之后回调callback，只回调一次
    var called = false,
        l = arguments.length,
        callback = arguments[l - 1];
    var args = slice.call(arguments, 0);
    args.splice(l - 1, 1, function () {
        if (!called) {
            called = true;
            callback.apply(this, slice.call(arguments, 0));
        }
    });
    this.when.apply(this, args);
};

CustomEvent.prototype.any = function () {
    var callback = arguments[arguments.length - 1],
        events,
        ev;
    if (typeof callback !== "function") {
        return;
    }
    events = slice.call(arguments, 0, -1);
    while (ev = events.shift()) {
        bind(this, ev, callback);
    }
    return this;
};

CustomEvent.prototype.emit = function () {
    var event = arguments[0],
        data = slice.call(arguments, 1),
        callback,
        i = 0;
    if (this.events[event] && this.events[event].callbacks) {
        while (callback = this.events[event].callbacks[i++]) {
            callback.apply(event, data);
        }
    }
    return this;
};
CustomEvent.prototype.fire = CustomEvent.prototype.trigger = CustomEvent.prototype.emit;

CustomEvent.prototype.clear = function () {
    this.events = {};
};
CustomEvent.extendTo = function (obj) {
    if (!obj) {
        return;
    }
    for (var proto in CustomEvent.prototype) {
        if (!obj[proto]) {
            obj[proto] = CustomEvent.prototype[proto];
        }
    }
}

try{
    exports.CustomEvent = CustomEvent;
}catch(e){
    this.CustomEvent = CustomEvent;
}