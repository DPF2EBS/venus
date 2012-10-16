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
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}



(function (root, NULL, undef) {
    var defaultConfig = {
            radius:40,
            alpha:1
        },
        util = {},
        toString = Object.prototype.toString;
    mix(util, {
        isArray:function(obj){
            return toString.call(obj) === "[object Array]";
        },
        isObject: function(obj){
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
        addPoint: function(x, y, count){
            var point;
            if(util.isArray(x)){ // [1,1]
                point = x;
                x = point[0];
                y = point[1];
            }else if(util.isObject(x)){ //{x:1,y:1,count:4}
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
        _addPoint:function(x, y, count){
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
        addPointSet: function(pointSet){
            //add point set
            this._addPointSet(pointSet);
            //heat
            this.heat();
        },
        _addPointSet: function(pointSet){
            var me = this;
            pointSet.forEach(function(point){
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
            this.drawAlpha();
            this.colorize();
        },
        drawAlpha: function(){
            this.area.forEach(function(row){
                row.forEach(function (point){
                    this.drawAlphaPoint(point);
                }.bind(this));
            }.bind(this));
        },
        drawAlphaPoint: function(point){
            var radius = this.config.radius,
                context = this.context,
                x = point.x,
                y = point.y,
                percent = point.count / this.max;
            //from heatmap.js
            /*context.shadowColor = ('rgba(0,0,0,'+percent+')');
            context.shadowOffsetX = 1000;
            context.shadowOffsetY = 1000;
            context.shadowBlur = 15;
            context.beginPath();
            context.arc(x - 1000, y - 1000, radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();*/
                
            radgrad = context.createRadialGradient(x, y, 0, x, y, radius);
            radgrad.addColorStop(0, 'rgba(0,0,0,'+1*percent+')');
            radgrad.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = radgrad;
            context.beginPath();
            context.arc(point.x,point.y,radius,0,Math.PI*2,true);
            context.closePath();
            context.fill();
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


/*
 * TODO
 * 1. 区域重绘
 */
