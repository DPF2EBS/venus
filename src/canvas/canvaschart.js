///////////////////////////////////////////////////////////////////////
//  SimpleText
///////////////////////////////////////////////////////////////////////
/**
 * SimpleText constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.SimpleText = Kinetic.Shape.extend({
    init: function (config) {
        this.setDefaultAttrs({
            text: "",
            font: "12",
            textAlign: "left",
            textBaseline: "top"
        });

        this.shapeType = "SimpleText";

        config.drawFunc = function (context) {
            var text = this.attrs.text;
            context.save();
            context.font = this.attrs.font,
            context.textAlign = this.attrs.textAlign;
            context.textBaseline = this.attrs.textBaseline;
            this.fillText(context, text);
            this.stroke(context, text);
            context.restore();
        };
        // call super constructor
        this._super(config);
    }
});

/*
 * Canvas Chart Lib of Venus
 */
;
(function (global, undefined) {

    var V = global.Venus,
		util = V.util;
    //todo del
    var mix = util.mix,
        PI = Math.PI,
        charts = {}; // charts added by using DPChart.addChart

    /*
     * Class DPChart
     * @param container{HTMLElement} container for Kinetic
     * @param data{Array} Array of the data to draw
     * @param options{object}
     */
    function DPChart(container, data, options) {
        if (!container || !container.nodeType) {
            return;
        }

        var defaultOptions = {
            width: container.clientWidth,
            height: container.clientHeight,
            margin: 10
        };

        this.container = container;
        this.data = data || [];
        this.events = new DPChart.CustomEvent();

        this.options = mix(defaultOptions, options || {});

        //initCanvas
        this._initCanvas();
        this.fire('onCanvasInit', this.stage, this.layer);
        //init data
        this._initData();
        this.fire('onDataInit', this.series);

        // init axis
        this._initAxis();
        this.fire('onAxisInit', {});

        //init legend
        this._initLegend();
        this.fire('onLegendInit', this.legend);

        //init grid
        this._initGrid();
        this.fire('onGridInit', this.grid);

        // draw
        this.draw();

        //init events
        this._initEvents();

        this.events.fire('onFinish');

    }

    //see src/common/commm.js
    mix(DPChart, util);

    DPChart.prototype = {

        constructor: DPChart,

        _initCanvas: function () {
            this.stage = new Kinetic.Stage({
                container: this.container,
                width: this.options.width,
                height: this.options.height
            });
            this.layer = new Kinetic.Layer();
        },
        _initData: function () {
            this.series = new Series(this.data);
        },
        //init asix
        _initAxis: function () {
            var opt = this.options,
                axisOption = opt.axis,
                axises = {},
                axis,
                thisAxisOption,
                range,
                beginX,
                beginY;

            if (typeof axisOption == "undefined") {
                return;
            }
            for (var axis in axisOption) {
                if ((thisAxisOption = axisOption[axis])) {

                    thisAxisOption.axisType = axis;

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
                        if (!thisAxisOption.ticks) {
                            thisAxisOption.ticks = this.series.getLabels();
                        }
                    }

                    thisAxisOption.canvasWidth = this.options.width;
                    thisAxisOption.canvasHeight = this.options.height;
                    thisAxisOption.margin = this.options.margin;

                    axises[axis] = new Axis(this.options, thisAxisOption, this.series, this.layer);
                }
            }
            this.axises = axises;
        },
        _initLegend: function () {
            var options = this.options;
            if (options.legend) {
                //TODO maybe delete this.series
                this.legend = new Legend(options, this.series, this.layer);
            }
        },
        _initGrid: function () {
            var options = this.options;
            if (options.grid) {
                this.grid = new Grid(options, this.layer);
            }
        },
        _initEvents: function () {

        },
        draw: function () {
            for (var chart in charts) {
                if (this.options[chart]) {
                    //draw that chart
                    charts[chart].draw && charts[chart].draw.call(this);
                }
            }
            this.stage.add(this.layer);
            this.percentLayer && this.stage.add(this.percentLayer);
        },
        update: function () {

        },
        //event
        fire: function () {
            this.events.fire.apply(this.events, arguments);
        },
        on: function () {
            this.events.on.apply(this.events, arguments);
        }
    };

    /*
     * add graph type in types
     * @params  name{String} graph name
     * @params  graphType{Object} graphType
     */
    DPChart.addChart = function (name, graphType) {
        charts[name] = graphType;
    }
    /*DPChart End*/

    /*
     *Series Class Start
     * data format
     * @params data
     * example
     * [1,2,3,4,5,6,7]
     * [[1,3],[2,3],[3,3],[4,2]]
     * [{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}]
     * {chrome:20,ie:45,ff:70}
     * =====================>
     * [{data:1},{data:2}..........]
     * [{data:3,label:1}.......]
     * [{data:50,label:"chrome"}.......]
     * [{data:12,label:'chrome'........}]
     * [{data:20,label:"ie"},{data:45,label:"ie"}........]
     */
    var Series = function (data) {
        this.data = data;
        this.__prepareData();
    };

    Series.prototype = {

        constructor: Series,

        __prepareData: function () {
            var series = this.series = [],
                tempArr,
                data = this.data,
                colors;

            if (DPChart.isArray(data)) {
                data.forEach(function (item) {
                    if (DPChart.isArray(item)) {
                        //[[1,3],[2,3],[3,3],[4,2]]
                        series.push({
                            name: item[0],
                            data: item[1]
                        });
                    } else if (DPChart.isObject(item)) {
                        //[{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}]
                        series.push({
                            name: (typeof item.name === "undefined" ? item.label : item.name),
                            data: item.data
                        });
                    } else {
                        //[1,2,3,4,5,6,7]
                        series.push({
                            data: item
                        });

                        //nolabel for getLabels method
                        this.__nolabel = true;
                    }
                });
            } else if (DPChart.isObject(data)) {
                Object.keys(data).forEach(function (key) {
                    //{chrome:20,ie:45,ff:70}
                    series.push({
                        name: key,
                        data: data[key]
                    });
                });
            } else {
                //do nothing
            }

            colors = DPChart.getColors(series.length);

            series.forEach(function (item, index) {
                item.color = colors[index];
            });

            tempArr = series.map(function (item) {
                return item.data;
            });

            this._range = {
                min: Math.min.apply(Math, tempArr),
                max: Math.max.apply(Math, tempArr)
            };

        },
        getRange: function () {
            return this._range;
        },
        getSeries: function () {
            return this.series;
        },
        getLabels: function () {
            if ( !! this.__nolabel) {
                return;
            } else {
                return this.series.forEach(function (item) {
                    return item.name;
                });
            }
        }
    }

    var Axis = function (globalOptions, options, series, layer) {
        var defaultOptions = {
            axisType: "x",
            max: 0,
            min: 0,
            tickSize: 1,
            tickWidth: 30,
            ticks: []
        },
        axisElement,
        labelElements = [],
            opt = this.options = mix(defaultOptions, options),
            i, l,
            label;
        if (opt.axisType == "x") {
            opt.beginX = opt.margin;
            opt.beginY = opt.canvasHeight - opt.margin;
            opt.endX = opt.canvasWidth - opt.margin;
            opt.endY = opt.margin;
            opt.length = opt.canvasWidth - 2 * opt.margin;
            opt.scaleSize = opt.length / (opt.ticks[opt.ticks.length - 1] - opt.ticks[0]);
            opt.tickWidth = opt.length / opt.ticks.length;
        } else if (opt.axisType == "y") {
            opt.beginX = opt.margin;
            opt.beginY = opt.canvasHeight - opt.margin;
            opt.endX = opt.margin;
            opt.endY = opt.margin;
            opt.length = opt.canvasHeight - 2 * opt.margin;
            opt.scaleSize = opt.length / (opt.ticks[opt.ticks.length - 1] - opt.ticks[0]);
            opt.tickWidth = opt.length / (opt.ticks.length - 1);
        }
        globalOptions = mix(globalOptions, {
            originX: opt.beginX,
            originY: opt.beginY
        });
        //如果是X轴的话 画X轴
        if (opt.axisType == "x") {
            globalOptions.axis.x = mix(globalOptions.axis.x, opt);
            layer.add(new Kinetic.Line({
                points: [opt.beginX, opt.beginY, opt.endX, opt.beginY],
                stroke: "red",
                strokeWidth: 1,
                lineCap: "round",
                lineJoin: "round"
            }));
            for (i = 0, l = opt.ticks.length; i < l; i++) {
                label = new Kinetic.SimpleText({
                    x: opt.beginX + (i + .5) * opt.tickWidth,
                    y: opt.beginY + 5,
                    text: opt.ticks[i] + "",
                    textFill: "#000000",
                    textAlign: "center"
                });
                layer.add(label);
            }
            //画Y轴
        } else if (opt.axisType == "y") {
            globalOptions.axis.y = mix(globalOptions.axis.y, opt);
            layer.add(new Kinetic.Line({
                points: [opt.beginX, opt.beginY, opt.beginX, opt.endY],
                stroke: "red",
                strokeWidth: 1,
                lineCap: "round",
                lineJoin: "round"
            }));
            for (i = 0, l = opt.ticks.length; i < l; i++) {
                label = new Kinetic.SimpleText({
                    x: opt.beginX - 10,
                    y: opt.beginY - i * opt.tickWidth,
                    text: opt.ticks[i] + "",
                    textFill: "#000000",
                    textBaseline: "middle",
                    textAlign: "right"
                });
                layer.add(label);
            }
        }
    };
    Axis.prototype = {
        constructor: Axis,
        getX: function (index) {
            //return the x in svg coordinate
            var opt = this.options;

            return opt.beginX + (index + .5) * opt.tickWidth;
        },
        getY: function (data) {
            //return the y in svg coordinate
            var opt = this.options;

            return data * opt.scaleSize;
        },
        getOrigin: function () {
            return {
                x: this.beginX,
                y: this.beginY
            }
        }
    }
    /*
     *@Todo: add Legend to the chart
     */
    var Legend = function (options, series, layer) {
        var defaultOptions = {
            legendWrap: {
                fillColor: '#EFEFEF',
                strokeColor: '#CCCCCC',
                strokeWidth: '1'
            },
            itemType: 'rect',
            position: ["right", "top"],
            width: '80',
            height: '100'
        };
        options.legend = mix(defaultOptions, options.legend);

        var colors = [ "skyblue","orangered", "yellow", "orange", "violet", "fuchsia", "yellowgreen", "khaki"];

        var legendOptions = options.legend,
            legendWidth = legendOptions.width,
            legendHeight = legendOptions.height,
            positions = legendOptions.position,
            pos,
            positionTable = {
                'left-top': {
                    x: 0,
                    y: 0
                },
                'right-top': {
                    x: options.width - legendWidth,
                    y: 0
                },
                'right-bottom': {
                    x: options.width - legendWidth,
                    y: options.height - legendHeight
                }
            },
            itemType = {
                'rect': 'Rect',
                'circle': 'Circle'
            };
        if(DPChart.isNumber(positions[0])){
            pos = {
                x:positions[0],
                y:positions[1]
            }
        }else{
            positions = positions.join("-");
            for (pos in positionTable) {
                if (positions == pos) {
                    pos = positionTable[pos];
                    break;
                }
            }
                
        }
        var showType;
        for (var type in itemType) {
            if (legendOptions.itemType == type) {
                showType = itemType[type];
                break;
            }
        }
        var seriesLen = series.series.length,
            labelTexts = [],
            lineHeight = Math.ceil(legendHeight / seriesLen);

            series.series = series.series.sort(function(a,b){return b.data - a.data});
        for (var ii = 0; ii < seriesLen; ii++) {
            labelTexts.push(series.series[ii].name);
        }
        for (var jj = 0; jj < seriesLen; jj++) {
            var itype;
            if (showType == "Circle") {
                itype = new Kinetic[showType]({
                    x: pos.x + 5,
                    y: pos.y + jj * lineHeight + 12,
                    radius: 8,
                    fill: colors[jj]
                })
            } else if (showType == "Rect") {
                itype = new Kinetic[showType]({
                    x: pos.x + 5,
                    y: pos.y + jj * lineHeight+5,
                    width: 10,
                    height: 10,
                    fill: colors[jj]
                })
            }
            var itext = new Kinetic.Text({
                x: pos.x + 12 + 5 + 5,
                y: pos.y + (jj - 1) * lineHeight + lineHeight + 5,
                text: labelTexts[jj] + "",
                fontSize: 10,
                fontFamily: "Curier",
                textFill: "#000"
            });
            layer.add(itype);
            layer.add(itext);
        }
    };
    // Grid Function to achive Grid
    var Grid = function (options, layer) {

        var defaultOption = {
            'color': '#CCCCCC',
            'columns': [],
            'strokeWidth': 1,
            'opacity': 0.4,
            'lineCap': 'round'
        };
        options.grid = mix(defaultOption, options.grid); // mix user's options to default options

        var beginX = this.beginX = options.originX,
            beginY = this.beginY = options.originY,
            xAxises = options.axis.x,
            yAxises = options.axis.y,
            enableXGrid = options.grid.enableXGrid,
            enableYGrid = options.grid.enableYGrid;

        var yTickWidth = yAxises.tickWidth,
            yTickLength = yAxises.ticks.length,
            xTickWidth = xAxises.tickWidth,
            xTickLength = xAxises.ticks.length;
        if (enableXGrid) {
            for (var kk = 1; kk < yTickLength; kk++) {
                var yAxis = new Kinetic.Line({
                    points: [beginX, beginY - yTickWidth * kk, xTickWidth * (xTickLength + 1), beginY - yTickWidth * kk],
                    stroke: options.grid.color,
                    strokeWidth: options.grid.strokeWidth,
                    lineCap: options.grid.lineCap,
                    alpha: options.grid.opacity
                });
                layer.add(yAxis);
            }
        }
        if (enableYGrid) {
            for (var k = 1; k <= xTickLength; k++) {
                var xAxis = new Kinetic.Line({
                    points: [beginX + xTickWidth * k, beginY, beginX + xTickWidth * k, beginY - yTickWidth * (yTickLength - 1)],
                    stroke: options.grid.color,
                    strokeWidth: options.grid.strokeWidth,
                    lineCap: options.grid.lineCap,
                    alpha: options.grid.opacity
                });
                layer.add(xAxis);
            }
        }
    }
        var tooltipslayer = null;
        function tooltips(x, y, texts, side) {
            if(tooltipslayer == null) {
                tooltipslayer = new Kinetic.Layer();
            } else {
                tooltipslayer.clear();
            }
            (side == undefined) && (side = 'top');

            (side == 'top') && (y = y - 10);

            (side == 'left') && (x = x - 10);

            (side == 'right') && (x = x + 10);

            (side == 'bottom') && (y = y + 10);

            var path = function (width, height, padding) {
                var p = ['M', x, y],
                    arrowWidth = 5,
                    left, top

                    height += (2 * padding || 0);
                width += (2 * padding || 0);
                switch (side) {
                case 'right':
                    //arrow at the left side and content at right
                    height = Math.max(arrowWidth * 2, height);
                    p.push('l', arrowWidth, - arrowWidth);
                    p.push('v', - (height / 2 - arrowWidth));
                    p.push('h', width);
                    p.push('v', height, 'h', - width);
                    p.push('v', - (height / 2 - arrowWidth));
                    p.push('l', - arrowWidth, - arrowWidth);
                    left = x + arrowWidth;
                    top = y - height / 2;
                    break;
                case 'top':
                    width = Math.max(arrowWidth * 2, width);
                    p.push('l', - arrowWidth, - arrowWidth);
                    p.push('h', - (width / 2 - arrowWidth));
                    p.push('v', - height, 'h', width, 'v', height);
                    p.push('h', - (width / 2 - arrowWidth));
                    p.push('l', - arrowWidth, arrowWidth);
                    left = x - width / 2;
                    top = y - arrowWidth - height;
                    break;
                case 'left':
                    height = Math.max(arrowWidth * 2, height);
                    p.push('l', - arrowWidth, arrowWidth);
                    p.push('v', height / 2 - arrowWidth);
                    p.push('h', - width, 'v', - height, 'h', width);
                    p.push('v', height / 2 - arrowWidth);
                    p.push('l', arrowWidth, arrowWidth);
                    left = x - arrowWidth - width;
                    top = y - height / 2;
                    break;
                case 'bottom':
                    width = Math.max(arrowWidth * 2, width);
                    p.push('l', arrowWidth, arrowWidth);
                    p.push('h', width / 2 - arrowWidth);
                    p.push('v', height, 'h', - width, 'v', - height);
                    p.push('h', width / 2 - arrowWidth);
                    p.push('l', arrowWidth, - arrowWidth);
                    left = x - width / 2;
                    top = y + arrowWidth;
                    break;

                }
                p.push('z')
                return {
                    path: p,
                    box: {
                        left: left,
                        top: top,
                        width: width,
                        height: height
                    }
                };
            };
            var preWord = new Kinetic.Text({
                x: x,
                y: -200,
                fontSize: 12,
                text: '' + texts
            }),
                wd = preWord.getTextWidth(),
                hd = preWord.getTextHeight();


            var pathObj = path(wd, hd, 10),
                pathString = pathObj.path,
                boxInfo = pathObj.box;

            pathString = pathString.join(',');

            if (texts) {
                var tipWord = new Kinetic.Text({
                    x: boxInfo.left + 10,
                    y: boxInfo.top + 10,
                    text: '' + texts,
                    align: 'center',
                    fontSize: 12,
                    textFill: "#FF7018"
                });
            }
            var path = new Kinetic.Path({
                data: pathString,
                stroke: '#EFEFEF',
                scale: 1,
                fill: '#FFFFFF',
                draggable: true,
                shadow: {
                    color: "#000",
                    blur: 5,
                    alpha: 0.4,
                    offset: [2, 2]
                }
            });

            tooltipslayer.removeChildren();

            tooltipslayer.add(path);

            tooltipslayer.add(tipWord);

            return tooltipslayer;

        }

        function toolTipHide(newLayer) {
            newLayer.clear();
        }
    
	
	
	DPChart.tooltips = tooltips;
	
	DPChart.toolTipHide =  toolTipHide;
	
	V.CanvasChart = DPChart;
	
})(this);
