;(function () {
    var util=Venus.util||{};
    var _hsv2rgb = function (h, s, v) {
        var hi, f, p, q, result = [];
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

        for (var j = 0, L = result.length; j < L; j++) {result[j] = Math.floor(result[j] * 255);}

        return result;
    };

    /**
     * get a group of chart colors
     * @param {Integer} colorCount How many colors needed.
     * @example DPChart.getColors(6);
     * @return a group of colors in type of rgb().
     * @type {Array}
     */
    util.getColors = function (colorCount) {
        var H=[.6, .2, .05, .1333, .75, 0], S=[0.75,0.75,0.45,1,0.35], V=[0.75,0.45,0.9,0.6,0.9], colors = [], L;

		//if colorCount is not provide, set colorCount default value 20
		colorCount=parseInt(colorCount,10)||10;
		L=Math.min(colorCount,Math.max(colorCount/S.length,12));

		for(var c=0;c<colorCount;c++){
			if (c < H.length&&colorCount<=H.length) {
                colors.push('rgba(' + _hsv2rgb(H[c]*360, S[0], V[0]).join(',') + ', 1)');
            }else{
				colors.push('rgba(' + _hsv2rgb(c%L*360/L, S[Math.floor(c/L)], V[Math.floor(c/L)]).join(',') + ', 1)');
			}
		}

        return colors;
    };


    /*
     * mix
     * */
    util.mix = function (o1, o2) {
        for (var attr in o2) {
            if (typeof  o2[attr] !== "object" || o1[attr] === undefined || typeof o1[attr] !== 'object') {
                o1[attr] = o2[attr];
            } else {
                util.mix(o1[attr], o2[attr]);
            }
        }
        return o1;
    };


    /*
    * isArray
    * */

    util.isArray = function (arr) {
        return __type(arr, "array");
    };

    /*
     * isObject
     */
    util.isObject = function(obj){
        return __type(obj, "object");
    };

    util.isNumber = function(nub){
        return __type(nub, "number");
    };

	util.isFunction=function(func){
		return __type(func,"function");
	};

    /**
    *get variable true type
    *@param {Unknown} target variable to be checked
    *@param {String} type[optional] which variable type to be check.
    *type can be any element of this array [Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String]
    *@return the result checked, if parameter type is provide, result will be true or false. else result is variable type.
    *@type {Boolean|String}
    */
    function __type(target, type) {
        var clas = Object.prototype.toString.call(target).slice(8, -1);
        clas = clas.toLowerCase();
        return !type?clas:target !== undefined && target !== null && clas === type;
    }


    /*
    * clone object
    *
    * returns a cloned object
    * */

   util.clone = function(obj){
       if(typeof obj=="string" || typeof obj=="boolean" || typeof obj== "number" || obj==null || util.isFunction(obj)){
           return obj;
       }
       if(util.isArray(obj)){
           return obj.slice(0);
       }
       if(util.isObject(obj)){
           var cloned = {};
           for(var o in obj){
               cloned[o] = util.clone(obj[o]);
           }
           return cloned;
       }

   };

    /*
    * add and multiple function to fix float number bug
    * */


    util.number = {
        add:function () {
            var args = Array.prototype.slice.call(arguments,0),
                mul = 1,
                sum = 0;
            args.forEach(function (number) {
                if (number.toString().indexOf('.') != -1) {
                    mul = Math.pow(10, number.toString().split('.')[1].length);
                }
            });
            args.forEach(function (num) {
                sum += num * mul;
            });
            return sum / mul;
        },
        multiple:function () {
            var args = Array.prototype.slice.call(arguments,0),
                mul = 1,
                divider = 1,
                sum = 1;
            args.forEach(function (number) {
                if (number.toString().indexOf('.') != -1) {
                    mul = Math.pow(10, number.toString().split('.')[1].length);
                    sum *= (number * mul);
                    divider *= mul;
                } else {
                    sum *= number;
                }
            });
            return sum / divider;
        }
    };

    util.date = {
        parse:function (d) {
            try{
                if(typeof d ==="string"){
                    var arr = d.split(/\s|-|\/|\:/);
                    if(arr[1]){
                        arr[1]--;
                    }
                    return eval("(new Date("+arr.join(',')+"))");
                }
                    return new Date(d);

            }catch(e){
                throw "can't convert date :" + d;
            }
//                try{
//                    if(typeof d==="string" && d.indexOf(' ')!==-1 && d.indexOf(':')==-1 && d.indexOf(' ')!== d.length-1){
//                        //yyyy-MM-dd hh, this cant't be parsed
//                        d+= ":00";
//                    }else if(util.isNumber(d)){
//                        return new Date(d)
//                    }
//                    if(typeof d==="string" && navigator.userAgent.indexOf('MSIE')!==-1){
//                        //is ie , can't use Date.parse to pase 'yyyy-MM-dd'
//                        // use new Date
//
//                        var arr = d.split(/\s|-|\/|\:/);
//                        if(arr[1]){
//                            arr[1]--;
//                        }
//                        return eval("(new Date("+arr.join(',')+"))");
//                    }
//                    var date = Date.parse(d);
//                    if (!date && date !== 0) {
//                        throw "can't convert date " + d;
//                    } else {
//                        return new Date(date);
//                    }
//                }catch(e){
//                    throw "can't convert date " + d;
//                }

        },
        format:function (date, formatString) {
            /*
            * convert Date instance to string
            * */
            date = this.parse(date);
            var formatStr = formatString || "yyyy-MM-dd hh:mm::ss",
                year = date.getFullYear().toString(),
                month = "0" + (date.getMonth() + 1),
                day = "0" + date.getDate(),
                hour = "0" + date.getHours(),
                minute = "0" + date.getMinutes(),
                second = "0" + date.getSeconds();

             var s =formatStr.replace('yyyy', year).replace('yy', year.substr(year.length - 2)).replace('MM', month.substr(month.length - 2))
                .replace('dd', day.substr(day.length - 2)).replace('hh', hour.substr(hour.length - 2)).replace('mm', minute.substr(minute.length - 2))
                .replace('ss', second.substr(second.length - 2));

            return s;

        }
    }
})();
