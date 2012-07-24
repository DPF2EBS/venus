/*
 * SVG Chart Lib of Venus
 * */

(function (global, undefined) {
    /*
     * Class DPChart
     * @param container{HTMLElement} container of the svg element to draw the chart
     * @param data{Array} Array of the data
     * @param options{object}
     * {
     width:
     height:
     axis:{
     ‘x’:{
     enable:true
     max:
     min:
     tickSize:
     ticks:[],
     minorTickNum: // 一个tick中有几个minor tick ，<0 就没有
     rotate:逆时针旋转的角度，0为水平向右，没有radius就按0点 ，有radius就按圆心
     radius:弯曲半径

     },
     ‘y’:{}

     },
     legend:{
     position：[left,top],
     format:”{name}-{percent.2f}%”
     itemType:’rect’ // circle
     },
     grid:{
     ‘color’:’’
     },
     events:{
     }
     }
     * */

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
        , indexOf = function (array, value) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
            return -1;
        }
        , PI = Math.PI
        , charts = {} // charts added by using DPChart.addChart

    function DPChart(container, data, options) {
        if (!container || !container.nodeType) {
            return;
        }
        this.container = container;
        this.data = data || [];
        this.events = new CustomEvent();
        var defaultOptions = {
            width:container.clientWidth,
            height:container.clientHeight,
            axis:{
            },
            legend:{
                position:[0, 0],
                format:"",
                itemType:'rect'
            },
            grid:{
                color:''
            }
        };
        this.options = mix(defaultOptions, options || {});
	    this.stage=new Kinetic.Stage({
	    	container:container,
	      	width:this.options.width,
	    	height:this.options.height		
    	});

        this.layer=new Kinetic.Layer();

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
            var axisOption = this.options.axis,
                axises = {};
            for (var axis in axisOption) {
                if (axisOption[axis]) {
                    axises[axis] = new Axis(axis, axisOption[axis], this.series, this.layer);
                }
            }
            this.axises = axises;
        },
        _initLegend:function () {
            var legendOption = this.options.legend;
            this.legend = new Legend(legendOptio, this.series);
        },
        _initGrid:function () {
            var gridOption = this.options.grid;
            this.grid = new Grid(gridOption);
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
            this.stage.add(this.layer);
        },
        update:function () {

        }
    };
    DPChart.addChart = function (name, methods) {
        charts[name] = methods;
    }


    /*DPChart End*/


    var Series = function (data) {
        var max = 0, min = 0, i , l
            , series

        series = this.series = data;

        for (i = 0, l = series.length; i < l; i++) {
            series[i] > max && (max = series[i]);
            series[i] < min && (min = series[i]);
        }

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
        }
    }


    var Axis = function (axis, options, series, layer) {
        var defaultOptions = {
                max:0,
                min:0,
                tickSize:1,
                tickWidth:30,
                ticks:[],
                minorTickNum:0, // 一个tick中有几个minor tick ，<0 就没有
                rotate:0, //逆时针旋转的角度，0为水平向右，没有radius就按0点 ，有radius就按圆心
                radius:0 //弯曲半径
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
            ,label;

        //hard code beginX,beginY ,TODO
        beginX = this.beginX = 100;
        beginY = this.beginY = 700;
        this.series = series;

        console.log(axis);

        //if get ticks, use ticks
        pathString += ("M" + beginX + " " + beginY);
        if (opt.ticks.length) {
            this.useTicks = true;
            for (i = 0, l = opt.ticks.length; i < l; i++) {
                if(axis=="x"){
                    label=new Kinetic.Text({
                        x:beginX + (i + 1) * opt.tickWidth,
                        y:beginY + labelMarginTop * (opt.rotate > 0 ? -1 : 1),
                        text:opt.ticks[i]+"",
                        fontSize: 10,
                        textFill: "#000000",
				    	align:"center"
                    });
                    layer.add(label);
                }else{
                    label=new Kinetic.Text({
                        x:beginX + labelMarginTop * (opt.rotate > 0 ? -1 : 1),
                        y:beginY - (i + 1) * opt.tickWidth,
                        text:opt.ticks[i]+"",
                        fontSize: 10,
                        textFill: "#000000",
				    	align:"right"
                    });
                    layer.add(label);
                }
            }
        }
    };
    Axis.prototype = {
        constructor:Axis,
        getX:function (index) {
            //return the x in svg coordinate
            var opt = this.options

            if (this.useTicks) {
                return Math.cos(opt.rotate / 360 * 2 * PI) * (index + 1) * opt.tickWidth + this.beginX;
            } else {

            }
        },
        getY:function (index) {
            //return the y in svg coordinate
            var opt = this.options

            if (this.useTicks) {
                return this.beginY - Math.sin(opt.rotate / 360 * 2 * PI) * this.series.getSeries()[index].data * opt.tickWidth / opt.tickSize;
            } else {

            }
        },
        getOrigin:function () {
            return {
                x:this.beginX,
                y:this.beginY
            }
        },
        getAngel:function () {
        }
    }

    var Legend = function (options, series) {
        var defaultOptions={};

        
    };
    var Grid = function (options) {

    }


//add to global
    global.DPChart = DPChart;

})(this);
