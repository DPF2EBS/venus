(function (undefined) {

    var SVG_NS = "http://www.w3.org/2000/svg",
        isObject = function (obj) {
            return obj === Object(obj);
        },
        keyValueDo = function (fn, key, value, context) {
            /*
             * @param fn{Function}
             * @param key{Object|String}
             * @param [value]
             * @param [context{Object}] pass to fn as the 'this' pointer
             *
             * if key is Object ,loop and call the fn
             * else call the fn using param key , value
             *
             * */

            if (!key) {
                return;
            }
            if (isObject(key)) {
                for (var o in key) {
                    fn.call(context, o, key[o]);
                }
            } else {
                fn.call(context, key, value);
            }
        },
        toCamel = function (str) {
            return str.replace(/\-\w/g, function (w) {
                return w.substr(1).toUpperCase();
            });
        }


//Element begin
    var Element = function (svgElement) {
        this.el = svgElement;

    };
    Element.prototype = {
        constructor:Element,
        isEmpty:function () {
            return !this.el;
        },
        attr:function (key, value) {
            if (this.isEmpty()) {
                return this
            }
            keyValueDo(function (_key, _value) {
                this.el.setAttribute(_key, _value);
            }, key, value, this);
            return this;
        },
        style:function (key, value) {
            if (this.isEmpty()) {
                return this
            }
            keyValueDo(function (_key, _value) {
                this.el.style[toCamel(_key)] = _value;
            }, key, value, this);
        },
        putItIn:function (el) {
            //append it to the el
            //@param el{Element|HTMLElement|HTMLSVGElement}
            if (this.isEmpty()) {
                return this
            }
            el instanceof Element ? (el.el.appendChild(this.el)) : el.appendChild(this.el);
            return this;
        },
        putItAt:function (x, y) {
            return  this.attr({
                'x':x,
                'y':y,
                'cx':x,
                'cy':y
            });
        },
        fill:function (color) {
            return this.attr('fill', color);
        },
        border:function (width, color) {
            //set the border(actually 'stroke')
            width !== undefined && this.attr('stroke-width', width);
            color !== undefined && this.attr('stroke', color);
            return this;
        }
    };

    Element.extend = function (key, value) {
        //add function to Element.prototype
        if (isObject(key)) {
            for (var attr in key) {
                Element.prototype[attr] = key[attr];
            }
        } else if (typeof key === "string") {
            Element.prototype[key] = value;
        }
    };

    Element.create = function (type, attrs) {
        //return an Element instance
        return (new Element(document.createElementNS(SVG_NS, type))).attr(attrs);
    }
//Element end

    var SVG = {
        Draw:{
            svg:function (attrs) {
                return  Element.create('svg').attr(attrs);
            },
            rect:function (width, height) {
                //@param width{Number|String|Object}
                //@param Same as width
                //if width is Number , set the width and height
                //if width is String , means other attribute key-value such as rect('x',100)
                //if width is Object , means Attributes such as{'x':100}
                var rect = Element.create('rect'),
                    attrs = {};
                switch (typeof width) {
                    case "number":
                        attrs = {
                            width:width,
                            height:height
                        };
                        break;
                    case "string":
                        attrs = {width:height}
                        break;
                    case 'object':
                        attrs = width;
                }
                return rect.attr(attrs);
            },
            circle:function (attrs) {
                var circle = Element.create('circle');
                switch (typeof attrs) {
                    case 'number':
                        return circle.attr('r', attrs);
                    case 'object':
                        return circle.attr(attrs);
                }
                return circle;
            }
        }
    };

    try {
        exports.SVG = SVG
    } catch (e) {
        this.SVG = SVG;
    }
})();