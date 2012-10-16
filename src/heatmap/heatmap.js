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
        util = {},
        toString = Object.prototype.toString;
    mix(util, {
        isArray:function(obj){
            return toString.call(obj) == "[object Array]";
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
        addPoint: function(x, y){
            this._addPoint(x, y, 1);
            this.heat();
        },
        //add point to area
        _addPoint:function(x, y, count){
            var _count;
            this.area[x] = this.area[x] || [];
            this.area[x][y] = this.area[x][y] || {
                x: x,
                y: y,
                count: 0
            };
            this.area.count += count;
            _count = this.area[x][y].count += count;
            if (this.max < _count) {
                this.max = _count;
            }
        },
        setPointSet: function (pointSet) {
            this.area = [];
            //迭代pointSet中的每一个点
            this._addPointSet(pointSet);
            this.heat();
        },
        addPointSet: function(pointSet){
            this._addPointSet(pointSet);
            this.heat();
        },
        _addPointSet: function(pointSet){
            var me = this;
            pointSet.forEach(function(point){
                //如果这个点是数组
                if(util.isArray(point)){
                    point[2] = 1;
                    me._addPoint.apply(me, point);
                }else{
                    me._addPoint(point.x, point.y, point.count);
                }
            });
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
            this.heatAlphaRadialGradient(point, percent);
        },
        heatAlphaRadialGradient: function (point, percent) {
            var radius = 40,
                context = this.context,
                radgrad = context.createRadialGradient(point.x,point.y,0,point.x,point.y,radius);
            radgrad.addColorStop(0, 'rgba(255,0,0,'+1*percent+')');
            radgrad.addColorStop(0.618, 'rgba(255,0,0,'+0.5*percent+')');
            radgrad.addColorStop(1, 'rgba(255,0,0,0)');
            context.fillStyle = radgrad;
            context.arc(point.x,point.y,radius,0,Math.PI*2,true);
            context.fill();
            this.colorize();
        },
        colorize:function(){
            var context = this.context,
                canvas = this.canvas,
                width = canvas.width,
                height = canvas.height,
                image = context.getImageData(0, 0, width, height),
                alpha,
                imageData = image.data,
                length = imageData.length;
                for(var i=3; i < length; i+=4){
                    alpha = imageData[i];
                    if(alpha > 170){
                        imageData[i-3] = 255;
                        imageData[i-2] = 255 - 255 * (alpha - 170)/85 ;
                        imageData[i-1] = 0;
                    }else if(alpha > 85){
                        imageData[i-3] = 255 * (alpha - 85)/85;
                        imageData[i-2] = 255;
                        imageData[i-1] = 0; 
                    }else if(alpha >0){
                        imageData[i-3] = 0;
                        imageData[i-2] = 255;
                        imageData[i-1] = 255 - 255 * (alpha - 85) / 85 ;
                    }
                }
                image.data =  imageData;
                console.log(imageData);
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
})(window, null);

