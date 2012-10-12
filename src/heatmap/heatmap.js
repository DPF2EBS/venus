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

(function (root, NULL, undef) {
    var defaultConfig = {},
    mix = function (o1, o2) {
        for (var attr in o2) {
            if (typeof o2[attr] !== "object" || o1[attr] === undefined || typeof o1[attr] !== 'object') {
                o1[attr] = o2[attr];
            } else {
                mix(o1[attr], o2[attr]);
            }
        }
        return o1;
    };

    function heatmap(canvas, config) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.config = mix(defaultConfig, config);
        this.area = [];
        this.max = 0;
        this.area.count = 0;
    }
    mix(heatmap.prototype, {
        point: function (x, y) {
            this.area[x] = this.area[x] || [];
            this.area[x][y] = this.area[x][y] || {
                x: x,
                y: y,
                count: 0
            };
            this.area.count++;
            this.area[x][y].count++;
            if (this.max < this.area[x][y].count) {
                this.max = this.area[x][y].count;
                this.heat();
            }else{
                this.heatPoint(this.area[x][y]);
            }
        },
        heat: function () {
            this.clear();
            this._heat();
        },
        _heat: function () {
            var that = this;
            this.area.forEach(function (row) {
                row.forEach(function (point) {
                    that.heatPoint(point);
                });
            });
        },
        heatPoint: function (point) {
            var percent = point.count / this.max;
            this.heatRadialGradient(point, percent);
        },
        heatRadialGradient: function (point, percent) {
            var context = this.context;
            context.beginPath();
            context.arc(point.x, point.y, 10, 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(60,60,60,"+percent+")";
            context.fill();
        },
        clear: function () {
            var canvas = this.canvas;
            this.context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
    root.heatmap = function (canvas, config) {
        return new heatmap(canvas, config);
    }
})(window, null);

