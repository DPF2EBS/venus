/*
 * <!--[if lt IE 9]>
 *	<script type="text/javascript" src="path/to/flashcanvas.js"></script>
 * <![endif]-->
 */
DP.define(function (D) {

    var DOC = document,
        PI = Math.PI,
        __hasProp = Object.prototype.hasOwnProperty;

    function Canvas(options) {
        var element, ctx;
        element = DOC.createElement("canvas");
        if (typeof FlashCanvas !== "undefined") {
            FlashCanvas.initElement(element);
        }

        element.width = options.width;
        element.height = options.height;
        ctx = element.getContext("2d");

        this.element = element;
        this.ctx = ctx;
    }

    //extend native context func to Canvas
    "beginPath closePath moveTo lineTo fillText fill stroke arc rect strokeRect save restore translate rotate scale transform setTransform".split(" ").forEach(function (method) {
        Canvas.prototype[method] = function () {
            var ctx = this.ctx;
            ctx[method].apply(ctx, arguments);
            return this;
        };
    });

    Canvas.prototype.inject = function () {
        var elementDOM = $(this.element);
        elementDOM.inject.apply(elementDOM, arguments);
        return this;
    };

    /*
     * no arguments:reset style
     * one argument
     * 		if string
     * 			reset special style
     * 		else if object
     * 			set style
     *two arguments
     *		set style
     * 
     */
		/**
			* Property Meaning
			* fillStyle The color, gradient, or pattern for fills
			* font The CSS font for text-drawing commands
			* globalAlpha Transparency to be added to all pixels
			* drawn
			* globalCompositeOperation How to combine pixel colors
			* lineCap How the ends of lines are rendered
			* lineJoin How vertices are rendered
			* lineWidth The width of stroked lines
			* miterLimit Maximum length of acute mitered vertices
			* textAlign Horizontal alignment of text
			* textBaseline Vertical alignment of text
			* shadowBlur How crisp or fuzzy shadows are
			* shadowColor The color of drop shadows
			* shadowOffsetX The horizontal offset of shadows
			* shadowOffsetY The vertical offset of shadows
			* strokeStyle The color, gradient, or pattern for lines
			**/
    Canvas.prototype.style = function () {
        var args = D.makeArray(arguments),
            o, key;
        var defaultStyle = (this.defaultStyle || (this.defaultStyle = {}));
        defaultStyle.remember || (defaultStyle.remember = {});
        if (args.length === 0) {
            this._resetStyle();
        } else if (args.length === 1) {
            o = args[0];
            if (D.isObject(o)) {
                for (key in o) {
                    if (__hasProp.call(o, key)) {
                        if (!defaultStyle.remember[key]) {
                            defaultStyle[key] || (defaultStyle[key] = this.ctx[key]);
                            defaultStyle.remember[key] = true;
                        }
                        this.ctx[key] = o[key];
                    }
                }
            } else if (D.isString(o)) {
                this._resetStyle(o);
            }
        } else if (args.length === 2) {
            defaultStyle[args[0]] || (defaultStyle[args[0]] = this.ctx[args[0]]);
            defaultStyle.remember[args[0]] = true;
            this.ctx[args[0]] = args[1];
        }

        return this;
    };

    Canvas.prototype.line = function (sx, sy, ex, ey) {
        this.beginPath();
        this.moveTo(sx, sy);
        this.lineTo(ex, ey);
        this.stroke();
        return this;
    };

    Canvas.prototype.cicle = function (x, y, radius, fill) {
        this.beginPath();
        this.arc(x, y, radius, 0, PI * 2);
        if (fill) {
            this.fill();
        } else {
            this.stroke();
        }
        return this;
    };

    Canvas.prototype.sector = function (x, y, radius, startAngle, endAngle, anticlockwise, fill) {
        this.beginPath();
        this.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        this.lineTo(x, y);
        this.closePath();
        if (fill) {
            this.fill();
        } else {
            this.stroke();
        }
        return this;
    };

    //delete for there are rect & strokeRect
    //	Canvas.prototype.rectangle=function(x,y,width,height,fill){
    //		this.beginPath();
    //		this.rect(x,y,width,height);
    //		if(fill){
    //			this.fill();
    //		}else{
    //			this.stroke();
    //		}
    //		return this;
    //	};
    Canvas.prototype.text = function (text, x, y) {
        this.fillText(text, x, y);
        return this;
    };


    //plugin & extend
    //extend Canvas.prototype
    Canvas.extend = function (name, method) {
        var proto = this.prototype,
            o;
        if (D.isObject(name)) {
            o = name;
            for (var key in o) {
                if (__hasProp.call(o, key)) {
                    this.extend(key, o[key]);
                }
            }
        } else if (D.isString(name) && D.isFunction(method)) {
            if (!proto[name]) {
                proto[name] = method;
            }
        }
    };

    //extend Canvas instance
    Canvas.prototype.extend = function (name, method) {
        var o;
        if (D.isObject(name)) {
            o = name;
            for (var key in o) {
                if (!__hasProp.call(o, key)) {
                    this.extend(key, o[key]);
                }
            }
        } else if (D.isString(name) && D.isFunction(method)) {
            if (!this[name]) {
                this[name] = method;
            }
        }
        return this;
    };


    Canvas.extend("pie", function (data, x, y, radius) {
        var sum = 0,
            that = this;
        data.forEach(function (data) {
            sum += data;
        });

        data = data.map(function (data) {
            return data / sum;
        });

        var begin, end = 0;
        begin = end;
        data.forEach(function (data) {
            end += data;
            that.style("fillStyle", randomColor());
            that.sector(x, y, radius, begin * 2 * PI, end * 2 * PI, false, true);
            begin = end;
        });
    });

    //util
    function randomColor() {
        var arrHex = "0123456789ABCDEF".split("");
        var strHex = "#";
        var index;
        for (var i = 0; i < 6; i++) {
            index = Math.round(Math.random() * 15);
            strHex += arrHex[index];
        }
        return strHex;
    }

    Canvas.prototype._resetStyle = function (key) {
        var defaultStyle = this.defaultStyle;
        if (!key) {
            for (key in defaultStyle) {
                if (Object.prototype.hasOwnProperty.call(defaultStyle, key)) {
                    this.ctx[key] = defaultStyle[key];
                }
            }
        } else {
            this.ctx[key] = defaultStyle[key];
        }
    };

    Canvas.extend({
        "polygon": function (n, x, y, r, angle, counterclockwise) {
            angle = angle || 0;
            counterclockwise = counterclockwise || false;
            // Compute vertex position and begin a subpath there
            this.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
            var delta = 2 * Math.PI / n; // Angle between vertices
            for (var i = 1; i < n; i++) { // For remaining vertices
                // Compute angle of this vertex
                angle += counterclockwise ? -delta : delta;
                // Compute position of vertex and add a line to it
                this.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
            }
            this.closePath(); // Connect last vertex back to the first
						this.fill();
        },
				shear:function(kx,ky){
					/**
  					* x' = ax + cy + e
  					* y' = bx + dy + f
					 */
					// Shear transform:
					// x' = x + kx*y;
					// y' = y + ky*x;
					this.transform(1,ky,kx,1,0,0);
					return this;
				},

 				// Rotate theta radians clockwise around (x,y).
 				// This can also be accomplished with a translate,
 				// rotate, translate back sequence of transformations.
				rotateAbout:function(theta,x,y){
					var ct = Math.cos(theta), st = Math.sin(theta);
					this.transform(ct, -st, st, ct,-x*ct-y*st+x, x*st-y*ct+y);
					return this;
				}

    });

    return Canvas;
});


//interface CanvasRenderingContext2D {
//
//	  // back-reference to the canvas
//	  readonly attribute HTMLCanvasElement canvas;
//
//	  // state
//	  void save(); // push state on state stack
//	  void restore(); // pop state stack and restore state
//
//	  // compositing
//	           attribute double globalAlpha; // (default 1.0)
//	           attribute DOMString globalCompositeOperation; // (default source-over)
//
//	  // colors and styles (see also the CanvasLineStyles interface)
//	           attribute any strokeStyle; // (default black)
//	           attribute any fillStyle; // (default black)
//	  CanvasGradient createLinearGradient(double x0, double y0, double x1, double y1);
//	  CanvasGradient createRadialGradient(double x0, double y0, double r0, double x1, double y1, double r1);
//	  CanvasPattern createPattern((HTMLImageElement or HTMLCanvasElement or HTMLVideoElement) image, DOMString repetition);
//
//	  // shadows
//	           attribute double shadowOffsetX; // (default 0)
//	           attribute double shadowOffsetY; // (default 0)
//	           attribute double shadowBlur; // (default 0)
//	           attribute DOMString shadowColor; // (default transparent black)
//
//	  // rects
//	  void clearRect(double x, double y, double w, double h);
//	  void fillRect(double x, double y, double w, double h);
//	  void strokeRect(double x, double y, double w, double h);
//
//	  // current default path API (see also CanvasPathMethods)
//	  void beginPath();
//	  void fill();
//	  void stroke();
//	  void drawSystemFocusRing(Element element);
//	  boolean drawCustomFocusRing(Element element);
//	  void scrollPathIntoView();
//	  void clip();
//	  boolean isPointInPath(double x, double y);
//
//	  // text (see also the CanvasText interface)
//	  void fillText(DOMString text, double x, double y, optional double maxWidth);
//	  void strokeText(DOMString text, double x, double y, optional double maxWidth);
//	  TextMetrics measureText(DOMString text);
//
//	  // drawing images
//	  void drawImage((HTMLImageElement or HTMLCanvasElement or HTMLVideoElement) image, double dx, double dy);
//	  void drawImage((HTMLImageElement or HTMLCanvasElement or HTMLVideoElement) image, double dx, double dy, double dw, double dh);
//	  void drawImage((HTMLImageElement or HTMLCanvasElement or HTMLVideoElement) image, double sx, double sy, double sw, double sh, double dx, double dy, double dw, double dh);
//
//	  // pixel manipulation
//	  ImageData createImageData(double sw, double sh);
//	  ImageData createImageData(ImageData imagedata);
//	  ImageData getImageData(double sx, double sy, double sw, double sh);
//	  void putImageData(ImageData imagedata, double dx, double dy);
//	  void putImageData(ImageData imagedata, double dx, double dy, double dirtyX, double dirtyY, double dirtyWidth, double dirtyHeight);
//	};
//	CanvasRenderingContext2D implements CanvasTransformation;
//	CanvasRenderingContext2D implements CanvasLineStyles;
//	CanvasRenderingContext2D implements CanvasPathMethods;
//	CanvasRenderingContext2D implements CanvasText;
//
//	[NoInterfaceObject]
//	interface CanvasTransformation {
//	  // transformations (default transform is the identity matrix)
//	  void scale(double x, double y);
//	  void rotate(double angle);
//	  void translate(double x, double y);
//	  void transform(double a, double b, double c, double d, double e, double f);
//	  void setTransform(double a, double b, double c, double d, double e, double f);
//	};
//
//	[NoInterfaceObject]
//	interface CanvasLineStyles {
//	  // line caps/joins
//	           attribute double lineWidth; // (default 1)
//	           attribute DOMString lineCap; // "butt", "round", "square" (default "butt")
//	           attribute DOMString lineJoin; // "round", "bevel", "miter" (default "miter")
//	           attribute double miterLimit; // (default 10)
//	};
//
//	[NoInterfaceObject]
//	interface CanvasText {
//	  // text
//	           attribute DOMString font; // (default 10px sans-serif)
//	           attribute DOMString textAlign; // "start", "end", "left", "right", "center" (default: "start")
//	           attribute DOMString textBaseline; // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom" (default: "alphabetic")
//	};
//
//	[NoInterfaceObject]
//	interface CanvasPathMethods {
//	  // shared path API methods
//	  void closePath();
//	  void moveTo(double x, double y);
//	  void lineTo(double x, double y);
//	  void quadraticCurveTo(double cpx, double cpy, double x, double y);
//	  void bezierCurveTo(double cp1x, double cp1y, double cp2x, double cp2y, double x, double y);
//	  void arcTo(double x1, double y1, double x2, double y2, double radius); 
//	  void rect(double x, double y, double w, double h);
//	  void arc(double x, double y, double radius, double startAngle, double endAngle, optional boolean anticlockwise); 
//	};
//
//	interface CanvasGradient {
//	  // opaque object
//	  void addColorStop(double offset, DOMString color);
//	};
//
//	interface CanvasPattern {
//	  // opaque object
//	};
//
//	interface TextMetrics {
//	  readonly attribute double width;
//	};
//
//	interface ImageData {
//	  readonly attribute unsigned long width;
//	  readonly attribute unsigned long height;
//	  readonly attribute Uint8ClampedArray data;
//	};
       
/**
 * TODOs
 * 1 change style to attr
 */
