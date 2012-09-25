;(function () {
    var util=Venus.util||{};
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

        for (var j = 0, L = result.length; j < L; j++) {result[j] = Math.floor(result[j] * 255);}

        return result;
    }

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
    }


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
    }
	

    /*
    * isArray
    * */

   util.isArray =  function (arr) {
        return __type(arr, "array");
    }

    /*
     * isObject
     */
    util.isObject = function(obj){
        return __type(obj, "object");
    }

    util.isNumber = function(nub){
        return __type(nub, "number");
    }
	
	util.isFunction=function(func){
		return __type(func,"function");
	}

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
    };


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

   }

})();
