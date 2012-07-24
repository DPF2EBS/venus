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
                color:'#CCCCCC'
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
            var options = this.options;
            this.legend = new Legend(options, this.series, this.layer);
        },
        _initGrid:function () {
            var options = this.options;
            this.grid = new Grid(options, this.series, this.layer);
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

        //if get ticks, use ticks
        pathString += ("M" + beginX + " " + beginY);
        if (opt.ticks.length) {
            this.useTicks = true;
			// 画坐标轴
			var xAxis = new Kinetic.Line({
			          points: [beginX, beginY, opt.tickWidth * opt.ticks.length, beginY],
			          stroke: "#CCCCCC",
			          strokeWidth: 1,
			          lineCap: "round",
			          lineJoin: "round"
			        }),
			yAxis = new Kinetic.Line({
					   points: [beginX, beginY,beginX, beginY - opt.tickWidth * opt.ticks.length],
					   stroke: "#CCCCCC",
					   strokeWidth: 1,
					   lineCap: "round",
					   lineJoin: "round"
				 });
		   	layer.add(xAxis);
			layer.add(yAxis); 
            for (i = 0, l = opt.ticks.length; i < l; i++) {
                if(axis=="x"){
                    label=new Kinetic.Text({
                        x:beginX + (i + 1) * opt.tickWidth,
                        y:beginY + labelMarginTop * (opt.rotate > 0 ? -1 : 1),
                        text:opt.ticks[i] + "",
                        fontSize: 10,
                        textFill: "#000000",
				    	align:"center"
                    });
                    layer.add(label);  		
                } else {
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

    var Legend = function (options, series, layer) {
        var defaultOptions={};
		var legendOptions = options.legend,
			legendWidth = legendOptions.width,
			legendHeight = legendOptions.height,
			positions = legendOptions.position,
			positionTable = {
				'left-top' : { x: 0, y:0 },
				'right-top': { x: options.width - legendWidth, y: 0 },
				'right-bottom': { x: options.width - legendWidth, y: options.height - legendHeight }
			},
			itemType = {
				'rect': 'Rect',
				'circle': 'Circle'
			};
		var pos = {},
			legendBox;
		for(var pos in positionTable) {
			if(positions == pos) {
				pos = positionTable[pos];
				break;
			}
		}
	    // 可以画图了。
	   	legendBox = new Kinetic.Rect({
		          x: pos.x,
		          y: pos.y,
		          width: legendWidth - 2,
		          height: legendHeight - 2,
		          fill: "#EFEFEF",
		          stroke: "#CCCCCC",
		          strokeWidth: 1
		        });
	    layer.add(legendBox);
	 	// 根据具体的颜色来定义图例
		console.log(legendOptions.itemType);
		var showType; // 大写了。。。
		for(var type in itemType) {
			if(legendOptions.itemType == type) {
				showType = itemType[type];
				break;
			}
		}
		var seriesLen = series.series.length,
			labelTexts = [];
		var colors=["red","blue","green","orange"];
	   	for(var ii = 0; ii < seriesLen; ii++) {
			labelTexts.push(series.series[ii].label);
		}
		console.log(labelTexts); // ["FF", "IE", "Chrome", "Ohter"] 
		var lineHeight =  Math.ceil(legendHeight/seriesLen);
		for(var jj = 0; jj < seriesLen; jj++){
			 var  itype =  new Kinetic[showType]({
				          x: pos.x + 5,
				          y: pos.y + jj * lineHeight,
				          width: legendWidth/2,
				          height: lineHeight - 10,
				          fill: colors[jj],
				          stroke: "#FF0000",
				          strokeWidth: 1
				        }),
				itext = new Kinetic.Text({
					 x: pos.x + legendWidth/2 + 10,
					 y: pos.y + (jj-1) * lineHeight + lineHeight + 5,
					 text: labelTexts[jj],
					 fontSize: 16,
					 fontFamily: "Arial",
					 textFill: "green"
				});
				layer.add(itype); 
				layer.add(itext);
		}
    };
	// not good
    var Grid = function (options, series, layer) {
        var beginX = this.beginX = 100,
        	beginY = this.beginY = 700,
			xAxises = options.axis.x,
			yAxises =  options.axis.y;
			if(yAxises.enable) {
			   var yTickWidth = yAxises.tickWidth,
				   yTickLength =  yAxises.ticks.length;
			   for(var kk = 1; kk <= yTickLength; kk++) {
	  			  var xAxis = new Kinetic.Line({
				          points: [beginX, beginY - yTickWidth * kk, yAxises.tickWidth * yAxises.ticks.length, beginY - yTickWidth * kk],
				          stroke: options.grid.color,
				          strokeWidth: 1,
				          lineCap: "round",
				          lineJoin: "round"
				    });
				 	layer.add(xAxis);
			   } 
			}
		
    }


//add to global
    global.DPChart = DPChart;

})(this);
