/*
 * SVG Chart Lib of Venus
 * */

(function (global, undefined) {
    //extend Array forEach
    !Array.prototype.forEach && (Array.prototype.forEach = function (fn, context) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this) {
                fn && fn.call(context, this[i], i, this);
            }
        }
    });


    var mix = function (o1, o2) {
            for (var attr in o2) {
                if (typeof  o2[attr] !== "object" || o1[attr] === undefined || typeof o1[attr] !== 'object') {
                    o1[attr] = o2[attr];
                } else {
                    mix(o1[attr], o2[attr]);
                }
            }
            return o1;
        }
        , getNumber = function (obj) {

        }
        , PI = Math.PI
        , toString = Object.prototype.toString
        , isArray = function (obj) {
            return toString.call(obj) === "[object Array]";
        }
        , isObject = function (obj) {
            return obj === Object(obj);
        }
        , charts = {} // charts added by using DPChart.addChart
        , colors

    /*DPChart Begin*/
    /*
     * Class DPChart
     * @param container{HTMLElement} container of the svg element to draw the chart
     * @param data{Array} Array of the data
     * @param options{object}
     */
    function DPChart(container, data, options) {
        if (!container || !container.nodeType) {
            return;
        }
        this.container = container;
        this.data = data || [];
        this.events = new CustomEvent();
        var defaultOptions = {
			/**
			*maybe here will cause a bug when a html element size is autosize or it is invisible.
			*chart size may provide from other way.
			*/
            width:container.clientWidth,
            height:container.clientHeight,
            colors:[],
            axis:{
                y:{
                    rotate:90
                }
            },
            legend:{

            },
            grid:{
                enableRow:true,
                enableColumn:false
            }
        };
        this.options = mix(defaultOptions, options || {});
        this.raphael = new Raphael(container, this.options.width, this.options.height);
        this.colors = colors;

        //init data
        this._initData();
        this.events.fire('onDataInit', this.series);

        // init axis
        this._initAxis();
        this.events.fire('onAxisInit', {});

        //init legend
        this._initLegend();
        this.events.fire('onLegendInit', this.legend);

        //init grid
        this._initGrid();
        this.events.fire('onGridInit', this.grid);

        // draw
        this.draw();

        //init events
        this._initEvents();

        this.events.fire('onFinish');

    }

    DPChart.prototype = {
        constructor:DPChart,
        _initData:function () {
            var data = this.data;
            this.series = new Series(data);
        },
        _initAxis:function () {
            var opt = this.options,
                axisOption = opt.axis,
                axises = {},
                axis,
                thisAxisOption,
                range,
                beginX,
                beginY

            for (axis in axisOption) {
                if ((thisAxisOption = axisOption[axis])) {
                    if (axis == "y" && (!thisAxisOption.ticks || thisAxisOption.ticks.length == 0)) {
                        range = this.series.getRange();
                        if (thisAxisOption.max === undefined) {
                            thisAxisOption.max = range.max
                        }
                        if (thisAxisOption.min === undefined) {
                            thisAxisOption.min = range.min;
                        }
                    }
                    if (axis == "x") {
                        (thisAxisOption.pop === undefined) && (thisAxisOption.pop = 1); //前面空一格
                        if (!thisAxisOption.ticks) {
                            thisAxisOption.ticks = this.series.getSeries();
                        }
                    }

                    thisAxisOption._svgWidth = this.options.width;
                    thisAxisOption._svgHeight = this.options.height;
                    axises[axis] = new Axis(thisAxisOption, this.series, this.raphael);
                    !thisAxisOption.beginX && axis == "x" && (beginX = (opt.width - axises[axis].axisLength) / 2);
                    !thisAxisOption.beginY && axis == "y" && (beginY = (opt.height - axises[axis].axisLength) / 2 + axises[axis].axisLength);
                }
            }
            if (beginX && beginY) {
                for (axis in axises) {
                    //adjust beginX and beginY
                    axises[axis].setPosition(beginX, beginY);

                }
            }
            this.axises = axises;
        },
        _initLegend:function () {
            var opt = this.options,
                legendOption = opt.legend;
            legendOption._svgWidth = opt.width;
            legendOption._svgHeight = opt.height;

            this.legend = new Legend(this.series, legendOption, this.raphael);


        },
        _initGrid:function () {
            var gridOption = this.options.grid
            gridOption.enableRow && this.axises.y && (gridOption.rows = this.axises.y.getTicksPos().y) && (gridOption._x = this.axises.y.beginX) && this.axises.x && (gridOption.width = this.axises.x.axisLength)
            gridOption.enableColumn && this.axises.x && (gridOption.columns = this.axises.x.getTicksPos().x) && (gridOption._y = this.axises.x.beginY) && this.axises.y && (gridOption.height = this.axises.y.axisLength)
            this.grid = new Grid(gridOption, this.raphael);
        },
        _initEvents:function () {

        },
        draw:function () {
            for (var chart in charts) {
                if (this.options[chart]) {
                    //draw that chart
                    charts[chart].draw && charts[chart].draw.call(this);
                }
            }
        },
        update:function () {

        }
    };
    DPChart.addChart = function (name, methods) {
        charts[name] = methods;
    }
	
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

        for (var j = 0, L = result.length; j < L; j++) {
            result[j] = Math.floor(result[j] * 255);
        }

        return result;
    }

    /**
     * get a group of chart colors
     * @param {Integer} colorCount How many colors needed.
     * @example DPChart.getColors(6);
     * @return a group of colors in type of rgb().
     * @type {Array}
     */
    DPChart.getColors = function (colorCount) {
        var S=[0.75,0.75,0.45,1,0.35], V=[0.75,0.45,0.9,0.6,0.9], colors = [], L;	
		
		//if colorCount is not provide, set colorCount default value 20
		colorCount=parseInt(colorCount,10)||20;
		L=Math.max(colorCount/5,6);		
		
		for(var c=0;c<colorCount;c++){
			colors.push('rgb(' + _hsv2rgb(c%L*360/L, S[Math.floor(c/L)], V[Math.floor(c/L)]).join(',') + ')');
		}

        return colors;
    }

    colors = DPChart.getColors();

    /*DPChart End*/


    var Series = function (data) {
        var max , min , i , l
            , series = []
            , lables = []

        if (isArray(data)) {
            for (i = 0, l = data.length; i < l; i++) {
                if (isObject(data[i])) {
                    //item is {}
                    if (data[i].data) {
                        // item in format {data:something,otherThings...}
                        series.push(mix({}, data[i]));
                    } else {
                        //item is data
                        series.push({data:mix({}, data[i])});
                    }
                } else {
                    series.push({data:data[i]});
                    if (isArray(data[i])) {
                        //get the max of the array
                        var iMax = Math.max.apply(Math, data[i]),
                            iMin = Math.min.apply(Math, data[i]);

                        (max === undefined || iMax > max) && (max = iMax);
                        (min === undefined || iMin < min) && (min = iMin);
                    } else {
                        (max === undefined || data[i] > max ) && (max = data[i]);
                        (min === undefined || data[i] < min ) && (min = data[i]);
                    }

                }
            }
        } else if (isObject(data)) {
            for (var o in data) {
                series.push({
                    name:o,
                    data:data[o]
                });
            }
        } else {
            series.push({data:data});
        }
        this.series = series

        this._max = max;
        this._min = min;
    };
    Series.prototype = {
        constructor:Series,
        getRange:function () {
            return {
                max:this._max,
                min:this._min
            }
        },
        getSeries:function () {
            return this.series;
        },
        getLabels:function () {

        }
    }


    var Axis = function (options, series, paper) {
        var defaultOptions = {
                max:0,
                min:0,
                tickSize:1,
                tickWidth:30,
                ticks:[],
                minorTickNum:0, // 一个tick中有几个minor tick ，<0 就没有
                rotate:0, //逆时针旋转的角度，0为水平向右，没有radius就按0点 ，有radius就按圆心
                radius:0, //弯曲半径
                pop:0, // 前面空掉几个刻度的位置
                _svgWidth:0,
                _svgHeight:0
            }
            , axisElement
            , labelElements = []
            , pathString = ""
            , beginX, beginY //start point of axis
            , opt = this.options = mix(defaultOptions, options)
            , i, l
            , labelMarginTop = 10
            , tickHeight = 3
            , rotate = 360 - opt.rotate
            , tick

        this.series = series;

        if (!opt.ticks.length) {
            tick = opt.min;
            while (tick < opt.max) {
                opt.ticks.push(tick)
                tick += opt.tickSize;
            }
            opt.ticks.push(tick)
        }

        //beginX,beginY ,can be adjust later
        this.beginX = beginX = opt.beginX || 30;
        this.beginY = beginY = opt.beginY || opt._svgHeight - 30;

        //if get ticks, use ticks
        pathString += ("M" + beginX + " " + beginY);
        for (i = 0, l = opt.pop; i < l; i++) {
            pathString += ("h" + opt.tickWidth + "v" + tickHeight + "v" + -tickHeight);
        }
        for (i = 0, l = opt.ticks.length; i < l; i++) {
            //horizontal draw the axis and later rotate it
            if (i !== 0) {
                pathString += (  "h" + opt.tickWidth + "v" + tickHeight + "v" + -tickHeight );
            }
            labelElements[i] = paper.text((beginX + (i + opt.pop) * opt.tickWidth), beginY + labelMarginTop * (opt.rotate > 0 ? -1 : 1), opt.ticks[i]).rotate(rotate, beginX, beginY);
        }

        axisElement = this.axisElement = paper.path(pathString);
        this.labelElements = labelElements;
        //rotate
        axisElement.rotate(rotate, beginX, beginY);

        //TODO compute 1 -1
        opt.rotate > 0 && axisElement.scale(1, -1, beginX, beginY)

        this.axisLength = opt.tickWidth * (opt.ticks.length + opt.pop - 1)
    };
    Axis.prototype = {
        constructor:Axis,
        getX:function (index) {
            //return the x in svg coordinate
            var opt = this.options

            return Math.cos(opt.rotate / 360 * 2 * PI) * (index + opt.pop) * opt.tickWidth + this.beginX;
        },
        getY:function (index) {
            //return the y in svg coordinate
            var opt = this.options
            return this.beginY - Math.sin(opt.rotate / 360 * 2 * PI) * ( this.series.getSeries()[index].data - opt.ticks[0]) * opt.tickWidth / opt.tickSize;
        },
        getOrigin:function () {
            return {
                x:this.beginX,
                y:this.beginY
            }
        },
        getAngel:function () {
			
        },
        setPosition:function (x, y) {
            var left = x - this.beginX,
                top = y - this.beginY
            this.beginX = x;
            this.beginY = y;
            this.axisElement.transform('T' + left + ',' + top + "...");
            this.labelElements.forEach(function (label) {
                label.transform('T' + left + ',' + top + "...");
            })
        },
        getTicksPos:function () {
            //刻度的位置
            var left = [],
                top = [],
                beginX = this.beginX,
                beginY = this.beginY,
                i, l,
                opt = this.options,
                rotate = opt.rotate / 360 * 2 * PI

            for (i = 0, l = opt.pop; i < l; i++) {
                left.push(beginX + i * opt.tickWidth * Math.cos(rotate));
                top.push(beginY + i * opt.tickWidth * Math.sin(rotate));
            }
            i > 0 && i--;
            this.options.ticks.forEach(function (tick, j) {
                left.push(beginX + (i + j) * opt.tickWidth * Math.cos(rotate));
                top.push(beginY - (i + j) * opt.tickWidth * Math.sin(rotate));
            });
            return {
                x:left,
                y:top
            }
        }
    }

    var Legend = function (series, options, paper) {
        var defaultOption = {
                position:['right', 'top'],
                format:'{name}',
                itemType:'rect'// circle
            }, i, l
            , data = series.getSeries()
            , width = 15 //item width
            , lineHeight = 20 // item line height
            , span = 10 //distance between item and text
            , border // rect element of border
            , startX = 0
            , startY = 0
            , item
            , text
            ,textWidth
            , totalWidth = []
            , totalHeight
            , itemSet // set of items
            , textSet // set of texts
            , margin = 10 // margin to svg boundary
            , padding = 10
        this.options = mix(defaultOption, options);
        itemSet = paper.set();
        textSet = paper.set();

        for (i = 0, l = data.length; i < l; i++) {
            switch (this.options.itemType) {
                case 'circle':
                    item = paper.circle(0, 0, width / 2).attr({
                        cx:startX + padding,
                        cy:startY + padding + i * lineHeight
                    });
                    break;
                case 'rect':
                    item = paper.rect(0, 0, width, width).attr({
                        x:startX + padding,
                        y:startY + padding + i * lineHeight
                    });
                    break;
            }
            item.attr({
                'fill':colors[i],
                'stroke-width':0,
                'cursor':'pointer'
            });
            text = paper.text(startX + width + span + padding, startY + padding + i * lineHeight + width / 2, data[i].data);
            textWidth = text.getBBox().width;
            text.translate(textWidth/2,0)
            itemSet.push(item);
            textSet.push(text)
            totalWidth.push(textWidth);
        }
        totalWidth = Math.max.apply(Math, totalWidth) + width + span + padding * 2;
        totalHeight = lineHeight * l + padding * 2;

        //border
        border = paper.rect(0, 0, totalWidth, totalHeight, 5).attr({
            'stroke-width':1,
            'stroke':'gray'
        });

        this.border = border;
        this.itemSet = itemSet;
        this.textSet = textSet;

        //transform to position
        var left , top;
        if (typeof (left = this.options.position[0]) == "string") {
            if (left == "right") {
                left = this.options._svgWidth - totalWidth - margin;
            } else if (left == "center") {
                left = this.options._svgWidth / 2 - totalWidth / 2
            } else {
                left = margin
            }
        }

        if (typeof (top = this.options.position[1]) == "string") {
            if (top == "bottom") {
                top = this.options._svgHeight - totalHeight - margin
            } else if (top == 'center') {
                top = this.options._svgHeight / 2 - totalHeight / 2
            } else {
                top = margin
            }
        }

        this.setPosition(left, top);


        //bind default click event
        this.on('click', function (e, i) {
            //console.log(e, i)
        });
    };
    Legend.prototype = {
        constructor:Legend,
        setPosition:function (left, top) {
            this.itemSet.translate(left, top);
            this.textSet.translate(left, top);
            this.border.translate(left, top);
        },
        on:function (name, fn) {
            var event
            if ((event = this.itemSet[name] ) && typeof event == "function") {
                this.itemSet.forEach(function (item, i) {
                    item[name](function (e) {
                        fn.call(item, e, i);
                    })
                })
            }
        }
    }

    var Grid = function (options, paper) {
        var defaultOption = {
                'color':'#ccc',
                'rows':[],
                'columns':[],
                'width':0,
                'height':0,
                'stroke-width':1,
                'opacity':0.2,
                _x:0, //y轴的x坐标
                _y:0  //x轴的y坐标
            },
            options = this.options = mix(defaultOption, options)

        if (options.rows.length) {
            options.rows.forEach(function (value) {
                paper.path('M' + options._x + "," + value + "h" + options.width).attr({
                    stroke:options.color,
                    "stroke-width":options['stroke-width'],
                    'opacity':options.opacity
                })
            })
        }
        if (options.columns.length) {
            options.columns.forEach(function (value) {
                paper.path('M' + value + "," + options._y + "v" + options.height)
            })
        }

    }


//add to global
    global.DPChart = DPChart;
    DPChart.mix = mix;

})(this);