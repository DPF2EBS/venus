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
        },
        mix = function (o1, o2) {
            if (!isObject(o1) || !isObject(o2)) {
                return;
            }
            for (var o in o2) {
                o1[o] = o2[o];
            }
        },
        transformMap = {
            'translate':'translate'
        },
        transformReg = /(translate|scale)\(([\w\W]+)\)/,
        cache = {
            color:''
        }


//Element begin
    var Element = function (svgElement) {
        if (!(svgElement instanceof Element)) {
            this.el = svgElement;
            this._events = {};
        } else {
            return svgElement;
        }

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
        in:function (el) {
            //append it to the el
            //@param el{Element|HTMLElement|HTMLSVGElement}
            if (this.isEmpty()) {
                return this
            }
            el instanceof Element ? (el.el.appendChild(this.el)) : el.appendChild(this.el);
            return this;
        },
        at:function (x, y) {
            if (this.el && this.el.nodeName === "g") {
                return this.translate(x, y);
            }
            return  this.attr({
                'x':x,
                'y':y,
                'cx':x,
                'cy':y
            });
        },
        fill:function (color) {
            return this.attr('fill', color || cache.color);
        },
        stroke:function (width, color) {
            //set the border(actually 'stroke')
            if (arguments.length == 0) {
                //stroke use cache color and width
                return this.attr({
                    'stroke':cache.color,
                    'stroke-width':cache.size
                });
            } else if (arguments.length == 1) {
                var type = typeof arguments[0];
                return this.attr({
                    'stroke':type == "string" ? arguments[0] : cache.color,
                    'stroke-width':type == "number" ? arguments[0] : cache.size
                });
            } else if (arguments.length == 2) {
                var type1 = typeof arguments[0],
                    type2 = typeof arguments[1];
                return this.attr({
                    'stroke':type1 == "string" ? arguments[0] : (type2 == "string" ? arguments[1] : cache.color),
                    'stroke-width':type1 == "number" ? arguments[0] : (type2 == "number" ? arguments[1] : cache.size)
                });
            }
        },
        translate:function (x, y) {
            return  this.transform('translate(' + x + "," + y + ")");
        },
        scale:function (sx, sy) {
            return this.transform('scale(' + sx + "," + (sy || sx) + ")");
        },
        transform:function (tStr) {
            if (this.isEmpty()) {
                return this;
            }
            var svg = document.createElementNS(SVG_NS, 'svg'),
                transArr = tStr.split(/\s+/), i, l,
                type, param, match;
            var trans = this.el.transform.baseVal.appendItem(svg.createSVGTransform());
            //create an new SVGTransform
            for (i = 0, l = transArr.length; i < l; i++) {
                match = transArr[i].match(transformReg);
                if (match) {
                    type = match[1];
                    param = match[2].split(',');
                    //   matrix[type] && matrix[type].apply(matrix, param.split(','));
                    switch (type) {
                        case 'translate':
                            trans.setTranslate.apply(trans, param);
                            break;
                        case 'scale':
                            trans.setScale.apply(trans, param);
                            break;
                    }
                }
            }
            return this;
        },
        remove:function () {
            if (this.isEmpty()) {
                return this;
            }
            this.el.parentNode.removeChild(this.el);
            return this;
        },
        on:function (eventName, fn) {
            //bind event
            if (this.isEmpty()) {
                return this;
            }
            var self = this,
                wrap = function (e) {
                    fn.call(self, e);
                };
            fn._event_wrap = wrap;
            this._events[eventName] || ( this._events[eventName] = []);
            this._events[eventName].push(wrap);
            this.el.addEventListener(eventName, wrap, false);
            return this;
        },
        off:function (eventName, fn) {
            //unbind event
            if (this.isEmpty()) {
                return this;
            }
            if (fn) {
                //remove fn
                var wrap = fn._event_wrap,
                    eve,
                    events,
                    i = 0;
                if (wrap && (events = this._events[eventName])) {
                    while (eve = events[i]) {
                        if (wrap === eve) {
                            //remove it
                            this.el.removeEventListener(eventName, wrap, false);
                            events.splice(i--, 1);
                        }
                        i++;
                    }
                }
            } else {
                //remove all
                var eve;
                while (this._events[eventName] && this._events[eventName].length) {
                    eve = this._events[eventName].shift();
                    this.el.removeEventListener(eventName, eve, false);
                }
            }
            return this;
        },
        fire:function (eventName) {
            var eve , i = 0;
            while (eve = (this._events[eventName] || [])[i++]) {
                eve && eve.call(this);
            }
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
    };
//Element end

    //Brush begin
    var Brush = function (color, size) {
        this.color = color;
        this.size = size;
    };
    //Brush end

    var SVG = {
        Draw:{
            g:function (attrs) {
                return Element.create('g').attr(attrs);
            },
            rect:function (width, height) {
                //@param width{Number|String|Object}
                //@param Same as width
                //if width is Number , set the width and height
                //if width is String , means other attribute key-value such as rect('x',100)
                //if width is Object , means Attributes such as{'x':100}
                var rect = Element.create('rect'),
                    attrs = {};
                cache.color && (attrs.fill = cache.color);
                switch (typeof width) {
                    case "number":
                        mix(attrs, {
                            width:width,
                            height:height
                        })
                        break;
                    case "string":
                        attrs [width] = height;
                        break;
                    case 'object':
                        mix(attrs, width);
                        break;
                }
                return rect.attr(attrs);
            },
            circle:function (r) {
                var circle = Element.create('circle'),
                    attrs = {};
                cache.color && (attrs.fill = cache.color);
                switch (typeof r) {
                    case 'number':
                        attrs.r = r;
                        break;
                    case 'object':
                        mix(attrs, r)
                }
                return circle.attr(attrs);
            },
            line:function (x1, y1, x2, y2) {
                //draw a line from x1,y1 to x2,y2
                var path = Element.create('path');
                return   path.attr({
                    'd':'M' + x1 + "," + y1 + "L" + x2 + "," + y2,
                    'stroke':cache.color
                });
            },
            path:function () {

            }
        },
        teach:function (name, fn) {
            this.Draw[name] = fn;
        },
        Palette:{

        },
        Brush:{
            use:function (brush) {
                cache.color = brush.color;
                cache.size = brush.size;
                return this;
            }
        },
        Eraser:{
            erase:function (element) {
                (new Element(element)).remove();
                return this;
            }
        },
        Buy:{
            canvas:function (attrs) {
                return  Element.create('svg').attr(attrs);
            },
            brush:function (color, size) {
                return new Brush(color, size);
            }
        }
    };

    try {
        exports.SVG = SVG
    } catch (e) {
        this.SVG = SVG;
    }
})();