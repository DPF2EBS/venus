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
			colors:[],
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
        this.raphael = new Raphael(container, this.options.width, this.options.height);

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
                    axises[axis] = new Axis(axisOption[axis], this.series, this.raphael);
                }
            }
            this.axises = axises;
        },
        _initLegend:function () {
            var legendOption = this.options.legend;
            this.legend = new Legend(legendOption);
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
        },
        update:function () {

        }
    };
    DPChart.addChart = function (name, methods) {
        charts[name] = methods;
    }
	
	
	var _hsv2rgb=function(h, s, v) {
		var hi,f,p,q,t,result = [];		
		hi = Math.floor(h / 60) % 6;		
		f=hi%2? h/60-hi : 1-(h/60-hi);
		p=v*(1-s);
		q=v*(1-f*s);
		
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
		
		for(var j=0,L=result.length;j<L;j++){
			result[j]=Math.floor(result[j]*255);
		}
		
		return result;
	}
	
	/**
	* get a group of chart colors
	* @param {Integer} colorCount How many colors needed.(waiting...)
	* @example DPChart.getColors(6);
	* @return a group of colors in type of rgb().
	* @type {Array}
	*/
	DPChart.getColors = function () {
		var hues = [0.6, 0.2, 0.05, 0.1333, 0.75, 0],colors = [];
		
		for (var i = 0; i < 10; i++) {
			if (i < hues.length) {
				colors.push('rgb('+_hsv2rgb(hues[i]*360,0.75,0.75).join(',')+')');
			} else {
				colors.push('rgb('+_hsv2rgb(hues[i - hues.length]*360,1,0.5).join(',')+')');
			}
		}
		
		return colors;
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


    var Axis = function (options, series, paper) {
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

        //hard code beginX,beginY ,TODO
        beginX = this.beginX = 100;
        beginY = this.beginY = 700;
        this.series = series;

        //if get ticks, use ticks
        pathString += ("M" + beginX + " " + beginY);
        if (opt.ticks.length) {
            this.useTicks = true;
            for (i = 0, l = opt.ticks.length; i < l; i++) {
                //horizontal draw the axis and later rotate it
                pathString += ("h" + opt.tickWidth + "v" + tickHeight + "v" + -tickHeight);
                labelElements[i] = paper.text((beginX + (i + 1) * opt.tickWidth), beginY + labelMarginTop * (opt.rotate > 0 ? -1 : 1), opt.ticks[i]).rotate(rotate, beginX, beginY);
            }
        }
        axisElement = this.axisElement = paper.path(pathString);

        //rotate
        axisElement.rotate(rotate, beginX, beginY);

        //TODO compute 1 -1
        opt.rotate > 0 && axisElement.scale(1, -1, beginX, beginY)


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

    var Legend = function () {

    };
    var Grid = function (options) {

    }


//add to global
    global.DPChart = DPChart;

})(this);