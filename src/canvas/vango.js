/*
 *vango.js a light lib extending from canvas API
 */
/*
 * lang
 */;
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
})(this, function () {

    var __hasProp = Object.prototype.hasOwnProperty,
        DOC = document,
        vangoprop = Vango.prototype,
        __animate;

    __animate = (function () {
        var requestAnimationFrame;
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
            setTimeout(function () {
                callback(new Date());
            }, 1000 / 60);
        };
        animate = function (duration, callback) {
            var finished, startTime, step;
            startTime = new Date();
            finished = -1;
            step = function (timestemp) {
                var progress;
                progress = timestemp - startTime;
                if (progress >= duration) {
                    callback(finished);
                    return;
                }
                callback(progress);
                return requestAnimationFrame(step);
            };
            return requestAnimationFrame(step);
        };
        return animate;
    })();


    /*
     * Vango instance constructor
     */
    function Vango(container, width, height) {
        var cvs;
        if (container == null) {
            return;
        }
        cvs = this.canvas = DOC.createElementByTagName("canvas");
        cvs.width = width;
        cvs.height = height;
        this.context = cvs.getContext("2d");
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

    ["getContext", "toDataURL"].forEach(function (method) {
        vangoprop[method] = function () {
            var cvs = this.canvas;
            return cvs[method].apply(cvs, arguments);
        }
    });


    /*
     * Context
     */

    /*
		attrName					attrValue				option
		
		canvas						--						readonly
		fillStyle					{String}
									{linearGradient}
									{radialGradient}
									{canvasPattern}
		font						{String}				css Font syntax
		globalAlpha					{Nnumber}				0.0	1.0
		globalCompositeOperation	{String}
		lineCap						{String}
		lineJoin					{String}
		lineWidth					{Number}
		miterLimit					{Number}
		textAlign					{String}
		textBaseline				{String}
		shadowBlur					{float}
		shadowColor					{String}				css Color String
		shadowOffsetX, shadowOffsetY{float}
		strokeStyle					{String}
									{linearGradient}
									{radialGradient}
									{canvasPattern}
	*/
    Vango.style = function (key, value) {
        this.context[key] = value;
    };

    Vango.style = __overloadGetterSetter.call(Vango.style, function (key) {
        return this.context[key];
    });

    /*
     * void mehtod
     * return tihs
     */

    [
    /*
     * path method
     */
    "beginPath", "closePath", "fill", "stroke", "clip", "moveTo", "lineTo", "arc", "arcTo", "bezierCurveTo", "quadraticCurveTo", "rect",
    /*
     * rectangles
     */
    "clearRect", "fillRect", "strokeRect",
    /*
     * text
     */
    "fillText", "strokeText",
    /*
     * image drawing
     */
    "drawImage",
    /*
     * pixel manipulation
     */
    "putImageData",
    /*
     * 2D Context
     */
    "save", "restore",
    /*
     * transform
     */
    "scale", "rotate", "translate", "transform", "setTransform"].forEach(function (method) {
        var ctx = this.context;
        ctx[method].apply(ctx, arguments);
        return this;
    });


    /*
     * return original returns
     */
    [
    /*
     * path
     */
    "isPointInPath",
    /*
     * text
     * measureText Interface
     * width	{float}	readonly
     */
    "measureText",
    /*
     * pixel manipulation
     * imageData	interface
     * 	width	unsigned long	readyonly
     * 	height	unsigned long	readyonly
     * 	data	CanvasPixelArray	readyonly
     * CanvasPixelArray interface
     * 	length	unsigned	readyonly
     */
    "createImageData", "getImageData",
    /*
     * color style & shadow
     * CanvasGradient interface
     * 	void	addColorStop(float offset,string color)
     */
    "createLinearGradient", "createRadialGradient", "createPattern"], forEach(function (method) {
        var ctx = this.context;
        return ctx[method].apply(ctx, arguments);
    });



    /*
     * extend Canvas
     */
    Vango.extend = function (name, method) {
        vangoprop[name] = method;
    }
    Vango.extend = __overloadGetterSetter.call(Vango.extend);


    Vango.extend("extend", __overloadGetterSetter.call(function (name, method) {
        this[name] = method;
    }));

    /*
     * extend context
     */
    Vango.extend({
        /*
         * graph extends
         */
        line: function (sx, sy, ex, ey) {},
        cicle: function (x, y, radius) {},
        rect: function (x, y, width, height) {},
        ellipse: function (x, y, radiusX, radiusY) {},
        polygon: function (n, x, y, radius, angle) {},
        sector: function (x, y, radius, startAngle, endAngle) {},
        /*@params pathString {String}	path string in SVG format.	"M10,20L30,40"
		Command	Name								Parameters
		M		moveto								(x y)+
		Z		closepath							(none)
		L		lineto								(x y)+
		H		horizontal lineto					x+
		V		vertical lineto						y+
		C		curveto								(x1 y1 x2 y2 x y)+
		S		smooth curveto						(x2 y2 x y)+
		Q		quadratic Bézier curveto			(x1 y1 x y)+
		T		smooth quadratic Bézier curveto	(x y)+
		A		elliptical arc						(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
		R		Catmull-Rom curveto*				x1 y1 (x y)+
		*/
        path: function (pathString) {},
        image: function (src, x, y) {},
        text: function (x, y, text) {},

        /*
         * transform extends
         */
        shear: function (kx, ky) {},
        rotateAbout: function (x, y, theta) {}
    });


    /*
     * native events adapter
     */
    Vango.extend({
        on: function (type, listener) {},
        off: function (type, listener) {}
    });

    /*
     * animate
     */
    vangoprop.animate = __animate;


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
            if (type of a === "string" && arguments.length === 1 && getter) {
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

