/* TG.js + a minimal set of g.dp.js
* @author: Lin Wang, Kael Zhang, Chao Wang
* @build: 2010-05-30 16:40
*/

/**
* this is a minimal set of g.dp.js of the main-site, including specific method for TuanGou
* require:
*      mootools.js
* include:
*      mootools.more.scroll.js
*      some method in g.dp.js of main-site, but some methods are different.
*
* added:
*      TG.util.js
*      TG.app.js
*
* Element.implements:
*      exactOffsets
*      exactCoordinates
*      exactPosition
*      tg_prevent
*
*      Correct a positioning bug of PopupPanel
*      Mbox has been replaced by TG.app.mbox
*/
/*
* Change log:2011-08-23 16:24
* simplied:
*   String Prototype: toNum
*   Array Prototype: min, max, average, sum
*   TG.uitl.fixPNG
* Change log:2011-09-27
*   remove TG.app.SubSMS, TG.app.scroll.assign
*   remove swfobject, TG.util.clipboard
*   simplify TG.app.clipboard
*/

// var pageTracker = { _addOrganic: $empty, _initData: $empty, _trackPageview: $empty };

/**
 *Usage: <a track=GACode1,GACode2,...|isHippo|HippoKey1#HippoValue1, HippoKey2#HippoValue2  href="">...</a>
 *   @param{String}GACode1,GACode2,...可以添加多条GA跟踪，代码为GACode1, GACod2,...
 *   @param{Int}1,同时添加Hippo跟踪
 *   @param{String}HippoCode,Hippo跟踪的key值和value值。
 *      1. HippoKey, HippoValue :
 *      2. HippoKey1#HippoValue1, HippoKey2 : HippValue2...}
 *      注意：Hippo的mv统计，不同于GA统计，它需要提供一个key-value键值对
**/
function $track(arg){
    var gaCode,
        hpCode,
        hpKey,
        hpValue
        arg,
        hp = document.hippo;

    arg = arg.split("|");
    gaCode = arg[0].split(",");
    gaCode.each(function (c) {
        pageTracker._trackPageview(c);
    });

    if (!arg[1] || arg[1] != 1) return;
    if (arg.length == 2) {
        hpKey = gaCode[0];
        hpValue = 1;
    } else if (arg.length == 3) {
        hpCode = arg[2].split(",");
        if (hpCode.length < 2) {
            hpKey = hpCode[0].split("#")[0];
            hpValue = hpCode[0].split("#")[1];
        } else {
            hpCode.each(function (code) {
                hp.ext(code.split("#")[0], code.split("#")[1]);
            });
            hp.mv('', '');
        }

    }
    if (hp && hpKey) {
        try {
            hp.mv(hpKey, hpValue);
        } catch (e) { };
    }
}

/*
* Track delegate
*/
(function () {
    document.addEvent('click', function(e){
        var tar,
            tar_p,
            tar_pare,
            tar_pare_p,
            TRACK='track';
        if((tar=e.target) && (tar_p=tar.getProperty(TRACK))){
            $track(tar_p);
        }else if((tar_pare=tar.getParent()) && (tar_pare_p=tar_pare.getProperty(TRACK))){
            $track(tar_pare_p);
        }
    });
})();

/*
function $OpenNewWindow(u, i, w, h, r, s, t) { var t = 20; var l = 120; if (window.screen.height) t = (window.screen.height - h) / 2; if (window.screen.width) l = (window.screen.width - w) / 2; var win = window.open(u, i, "width=" + w + ",height=" + h + ",resizable=" + (r ? "yes" : "no") + ",scrollbars=" + (s ? "yes" : "no") + ",status=" + (t ? "1" : "0") + ", top=" + t + ", left=" + l); if (win) win.focus(); return win; }


var $equals = function (obj1, obj2) {
    return (obj1 == obj2 || obj1.trim() == obj2.trim() || JSON.encode(obj1) == JSON.encode(obj2));
};
*/
function $lazyload() {
    var TYPE_ATTR = 'data-type', SELF = 'self', BEFORE = 'before';
    $$('.J_auto-load').each(function (loader) {
        var value = loader.value.trim(), type = loader.getAttribute(TYPE_ATTR), children;

        if (value) {
            children = new Element('div', { html: value }).getChildren();
            type === SELF ? children.inject(loader, BEFORE) : children.inject(document.body);
        }
        loader.destroy();
    });
}

function $peiShow() {
    var msg = "";
    if ($pei) {
        msg += "服务编号: " + $pei.i + "\n";
        msg += "页面时间: " + $pei.w + "\n";
        msg += "数据次数: " + $pei.s + "\n";
        msg += "数据时间: " + $pei.q + "\n";
        msg += "高速对象: \n-------------------------------------------\n" + $pei.c + "-------------------------------------------\n";
    }
    alert(msg);
}

var $isMatch = function (ele, match, matchValue, eleAttr) {
    var value = eleAttr ? $(ele).get('value').trim().length : $(ele).get('value').trim();
    if ($type(matchValue) == 'string') return eval('"' + value + '"' + match + '"' + matchValue + '"');
    else return eval(value + match + matchValue);
};
$isMatch.extend({
    IS: '==',
    NOT_IS: '!=',
    MORE: '>',
    MORE_IS: '>=',
    LESS: '<',
    LESS_IS: '<='
});

var $isRegex = function (ele, regex, params) {
    return $(ele).get('value').trim().test(regex, params || 'i');
};
$isRegex.extend({
    EMAIL: "^[a-z0-9._%-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    URL: "^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$",
    MOBILE: "^(1[3-9][0-9])\\d{8}$",
    ZIPCODE: "^\\d{6}$"
});

function $dialog(title, content, btn) {
    var html = [],
        ele = function(class_, content){
            var ret = new Element('div', {'class': class_});
            $type(content) === 'array' ? ret.adopt(content) : ret.set("html", content);
            return ret;
        };

    title && html.push( ele( 'DialogTitle', title) );
    content && html.push( ele('DialogContent', content) );
    btn && html.push( ele("DialogButtons", btn) );

	return new Element('div').adopt(html);
};

/**
* Native Implements
*/
/*
Array.implement({
    min: function () {
        return Math.min.apply(null, this);
    },
    max: function () {
        return Math.max.apply(null, this);
    },
    average: function () {
        return this.length ? this.sum() / this.length : 0;
    },
    sum: function () {
        var result = 0, l = this.length;
        if (l) {
            do {
                result += this[--l];
            } while (l);
        }
        return result;
    }
});
*/
Hash.implement({
    run: function () {
        var args = arguments;
        this.each(function (v, k) {
            if ($type(v) == 'function') v.run(args);
        });
    }
});

String.implement({
    cnEncode: function () {
        return encodeURIComponent(this);
    },
    cnDecode: function () {
        return decodeURIComponent(this);
    } // ,

    // function toInt in mootools only could fetch numbers from the beginning of a string
    // to Num return the first match of number by default 
    // @param {boolean} all: whether return all matches of numbers, or only the first match
    // @return: if no munber matched, return false;
    /*
    toNum: function (all) {
        var ret = this.match(/\d+/g);
        return ret ? (all ? ret.map(function (item_) { return item_.toInt(); }) : ret[0].toInt()) : false;
    }*/
});


/**
 * fetch exact dimensions
 *
 * mootools' default method will return integers of sizes and length,  but many browsers will deal with decimal positions,
 * which makes mootools.dimension really buggy
 */
(function () {

    var styleString = Element.getComputedStyle;

    function isBody(element) {
        return (/^(?:body|html)$/i).test(element.tagName);
    };

    function borderBox(element) {
        return styleString(element, '-moz-box-sizing') == 'border-box';
    };

    function topBorder(element) {
        return styleNumber(element, 'border-top-width');
    };

    function leftBorder(element) {
        return styleNumber(element, 'border-left-width');
    };

    Element.implement({

        // method exactOffsets
        // @return the exact offsets of the element, as well as exactPosition and exactCoordinates
        // different from mootools.getOffsets

        // which will be used in PopupPanel
        exactOffsets: function () {
            if (this.getBoundingClientRect) {
                var bound = this.getBoundingClientRect(),
				html = document.id(this.getDocument().documentElement),
				htmlScroll = html.getScroll(),
				elemScrolls = this.getScrolls(),
				elemScroll = this.getScroll(),
				isFixed = (styleString(this, 'position') == 'fixed');

                return {
                    x: bound.left + elemScrolls.x - elemScroll.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
                    y: bound.top + elemScrolls.y - elemScroll.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
                };
            }

            var element = this, position = { x: 0, y: 0 };
            if (isBody(this)) return position;

            while (element && !isBody(element)) {
                position.x += element.offsetLeft;
                position.y += element.offsetTop;

                if (Browser.Engine.gecko) {
                    if (!borderBox(element)) {
                        position.x += leftBorder(element);
                        position.y += topBorder(element);
                    }
                    var parent = element.parentNode;
                    if (parent && styleString(parent, 'overflow') != 'visible') {
                        position.x += leftBorder(parent);
                        position.y += topBorder(parent);
                    }
                } else if (element != this && Browser.Engine.webkit) {
                    position.x += leftBorder(element);
                    position.y += topBorder(element);
                }

                element = element.offsetParent;
            }
            if (Browser.Engine.gecko && !borderBox(this)) {
                position.x -= leftBorder(this);
                position.y -= topBorder(this);
            }
            return position;
        },

        // @require exactOffsets
        exactPosition: function (relative) {
            if (isBody(this)) return { x: 0, y: 0 };
            var offset = this.exactOffsets(),
				scroll = this.getScrolls();
            var position = {
                x: offset.x - scroll.x,
                y: offset.y - scroll.y
            };
            var relativePosition = (relative && (relative = document.id(relative))) ? relative.getPosition() : { x: 0, y: 0 };
            return { x: position.x - relativePosition.x, y: position.y - relativePosition.y };
        },

        // @require exactPosition
        exactCoordinates: function (element) {
            if (isBody(this)) return this.getWindow().getCoordinates();
            var position = this.exactPosition(element),
				size = this.getSize();
            var obj = {
                left: position.x,
                top: position.y,
                width: size.x,
                height: size.y
            };
            obj.right = obj.left + obj.width;
            obj.bottom = obj.top + obj.height;
            return obj;
        },

        appendHTML: function (html, where) {
            if ($type(html) != 'string') return false;
            where = where || 'bottom';
            var temp = new Element('div');
            temp.set('html', html);
            var data = (where == 'bottom' || where == 'before') ? $A(temp.childNodes) : $A(temp.childNodes).reverse();
            data.each(function (node) {
                if ($type(node) == 'element') $(node).inject(this, where);
            }, this);
            return this;
        },
        css: function (key, value) {
            if ($type(key) == 'object') {
                for (var p in key) this.css(p, key[p]);
                return this;
            }
            this.setStyle(key, value);
            return this;
        },
        attr: function (key, value) {
            if ($type(key) == 'object') {
                for (var p in key) this.attr(p, key[p]);
                return this;
            }
            this.setProperty(key, value);
            return this;
        },
        isDisplayed: function () {
            return this.getStyle('display') != 'none';
        },
        toggle: function () {
            return this[this.isDisplayed() ? 'hide' : 'show']();
        },
        hide: function () {
            var d;
            try {
                //IE fails here if the element is not in the dom
                if ('none' != this.getStyle('display')) d = this.getStyle('display');
            } catch (e) { }

            return this.store('originalDisplay', d || 'block').setStyle('display', 'none');
        },
        show: function (display) {
            return this.setStyle('display', display || this.retrieve('originalDisplay') || 'block');
        },
        swapClass: function (remove, add) {
            return this.removeClass(remove).addClass(add);
        },

        tg_prevent: function (type) {
            return this.addEvent(type, function (e) { e && new Event(e).preventDefault(); });
        }
    });

    //Element.alias('store', 'sdata');
    //Element.alias('retrieve', 'gdata');

})();

// live
// note: live Event is undone, buggy, and has details to be optimized
/* 
(function () {
    var guid = 1;
    function liveHandler(e) {
        var t = $(e.target), type = e.type, fns = document.retrieve('live', []), eles = [], stop = true;
        if (!fns.length) return;
        fns.each(function (item) {
            if (item.type == type) {
                var order = closest(item.exp, t);

                if (order) eles.push({ ele: t, fn: item, order: order });
            }
        });

        if (eles.length) {
            eles.sort(function (a, b) {
                return a.order - b.order;
            });

            eles.each(function (item) {
                if (item.fn.call(item.ele, e) === false) return (stop = false);
            });
        }
        return stop;
    }

    function closest(exp, t) {
        var pos = $type(exp) == 'string' ? $$(exp) : null, cur = t, closer = 1;
        if (!pos) return false;

        while (cur && !isBody(cur)) {

            if (pos.contains(cur)) {
                return closer;
            }
            cur = cur.getParent();
            closer++;
        }
        return false;
    }

    function isBody(element) {
        return (/^(?:body|html)$/i).test(element.tagName);
    }

    Window.implement({
        $live: function (exp, type, fn) {
            var fns = document.retrieve('live', []);
            var wrap = function () { return fn.apply(this, arguments) };
            wrap.guid = fn.guid = fn.guid || wrap.guid || guid++;
            wrap.type = type;
            wrap.exp = exp;
            fns.length ? fns.each(function (item) {
                if (item.guid != wrap.guid || item.type != wrap.type || item.exp != wrap.exp) fns.push(wrap);
            }) : fns.push(wrap);
            document.addEvent(type, liveHandler);
        },
        $die: function (exp, type, fn) {
            var fns = document.retrieve('live');
            if (!fns || !fns.length) return;
            document.store('live', fns.filter(function (item) {
                return !(item.exp == exp && item.type == type && (fn ? item.guid == fn.guid : true));
            }));
        }
    });

})();
*/


/**
* npage section
*/
var npage = new Hash({
    ids: new Hash(),
    data: new Hash(),
    regEvents: function (events) {
        events = events || { domready: $empty, load: $empty, unload: $empty };
        for (var i in events) {
            if (typeof events[i] == 'function') window.addEvent(i, events[i]);
        }
        return this;
    },
    setEles: function (eles, alias) {
        if (!eles) return;
        var result, F = arguments.callee;
        F.extend({ v: true, d: [] });
        eles = new Hash(eles);
        if (alias) window[alias] = this.ids;
        eles.each(function (value, key) {
            if (result = value) this.ids.set(key, result);
            else { F.v = false; F.d.push(key); }
        }, this);
        return F.v;
    },
    setData: function (data, alias) {
        if (!data) return;
        data = new Hash(data);
        if (alias) window[alias] = this.data;
        data.each(function (value, key) {
            this.data.set(key, value);
        }, this);
        return this;
    },
    erase: function () {
        for (var i = 0, l = arguments.length; i < l; i++) { try { this[arguments[i]].empty(); } catch (e) { alert('unexpected param'); } }
    },
    get: function (type) {
        if (type && $type(this[type]) == 'hash') return this[type].getClean();
    }
});




/**
* table content
* -----------------------------
* AjaxReq
* IframeShim
* Observer
* Overlay
* Autocompleter
**/

/*
* class AjaxReq
*
{
code:200,
msg:''
}
*/

/*
config 属性说明
url: {String} 设置请求的url
method: {String} [get|post]
data: {Object} 设置需要post的数据
headers: {Object} 设置http header
async: {Boolean} 设置是否是异步通信
evalScripts: {Boolean} 设置是否自动执行js
secure: {Boolean} 指定返回的json数据是否是安全的，如果安全则直接eval解析
callType: {String}设置请求的数据类型
timeOut: {Number} 设置超时的时间
onRequest: {Function} 请求前触发的事件
onSuccess: {Function} 请求成功后触发的事件
onError: {Function} 请求出错触发的事件
*/
/*
config 属性说明
url: {String} 设置请求的url
method: {String} [get|post]
data: {Object} 设置需要post的数据
headers: {Object} 设置http header
async: {Boolean} 设置是否是异步通信
evalScripts: {Boolean} 设置是否自动执行js
secure: {Boolean} 指定返回的json数据是否是安全的，如果安全则直接eval解析
callType: {String}设置请求的数据类型
timeOut: {Number} 设置超时的时间
onRequest: {Function} 请求前触发的事件
onSuccess: {Function} 请求成功后触发的事件
onError: {Function} 请求出错触发的事件
*/
var AjaxReq = new Class({
    Implements: [Options, Events],
    options: {
        url: null,
        method: 'get',
        data: null,
        headers: {},
        async: true,
        evalScripts: true,
        secure: false,
        update: false,
        //custom options
        callType: 'json',
        timeOut: 30000,
        onRequest: $empty,
        onSuccess: $empty,
        onError: $empty

    },

    initialize: function (options) {
        this.setOptions(options);
        var requestOptions = {
            url: this.options.url,
            method: this.options.method,
            data: this.options.data,
            headers: this.options.headers,
            async: this.options.async,
            evalScripts: this.options.evalScripts,
            secure: this.options.secure,
            update: this.options.update
        };
        requestOptions.onRequest = this.request.bind(this);
        requestOptions.onSuccess = this.success.bind(this);
        requestOptions.onFailure = requestOptions.onException = requestOptions.onCancel = this.error.bind(this);

        switch (this.options.callType) {
            case 'html':
                {
                    this.ajax = new Request.HTML(requestOptions); break;
                }
            case 'json':
                {
                    this.ajax = new Request.JSON(requestOptions);
                    //this.ajax.headers.extend({ 'Accept': 'application/json, */*' });
                    Object.append(this.ajax.headers, { 'Accept': 'application/json, */*' });
                    break;
                }
        }
        return this;
    },
    error: function () {
        if (this.options.timeOut) $clear(this.options.timeOut);
        this.fireEvent('error');
        return this;
    },
    success: function (a, b, c, d) {
        if (this.options.timeOut) $clear(this.options.timeOut);
        if (this.options.callType == 'html') {
            if (this.$events.success) {
                this.fireEvent('success', [a, b, c, d]);
            }
        } else {
            if (this.$events.success) {
                this.fireEvent('success', [a, b]);
            }
        }
        return this;
    },
    request: function () {
        this.fireEvent('request');
        return this;
    },
    send: function (options) {
        this.options.timeOut = setTimeout(function () { this.ajax.cancel(); } .bind(this), this.options.timeOut);
        this.ajax.send(options);
    }
});

Request.Queue = new Class({

    Implements: [Options, Events],

    Binds: ['attach', 'request', 'complete', 'cancel', 'success', 'failure', 'exception'],

    options: {/*
		onRequest: $empty(argsPassedToOnRequest),
		onSuccess: $empty(argsPassedToOnSuccess),
		onComplete: $empty(argsPassedToOnComplete),
		onCancel: $empty(argsPassedToOnCancel),
		onException: $empty(argsPassedToOnException),
		onFailure: $empty(argsPassedToOnFailure),*/
        stopOnFailure: true,
        autoAdvance: true,
        concurrent: 1,
        requests: {}
    },

    initialize: function (options) {
        this.setOptions(options);
        this.requests = new Hash;
        this.addRequests(this.options.requests);
        this.queue = [];
        this.reqBinders = {};
    },

    addRequest: function (name, request) {
        this.requests.set(name, request);
        this.attach(name, request);
        return this;
    },

    addRequests: function (obj) {
        $each(obj, function (req, name) {
            this.addRequest(name, req);
        }, this);
        return this;
    },

    getName: function (req) {
        return this.requests.keyOf(req);
    },

    attach: function (name, req) {
        if (req._groupSend) return this;
        ['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function (evt) {
            if (!this.reqBinders[name]) this.reqBinders[name] = {};
            this.reqBinders[name][evt] = function () {
                this['on' + evt.capitalize()].apply(this, [name, req].extend(arguments));
            } .bind(this);
            req.addEvent(evt, this.reqBinders[name][evt]);
        }, this);
        req._groupSend = req.send;
        req.send = function (options) {
            this.send(name, options);
            return req;
        } .bind(this);
        return this;
    },

    removeRequest: function (req) {
        var name = $type(req) == 'object' ? this.getName(req) : req;
        if (!name && $type(name) != 'string') return this;
        req = this.requests.get(name);
        if (!req) return this;
        ['request', 'complete', 'cancel', 'success', 'failure', 'exception'].each(function (evt) {
            req.removeEvent(evt, this.reqBinders[name][evt]);
        }, this);
        req.send = req._groupSend;
        delete req._groupSend;
        return this;
    },

    getRunning: function () {
        return this.requests.filter(function (r) { return r.running; });
    },

    isRunning: function () {
        return !!this.getRunning().getKeys().length;
    },

    send: function (name, options) {
        var q = function () {
            this.requests.get(name)._groupSend(options);
            this.queue.erase(q);
        } .bind(this);
        q.name = name;
        if (this.getRunning().getKeys().length >= this.options.concurrent || (this.error && this.options.stopOnFailure)) this.queue.push(q);
        else q();
        return this;
    },

    hasNext: function (name) {
        return (!name) ? !!this.queue.length : !!this.queue.filter(function (q) { return q.name == name; }).length;
    },

    resume: function () {
        this.error = false;
        (this.options.concurrent - this.getRunning().getKeys().length).times(this.runNext, this);
        return this;
    },

    runNext: function (name) {
        if (!this.queue.length) return this;
        if (!name) {
            this.queue[0]();
        } else {
            var found;
            this.queue.each(function (q) {
                if (!found && q.name == name) {
                    found = true;
                    q();
                }
            });
        }
        return this;
    },

    runAll: function () {
        this.queue.each(function (q) {
            q();
        });
        return this;
    },

    clear: function (name) {
        if (!name) {
            this.queue.empty();
        } else {
            this.queue = this.queue.map(function (q) {
                if (q.name != name) return q;
                else return false;
            }).filter(function (q) { return q; });
        }
        return this;
    },

    cancel: function (name) {
        this.requests.get(name).cancel();
        return this;
    },

    onRequest: function () {
        this.fireEvent('request', arguments);
    },

    onComplete: function () {
        this.fireEvent('complete', arguments);
    },

    onCancel: function () {
        if (this.options.autoAdvance && !this.error) this.runNext();
        this.fireEvent('cancel', arguments);
    },

    onSuccess: function () {
        if (this.options.autoAdvance && !this.error) this.runNext();
        this.fireEvent('success', arguments);
    },

    onFailure: function () {
        this.error = true;
        if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
        this.fireEvent('failure', arguments);
    },

    onException: function () {
        this.error = true;
        if (!this.options.stopOnFailure && this.options.autoAdvance) this.runNext();
        this.fireEvent('exception', arguments);
    }

});


/*
config 属性说明
name: {String} 设置iframe的id
className: {String}  设置iframe的class
display: {Boolean} iframe的默认是否显示
zIndex: {Number} 设置z-index
margin: {Number} 设置iframe的margin
offset: {Object} 设置iframe的x，y偏移量
browsers: {String} 设置哪些浏览器需要iframeShim
onInject: {Function}设置inject事件的处理函数
*/
var IframeShim = new Class({
    Implements: [Options, Events],
    options: {
        name: '',
        className: 'iframeShim',
        display: false,
        zIndex: null,
        margin: 0,
        offset: {
            x: 0,
            y: 0
        },
        browsers: (Browser.Engine.trident4 || (Browser.Engine.gecko && !Browser.Engine.gecko19 && Browser.Platform.mac)),
        onInject: $empty
    },
    initialize: function (element, options) {
        this.setOptions(options);
        //legacy
        if (this.options.offset && this.options.offset.top) this.options.offset.y = this.options.offset.top;
        if (this.options.offset && this.options.offset.left) this.options.offset.x = this.options.offset.left;
        this.element = $(element);
        this.makeShim();
        return;
    },
    makeShim: function () {
        this.shim = new Element('iframe');
        this.id = this.options.name || new Date().getTime() + "_shim";
        if (this.element.getStyle('z-Index').toInt() < 1 || isNaN(this.element.getStyle('z-Index').toInt()))
            this.element.setStyle('z-Index', 999);
        var z = this.element.getStyle('z-Index') - 1;

        if ($chk(this.options.zIndex) && this.element.getStyle('z-Index').toInt() > this.options.zIndex)
            z = this.options.zIndex;

        this.shim.setStyles({
            'position': 'absolute',
            'zIndex': z,
            'border': 'none',
            'filter': 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
        }).setProperties({
            'src': 'javascript:void(0);',
            'frameborder': '0',
            'scrolling': 'no',
            'id': this.id
        }).addClass(this.options.className);

        this.element.store('shim', this);

        var inject = function () {
            this.shim.inject(document.body);
            if (this.options.display) this.show();
            else this.hide();
            this.fireEvent('inject');
        };
        if (this.options.browsers) {
            if (Browser.Engine.trident && !IframeShim.ready) {
                window.addEvent('load', inject.bind(this));
            } else {
                inject.run(null, this);
            }
        }
    },
    position: function (obj) {
        if (!this.options.browsers || !IframeShim.ready) return this;
        if (obj) {
            this.shim.setStyles({
                width: obj.width,
                height: obj.height,
                top: obj.top,
                left: obj.left
            });
        }
        else {
            var before = this.element.getStyles('display', 'visibility', 'position');
            this.element.setStyles({
                display: 'block',
                position: 'absolute',
                visibility: 'hidden'
            });
            var size = this.element.getSize();
            var pos = this.element.getPosition();
            this.element.setStyles(before);
            if ($type(this.options.margin)) {
                size.x = size.x - (this.options.margin * 2);
                size.y = size.y - (this.options.margin * 2);
                this.options.offset.x += this.options.margin;
                this.options.offset.y += this.options.margin;
            }

            this.shim.setStyles({
                width: size.x,
                height: size.y,
                top: pos.y,
                left: pos.x
            });
        }

        return this;
    },
    hide: function () {
        if (this.options.browsers) this.shim.setStyle('display', 'none');
        return this;
    },
    show: function (obj) {
        if (!this.options.browsers) return this;
        this.shim.setStyle('display', 'block');
        return this.position(obj);
    },
    dispose: function () {
        if (this.options.browsers) this.shim.dispose();
        return this;
    }
});
window.addEvent('load', function () {
    IframeShim.ready = true;
});



//overlay class
/*
config 属性说明
useFx: {Boolean} 设置显示overlay时，是否需要效果
name: {String}  设置overlay的id
duration: {Number}设置效果的帧频
zIndex: {Number} 设置z-index
colour: {String} 设置iframe的背景色
opacity: {Number} 设置iframe的默认透明度
hasShim: {Boolean} 是否使用iframeShim来遮蔽select等元素
container: {Element}设置overlay的父元素
onClick: {Function}设置click事件的处理函数
*/
var Overlay = new Class({
    Implements: [Options, Events],
    getOptions: function () {
        return {
            useFx: false,
            name: '',
            duration: 200,
            colour: '#000',
            opacity: 0.2,
            zIndex: 99,
            hasShim: true,
            container: document.body,
            onClick: $empty
        };
    },

    initialize: function (options) {
        this.setOptions(this.getOptions(), options);
        this.element = $(this.options.container);

        this.container = new Element('div').setProperty('id', this.options.name + '_overlay').setStyles({
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            backgroundColor: this.options.colour,
            zIndex: this.options.zIndex,
            opacity: this.options.opacity
        }).inject(document.body);


        if (this.options.hasShim) this.shim = new IframeShim(this.container);
        this.options.useFx ? this.fade = new Fx.Tween(this.container, { property: 'opacity', duration: this.options.duration }).set(0) : this.fade = null;
        this.container.setStyle('display', 'none');

        this.container.addEvent('click', function () {
            this.fireEvent('click');
        } .bind(this));

        window.addEvent('resize', this.position.bind(this));
        return this;
    },

    position: function (obj) {
        if (this.element == document.body) {
            var h = window.getScrollHeight() + 'px';
            this.container.setStyles({ top: '0px', height: h });
            return;
        }

        if (obj) {
            this.container.setStyles({
                width: obj.width,
                height: obj.height,
                top: obj.top,
                left: obj.left
            });
        } else {
            var myCoords = this.element.getCoordinates();
            this.container.setStyles({
                top: myCoords.top,
                height: myCoords.height,
                left: myCoords.left,
                width: myCoords.width
            });
        }
    },

    show: function (obj) {
        this.container.setStyle('display', '');
        if (this.fade) this.fade.cancel().start(this.options.opacity);
        if (this.shim) { this.shim.element = this.element; this.shim.show(obj); }
        return this.position(obj);
    },

    hide: function (dispose) {
        if (this.fade) this.fade.cancel().start(0);
        this.container.setStyle('display', 'none');
        if (this.shim) this.shim.hide();
        if (dispose) this.dispose();
        return this;
    },

    dispose: function () {
        this.container.dispose();
        if (this.shim) this.shim.dispose();
    }

});

/**
* Class Autocompleter
*
* required (Observer)
*
*/
Element.implement({

    getOffsetParent: function () {
        var body = this.getDocument().body;
        if (this == body) return null;
        if (!Browser.Engine.trident) return $(this.offsetParent);
        var el = this;
        while ((el = el.parentNode)) {
            if (el == body || Element.getComputedStyle(el, 'position') != 'static') return $(el);
        }
        return null;
    },

    getCaretPosition: function () {
        if (!Browser.Engine.trident) return this.selectionStart;
        this.focus();
        var work = document.selection.createRange();
        var all = this.createTextRange();
        work.setEndPoint('StartToStart', all);
        return work.text.length;
    },

    selectRange: function (start, end) {
        if (Browser.Engine.trident) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            this.focus();
            this.setSelectionRange(start, end);
        }
        return this;
    }

});

/**
    config 属性说明
    enable: {Boolean}  设置autocomplete是否可用
    minLength: {Number}设置最小开始suggest的字数
    width: {String} 设置推荐框的宽度
    height: {String} 设置推荐框的高度
    adjust: {Object} 设置推荐框的偏移位置
    maxChoices: {Number} 设置最多推荐的元素个数
    className: {String} 推荐框的className
    selectClass: {String}选中元素的className
    closeClass: {String}关闭按钮的className
    zIndex: {Number} 推荐框的z-index
    delay: {Number} 设置搜索延迟的时间
    extraParams: {Object} 设置搜索需要的额外参数
    autoSubmit: {Boolean} 设置是否自动提交
    autoTrim: {Boolean} 设置是否自动出去首尾的空格
    autoClose: {Boolean}设置推荐框是否自动消失（不需要人工点击close按钮）
    filter: {Function}设置筛选结果的条件函数
    parser: {Function}设置返回数据的解析函数
    selectMode: {Boolean}设置是否是选择模式（可以用键盘选择）
    multiple: {Boolean} 设置是否多重suggest模式
    separatorSplit: {String} 如果是多重suggest模式，关键词之间的分隔符
    isfix: {Boolean} 是否需要iframeshim
    filterSubset: {Boolean}是否配备子选项
    filterCase: {Boolean}是否匹配大小写
    listCloseBtn: {Boolean}是否需要close 按钮
    onSelection: {Function}设置selection事件的处理函数
    onShow: {Function}设置show事件的处理函数
    onHide: {Function}设置hide事件的处理函数
    onBlur: {Function}设置blur事件的处理函数
    onFocus: {Function}设置focus事件的处理函数
*/


// Attention! Autocompleter in tuangou is slightly different from the one of main-site
var Autocompleter = new Class({

    Implements: [Options, Events],

    options: {
        enable: true,
        minLength: 1,
        width: 'inherit',
        height: 'auto',

        // TG.g.dp.js has adjust.width, but DP.g.dp.js don't
        adjust: { x: 0, y: 0, w: 0 },
        maxChoices: 10,
        className: 'autocompleter',
        selectClass: 'ac_select',
        closeClass: 'ac_close',
        titleClass: 'ac_title',
        pageClass: 'ac_page',
        zIndex: 999,
        delay: 200,
        observerOptions: {},
        fxOptions: {},
        extraParams: {},
        autoSubmit: true,
        autoTrim: true,
        autoClose: true,
        filter: null,
        parser: $empty,
        selectMode: true,
        wordSync: true,
        multiple: false,
        separatorSplit: ',',
        isfix: false,
        filterSubset: false,
        filterCase: false,
        listCloseBtn: true,
        onSelection: $empty,
        onShow: $empty,
        onHide: $empty,
        onBlur: $empty,
        onFocus: $empty
    },

    initialize: function (element, url, options) {
        this.element = $(element);
        this.setOptions(options);
        this.build();
        this.observer = new Observer(this.element, this.fetch.bind(this), $merge({
            'delay': this.options.delay
        }, this.options.observerOptions));
        this.queryValue = null;
        if (this.options.filter) this.filter = this.options.filter.bind(this);
        this.selectMode = this.options.selectMode;
        this.enable = this.options.enable;
        this.extraParams = this.options.extraParams;
        ($type(url) === 'array') ? this.remote = false : this.remote = true;
        this.cached = false;
        this.cacheStatus = 'loading';
        this.url = url;

    },

    build: function () {
        var self = this;
        this.choices = new Element('ul', {
            'class': this.options.className,
            'styles': {
                'zIndex': this.options.zIndex,
                'position': 'absolute'
            }
        }).inject(document.body);

        if (this.options.isfix) this.fix = new IframeShim(this.choices);

        this.fx = (!this.options.fxOptions) ? null : new Fx.Tween(this.choices, $merge({
            'property': 'opacity',
            'link': 'cancel',
            'duration': 200
        }, this.options.fxOptions)).addEvent('onStart', Chain.prototype.clearChain).set(0);

        this.element.setProperty('autocomplete', 'off')
			.addEvent('keydown', this.onCommand.bind(this))
			.addEvent('focus', this.toggleFocus.create({ bind: this, arguments: true, event: true }))
			.addEvent('blur', this.toggleFocus.create({ bind: this, arguments: false, event: true }));

        //if update div has scrollbar,it has double click bug in ie.
        this.choices.onmousedown = function () {
            if (self.options.autoClose) {
                self.element.onbeforedeactivate = function () {
                    self.element.onbeforedeactivate = null;
                    return false;
                }
            }
            return false;
        };
    },

    destroy: function () {
        if (this.fix) this.fix.dispose();
        this.choices = this.selected = this.choices.destroy();
    },

    toggleFocus: function (e, state) {
        e.stop();
        this.focussed = state;
        if (!this.focussed) { if (this.options.autoClose) this.hideChoices(true); }
        else this.prefetch();
        this.fireEvent((state) ? 'onFocus' : 'onBlur', [this.element]);
    },

    onCommand: function (e) {
        if (e && e.key && !e.shift) {
            switch (e.key) {
                case 'enter':
                    e.stop();
                    //if (this.element.value != this.opted) return true;
                    if (this.selected && this.visible) {
                        this.choiceSelect(this.selected);
                        return !!(this.options.autoSubmit);
                    }
                    break;
                case 'up': case 'down':
                    if (this.visible && this.queryValue !== null) {
                        var up = (e.key == 'up');
                        //set close button
                        if (this.selected && this.selected.getNext() && this.selected.getNext().hasClass(this.options.closeClass)) up ? this.choiceOver(this.selected.getPrevious(), true) : this.choiceOver(this.choices.getFirst(), true);
                        //end
                        else {
                            this.choiceOver((this.selected || this.choices)[
							        (this.selected) ? ((up) ? 'getPrevious' : 'getNext') : ((up) ? 'getLast' : 'getFirst')
						        ](), true);
                        }

                    }
                    return false;
                case 'esc': case 'tab':
                    this.hideChoices(true);
                    break;
            }
        }
        return true;
    },

    prefetch: function () {
        if (this.cacheStatus == 'loaded') return true;
        if (!this.remote) {

            this.cached = this.url;
            this.cacheStatus = 'loaded';
        } else {
            //		    this.ajaxReq= new AjaxReq({url:this.url,callType:'json',onSuccess:function(a,b){
            //		                this.cached= a;
            //		                this.update(this.cached.msg.shop);
            //		    }.bind(this)});

            this.cached = [];
            this.cacheStatus = 'loaded';
        }
    },

    fetch: function () {
        if (!this.enable || this.cacheStatus != 'loaded') return false;
        var value = this.element.value, query = value, index = 0;
        if (this.options.multiple) {
            var split = this.options.separatorSplit;
            var values = value.split(split);
            index = this.element.getCaretPosition();
            var toIndex = value.substr(0, index).split(split);
            var last = toIndex.length - 1;
            index -= toIndex[last].length;
            query = values[last];
        }

        if (query.length < this.options.minLength) {
            this.hideChoices();
        }
        else {
            this.queryIndex = index;
            //if extraParams or queryValue is changed,get new data.
            if ((JSON.encode(this.extraParams) === this.queryExtraParams && query === this.queryValue) || (this.visible && query == this.selectedValue)) {
                if (this.visible) return false;
                this.showChoices();
            } else {
                this.queryExtraParams = JSON.encode(this.extraParams);
                this.queryValue = query;
                if (this.remote) {
                    this.makeUrl();
                    this.ajaxReq = new AjaxReq({ url: this.makeUrl(), callType: 'json', onSuccess: function (a, b) {
                        this.cached = a;
                        var parserData = this.options.parser(this.cached);
                        if ($type(parserData) == "array") {
                            this.update(parserData);
                        }
                        else if ($type(parserData.data) == "array" && parserData.more) {
                            this.update(parserData.data, parserData.more);
                        }
                    } .bind(this)
                    });
                    //this.ajaxReq.send({url:this.url+'?q='+this.queryValue});
                    this.ajaxReq.send();
                } else {
                    this.update(this.filter(this.cached));
                }

            }
        }
        return true;

    },

    makeUrl: function () {
        var url = this.url + "?q=" + encodeURIComponent(this.queryValue);
        for (var i in this.extraParams) {
            url += "&" + i + "=" + encodeURIComponent(this.extraParams[i]);
        }
        return url;
    },

    filter: function (tokens) {
        var regex = new RegExp(((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp(), (this.options.filterCase) ? '' : 'i');
        var result = [];
        (tokens || this.tokens).each(function (item) {
            if (regex.test(item)) result.push(item);
        }, this);
        return result;
    },

    setSelection: function (finish) {
        var input = this.selectedValue, value = input;
        if (!input) return false;
        var start = this.queryValue ? this.queryValue.length : 0, end = input.length;
        if (this.queryValue && input.substr(0, start).toLowerCase() != this.queryValue.toLowerCase()) start = 0;
        if (this.options.multiple) {
            var split = this.options.separatorSplit;
            value = this.element.value;
            start += this.queryIndex;
            end += this.queryIndex;
            var old = value.substr(this.queryIndex).split(split, 1)[0];

            value = value.substr(0, this.queryIndex) + input + value.substr(this.queryIndex + old.length);
            if (finish) {
                var space = /[^\s,]+/;

                var tokens = [];
                value.split(this.options.separatorSplit).each(function (item) {
                    if (space.test(item)) tokens.push(item);
                }, this);

                var sep = this.options.separatorSplit;
                value = tokens.join(sep) + sep;
                end = value.length;
            }
        }

        if (this.options.wordSync) this.observer.setValue(value);
        this.opted = value;

        if (finish) start = end;
        this.element.selectRange(start, end);
        //fix autoSubmit
        var selIndex = this.selected.getElement('span').get('html');
        var selText = value;
        if (this.options.autoSubmit && finish) this.fireEvent('onSelection', [this.element, this.selected, selIndex, selText]);
    },

    showChoices: function () {
        var first = this.choices.getFirst(), last = this.choices.getLast(), styles;
        if (!first || this.visible) return;
        var pos = this.element.getCoordinates(), width = this.options.width || 'auto';


        if ($type(this.options.height) === 'number') {
            (last.getCoordinates(this.choices).bottom > this.options.height) ? styles = { 'overflow-y': 'scroll', 'height': this.options.height} : styles = { 'overflow-y': 'hidden', 'height': this.options.height };
        } else {
            styles = { 'overflow-y': 'hidden', 'height': this.options.height };
        }
        styles = $merge(styles, {
            'left': pos.left + this.options.adjust.x,
            'top': pos.bottom + this.options.adjust.y,
            'width': ((width === true || width == 'inherit') ? pos.width : width) + this.options.adjust.w
        });

        if (!this.visible) {
            this.visible = true;
            this.choices.setStyles(styles);
            this.fx ? this.fx.start(1) : this.choices.setStyle('visibility', 'visible');
            if (this.fix) this.fix.show();
            this.fireEvent('onShow', [this.element, this.choices]);
        }

    },

    hideChoices: function (clear) {
        if (clear) {
            var value = this.element.value;
            if (this.options.autoTrim) {
                value = value.split(this.options.separatorSplit).filter($arguments(0)).join(this.options.separatorSplit);
            }
            this.observer.setValue(value);
        }
        if (!this.visible) return;
        this.visible = false;
        this.observer.clear();
        var hide = function () {
            this.choices.setStyle('visibility', 'hidden');
            if (this.fix) this.fix.hide();
        } .bind(this);
        this.fx ? this.fx.start(0).chain(hide) : hide();
        this.fireEvent('onHide', [this.element, this.choices]);
    },



    update: function (tokens, more) {
        this.choices.empty();
        if (this.selected) this.selected = this.selectedValue = null;

        if (!tokens || !tokens.length) {
            this.hideChoices();
        } else {
            if (this.options.maxChoices < tokens.length) tokens.length = this.options.maxChoices;
            tokens.each(function (token) {
                var item = token.split('|');
                var choice = new Element('li', { 'html': this.markQueryValue(item) });
                choice.inputValue = item[0];
                this.addChoiceEvents(choice).inject(this.choices);
            }, this);

            //set close button
            if (more && more.text && more.link) {
                var moreBtn = new Element('a').addClass("BL").setProperty('href', more.link).set('html', more.text);
                var moreLi = new Element('li');
                moreLi.grab(moreBtn);
                moreLi.inject(this.choices);
            }

            if (this.options.listCloseBtn) {
                var closeBtn = new Element('a').addClass("BL").setStyle('margin-left', '8px').setProperty('href', '#').set('html', '关闭').addEvent('click', function () { this.hideChoices(true); return false; } .bind(this));
                var closeLi = new Element('li').addClass(this.options.closeClass);
                closeLi.grab(closeBtn);
                closeLi.inject(this.choices);
            }
            //end
            this.showChoices();
        }
    },
    markQueryValue: function (item) {
        return (item.length == 1) ? item[0] : ('<span style="float:right;display:none">' + item[1] + '</span>') + (item[2] ? '<p style="float:right;color:#777">' + item[2] + '</p>' : '') + item[0];
    },

    addChoiceEvents: function (el) {
        return el.addEvents({
            'mouseover': this.choiceOver.bind(this, [el]),
            'click': this.choiceSelect.bind(this, [el])
        });
    },
    choiceOver: function (choice, selection) {
        if (!choice || choice == this.selected) return;
        if (this.selected) this.selected.removeClass(this.options.selectClass);
        this.selected = choice.addClass(this.options.selectClass);
        this.fireEvent('onSelect', [this.element, this.selected, selection]);
        if (!selection) return;
        if (this.selectMode) {
            this.selectedValue = this.selected.inputValue;
            this.setSelection();
        }

    },

    choiceSelect: function (choice) {
        if (choice) this.choiceOver(choice);
        this.selectedValue = this.selected.inputValue;
        this.setSelection(true);
        this.queryValue = null;
        this.hideChoices();
    }

});


var Observer = new Class({

    Implements: [Options, Events],

    options: {
        periodical: false,
        delay: 1000
    },

    initialize: function (el, onFired, options) {
        this.setOptions(options);
        this.addEvent('onFired', onFired);
        this.element = $(el) || $$(el);
        this.boundChange = this.changed.bind(this);
        this.resume();
    },

    changed: function () {
        var value = this.element.get('value');
        if ((this.value == value || JSON.encode(this.value) == JSON.encode(value))) return;
        this.clear();
        this.value = value;
        this.timeout = this.onFired.delay(this.options.delay, this);
    },

    setValue: function (value) {
        this.value = value;
        this.element.set('value', value);
        return this.clear();
    },

    onFired: function () {
        this.fireEvent('onFired', [this.value, this.element]);
    },

    clear: function () {
        $clear(this.timeout || null);
        return this;
    },
    pause: function () {
        $clear(this.timeout);
        $clear(this.timer);
        this.element.removeEvent('keyup', this.boundChange);
        return this;
    },
    resume: function () {
        this.value = this.element.get('value');
        if (this.options.periodical) this.timer = this.changed.periodical(this.options.periodical, this);
        else this.element.addEvent('keyup', this.boundChange);
        return this;
    }

});

Autocompleter.Location = new Class({
    Extends: Autocompleter,
    initialize: function (element, url, options) {
        options = $merge({
            filterSubset: false,
            fxOptions: false,
            selectMode: false,
            width: 200,
            maxChoices: 12,
            minLength: 0,
            defaultTitle: '输入中文/拼音或↑↓选择',
            defaultText: '中文/拼音'
        }, options);

        this.parent(element, url, options);
        if (this.element.value.trim() == '') {
            this.element.setStyle('color', 'gray').value = this.options.defaultText;
        }
        //this.element.addEvent('keydown', this.onCommand.bind(this))
    },
    onCommand: function (e) {
        if (e && e.key && !e.shift) {
            switch (e.key) {
                case 'enter':
                    e.stop();
                    if (this.selected && this.visible) {
                        this.choiceSelect(this.selected);
                        return !!(this.options.autoSubmit);
                    }
                    break;
                case 'up': case 'down':
                    if (this.visible) {
                        var up = (e.key == 'up');
                        if (this.selected) {
                            if (this.selected.getPrevious().hasClass(this.options.titleClass) && this.selected.getNext().hasClass(this.options.pageClass)) { return false; }
                            else if (this.selected.getPrevious().hasClass(this.options.titleClass)) { up ? this.choiceOver(this.choices.getLast().getPrevious(), true) : this.choiceOver(this.selected.getNext(), true); }
                            else if (this.selected.getNext().hasClass(this.options.pageClass)) { up ? this.choiceOver(this.selected.getPrevious(), true) : this.choiceOver(this.choices.getFirst().getNext(), true); }
                            else { this.choiceOver(this.selected[((up) ? 'getPrevious' : 'getNext')](), true); }
                        } else {
                            this.choiceOver(up ? this.choices.getLast().getPrevious() : this.choices.getFirst().getNext());
                        }
                    }
                    return false;
                case 'esc': case 'tab':
                    this.hideChoices(true);
                    break;
            }
        }
        return true;
    },
    toggleFocus: function (e, state) {
        e.stop();
        this.focussed = state;
        if (!this.focussed) { if (this.options.autoClose) this.hideChoices(true); }
        else this.prefetch();
        this.fireEvent((state) ? 'onFocus' : 'onBlur', [this.element, this.blurData, this.options.defaultText]);
    },
    filter: function (tokens) {
        if (this.queryValue == '') {
            var defData = [].concat(this.url);
            defData.length = this.options.maxChoices;
            return defData;
        } else {
            var regex = new RegExp(((this.options.filterSubset) ? '' : '^') + this.queryValue.escapeRegExp(), (this.options.filterCase) ? '' : 'i');
            var result = [], han = [], pin = [], suo = [], index = [];
            (tokens || this.tokens).each(function (item, index) {
                var i = item.split('|');
                han[index] = i[0];
                pin[index] = i[1];
                suo[index] = i[2];
            }, this);
            [pin, suo, han].each(function (item, i) {
                item.each(function (ditem, j) {
                    if (regex.test(ditem)) index.include(j);
                }, this);
            }, this);
            index.each(function (item) {
                result.push(tokens[item]);
            });
            return result;
        }
    },
    prefetch: function () {
        this.parent();
        if (this.element.value.trim() == this.options.defaultText) {
            this.element.value = '';
            var data = [].concat(this.url);
            data.length = this.options.maxChoices;
            this.update(data);
        } else {
            this.fetch();
        }
    },
    update: function (tokens, currentPage) {
        this.choices.empty();
        if (this.selected) this.selected = this.selectedValue = null;

        if (!tokens || !tokens.length) {
            this.hideChoices();
        } else {
            var pages = Math.ceil(tokens.length / this.options.maxChoices), currentPage = currentPage || 1, isPage = (this.options.maxChoices < tokens.length), temp = [];
            new Element('li', { 'html': this.options.defaultTitle }).addClass(this.options.titleClass).inject(this.choices);
            if (isPage) {
                for (var i = 0; i < this.options.maxChoices; i++) {
                    var index = (currentPage - 1) * this.options.maxChoices + i;
                    if (index >= tokens.length) break;
                    temp[i] = tokens[index];
                }
            } else {
                temp = [].concat(tokens);
            }
            this.blurData = temp;
            temp.each(function (t) {
                var item = t.split('|');
                var choice = new Element('li', { 'html': this.markQueryValue(item) });
                choice.inputValue = item[0];
                this.addChoiceEvents(choice).inject(this.choices);
            }, this);

            var pager = new Element('li', { html: (isPage ? this.rendPage(currentPage, pages) : '') }).addClass(this.options.pageClass).inject(this.choices);
            pager.getElements('a').addEvent('click', function (e) {
                this.update(tokens, $(e.target).get('name'));
            } .bind(this));

            this.showChoices();
        }
    },
    markQueryValue: function (item) {
        return ('<span style="float:right;display:none">' + item[3] + '</span>') + ('<p>' + item[1] + '(' + item[2] + ')' + '</p>') + item[0];
    },
    rendPage: function (currentPage, pages) {
        var pageIndex = [], currentPage = currentPage.toInt(), showIndex = 3;
        pageIndex.push("<a name=" + ((currentPage - 1 < 1) ? 1 : (currentPage - 1)) + " href='javascript:'><-</a>");
        if (pages <= 2 * showIndex) {
            for (var i = 1; i <= pages; i++) {
                if (i == currentPage) {
                    pageIndex.push("<a class='ac_page_select' name=" + i + " href='javascript:'>" + i + "</a>");
                }
                else {
                    pageIndex.push("<a class='ac_page_normal' name=" + i + " href='javascript:'>" + i + "</a>");
                }
            }
        }
        else {
            if ((currentPage - showIndex) < 1) { var startIndex = 1; }
            else { var startIndex = currentPage - showIndex; }
            if ((currentPage + showIndex - 1) > pages) { var endIndex = pages; }
            else { var endIndex = (currentPage + showIndex - 1); }
            for (var i = startIndex; i <= endIndex; i++) {
                if (i == currentPage) {
                    pageIndex.push("<a class='ac_page_select' name=" + i + " href='javascript:'>" + i + "</a>");
                }
                else {
                    pageIndex.push("<a class='ac_page_normal' name=" + i + " href='javascript:'>" + i + "</a>");
                }
            }

        }
        pageIndex[pageIndex.length] = "<a name=" + ((currentPage + 1 > pages) ? pages : (currentPage + 1)) + " href='javascript:'>-></a>";

        return pageIndex.join("");
    }

});
var Switch = new Class({
    Implements: [Options, Events],
    options: {
        mode: 'fade', //slide
        auto: true,
        speed: 5E3, //自动切换速度
        fade_duration: 500, //淡入淡出速度
        response_delay: 200, //延迟响应鼠标操作速度
        tmode: 'click', //mouseover 鼠标操作方式
        hoverStop: true,
        fx: { property: "top", duration: 250 }, // slide方向、速度 property: left
        initOffset: 0,
        source: null, // 自动加载图片，数组形式的url
        sideTrigger: true, //两次的trigger， 向前(上)、向后（下）
        curClass: 'on'
    },
    initialize: function (c, options) {
        if (!c) return;
        var _this = this, pureSource = [];
        this.setOptions(options);

        if (this.options.source != null && typeOf(this.options.source) == "array" && this.options.source.length != 0) {
            this.options.source.each(function (t, i) {
                if (/.+\.(png|jpg|gif)$/i.test(t)) {
                    pureSource.push(t);
                }
            });
            this.loadimg = new Asset.images(pureSource, {
                onComplete: function () {
                    _this._loadSource(c);
                }
            });
        } else {
            this.s = c.getElement(".J_wrap");
            this.ss = this.s && this.s.getElements('li');
            try {
                this.t = c.getElement(".J_ctrl");
                this.tt = this.t.getElements('li');
            } catch (e) { };
            _this.start();
        }
        if (!this.Index) this.Index = 0;
    },
    _loadSource: function (c) {
        this.s = c;
        var _this = this,
            p = this.s.getParent(".slide");
        c.set('html', '');
        c.adopt(this.loadimg);
        this.ss = this.s.getElements("img");
        if (this.ss.length == 1) return;

        this.t = new Element("div", { 'class': 'imgctrl' });
        this.tt = [];
        for (var i = 0, l = _this.ss.length; i < l; i++) {
            this.tt.push(new Element("span"));
        }
        this.t.adopt(_this.tt);
        this.t.inject(c, 'after');
        if (this.options.sideTrigger) {
            this.before_trigger = new Element("li", { 'html': '<span>向前</span>', 'class': 'before' });
            this.after_trigger = new Element("li", { 'html': '<span>向后</span>', 'class': 'after' });
            this.sidet = new Element("ul", { 'class': "sideTrigger" });
            this.sidet
            .addClass("Hide")
            .adopt([this.before_trigger, this.after_trigger]).inject(c, 'after');
            this.sideTrigger();
        }
        p.addEvents({
            mouseenter: function (e) { _this.sidet.removeClass("Hide"); _this._pause(); },
            mouseleave: function (e) { _this.sidet.addClass("Hide"); _this._resume(); }
        });
        this.start();
    },
    start: function () {
        if (!this.ss) return;
        this.ss_length = this.ss.length;
        this.tt_length = this.tt && this.tt.length;
        if (this.ss_length === 1) return;

        this.fx = new Fx.Tween(this.s, this.options.fx);
        if (this.fx.options.property === 'left') {
            var s_width = 0;
            (s_width === 0) ? s_width = this.s.getParent().getStyle('width').toInt() * this.ss_length : 0;
            this.s.setStyle('width', s_width);
            this.ss.setStyle('float', 'left');
        }
        if (this.options.mode === 'fade') {
            this.ss.setStyle("visibility", "hidden");
            this.ss[0].setStyle("visibility", "visible");
        }
        this.toggle_curClass(0);
        this.autoplay();
        this.ss_length === this.tt_length && this.bind();

    },
    bind: function () {
        if (!this.tt) return;
        var _t = this,
                _tm = this.options.tmode,
                _m = this.options.mode,
                timer;

        this.tt.each(function (b, c) {
            b.addEvent(_tm, function () {
                clearTimeout(timer);
                timer = setTimeout(function () { _t.action(c); _t.Index = c; }, _t.options.response_delay);
            })
        });

        this.options.hoverStop && this.t.addEvents({
            mouseenter: this._pause.bind(this),
            mouseleave: this._resume.bind(this)
        });
    },
    autoplay: function () {
        if (this.options.auto) this.timer = this.auto_play.delay(this.options.speed, this);
    },
    auto_play: function () {
        $clear(this.timer);
        if (!this.stopped) {
            this.Index++;
            if (this.Index >= this.ss_length) this.Index = 0;
            this.action(this.Index);
            this.toggle_curClass(this.Index);
            this.autoplay();
        }

    },
    action: function (e) {
        var _this = this;
        $clear(this.timer);

        if (this.options.mode === 'fade') {
            var curIndex = 0, t = this;

            if (!this.s.hasClass('fade')) this.s.addClass("fade");

            for (i = 1; i < this.tt_length; i++) {
                if (this.tt[i].hasClass(this.options.curClass)) curIndex = i;
            }
            if (curIndex === e) return;
            if (this.options.fade_duration >= this.options.speed) {
                this.options.fade_duration = 500;
            }
            this.fade_bf_fx = new Fx.Morph(this.ss[curIndex], { duration: this.options.fade_duration });
            this.fade_fx = new Fx.Morph(this.ss[e], { duration: this.options.fade_duration });
            this.fade_bf_fx.cancel().start({
                'opacity': [1, 0]
            });
            _this.fade_fx.cancel().start({
                'opacity': [0, 1]
            });
        } else if (this.options.mode === 'slide') {
            var a = this.ss[e].getPosition(this.s);

            switch (this.fx.options.property) {
                case "left":
                    a = a.x;

                    if (this.s.getStyle("left") == "auto" && (this.Index == 1 || this.Index == this.ss_length - 1)) {
                        this.s.setStyle("left", 0); // fix bug for mt Fx
                    }

                    break;

                case "top":
                default:
                    a = a.y;

                    if (this.s.getStyle("top") == "auto" && (this.Index == 1 || this.Index == this.ss_length - 1)) {
                        this.s.setStyle("top", 0); // fix bug for mt Fx
                    }

                    break
            }
            this.fx.cancel().start(-a - this.options.initOffset);
        }
        this.toggle_curClass(e);
    },
    toggle_curClass: function (e) {
        var t = this;
        this.tt && this.tt.each(function (c, i) {
            i === e ? c.addClass(t.options.curClass) : c.removeClass(t.options.curClass)
        });
    },
    sideTrigger: function () {
        var _t = this;
        var _tm = this.options.tmode;

        this.before_trigger.addEvent(_tm, function () {
            $clear(this.timer);
            _t.side_slide('before');
        });

        this.after_trigger.addEvent(_tm, function () {
            $clear(this.timer);
            _t.side_slide('after');
        });
        this.options.hoverStop && [this.before_trigger, this.after_trigger].each(function (t) {
            t.addEvents({
                mouseenter: function () { _t._pause(); },
                mouseleave: function () { _t._resume(); }
            });
        });

    },
    side_slide: function (e) {
        if (e === 'before') {
            this.Index--;
            if (this.Index < 0) this.Index = this.ss_length - 1;
            this.action(this.Index);
        } else {
            this.Index++;
            if (this.Index >= this.ss_length) this.Index = 0;
            this.action(this.Index);
        }


    },
    _pause: function () {
        this.stopped = true;
        $clear(this.timer);
        return this;
    },
    _resume: function () {
        this.stopped = false;
        return this.autoplay();
    }
});
var LazyLoader = new Class({

    Implements: [Options, Events],

    /* additional options */
    options: {
        range: 0,
        elements: 'img',
        property: 'lazy-src',
        container: window,
        fireScroll: true, /* keeping for legacy */
        mode: 'vertical',
        startPosition: 0,
        onLoad: $empty
    },

    /* initialize */
    initialize: function (options) {

        /* vars */
        var _ops = this.options;
        this.setOptions(options);
        this.container = document.id(_ops.container);
        this.property = _ops.property.split('-')[1];
        //this.elements = $$(_ops.elements + '[' + _ops.property + ']');
        this.elements = $$(_ops.elements).filter(function (item) { if (item.getProperty(_ops.property)) return true; });
        var axis = (_ops.mode == 'vertical' ? 'y' : 'x');
        this.containerDimension = this.container.getSize()[axis];
        this.startPosition = 0;

        var offset = (this.container != window && this.container != document.body ? this.container : "");

        /* create the action function */
        var action = function () {
            var cpos = this.container.getScroll()[axis];
            if (cpos >= this.startPosition) {
                this.elements = this.elements.filter(function (el) {
                    if ((cpos + this.options.range + this.containerDimension) >= el.getPosition(offset)[axis]) {
                        var p = el.getProperty(_ops.property);
                        if (p) { el.removeProperty(_ops.property); el.set(this.property, p); }
                        this.fireEvent('load', [el]);
                        return false;
                    }
                    return true;
                }, this);
                this.startPosition = cpos;
            }
            this.fireEvent('scroll');
            /* remove this event IF no elements */
            if (!this.elements.length) {
                this.container.removeEvent('scroll', action);
                this.fireEvent('complete');
            }
        } .bind(this);

        /* listen for scroll */
        window.addEvent('scroll', action);
        if (_ops.fireScroll) { action(); }
    }
});
/**
 * SWFObject v2.2 <http://code.google.com/p/swfobject/>
 * is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
/*
var swfobject = function () { var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [h], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function () { var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = Y ? /win/.test(Y) : /win/.test(ah), ac = Y ? /mac/.test(Y) : /mac/.test(ah), af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, X = ! +"\v1", ag = [0, 0, 0], ab = null; if (typeof t.plugins != D && typeof t.plugins[S] == r) { ab = t.plugins[S].description; if (ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) { T = true; X = false; ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1"); ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10); ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10); ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0 } } else { if (typeof O.ActiveXObject != D) { try { var ad = new ActiveXObject(W); if (ad) { ab = ad.GetVariable("$version"); if (ab) { X = true; ab = ab.split(" ")[1].split(","); ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)] } } } catch (Z) { } } } return { w3: aa, pv: ag, wk: af, ie: X, win: ae, mac: ac} } (), k = function () { if (!M.w3) { return } if ((typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) { f() } if (!J) { if (typeof j.addEventListener != D) { j.addEventListener("DOMContentLoaded", f, false) } if (M.ie && M.win) { j.attachEvent(x, function () { if (j.readyState == "complete") { j.detachEvent(x, arguments.callee); f() } }); if (O == top) { (function () { if (J) { return } try { j.documentElement.doScroll("left") } catch (X) { setTimeout(arguments.callee, 0); return } f() })() } } if (M.wk) { (function () { if (J) { return } if (!/loaded|complete/.test(j.readyState)) { setTimeout(arguments.callee, 0); return } f() })() } s(f) } } (); function f() { if (J) { return } try { var Z = j.getElementsByTagName("body")[0].appendChild(C("span")); Z.parentNode.removeChild(Z) } catch (aa) { return } J = true; var X = U.length; for (var Y = 0; Y < X; Y++) { U[Y]() } } function K(X) { if (J) { X() } else { U[U.length] = X } } function s(Y) { if (typeof O.addEventListener != D) { O.addEventListener("load", Y, false) } else { if (typeof j.addEventListener != D) { j.addEventListener("load", Y, false) } else { if (typeof O.attachEvent != D) { i(O, "onload", Y) } else { if (typeof O.onload == "function") { var X = O.onload; O.onload = function () { X(); Y() } } else { O.onload = Y } } } } } function h() { if (T) { V() } else { H() } } function V() { var X = j.getElementsByTagName("body")[0]; var aa = C(r); aa.setAttribute("type", q); var Z = X.appendChild(aa); if (Z) { var Y = 0; (function () { if (typeof Z.GetVariable != D) { var ab = Z.GetVariable("$version"); if (ab) { ab = ab.split(" ")[1].split(","); M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)] } } else { if (Y < 10) { Y++; setTimeout(arguments.callee, 10); return } } X.removeChild(aa); Z = null; H() })() } else { H() } } function H() { var ag = o.length; if (ag > 0) { for (var af = 0; af < ag; af++) { var Y = o[af].id; var ab = o[af].callbackFn; var aa = { success: false, id: Y }; if (M.pv[0] > 0) { var ae = c(Y); if (ae) { if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) { w(Y, true); if (ab) { aa.success = true; aa.ref = z(Y); ab(aa) } } else { if (o[af].expressInstall && A()) { var ai = {}; ai.data = o[af].expressInstall; ai.width = ae.getAttribute("width") || "0"; ai.height = ae.getAttribute("height") || "0"; if (ae.getAttribute("class")) { ai.styleclass = ae.getAttribute("class") } if (ae.getAttribute("align")) { ai.align = ae.getAttribute("align") } var ah = {}; var X = ae.getElementsByTagName("param"); var ac = X.length; for (var ad = 0; ad < ac; ad++) { if (X[ad].getAttribute("name").toLowerCase() != "movie") { ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value") } } P(ai, ah, Y, ab) } else { p(ae); if (ab) { ab(aa) } } } } } else { w(Y, true); if (ab) { var Z = z(Y); if (Z && typeof Z.SetVariable != D) { aa.success = true; aa.ref = Z } ab(aa) } } } } } function z(aa) { var X = null; var Y = c(aa); if (Y && Y.nodeName == "OBJECT") { if (typeof Y.SetVariable != D) { X = Y } else { var Z = Y.getElementsByTagName(r)[0]; if (Z) { X = Z } } } return X } function A() { return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312) } function P(aa, ab, X, Z) { a = true; E = Z || null; B = { success: false, id: X }; var ae = c(X); if (ae) { if (ae.nodeName == "OBJECT") { l = g(ae); Q = null } else { l = ae; Q = X } aa.id = R; if (typeof aa.width == D || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) { aa.width = "310" } if (typeof aa.height == D || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) { aa.height = "137" } j.title = j.title.slice(0, 47) + " - Flash Player Installation"; var ad = M.ie && M.win ? "ActiveX" : "PlugIn", ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title; if (typeof ab.flashvars != D) { ab.flashvars += "&" + ac } else { ab.flashvars = ac } if (M.ie && M.win && ae.readyState != 4) { var Y = C("div"); X += "SWFObjectNew"; Y.setAttribute("id", X); ae.parentNode.insertBefore(Y, ae); ae.style.display = "none"; (function () { if (ae.readyState == 4) { ae.parentNode.removeChild(ae) } else { setTimeout(arguments.callee, 10) } })() } u(aa, ab, X) } } function p(Y) { if (M.ie && M.win && Y.readyState != 4) { var X = C("div"); Y.parentNode.insertBefore(X, Y); X.parentNode.replaceChild(g(Y), X); Y.style.display = "none"; (function () { if (Y.readyState == 4) { Y.parentNode.removeChild(Y) } else { setTimeout(arguments.callee, 10) } })() } else { Y.parentNode.replaceChild(g(Y), Y) } } function g(ab) { var aa = C("div"); if (M.win && M.ie) { aa.innerHTML = ab.innerHTML } else { var Y = ab.getElementsByTagName(r)[0]; if (Y) { var ad = Y.childNodes; if (ad) { var X = ad.length; for (var Z = 0; Z < X; Z++) { if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) { aa.appendChild(ad[Z].cloneNode(true)) } } } } } return aa } function u(ai, ag, Y) { var X, aa = c(Y); if (M.wk && M.wk < 312) { return X } if (aa) { if (typeof ai.id == D) { ai.id = Y } if (M.ie && M.win) { var ah = ""; for (var ae in ai) { if (ai[ae] != Object.prototype[ae]) { if (ae.toLowerCase() == "data") { ag.movie = ai[ae] } else { if (ae.toLowerCase() == "styleclass") { ah += ' class="' + ai[ae] + '"' } else { if (ae.toLowerCase() != "classid") { ah += " " + ae + '="' + ai[ae] + '"' } } } } } var af = ""; for (var ad in ag) { if (ag[ad] != Object.prototype[ad]) { af += '<param name="' + ad + '" value="' + ag[ad] + '" />' } } aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>"; N[N.length] = ai.id; X = c(ai.id) } else { var Z = C(r); Z.setAttribute("type", q); for (var ac in ai) { if (ai[ac] != Object.prototype[ac]) { if (ac.toLowerCase() == "styleclass") { Z.setAttribute("class", ai[ac]) } else { if (ac.toLowerCase() != "classid") { Z.setAttribute(ac, ai[ac]) } } } } for (var ab in ag) { if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") { e(Z, ab, ag[ab]) } } aa.parentNode.replaceChild(Z, aa); X = Z } } return X } function e(Z, X, Y) { var aa = C("param"); aa.setAttribute("name", X); aa.setAttribute("value", Y); Z.appendChild(aa) } function y(Y) { var X = c(Y); if (X && X.nodeName == "OBJECT") { if (M.ie && M.win) { X.style.display = "none"; (function () { if (X.readyState == 4) { b(Y) } else { setTimeout(arguments.callee, 10) } })() } else { X.parentNode.removeChild(X) } } } function b(Z) { var Y = c(Z); if (Y) { for (var X in Y) { if (typeof Y[X] == "function") { Y[X] = null } } Y.parentNode.removeChild(Y) } } function c(Z) { var X = null; try { X = j.getElementById(Z) } catch (Y) { } return X } function C(X) { return j.createElement(X) } function i(Z, X, Y) { Z.attachEvent(X, Y); I[I.length] = [Z, X, Y] } function F(Z) { var Y = M.pv, X = Z.split("."); X[0] = parseInt(X[0], 10); X[1] = parseInt(X[1], 10) || 0; X[2] = parseInt(X[2], 10) || 0; return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false } function v(ac, Y, ad, ab) { if (M.ie && M.mac) { return } var aa = j.getElementsByTagName("head")[0]; if (!aa) { return } var X = (ad && typeof ad == "string") ? ad : "screen"; if (ab) { n = null; G = null } if (!n || G != X) { var Z = C("style"); Z.setAttribute("type", "text/css"); Z.setAttribute("media", X); n = aa.appendChild(Z); if (M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) { n = j.styleSheets[j.styleSheets.length - 1] } G = X } if (M.ie && M.win) { if (n && typeof n.addRule == r) { n.addRule(ac, Y) } } else { if (n && typeof j.createTextNode != D) { n.appendChild(j.createTextNode(ac + " {" + Y + "}")) } } } function w(Z, X) { if (!m) { return } var Y = X ? "visible" : "hidden"; if (J && c(Z)) { c(Z).style.visibility = Y } else { v("#" + Z, "visibility:" + Y) } } function L(Y) { var Z = /[\\\"<>\.;]/; var X = Z.exec(Y) != null; return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y } var d = function () { if (M.ie && M.win) { window.attachEvent("onunload", function () { var ac = I.length; for (var ab = 0; ab < ac; ab++) { I[ab][0].detachEvent(I[ab][1], I[ab][2]) } var Z = N.length; for (var aa = 0; aa < Z; aa++) { y(N[aa]) } for (var Y in M) { M[Y] = null } M = null; for (var X in swfobject) { swfobject[X] = null } swfobject = null }) } } (); return { registerObject: function (ab, X, aa, Z) { if (M.w3 && ab && X) { var Y = {}; Y.id = ab; Y.swfVersion = X; Y.expressInstall = aa; Y.callbackFn = Z; o[o.length] = Y; w(ab, false) } else { if (Z) { Z({ success: false, id: ab }) } } }, getObjectById: function (X) { if (M.w3) { return z(X) } }, embedSWF: function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) { var X = { success: false, id: ah }; if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) { w(ah, false); K(function () { ae += ""; ag += ""; var aj = {}; if (af && typeof af === r) { for (var al in af) { aj[al] = af[al] } } aj.data = ab; aj.width = ae; aj.height = ag; var am = {}; if (ad && typeof ad === r) { for (var ak in ad) { am[ak] = ad[ak] } } if (Z && typeof Z === r) { for (var ai in Z) { if (typeof am.flashvars != D) { am.flashvars += "&" + ai + "=" + Z[ai] } else { am.flashvars = ai + "=" + Z[ai] } } } if (F(Y)) { var an = u(aj, am, ah); if (aj.id == ah) { w(ah, true) } X.success = true; X.ref = an } else { if (aa && A()) { aj.data = aa; P(aj, am, ah, ac); return } else { w(ah, true) } } if (ac) { ac(X) } }) } else { if (ac) { ac(X) } } }, switchOffAutoHideShow: function () { m = false }, ua: M, getFlashPlayerVersion: function () { return { major: M.pv[0], minor: M.pv[1], release: M.pv[2]} }, hasFlashPlayerVersion: F, createSWF: function (Z, Y, X) { if (M.w3) { return u(Z, Y, X) } else { return undefined } }, showExpressInstall: function (Z, aa, X, Y) { if (M.w3 && A()) { P(Z, aa, X, Y) } }, removeSWF: function (X) { if (M.w3) { y(X) } }, createCSS: function (aa, Z, Y, X) { if (M.w3) { v(aa, Z, Y, X) } }, addDomLoadEvent: K, addLoadEvent: s, getQueryParamValue: function (aa) { var Z = j.location.search || j.location.hash; if (Z) { if (/\?/.test(Z)) { Z = Z.split("?")[1] } if (aa == null) { return L(Z) } var Y = Z.split("&"); for (var X = 0; X < Y.length; X++) { if (Y[X].substring(0, Y[X].indexOf("=")) == aa) { return L(Y[X].substring((Y[X].indexOf("=") + 1))) } } } return "" }, expressInstallCallback: function () { if (a) { var X = c(R); if (X && l) { X.parentNode.replaceChild(l, X); if (Q) { w(Q, true); if (M.ie && M.win) { l.style.display = "block" } } if (E) { E(B) } } a = false } } } } ();
*/


/**
* TG.js
* @author Kael Zhang

* Each normal method begins with a lowercase letter, while constructor with an uppercase one
*/

// TG namespace
var TG = {};

/**
* DP.Tuangou.Utility.js
*
* TuanGou.Utility contains abstract and non-business-required methods
* methods with notation "@constructor" must be used with "new" keyword
*/
TG.util = {

    // method to deal with or imitating html5 placeholder
    // @constructor
    //      must be used with 'new' keyword

    // @param input {element || element id} input
    // @param options
    //      placeholder (optional){string} alternative hint text
    //      btn         (optional){element || element id} trigger button
    //      exec        (optional){function} functions to be executed, if you press enter in the input or press btn
    //                      exec will be bind with this of the derived object
    //      focusClass  (optional){string} default to 'focus'

    // @return {
    //      stopKey: {function} stop 'keydown' event
    //      resumeKey: {function} resume 'keydown' event
    //      getValue: {function}
    // }

    // @example: new TG.util.PlaceHolder('sub-email').stopKey();
    // NO need for checking the existance of 'sub-email'

    // to do:
    // (pending)combine this method width html5 placeholder
    PlaceHolder: function (input, options, undefined) {
        if (this === TG.util) throw new Error('TG.app.PlaceHolder must be used with "new" keyword');

        options = options || {};

        var PLACE_HOLDER = 'placeholder',
            placeholder,
            btn,
            exec,
            ret,
            stopKey = function () {

                // 为了链式操作
                return ret;
            },
            resumeKey = stopKey,
            focusClass = options.focusClass === undefined ? 'focus' : options.focusClass,

        // create an input with no 'placeholder' attribute
            test_input = new Element('input');

        this.input = input = $(input);

        if (input) {
            // test whether browser support html5 placeholder attribute
            // if browser doesn't support, then we imitate it

            if (!(PLACE_HOLDER in test_input)) {
                // placeholder attribute has higher priority
                placeholder = input.get(PLACE_HOLDER) || options[PLACE_HOLDER];
                // else deal with attr value
            } else if (!input.get(PLACE_HOLDER) && options[PLACE_HOLDER]) {
                input.set(PLACE_HOLDER, options[PLACE_HOLDER]);
            }
            btn = $(options.btn);
            exec = options.exec && $type(options.exec) === 'function' ? options.exec.bind(this) : false;

            delete options;

            var _this = this,
                check = function () {
                    var value = input.get('value').trim();

                    return value && value !== placeholder;
                },

                keydown = function (e) {
                    if (e && (e = new Event(e)).code === 13) {
                        e.preventDefault();
                        exec && check() && exec();
                    }
                };

            stopKey = function () {
                input.removeEvent('keydown', keydown);
                return ret;
            },

            resumeKey = function () {
                input.addEvent('keydown', keydown);
                return ret;
            };

            exec && btn && btn.addEvent('click', function () {
                check() && exec();
            });

            input.addEvents({
                'keydown': keydown,

                'focus': function () {
                    var class_ = focusClass,
                        _placeholder = placeholder,
                        i = input;

                    class_ && i.addClass(class_);

                    if (i.get('value').trim() === _placeholder) i.set('value', '');
                },

                'dblclick': function (e) {
                    e && new Event(e).preventDefault();
                },

                'blur': function () {
                    var i = input,
                        class_ = focusClass,
                        _placeholder = placeholder,
                        value = i.get('value').trim();

                    // 值为空，或者值为placeholder
                    if (!value || value === _placeholder) {
                        class_ && i.removeClass(class_);
                        _placeholder && i.set('value', _placeholder);
                    }
                }
            });

            input.blur();
            input.fireEvent('blur');
        }

        ret = {
            stopKey: stopKey,
            resumeKey: resumeKey,
            getValue: function () {
                var value = input.get('value'),
                    _placeholder = placeholder;
                return _placeholder && value === _placeholder ? '' : value;
            }
        }

        return ret;
    },

    postData: function (data, options) {
        options = $extend({ method: 'post', form: false }, options);

        var form,
            i;

        if (options.form) {
            form = $(options.form);
            if (!form) return;

            delete options.form;

        } else {
            form = new Element('form', { 'class': 'Hide' }).inject(document.body);
        }

        for (i in options) {
            form[i] = options[i];
        }

        new Hash(data).each(function (value, name) {
            var input = form.getElement('input[name=' + name + ']');

            if (input) {
                input.set('value', value);
            } else {
                new Element('input', { 'type': 'hidden', 'value': value, 'name': name }).inject(form);
            }
        });

        form.submit();
    },

    // mootools.more.FX.Scroll.js
    // @constructor
    Scroll: new Class({
        Extends: Fx,

        // @param {object} options : Fx options
        // @param {element | element selector} element : null -> body, element -> $j( element )
        initialize: function (options, element) {
            var el;
            if (element) el = $(element);
            else el = window;

            this.element = this.subject = el;

            // mootools fx
            this.parent($extend({ transition: Fx.Transitions.Quart.easeOut }, options));
        },

        set: function () {
            var now = Array.flatten(arguments);
            if (Browser.Engine.gecko) now = [Math.round(now[0]), Math.round(now[1])];
            this.element.scrollTo(now[0], now[1]);
        },

        compute: function (from, to, delta) {
            return [0, 1].map(function (i) {
                return Fx.compute(from[i], to[i], delta);
            });
        },

        start: function (x, y) {
            if (!this.check(x, y)) return this;
            var scrollSize = this.element.getScrollSize(),
		        scroll = this.element.getScroll(),
		        values = { x: x, y: y };

            for (var z in values) {
                var max = scrollSize[z];
                if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z] : max;
                else values[z] = scroll[z];
            }
            return this.parent([scroll.x, scroll.y], [values.x, values.y]); //call Fx.start
        },

        toTop: function () {
            return this.start(false, 0);
        },

        toLeft: function () {
            return this.start(0, false);
        },

        toRight: function () {
            return this.start('right', false);
        },

        toBottom: function () {
            return this.start(false, 'bottom');
        },

        toElement: function (el) {
            var position = $(el).getPosition(this.element);
            return this.start(position.x, position.y);
        }
    }),


    // @return root url of the current page
    urlRoot: function () {
        return [location.protocol, '//', location.hostname].join('');
    },


    // method to preload images
    // @param {mixed} arguments: image sources to be preloaded or css class which contains a background-image
    // @example: TG.util.preload(http://i2.dpfile.com/xxxxxx.png, .mbox-loading, http://i4.dpfile.com/xxxxxx.gif);

    // @require: mootools.more.Asset
    /*
    preload: function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
    var source = arguments[i];

    if ($type(source) === 'string') {
    if (/.+\.js$/i.test(source)) {
    new Asset.javascript(source);
    } else if (/.+\.(png|jpg|gif)$/i.test(source)) {
    new Asset.image(source);
    } else {

    // .Zero is a css class which makes dom element has neither size nor visibility, located in g.base.css
    new Element('div', { 'class': source + ' Zero' }).inject($(document.body));
    }
    }
    }
    },
    */

    // method to enable clipboard.setData for almost all browsers

    // @param {element|element id} contentElement: element from which to fetch content
    // @param {element|element id} triggerElement: element to trigger copying
    // @param {object} successText:

    clipboard: function (contentElement, triggerElement, successText, options) {
        contentElement = $(contentElement);
        triggerElement = $(triggerElement);
        if (!triggerElement || !contentElement) return;
        var c = TG.util.clipboard,
            check = c.check();

        successText = successText || true;

        // c.enable was generated by c.check
        switch (c.enable) {
            case 'trident':
                triggerElement.addEvent('click', function (e) {
                    e && new Event(e).preventDefault();

                    var value = contentElement.get('text') || contentElement.get('value');

                    value && window.clipboardData.setData("Text", value) && successText && alert(successText);
                });

                break;

            case 'flash':

                c._initFlash(contentElement, triggerElement, successText);

                break;
        }
    },


    // method to fix png-24 bug for ie6

    // @param {mixed} className: identifier
    //      {string}: class name
    //      {element}: <img> element, or the element with a background-image

    // @param (optional){string/ url} image: image url of the element or class rule
    /*
    fixPNG: function (className, image) {
    if (Browser.Engine.trident && Browser.Engine.version < 5) {
    var type = $type(className),

    // get background-image from the current style
    getBgImg = function (ele) {
    var src = $(ele).getStyle('backgroundImage'),
    match;

    if (src) {
    match = src.match(/http:\/\/.*\.png/);

    if (match && match[0]) return match[0];
    }

    return;
    };


    if (type === 'string') {
    var ele = new Element('div', { 'class': className + ' Zero' }).inject(document.body),
    src = image || getBgImg(ele);

    src && new Element('style')
    .inject(document.head)
    .addRule('.' + className, 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + src + ')');


    } else if (type === 'element') {
    var ele = $(className),
    src = image || getBgImg(className);

    if (src) {
    ele.style.backgroundImage = 'url(#)';
    ele.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + src + ')';
    }
    }
    }
    },*/


    // TG.util.Suggest allow user's input and the tokens to be not exactly the same, 
    // but match the substrings after the spliter of both

    // @constructor
    // @require: Autocompleter
    Suggest: new Class({
        Extends: Autocompleter,

        // @param {element|element id} element:
        // @param {array} suggestRule: suggest rules
        initialize: function (element, suggestRule, options) {
            options = $merge({

                // usually, the panel has a one pixel border
                adjust: {
                    w: -2
                },

                listCloseBtn: false,
                filterSubset: true,

                // spliter is a sign that tell pc to compare
                spliter: '@',
                // if there's a spliter, whether the substring before the spliter could match the rules
                allowNonePrefix: false,

                selectMode: false,

                // when one of the suggest items is selected --- what's more than {class}Autocompleter
                onSelect: $empty

            }, options);

            if (!options.spliter) options.allowNonePrefix = true;

            this.parent(element, suggestRule, options);
        },

        filter: function (tokens) {
            var value = this.splitQuery(),
		        regex = new RegExp(((this.options.filterSubset) ? '' : '^') + value.suf.escapeRegExp(), (this.options.filterCase) ? '' : 'i'),
		        result = [],
		        pre = this.options.allowNonePrefix;

            (pre || !pre && value.pre) && (tokens || this.tokens).each(function (item) {
                if (regex.test(item)) result.push(item);
            }, this);

            return result;
        },

        // markQueryValue: function(item) {
        //    return (item.length == 1) ? item[0] : ('<span style="float:right;display:none">' + item[1] + '</span>') + (item[2] ? '<p style="float:right;color:#777">' + item[2] + '</p>' : '') + item[0];
        // },


        // split the user input into prefix and suffix, according to options.spliter
        splitQuery: function () {
            var value = this.element.get('value'),
                pos = false,
                ret;

            if (this.options.spliter) pos = value.indexOf(this.options.spliter);

            if (pos === false) {
                ret = { pre: '', suf: value }
            }

            return pos === false ?
                { pre: '', suf: value }
                :
                (
                    pos === -1 ?
                        { pre: value, suf: '' }
                    :
                        { pre: value.substr(0, pos), suf: value.substr(pos) }
                );
        },

        // fire onSelect event 
        choiceOver: function (choice, selection) {
            this.fireEvent('onSelect', [this.element, this.choices]);
            this.parent(choice, selection);
        },

        update: function (tokens, more) {
            var prefix = this.splitQuery().pre;

            this.choices.empty();
            if (this.selected) this.selected = this.selectedValue = null;

            if (!tokens || !tokens.length) {
                this.hideChoices();
            } else {
                if (this.options.maxChoices < tokens.length) tokens.length = this.options.maxChoices;
                tokens.each(function (token) {
                    var item = token.split('|');

                    // if there's prefix, add to each of the suggest items
                    var choice = new Element('li', { 'html': prefix + this.markQueryValue(item) });
                    choice.inputValue = item[0];
                    this.addChoiceEvents(choice).inject(this.choices);
                }, this);

                // set close button
                if (more && more.text && more.link) {
                    var moreBtn = new Element('a').addClass("BL").setProperty('href', more.link).set('html', more.text);
                    var moreLi = new Element('li');
                    moreLi.grab(moreBtn);
                    moreLi.inject(this.choices);
                }

                if (this.options.listCloseBtn) {
                    var closeBtn = new Element('a').addClass("BL").setStyle('margin-left', '8px').setProperty('href', '#').set('html', '关闭').addEvent('click', function () { this.hideChoices(true); return false; } .bind(this));
                    var closeLi = new Element('li').addClass(this.options.closeClass);
                    closeLi.grab(closeBtn);
                    closeLi.inject(this.choices);
                }

                // end
                this.showChoices();
            }
        },

        setSelection: function (finish) {
            var input = this.selectedValue,
		        value = input,
		        prefix = this.splitQuery().pre;

            if (!input) return false;
            var start = this.queryValue ? this.queryValue.length : 0, end = input.length;
            if (this.queryValue && input.substr(0, start).toLowerCase() != this.queryValue.toLowerCase()) start = 0;
            if (this.options.multiple) {
                var split = this.options.separatorSplit;
                value = this.element.value;
                start += this.queryIndex;
                end += this.queryIndex;
                var old = value.substr(this.queryIndex).split(split, 1)[0];

                value = value.substr(0, this.queryIndex) + input + value.substr(this.queryIndex + old.length);
                if (finish) {
                    var space = /[^\s,]+/;

                    var tokens = [];
                    value.split(this.options.separatorSplit).each(function (item) {
                        if (space.test(item)) tokens.push(item);
                    }, this);

                    var sep = this.options.separatorSplit;
                    value = tokens.join(sep) + sep;
                    end = value.length;
                }
            }

            // deal with the prefix
            if (this.options.wordSync) this.observer.setValue(prefix + value);
            this.opted = value;

            if (finish) start = end;
            this.element.selectRange(start, end);

            //fix autoSubmit
            var selIndex = this.selected.getElement('span');

            // there's a bug in DP.g.dp.js, 
            // it's ignored to judge the existance of the 'span' element
            if (selIndex) {
                selIndex = selIndex.get('html');
                var selText = value;
                if (this.options.autoSubmit && finish) this.fireEvent('onSelection', [this.element, this.selected, selIndex, selText]);
            }
        }
    }),

    // TG.util.inputFilter
    // method to limit user input, only allow user to input certain characters or substrings according to regular expression
    // @constructor
    // @require {Class}Observer
    inputFilter: new Class({
        Implements: Options,

        options: {
            periodical: 100,    // {number} Observer periodical
            delay: 10,          // {number} Observer delay

            modifiers: 'i',     // {string} regexp modifiers, only works if typeof filter === 'string',
            type: 'filter',     // {string} 'filter' || 'limit':
            //  type === 'filter': all matched string will be considered as wrong input
            //  type === 'limit': on the contrary

            onlyFocus: true,    // only check user input when input focused on

            onStart: $empty
        },

        // @param {element || element id} input
        // @param {string || regexp || function} filter:
        // @param {object} options
        initialize: function (input, filter, options) {
            input = $(input);
            if (!input || !filter) return;

            this.setOptions(options);

            switch ($type(filter)) {
                case 'string':
                    filter = new RexExp(filter, this.options.modifiers);

                case 'regexp':
                    var regex = filter;
                    if (this.options.type === 'filter') {
                        filter = function (value) {
                            return !regex.test(value);
                        };
                    } else {
                        filter = function (value) {
                            return regex.test(value);
                        };
                    }

                    break;

                // custom function(value){} to check user input                                   
                // @param {string} value user input will be passed in                                  
                case 'function':
                    filter = filter.bind(this);
                    break;

                default:
                    return;
            }

            this.input = input;
            this.filter = filter;

            this.value = '';

            this.check = this.check.bind(this);

            if (this.options.onlyFocus) {
                var _this = this;
                input.addEvents({
                    focus: function () {
                        _this.checkOn = true;
                    },

                    blur: function () {
                        _this.checkOn = false;
                    }
                });
            } else {
                _this.checkOn = true;
            }

            this.options.onStart !== $empty && this.options.onStart.run(input, this);

            this.observer = new Observer(input, this.check, { periodical: this.options.periodical, delay: this.options.delay });
        },

        check: function (value) {
            if (!this.checkOn || this.value === value) return;

            if (this.filter(value)) {
                this.value = value;
            } else {
                this.input.set('value', this.value);
            }
        }
    })
}

/*
TG.util.clipboard.extend({

    // @private
    _getSWF: function () {
        return npage.data.clipboardSWF || '/t/res/f.clipboard.swf';
    },

    // @public
    // set the uri of the clipboard.swf
    setSWF: function (uri) {
        if (!uri) return;

        if ($type(uri) !== 'function') {
            uri = $lambda(uri);
        }

        TG.util.clipboard._getSWF = uri;
    },

    // Check if user's browser is able to copy text to clipboard
    check: function (element) {
        var c = TG.util.clipboard;

        // if clipboard is not initialized
        // check only once
        if (c.enable === undefined) {
            if (window.clipboardData && window.clipboardData.setData) {
                c.enable = 'trident';
                delete c.initFlash;
                delete c.holder;

            // check flash version
            } else if (window.swfobject &&

            // f.clipboard.swf need at least flashplayer 9 for ExternalInterface package of ActionScript 3.0
            swfobject.getFlashPlayerVersion().major >= 9) {
                c.enable = 'flash';

            } else {
                c.enable = false;
                delete c.initFlash;
                delete c.holder;
            }

        }

        return c.enable;
    },

    _guid: 0,

    // @private

    // @param {element} ce: contentElement
    // @param {element} te: triggerElement
    // @param {string} su: successText
    _initFlash: function (ce, te, su) {
        var sprite,

            parent = te.getParent(),
            coor = te.getCoordinates(parent),
            container,
            init,
            c = TG.util.clipboard,

            // generate an unique id for each clipboard
            id = '__clipboard_' + ( c._guid += 1 );

        // give the direct parent element positioning
        if (te.offsetParent !== parent) {
            parent.setStyle('position', 'relative');
        }

        container = new Element('div', {
            styles: {
                position: 'absolute',
                left: coor.left,
                top: coor.top,
                width: coor.width,
                height: coor.height,
                overflow: 'hidden'
            }
        })
        .inject(parent)
        .grab(
            new Element('div', { 'id': id })
        )
        .addEvent("click", function () {
            pageTracker._trackPageview('dp_tuangou_share_msn/qq_copy');
        });


        sprite = {
            dom: ce,

            // get the content to be copied
            // the content can be a input element or text container
            _get: function () {
                return ce.get('text') || ce.get('value');
            },

            // show success message
            _msg: function (isSuccess) {
                isSuccess = isSuccess || true;

                alert(isSuccess ? su : 'fail');
            }
        }

        c.holder.set(id, sprite);


        // create a transparent flash over the trigger button

        // "With Flash Player 10, the System.setClipboard() method
        // MUST be called only through ActionScript that originates from user interaction." (ActionScript 3.0)

        // f.clipboard.swf:
        //    source file at: SERVER: \\192.168.1.4\...\kael.zhang\DP Clipboard Flash Source File\
        swfobject.embedSWF(c._getSWF(), id, String(coor.width), String(coor.height), '9.0.0', '/t/res/f.expressInstall.swf', {

            // javascript method to get the content to be copied
            _funcName_getContent: 'TG.util.clipboard.holder.' + id + '._get',

            // javascript method to show success message
            // @param {boolean} isSuccess: if successfully set to clipboard
            _funcName_callback: 'TG.util.clipboard.holder.' + id + '._msg'

        }, {

            // so that flash ExternalInterface will work
            allowScriptAccess: 'always',
            wmode: 'transparent'
        });

    },

    holder: new Hash()
});
*/


/**
* generate a TuanGou-style button
* @param {string} text:
* @param (optional){string | mixed} color: 'white' or non-'white', default to 'red'
* @param (optional){string} class: class of the button, the 'tg-btn' class should not be overwritten
* @param (optional){object} events:

* @example:  TG.btn('Comfirm', null, null, {click: $empty})
*/
TG.btn = function (text, color, class_, events) {
    return new Element('a', {
        'href': 'javascript:void(0)',
        'class': (color === 'white' ? 'tg-btn' : 'tg-rbtn') + (class_ ? ' ' + class_ : ''),
        'html': ['<span>', text, '</span>'].join('')
    }).tg_prevent('click')
      .addEvents(events);
};

/**
 * @author: yongliang.li
 * @date: 2012-07-03
 * @adapter
 */
(function(T){
	
var type_map = {},
	toString = Object.prototype.toString;

'Boolean Number String Function Array Date RegExp Object'.split(' ').each(function(name){
    var nl = name.toLowerCase();
		
	type_map[ '[object ' + name + ']' ] = nl;

    T['is' + name] = name === 'Object' ?
            function(o){
		        return !!o && type(o) === nl;
		    }
		:
			function(o){
			    return type(o) === nl;
			}
});

/**
 * a simple and faster typeOf method, and an adapter for mootools
 */
function type(obj, noMootools){
    // if not simple type, use mootools method
	return noMootools && type_map[ toString.call(obj) ] || $type(obj);
};

function toQueryString(obj, splitter){
	var key, ret = [];
	
	for(key in obj){
		ret.push(key + '=' + obj[key]);
	}
	
	return ret.join(splitter || '&');
};

T.isPlainObject = function(obj){
	return obj && T.isObject(obj) && 'isPrototypeOf' in obj;
};

T.type = type;

T.makeArray = function(obj){
	return type(obj) === 'array' ? obj : [obj];
};

T.toQueryString = function(obj, splitter){
    return type(obj) === 'object' ? toQueryString(obj, splitter) : obj;
};
T.mix = function (r, s, or, cl) {
    if (!s || !r) return r;
    if (or === undefined) or = true;
    var i = 0, c, len;

    if (cl && (len = cl.length)) {
        for (; i < len; i++) {
            c = cl[i];
            if ((c in s) && (or || !(c in r))) {
                r[c] = s[c];
            }
        }
    } else {
        for (c in s) {
            if (or || !(c in r)) {
                r[c] = s[c];
            }
        }
    }
    return r;
};
})(TG);

TG.JSONP = (function () {
    var _counter = 0,

    // @private
    // create a script node
    _create_script = function(src){
	    return new Element('script', {
            // async: true,
		    type: 'text/javascript',
		    src: src
	    });
    },

    // @private
    // return a query string, if passed in an Object, it will be formatted to query string
    _getQuery = function(query){
        var t = TG,
            type = t.type(query);

        if(type === 'object') query = t.toQueryString(query);

        return query;
    },
    // @private
    // clean/check the symbol of empersand('&') on the end/beginning of a query
    
    // @param query {query} the string to be tidied
    // @param hasFirst {Boolean}
    //      if true, will check whether is the has a '&' at first. if hasn't, one '&' will be added
    //      if false, 
    _tidyEmpersand = function(str, hasFirst, hasLast){
        var e = '&',
            len,
            f,
            l;
        
        if(str){
            len = str.length - 1,
            f = str[0] === e,
            l = str[len] === e;

            if(!hasFirst){
                str = f ? str.substr(1) : str; 
            }else{
                str = f ? str : e + str; 
            }

            if(!hasLast){
                str = l ? str.substr(0, len) : str;
            }else{
                str = l ? str : str + e; 
            }
        }
        return str || '';
    },

    // @private
    // generate a query url
    _getQuestURL = function(options, query, index){
        var url = options.url.split('?'),
            tidy = _tidyEmpersand;
        return url[0] + '?' + tidy(url[1], false, true) + tidy(query, false, true) + options.callbackKey + '=TG.JSONPRequest._' + index;
    },

    JSONP = new Class({
        Implements: [Chain, Events, Options],
        options: {
        //		onRequest: function(src, scriptElement){},
        //		onSuccess: function(data){},
        //		onCancel: function(){},
        //		onTimeout: function(){},
        //		onError: function(){}, 
	        onRequest: function(src){
	        },
	        onError: function(src){
	        },
            // @type {string} JSONP request uri
	        url: '',
	        callbackKey: 'callback',
        // inject: {Element} default to document.head,
	        data: '',
	        link: 'ignore',
	        timeout: 0
        },
        initialize: function(options){
            this.setOptions(options);
        },

        // @param options 
        //  {Object} jsonp request data
        //  {String} jsonp request query string

        // @note: no more support Element type
        send: function(options){
            var _this = this,
                type,
                query,
                src,
                script,

                // generate a unique, non-zero jsonp request id
                index = ++ _counter,
                t = TG;

	        if (!Request.prototype.check.call(_this, options)) return _this;
	        _this.running = true;

            // formatting data ------------------------------------------------------- *\
	        type = t.type(options);
            options = t.mix(type === 'string' ? {data: options} : options || {}, _this.options, false); // don't override new options
            query = _getQuery(options.data);
            src = _getQuestURL(options, query, index);

            if (src.length > 2083) _this.fireEvent('error', src);

            // JSONP request start
            t.JSONPRequest['_' + index] = function(){
                if(_this.running){
                    _this.__success.apply(_this, arguments);
                }
	        }

	        script = _this.script = _create_script(src).inject(options.inject || document.head);

	        _this.fireEvent('request', [options.url, script]);

		
	        if (options.timeout){
		        (function(){
			        if (_this.running) _this.fireEvent('timeout', [script.get('src'), script]).fireEvent('failure').cancel();
		        }).delay(options.timeout);
	        }
	        return this;
        },

        // @private
        __success: function(){
	        // if (!this.running) return false;
	        this.clear()
		        .fireEvent('success', arguments)
		        .callChain();
        },

        cancel: function(){
	        return this.running ? this.clear().fireEvent('cancel') : this;
        },

        isRunning: function(){
	        return !!this.running;
        },

        clear: function(){
            var _this = this;

	        _this.script && _this.script.destroy();
	        _this.running = false;
	        return _this;
        }
    });
    //return _tidyEmpersand;
    TG.JSONPRequest = TG.JSONPRequest || {};

    return JSONP;

})();

/* 页头用户消息 start*/
(function(){
    var msg = $('G_h-msg'),
        ignored = false;

    function getUserMessage(server, onSuccess, onIgnored) {
        var ENUM = [
                'replies', // 1  新回应
                'badge', // 2  新徽章
                'fans', // 3  新粉丝
                'msg', // 4  新消息
                'notice'    // 5  新提醒
            ],
            unread_url = server + '/member/jsonp/unreadMsg', //获取所有未读消息
            ignoremsg_url = server + '/member/jsonp/ignoreMsg'; //清除未读消息

        new TG.JSONP({
            url:unread_url,
            data:{
                rand:Math.random() * 1000
            }, onSuccess:function (r) {
                // event_letter(r);
                if (r && r.msg && r.code === 200) {
                    var data = r.msg.mc || [],
                        cityName = npage.data['cityEnName'];

                    // 如果没有消息数据，或者模板不存在，则不做任何处理
                    if (data.length) {
                        data.ENUM = ENUM;
                        var common_item_format = '<li><a onclick="dpga(\'{ga}\')" href="{link}" data-type="{type}"><strong>{count}</strong>{text}，查看</a></li>',
                            _panel = '<ul class="pp-msg_list Fix" style="visibility:hidden;" >' +
                                '{items}' +
                                '<li><a class="c-gray ignore" onclick="dpga(\'dp_head_notice_ignore_' + cityName + '\')"  href="javascript:;">忽略</a></li>' +
                                '</ul>',
                            _s = [],
                            sum = 0, panel = new Element('div'), res;

                        data.forEach(function (item) {
                            item.ga = 'dp_head_notice_' + ENUM[item.type] + "_" + cityName;
                            _s.push(common_item_format.substitute(item));
                            sum += item.count;
                        });
                        panel.innerHTML = _panel.substitute({'items':_s.join('')});
                        panel = panel.getElement('ul')
                        res = {
                            sum:sum,
                            panel:panel
                        };

                        // 处理后端数据问题，若包含消息数据，未读数据为0，也不进行任何其他操作
                        sum && onSuccess && onSuccess(res);

                        panel.getElement('.ignore').addEvent('click', function (e) {
                            e.stop();
                            new TG.JSONP({
                                url:ignoremsg_url,
                                data:{
                                    rand:(Math.random() * 1000)
                                },
                                onSuccess:function(){
                                    onIgnored && onIgnored(res);
                                }
                            }).send();
                        });
                    }
                }
            }
        }).send();
    }

    if (msg) {
        var msg_menu = msg.getParent();

        msg_menu && getUserMessage(msg.getProperty('data-server') || '', function (res) {
            var panel = res.panel,
                cityName =  npage.data['cityEnName'];
                ga = 'dp_head_msg_news_'+cityName,
                gashow = 'dp_test_head_msg_'+cityName;

            // 只有当包含未读消息时，才发送 data-ga-unread 的ga
           res.sum && ga && dpga(ga);

            // sum
           new Element('span').inject(msg).innerHTML=res.sum;

            msg_menu.removeClass('Hide');

            panel.inject(msg_menu).setStyle('visibility','hidden');

            msg_menu.addEvents({
                mouseenter:function () {
                    if(ignored){return;}
                    msg.addClass('active');
                    panel.setStyle('visibility', 'visible');
                    gashow && dpga(gashow);
                    document.hippo && document.hippo.mv('v_u_m', 1);
                },
                mouseleave:function () {
                    if(ignored){return;}
                    msg.removeClass('active');
                    panel.setStyle('visibility', 'hidden');
                }
            });

        }, function (res) {
            res.panel.destroy();
            msg.getElement('span').destroy();
            msg.removeClass('active');
            ignored = true;
        });
    }
})();




/**
* DP.TuanGou.Application.js
*/
TG.app = {

    // go to login page and automatically set redirect
    // @param (optional){string} redirect: redirect url. if false, it will be current page url instead
    login: function (redirect) {
        location.href = '/login?redirect=' + encodeURIComponent(redirect || (location.pathname + location.search));
    },

    // @param {string} type: 'suc' || 'err'
    // @param (optional){object} options: message bar options, which contains:
    //      {boolean} closebtn: whether has a close button, default to 'suc'
    //      {boolean} icon: whether has a icon or not
    //      {boolean} scroll: scroll to top or not
    //      {number} timeout: ms before the message bar to be closed, only available if closebtn is false
    //      {string} name: 
    //          usually, before creating a new msgbar, it will remove the msgbar with the same name; if name is undefined, a former unnamed msgbar will be closed
    //          this option will be useful, if we dont want many msgbars of a specific type shown at the same time;

    // @require: TG.app.msgbar.close
    msgbar: function (type, options) { // closebtn, timeout, maintain) {
        type = type || 'suc';

        // initialize data
        options = $extend({ closebtn: true, icon: true, scroll: true }, options || {});

        if ($type(options.name) !== 'string') delete options.name;

        // @return
        return function (msg) {
            var msgbar = TG.app.msgbar;


            // remove former bars
            if (options.name) {
                (function () {
                    var bar = msgbar['bar_' + options.name];
                    bar && bar.dispose();
                })();
            }

            if (options.remove && $type(options.remove) === 'element' && options.remove.hasClass('Msg-box')) options.remove.dispose();

            msgbar.bar && msgbar.bar.dispose(); msgbar.bar = null;

            // deal with message
            if (msg && $type(msg) === 'object') msg = msg.msg;

            if (!msg) {
                msg = '抱歉，无法完成操作';
                type = 'err';
            }


            // create new message bar
            var bar = new Element('div', {
                'class': 'Msg-box Msg-box-' + type,
                'html': (options.icon ? '<span class="icon"></span>' : '') + msg
            }).inject($$('.pgm')[0], 'top');

            if (options.name) msgbar['bar_' + options.name] = bar;
            else msgbar.bar = bar;

            if (options.closebtn) {
                new Element('a', { 'class': 'close', 'text': '关闭', 'href': 'javascript:void(0)' })
					.addEvent('click', function () { msgbar.close(bar) }).inject(bar);

            } else if (options.timeout) {
                msgbar.close.delay(options.timeout, null, bar);
            }

            options.scroll && TG.app.scroll();

            return bar;
        }
    },

    // @param {mixed} target:
    //      tyoeof target = 
    //              undefined: scroll to top
    //              number: scroll to {number} offsetTop
    //              element: scroll to the element
    // @param (optional){object} options: mootools.fx.options

    // @method:
    //      TG.app.scroll.assign
    scroll: function (target, options) {
        if (!TG.app.scroll.s) TG.app.scroll.s = new TG.util.Scroll(options);

        var s = TG.app.scroll.s;

        if (!$chk(target)) s.toTop();
        else {
            switch ($type(target)) {
                case 'number': s.start(0, target); break;
                case 'string': target = $$(target)[0]; // no break
                case 'element':
                    if (target) {
                        s.toElement(target);
                        break;
                    }
            }
        }
    },

    // email subscribe

    // @param {object} data: object contains, id(cityID), name(cityName), msg:(success message)
    subscribe: function (data) {
        if (!data) return;

        var email = data.email && data.email.test($isRegex.EMAIL, 'i') ? data.email : false;

        if (!email) {
            return TG.app.msgbar('err', { /* remove:$('TG_MsgBar'),*/closebtn: false, timeout: 2000, name: 'invalidEmail' })('请输入正确的EMAIL地址。');
        }

        data.msg = data.msg || (data.name + '每天的团购将及时发到您邮箱。');

        new AjaxReq({
            method: 'post',
            url: '/emailpush.v',
            data: {
                'do': 'createep',
                'email': email,
                'eCityId': data.id,
                'eCityName': data.name
            },

            onSuccess: function (rt) {
                if (rt && rt.code == 200) {
                    var msg,
                        en = rt.msg.en,
                        id = rt.msg.id || 0;

                    if (Number(rt.msg.p) == 0) {
                        msg = rt.msg.msg + '服务开通，我们将第一时间通知您。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="' + rt.msg.url + '" track="dp_tuangou_emailsub_whitelist">收不到邮件？</a>';
                        TG.app.msgbar('suc')(msg);
                    } else {
                        Cookie.write("subscribe", rt.msg.url + "," + email, { path: "/" });
                        location.href = "http://" + location.host + '/' + en;
                    }
                    try {
                        pageTracker._trackPageview('subscribe_success_' + en + '_fromdingyueyemian');
                    } catch (e) { }
                } else {
                    TG.app.msgbar('err'/*{ remove: $('TG_MsgBar') }*/)(rt.msg);
                }
            }
        }).send();
    },

    // a lightweight mbox for TuanGou, is a minimal set of Mbox(Mbox.open, type = 'ele') with an optimized call chain
    // @note TG.app.mbox is of much difference from main-site, NEVER override

    // to do:
    // 1. deliver Overlay options to mbox
    mbox: {
        getOptions: function () {
            return {
                // width of the mbox is not auto adjusting, if you need a wider box, you should assign a new size.x
                size: { x: 350 },
                url: false,

                winClassBase: 'mbox-window',
                winClass: '',

                contClass: 'mbox-content',
                closeClass: 'mbox-btn-close',

                overlay: true,
                hasShim: true,

                reposition: true,
                autoSize: false,
                closable: true,
                container: $(document.body),
                zIndex: 999,

                onLoading: $empty,
                onOpen: $empty,
                onShow: $empty,
                onClosing: $empty,
                onClose: $empty
            }
        },

        init: function (options) {
            this.options = this.getOptions();
            this.setOptions(options);

            if (this.inited) return this;

            this.build();

            this.bound = {
                window: this.position.bind(this, [null]),
                scroll: this.checkTarget.bind(this),
                close: this.close.bind(this),
                key: this.onKey.bind(this)
            };

            this.position = this.position.bind(this);

            this.isOpen = this.isLoading = false;

            if (Browser.Engine.trident) this.ie = true;

            return this;
        },

        build: function () {
            var _options = this.options;

            this.overlay = new Overlay({ name: 'mbox', hasShim: _options.hasShim, onClick: (_options.overlayClosable) ? this.close.bind(this) : null });

            this.closeBtn = new Element('a', { 'class': _options.closeClass, href: 'javascript:;', text: '关闭' });

            this.content = new Element('div', { 'class': _options.contClass });

            this.win = new Element('div', {
                styles: {
                    visibility: 'hidden',
                    zIndex: _options.zIndex + 2
                }
            }).adopt(this.closeBtn, this.content)
		      .inject($(document.body));

            this.inited = true;
        },

        // @param {object} options: mbox options 
        open: function (options) {
            if (!options) return;

            if (this.isOpen) this.close();

            this.init(options);

            var _options = this.options;

            this.win.setStyles({
                display: '',
                width: _options.size.x,
                height: _options.size.y

            });

            this.win.className = _options.winClassBase + (_options.winClass ? ' ' + _options.winClass : '');

            this.options.closable ? this.closeBtn.setStyle('display', '') : this.closeBtn.setStyle('display', 'none');
            if (this.options.overlay) {
                this.overlay.element = this.options.container;
                this.overlay.show();
            }

            this.toggleListeners(true);

            this.fireEvent('onOpen', [this.content]);

            return this.load();
        },

        assign: function (to, options) {
            to.addEvent('click', function (e) {
                new Event(e).stop();
                TG.app.mbox.open(options);
            });
        },

        hide: function () {
            if (this.isOpen) {
                this.isOpen = false;
                if (this.overlay && this.options.overlay) this.overlay.hide();

                this.win.setStyle('display', 'none');
                this.trash();
            }
            return this;
        },

        close: function (e) {
            if ($type(e) == 'event') new Event(e).stop();
            if (!this.isOpen) return this;

            this.fireEvent('onClosing', [this.content]);
            this.isOpen = false;

            this.options.overlay && this.overlay.hide();

            this.win.setStyle('display', 'none');
            this.fireEvent('onClose', [this.content]);
            this.trash();
            return this;
        },

        trash: function () {
            this.toggleListeners();
            this.removeEvents();
            this.content.empty();
        },

        onError: function () {
            this.content.set('text', 'Error during loading');
        },

        load: function (init) {
            this.isOpen = true;
            this.applyContent();

            this.position(true);

            return this;
        },

        position: function (build) {
            if (build !== true && !this.options.reposition) return this;

            var screen = document.getSize(),
			    scroll = document.getScroll(),
			    h = build ? (this.sizeY = (this.win.getSize() || {}).y || 300) : this.sizeY,
			    left, top;

            left = (scroll.x + (screen.x - this.options.size.x) / 2).toInt(),
			top = (scroll.y + (screen.y - h) / 2).toInt();

            this.win.setStyles({
                left: (left >= 0) ? left : 0,
                top: (top >= 0) ? top : 20,
                visibility: 'visible'
            });

            return this;
        },

        applyContent: function (html) {
            this.win.setStyles({ 'visibility': (this.ie ? 'visible' : 'hidden'), 'display': '' });

            this.content.empty().grab(html || $(this.options.url));

            this.inner = this.content.getElement('.DialogContent');

            return this;
        },

        toggleListeners: function (state) {
            var fn = (state) ? 'addEvent' : 'removeEvent';
            this.closeBtn[fn]('click', this.bound.close);
            document[fn]('keydown', this.bound.key);
            window[fn]('resize', this.bound.window)[fn]('scroll', this.bound.window);
        },

        onKey: function (e) {
            switch (e.key) {
                case 'esc': if (this.options.closable) this.close(e);
                case 'up': case 'down': return false;
            }
        },

        checkTarget: function (e) {
            return this.content.hasChild(e.target);
        },

        removeEvents: function (type) {
            if (!this.$events) return this;
            if (!type) this.$events = null;
            else if (this.$events[type]) this.$events[type] = null;
            return this;
        },

        extend: function (properties) {
            return $extend(this, properties);
        },

        // method to change the .DiaglogContent of the mbox
        refresh: function (html) {
            if (this.inner && html) {

                this.inner.empty();
                $type(html) === 'array' ? this.inner.adopt(html) : this.inner.set('html', html);
                this.position(true);
            }
            return this;
        }

    },


    // @param {element} wrap: the countdown wrappper
    countdown: function (wrap) {
        //wrap = $(wrap); if (!wrap) return;

        wrap = $(wrap) || wrap; if ($type(wrap) == 'string') return;
        var day = wrap.getElement('.day'),
            hour = wrap.getElement('.hour'),
            minute = wrap.getElement('.minute'),
            second = wrap.getElement('.second'),
            timeLeft = window.TG_TIME_LEFT || wrap.getProperty('data-secondLeft'),
            timespan;


        if (!timeLeft) return;


        if (second) timespan = 1;
        else if (minute) timespan = 60;
        else return;

        //var now = Math.floor(window.TG_TIME_LEFT - ($time() - (window.TG_PAGE_TIME || $time())) / 1000 - 1),
        var now = Math.floor(timeLeft - ($time() - (window.TG_PAGE_TIME || $time())) / 1000 - 1),
            count = function () {
                second && second.set('text', Math.floor(now % 60));
                minute && minute.set('text', Math.floor((now % 3600) / 60));
                hour && hour.set('text', Math.floor((now % 86400) / 3600));
                if (day) {
                    var days = Math.floor(now / 86400);
                    if (days < 1) return window.location.reload();
                    else day.set('text', days);
                }
                now -= timespan;
                //now > 0 ? window.setTimeout(count, timespan * 1000) : window.location.reload();
                if (now > 0) window.setTimeout(count, timespan * 1000);
            };

        window.setTimeout(count, timespan * 1000);
    },

    // business require for TG
    // method to refresh the number of purchases in CityIndex.aspx

    manyDealCount: function (count, timespan) {
        if (!count) return;

        var timer,
			update = function () {
			    new AjaxReq({
			        url: '/deal.v',
			        method: 'post',
			        data: {
			            'do': 'gact'
			        },

			        onSuccess: function (rt) {
			            if (rt) {
			                if (rt.code === 200) {
			                    if (rt.msg.id.length != 0 && rt.msg.join.length != 0) {
			                        var arrdid = rt.msg.id,
                                        arrjoin = rt.msg.join;
			                        count.each(function (t) {
			                            var did = t.getProperty('data-did');
			                            arrdid.each(function (tt, ii) {
			                                if (tt == did) {
			                                    t.set('text', arrjoin[ii]);
			                                }
			                            })
			                        });

			                    }

			                } else $clear(timer);

			                // if(rt.code === 501) location.reload();
			                // else if(rt.code === 500) $clear(timer);
			            }
			        }
			    }).send();
			}

        timer = update.periodical(timespan || 6e4);

    },

    //method to refresh deal index purchases count
    dealCountRefresh: function (timespan) {
        var timer,
            update = function () {
                var count = $$(".J_dealCount"),
                    ids = [];
                count.each(function (t) {
                    var id = t.getProperty('data-did');
                    id && ids.push(id);
                });
                new AjaxReq({
                    url: '/deal.v',
                    method: 'post',
                    data: {
                        'do': 'gaids',
                        'ids': "[" + ids.join(',') + "]"
                    },
                    onSuccess: function (rt) {
                        if (rt) {
                            if (rt.code === 200) {
                                if (rt.msg) {
                                    count.each(function (t) {
                                        var did = t.getProperty('data-did');
                                        rt.msg[did] && t.set('text', rt.msg[did]);
                                    });

                                }

                            } else $clear(timer);

                            // if(rt.code === 501) location.reload();
                            // else if(rt.code === 500) $clear(timer);
                        }
                    }
                }).send();
            }

        timer = update.periodical(timespan || 6e4);
    },

    // business require for TG
    // method to refresh the number of purchases
    dealCount: function (count, countLeft, timespan) {
        count = $(count);
        if (!count) return;
        if (count.getProperty("data-selled") == 1) return;
        countLeft = $(countLeft);

        var timer,
			update = function () {
			    new AjaxReq({
			        url: '/deal.v',
			        method: 'post',
			        data: {
			            'do': 'gren',
			            'did': npage.data.dealGroupID
			        },

			        onSuccess: function (rt) {
			            if (rt) {
			                if (rt.code === 200) {
			                    rt.msg.num && count.set('text', rt.msg.num);

			                    if (rt.msg.left) {
			                        !countLeft && window.location.reload();
			                        countLeft && countLeft.set('text', rt.msg.left);
			                    }

			                } else $clear(timer);

			                // if(rt.code === 501) location.reload();
			                // else if(rt.code === 500) $clear(timer);
			            }
			        }
			    }).send();
			}

        timer = update.periodical(timespan || 6e4);

    },


    // method to copy text to clipboard from a input

    // @param input {element} input area to be copied
    // @param btn {element} the copy button
    // @param successText {string} the message to be shown if the text successfully copied
    // @param getter {function} method to get the content to be copied

    // @require TG.util.clipboard

    clipboard: function (input, successText, getter) {
        input = $(input);
        if (!input) return;
        // feature detection
        var select = function (e) {
            e && new Event(e).stop();

            var _t = $(this),
                    value = input.get('value');

            if (_t !== input) return;

            _t.selectRange(0, _t.get('value').trim().length);

            // business require
            //check === 'trident' && value && window.clipboardData.setData("Text", value) && successText && alert(successText);
        };

        input.addEvents({
            // on some trident-based browser, i.e. maxthon, 'focus' event might be triggered after closing window.alert
            // so never bind 'focus' event here, or you will be involved in the dead cycle
            // 'focus': select

            'click': select
        });
    },


    // ajax method for sending verification mail
    // business requirement: this is a most less abstract method

    // @param btn {element|element id} the button or element to trigger sending of verification
    // @param redirect {string/ url} the url address to rediect after sending
    // 
    sendverify: function (btn, redirect, extraMsg) {
        btn = $(btn);

        // @param fake {boolean} if fake is true, show fake success message and do not send verification email -- business requirement
        var send = function (redirect, noMsg, fake, extraMsg) {
            var fn = arguments.callee,
            msg = function (extra) {
                !noMsg && TG.app.mbox.open({
                    url: $dialog(
						    '成功',
						    TG.app.mbox.tpl({
						        title: '验证邮件发送成功！',
						        icon: 'suc',
						        contentTop: '<p>请到您的邮箱收信，并点击其中的链接验证您的邮箱</p>',
						        contentBottom: extra || ''
						    }),
						    [TG.btn('确定', null, null, { 'click': function () { TG.app.mbox.close(); } })]
					    )
                });
            }

            if (fn.on) return;

            if (fake) {
                msg(extraMsg);
            } else {

                // prevent duplicate sending
                fn.on = true;

                new AjaxReq({
                    url: "/reg.v",
                    method: "post",
                    data: { "do": "remail" },
                    onRequest: function () {
                        if (redirect) {
                            location.href = redirect;
                            return;
                        }
                    },

                    onSuccess: function (rt) {
                        if (rt && rt.code === 200) {
                            msg(extraMsg);
                        }
                        fn.on = false;
                    },

                    onError: function () {
                        fn.on = false;
                    }
                }).send();
            }
        };
        btn && btn.addEvent('click', function (e) {
            e && new Event(e).preventDefault();

            var TIME_STAMP = '_dpt_mailv_timestamp',
                last_validate_time = Number(Cookie.read(TIME_STAMP));

            if (!last_validate_time || $time() - last_validate_time > 3E5) {

                Cookie.write(TIME_STAMP, $time());

                send(redirect, null, null, extraMsg);
            } else {
                send(redirect, null, true, extraMsg);
            }

        });
    },

    // method for submitting aspnetForm, especially for ASP.NET
    // @param {element|id|array of element or id} inputs: text input
    // @param (optional){element|string} form: form element or form id
    enterToGo: function (inputs, btn, form) {
        form = $(form) || $('aspnetForm');

        btn = $(btn); if (!btn) return;

        $splat(inputs).each(function (input) {
            input = $(input);
            input && input.addEvent('keypress', function (e) {
                if (e && (e = new Event(e)).code === 13) {
                    e.preventDefault();
                    btn.click();

                }
            });
        });
    },
    // method for button go to top
    toTop: function () {
        var toTopElem = $("toTop"),
            scrollTop;

        if (!toTopElem) return;
        action = function () {
            if (Browser.ie && Browser.version <= 6) {
                scrollTop = document.getScroll().y + window.getSize().y;
                toTopElem.setStyle("top", scrollTop - 210);
            }
            if (this.getScroll().y > 0) {
                toTopElem.setStyle("display", "block");
            } else {
                toTopElem.setStyle("display", "none");
            }
        };

        window.addEvents({
            "scroll": function () { action(); },
            "resize": function () { action(); }
        });
        toTopElem.addEvent("click", function (e) {
            e && e.preventDefault();
            new TG.util.Scroll().toTop();
        });
    },

    /**
    * alipay gold vip box
    * TODO: remove when zhis market activities end
    * @param notCookie{boolean} whether need cookie check
    * Usage: TG.app.alipayvip();
    * Used: DealIndex.aspx, DealCategoryHome.aspx, DealHome.aspx, SubmitOrderNew.apsx, MyHeaderCtrl.ascx, SureOrder.aspx
    * Refer: https://docs.google.com/a/dianping.com/document/d/18NeEc2NTH2X4hlMU1oyWLg9DHtzYtFbNqq5HpBD4T4I/edit?hl=zh_CN
    */
    /*
    alipayvip: function (notCookie) {
    var apvu = Cookie.read("apvu"),
    apvf = Cookie.read("apvf"),
    h = '<div class="Form-box box">' +
    '<div class="field" style="*margin-top:20px; font-size:14px;">活动期间支付宝金帐户关联的点评帐户可享受以下特权：</div>' +
    '<div class="field">● 支付宝金账户用户首次登录点评团，赠送一张满50元减10元和两张满100元减10元的抵扣券（均为首次登录30日之内有效）</div>' +
    '<div class="field">● 以后每月一号赠送满50元减5元，满100元减15元的抵扣券各两张（均为当月有效）</div>' +
    '<div class="field">点此链接查看已获得的抵扣券：<a target="_blank" href="http://t.dianping.com/account/credit">http://t.dianping.com/account/credit</a></div>' +
    '<div class="field color-r">抵扣券发放说明：首次登录获得的赠券将于15分钟内发放至点评账户</div>' +
    '</div>',

    showDialog = function () {
    TG.app.mbox.open({
    size: { x: 450 },
    url: $dialog(
    '欢迎您，支付宝金账户会员',
    TG.app.mbox.tpl({
    title: '',
    contentTop: h,
    contentBottom: ''
    }),
    [TG.btn('知道了', null, null, { 'click': function () { TG.app.mbox.close(); } })]
    )
    });
    };
    if (notCookie) {
    showDialog();
    }
    if (apvf && apvu && /^\w+-\w+-1$/.test(apvu)) {
    showDialog();
    apvu = apvu.replace(/(\w+-\w+)(-1)/, "$1-0");

    Cookie.write("apvu", apvu, { domain: '.dianping.com' });
    }
    },*/
    searchStart: function () {
        var _handleUrl = function () {
            var hr = location.href, hre = hr.substring(hr.indexOf('http://') + 7), result = hre.substring(0, hre.indexOf('/') + 1);
            (!result.test(/\/s0|\/s1|\/s2/)) && (result += "s");
            return result;
        },
        search = function () {
            var keyword = $("search-keywords").value.trim(), url = location.href, sort, l, s, sortindex = url.indexOf('sort='), qindex;
            $track("dp_tg_search_home_" + npage.data.cityEnName);
            (sortindex == -1) ? sort = '' : sort = url.substring(sortindex + 5);
            if ((qindex = sort.indexOf('q=')) == -1) {
                sort = sort + '';
            } else {
                sort = sort.substring(0, qindex - 1);
            }
            if ($$('.popular-box')) {
                s = (keyword != "") ? ("?q=" + encodeURIComponent(keyword)) + "&sort=" + sort : "";
            } else {
                s = (keyword != "") ? ("?q=" + encodeURIComponent(keyword)) : "";
            }
            l = _handleUrl() + s;
            window.location = 'http://' + l;
        };
        var p = new TG.util.PlaceHolder('search-keywords', { btn: 'search-btn', exec: function () { search(); } }),
            refer;
        $("search-keywords") && $("search-keywords").addEvents({
            focus: function () {
                refer = $(this).getParent();
                !refer.hasClass('search-current') && refer.addClass('search-current');
            },
            blur: function () {
                refer = $(this).getParent();
                refer.hasClass('search-current') && refer.removeClass('search-current');
            }
        });
        $("searchBtn") && $("searchBtn").addEvent("click", function (e) {
            var k = $("search-keywords");
            $track("dp_tg_search_home_" + npage.data.cityEnName);
            if (k.value.trim() == "" || k.value == k.getProperty("placeholder")) {
                window.location = 'http://' + _handleUrl();
            } else {
                search();
            }
        });
    },

    hoverMenu: function (b) {
		
        if (!b) return;
        var t = b.getElement(".J_trigger"),
        p = b.getElement(".J_list");
        if (!t || !p) { return; }
        b.addEvents({
            'mouseenter': function () {
                t.addClass('hover');
                p.removeClass('Hide');
            },
            'mouseleave': function (e) {
                t.removeClass('hover');
                p.addClass('Hide');
            }
        });
    },
    iptip: function () {
        if (!window.m) return;
        var ck = new Cookie('ipbh', { domain: '.dianping.com', duration: m.cookieexp }), mp, mi, bp;
        if (d > m.starttime && d < m.endtime && !ck.read()) {
            mi = $$('.i-mobile')[0]; mp = mi && mi.getPosition(); bp = new Element('div', { 'class': 'pop-panel pp_ipad-hint', 'html': m.content + '<a title="关闭" class="close">关闭</a><span class="arrow"></span>', 'styles': { "top": '5px', 'right': 0} }).inject($$(".hd")[0]); mp && bp && bp.setStyles({ left: mp.x - 33, top: mp.y + 31, visibility: 'visible' });
            $$('.pp_ipad-hint .close').addEvent('click', function (e) {
                e.preventDefault(); bp.destroy(); ck.write(1);
            });
        }
    },
    recentView: function () {
        var t = $('J_recent_box'),
            flag = true,
            temp = '<li>' +
                '<a class="deal Fix" href="{href}" track="{track}" target="_blank">' +
                    '<img src="{src}" title="{title}">' +
                    '<span class="title" title="{title}"><span class="tip">{tip}</span>{text}</span> ' +
                '</a>' +
            '</li>';

        t && t.addEvents({
            'mouseenter': function () {
                if (!flag) return;
                new AjaxReq({
                    url: '/deal.v', method: 'post', data: { 'do': 'grdg' },
                    onSuccess: function (rt) {
                        if (rt && rt.code == 200) {
                            var m = rt.msg, l, html = '';
                            if (!m) {
                                html = '暂没有浏览记录';
                            } else {
                                if (!$type(m) == 'array') return;
                                l = m.length;
                                l > 0 && m.each(function (t) {
                                    html += temp.substitute(t);
                                });
                            }
                        }
                        $('J_recent_list').set('html', html);
                        flag = false;
                    }
                }).send();
            },
            'mouseout': function (e) {
                if (e && e.target != t) {
                    flag = true;
                }
            }
        });
    }
}


TG.app.msgbar.extend({

    // @param (optional){element} bar: the message bar element, if false, it will get the latest message bar
    // @param (optional){number} duration: duration before the message faded out, default to 250;
    //    if === false, the msgbar will close immediately


    // @example: TG.app.msgbar.close(false, false);  ---- will close the current message bar immediately without animation;
    // change log for close msgbar zhen send msg 
    // @param (options){String} ajaxUrl : the ajax url for sending msg
    // @param (options){JSON} ajaxParam: the param for ajax request
    close: function (bar, duration, ajaxUrl, ajaxParam) {
        bar = $(bar) || TG.app.msgbar.bar;

        if (bar) {
            if (duration === false) return bar.dispose();

            duration = $type(duration) === 'number' ? duration : 250;

            new Fx.Tween(bar, { duration: duration, property: 'opacity', onComplete: function () { bar.dispose(); } }).start(0);
        }

        if (ajaxUrl && ajaxParam) {
            new AjaxReq({
                url: ajaxUrl,
                method: 'post',
                data: ajaxParam
            }).send();
        }
    }
});

TG.app.mbox.extend(new Events)
           .extend(new Options)
           .extend({
               // templates for TuanGou dialog
               tpl: function (object, type) {
                   if ($type(object) !== 'object') return;

                   var module = TG.app.mbox.module[(type || 'dflt')] || mbox.module.dflt;

                   return module.substitute(object);
               },

               module: {
                   loading: '<div class="mbox-loading">{content}</div>',
                   dflt: '<div class="mcont Fix"><span class="ib-{icon} icon Left"></span><h3>{title}</h3>{contentTop}</div><div>{contentBottom}</div>'
               },

               loading: function (title, cont, options) {
                   TG.app.mbox.open($extend({
                       url: $dialog(title, TG.app.mbox.tpl({ content: cont }, 'loading')),
                       closable: false

                   }, options));
               }
           });
// Venus obj
var Myra = {};
Myra.app = {
	dropMenu: function () {
		//console.log(11);
		var menu = $$(".J_menu"), app = TG.app;
		menu && menu.each(function(t){ app.hoverMenu(t);});
	}
};

