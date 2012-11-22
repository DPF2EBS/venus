/**
 * Created with JetBrains WebStorm.
 * User: allanma
 * Date: 12-5-18
 * Time: 下午6:38
 * customevent.js
 * Pack after common.js
 */
;(function () {
    var namespace = Venus.util||{};


    var slice = Array.prototype.slice

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

    CustomEvent.prototype.one = function (eventName, callback) {
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

    CustomEvent.prototype.fire = function () {
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

    CustomEvent.prototype.clear = function () {
        this.events = {};
    };

    namespace.CustomEvent = CustomEvent;
})();