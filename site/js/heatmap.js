/*
heatmap base on canvas
author:Zhi Cun(island205@gmail.com)
date:2012-10-12 17:21
*/
/*
 *lang extentions
 */
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

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}



(function (root, NULL, undef) {
    var defaultConfig = {
        radius: 40,
        opacity: 0.8
    },
    util = {},
    toString = Object.prototype.toString;
    mix(util, {
        isArray: function (obj) {
            return toString.call(obj) === "[object Array]";
        },
        isObject: function (obj) {
            return obj === Object(obj);
        }
    });

    function heatmap(canvas, config) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.config = mix(defaultConfig, config);
        this.area = [];
        this.max = 0;
        this.area.count = 0;
    }
    mix(heatmap.prototype, {
        addPoint: function (x, y, count) {
            var point;
            if (util.isArray(x)) { // [1,1]
                point = x;
                x = point[0];
                y = point[1];
            } else if (util.isObject(x)) { //{x:1,y:1,count:4}
                point = x;
                x = point.x;
                y = point.y;
                count = point.count;
            } // addPoint(1,1) or addPint(1, 1, 4)
            count = count || 1;
            this._addPoint(x, y, count);
            this.heat();
        },
        //add point to area
        _addPoint: function (x, y, count) {
            var _count;
            this.area[x] = this.area[x] || [];
            this.area[x][y] = this.area[x][y] || {
                x: x,
                y: y,
                count: 0
            };
            this.area.count += count;
            this.area[x][y].count += count;
            _count = this.area[x][y].count;
            if (this.max < _count) {
                this.max = _count;
            }
        },
        setPointSet: function (pointSet) {
            //clear area
            this.area = [];
            //add point set
            this._addPointSet(pointSet);
            //heat
            this.heat();
        },
        addPointSet: function (pointSet) {
            //add point set
            this._addPointSet(pointSet);
            //heat
            this.heat();
        },
        _addPointSet: function (pointSet) {
            var me = this;
            pointSet.forEach(function (point) {
                if (util.isArray(point)) {
                    point[2] = 1;
                    me._addPoint.apply(me, point);
                } else {
                    me._addPoint(point.x, point.y, point.count);
                }
            });
        },
        heat: function () {
            this.clear();
            this.drawAlpha();
            this.colorize();
        },
        drawAlpha: function () {
            this.area.forEach(function (row) {
                row.forEach(function (point) {
                    this.drawAlphaPoint(point);
                }.bind(this));
            }.bind(this));
        },
        drawAlphaPoint: function (point) {
            var radius = this.config.radius,
                opacity = this.config.opacity,
                context = this.context,
                x = point.x,
                y = point.y,
                percent = point.count / this.max;
            //from heatmap.js
            /*
            context.shadowColor = ('rgba(0,0,0,'+percent+')');
            context.shadowOffsetX = 1000;
            context.shadowOffsetY = 1000;
            context.shadowBlur = 15;
            context.beginPath();
            context.arc(x - 1000, y - 1000, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();*/

            radgrad = context.createRadialGradient(x, y, 0, x, y, radius);
            radgrad.addColorStop(0, 'rgba(0,0,0,' + percent * opacity + ')');
            radgrad.addColorStop(0.8, 'rgba(0,0,0,' + percent * opacity * 0.4 + ')');
            radgrad.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = radgrad;
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        },
        colorize: function () {
            var context = this.context,
                canvas = this.canvas,
                width = canvas.width,
                height = canvas.height,
                opacity = this.config.opacity,
                image = context.getImageData(0, 0, width, height),
                alpha,
                rgb,
                imageData = image.data,
                length = imageData.length;
            for (var i = 3; i < length; i += 4) {
                alpha = imageData[i];
                rgb = hsvToRgb(280 - alpha / (255 * opacity) * 280, 100, 100);
                imageData[i - 3] = rgb[0];
                imageData[i - 2] = rgb[1];
                imageData[i - 1] = rgb[2];
            }
            image.data = imageData;
            this.clear();
            context.putImageData(image, 0, 0);
        },
        clear: function () {
            var canvas = this.canvas;
            this.context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
    root.heatmap = function (canvas, config) {
        return new heatmap(canvas, config);
    }

    function mix(target, source) {
        for (var attr in source) {
            if (typeof source[attr] !== "object" || target[attr] === undefined || typeof target[attr] !== 'object') {
                target[attr] = source[attr];
            } else {

            }
        }
        return target;
    };
    /**
     * HSV to RGB color conversion
     *
     * H runs from 0 to 360 degrees
     * S and V run from 0 to 100
     * 
     * Ported from the excellent java algorithm by Eugene Vishnevsky at:
     * http://www.cs.rit.edu/~ncs/color/t_convert.html
     */
    function hsvToRgb(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;
        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));
        // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.
        s /= 100;
        v /= 100;
        if (s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            default:
                // case 5:
                r = v;
                g = p;
                b = q;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

})(window, null);


/*
 * TODO
 * 1. 区域重绘
 */

