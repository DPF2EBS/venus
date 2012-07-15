/*
 *vango.js a light lib extending from canvas API
 */;


/*
 * lang
 */
(function () {
    /*
     *https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
     */
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError("this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ({}.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }

})();
/*
 * wrapper for browser,nodejs or AMD loader evn
 */

(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.Vango = factory();
    }
})(root, function () {

    var __hasProp = Object.prototype.hasOwnProperty,
    DOC=document;
    vangoprop=Vango.prototype;

    /*
     * Vango instance constructor
     */
    function Vango(container, width, height) {
        var cvs;
        if(container == null){
            return;
        }
        cvs=this.canvas=DOC.createElementByTagName("canvas");
        cvs.width=width;
        cvs.height=height;
        this.context=cvs.getContext("2d");
        container.appendChild(cvs);
    }

    /*
     * canvas DOM
     */
    Vango.attr = function (key, value) {
        this.canvas.setAttribute(key, value);
    }
    Vango.attr = __overloadGetterSetter.call(Vango.attr, function (key) {
        this.canvas.getAttribute(key);
    });

    Vango.css = function (property, value) {
        this.canvas.style[property] = value;
    };
    Vango.css = __overloadGetterSetter.call(Vango.css, function (property) {
        return this.canvas.style[property];
    });

    ["getContext", "toDataURL"].forEach(function(method){
        vangoprop[method]=function(){
            var cvs=this.canvas;
            return cvs[method].apply(cvs,arguments);
        }
    });




    /*
     * util
     */
    function __extend(target, source) {
        for (var key in source) {
            if (__hasProp.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    function __overloadGetterSetter = function (getter) {
        var that = this;
        return function (a, b) {
            if (a == null) return this;
            if (type of a === "string" && arguments.length === 1) {
                return getter.call(this, a);
            }
            if (type a === "object") {
                for (var k in a) {
                    that.call(this, k, a[k]);
                }
            } else {
                that.call(this, a, b);
            }
            return this;
        }
    }

    return Vango;
});

