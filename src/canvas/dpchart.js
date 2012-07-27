/*
 * Canvas Chart Lib of Venus
 */

(function (global, undefined) {

    var _DPChart = global.DPChart;

    //todo del
    var mix = _DPChart.mix,
        indexOf = function (array, value) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
            return -1;
        },
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
            width:container.clientWidth,
            height:container.clientHeight,
            axis:{
            }
        };
        this.container = container;
        this.data = data || [];
        this.events = new CustomEvent();

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

        this._findDataRange();
        this._calculateSpacing();

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
    mix(DPChart, _DPChart);


    mix(DPChart, {
        //cut from flotr
        getTickSize: function(noTicks, min, max, decimals){
            var delta = (max - min) / noTicks,
                magn = DPChart.getMagnitude(delta),
                tickSize = 10,
                norm = delta / magn; // Norm is between 1.0 and 10.0.
                
            if(norm < 1.5) tickSize = 1;
            else if(norm < 2.25) tickSize = 2;
            else if(norm < 3) tickSize = ((decimals === 0) ? 2 : 2.5);
            else if(norm < 7.5) tickSize = 5;
            
            return tickSize * magn;
        },
        /**
        * Returns the magnitude of the input value.
        * @param {Integer, Float} x - integer or float value
        * @return {Integer, Float} returns the magnitude of the input value
        */
        getMagnitude: function(x){
            return Math.pow(10, Math.floor(Math.log(x) / Math.LN10));
        },

        isInteger: function(number){
            return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
        }
    });
    
    DPChart.prototype = {
        
        constructor:DPChart,

        _initCanvas: function(){
            this.stage=new Kinetic.Stage({
                container:container,
                width:this.options.width,
                height:this.options.height      
            });
            this.layer=new Kinetic.Layer();
        },
        _initData:function () {
            this.series = new Series(this.data);
        },
        _findDataRange: function(){
        },
        _calculateSpacing: function(){
        }, 

        //init asix
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
            if(options.legend){
                //TODO maybe delete this.series
                this.legend = new Legend(options, this.series, this.layer);
            }
        },
        _initGrid:function () {
            var options = this.options;
            if(options.grid){
                this.grid = new Grid(options, this.layer);
            }
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

        },
        //event
        fire: function(){
            this.events.fire.apply(this.events, arguments);
        },
        on: function(){
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

        constructor:Series,

        __prepareData: function(){
            var series = this.series = [],
                tempArr,
                data = this.data;

            if(DPChart.isArray(data)){
                data.forEach(function(item){
                    if(DPChart.isArray(item)){
                        //[[1,3],[2,3],[3,3],[4,2]]
                        series.push({
                            label:item[0],
                            data:item[1]
                        });
                    }else if(DPChart.isObject(item)){
                        //[{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}]
                        series.push({
                            label:(typeof item.name === "undefined" ? item.label : item.name),
                            data:item.data
                        });
                    }else{
                        //[1,2,3,4,5,6,7]
                        series.push({
                            data:item
                        });

                        //nolabel for getLabels method
                        this.__nolabel=true;
                    }
                });
            }else if(DPChart.isObject(obj)){
                Object.keys(obj).forEach(function(key){
                    //{chrome:20,ie:45,ff:70}
                    series.push({
                        label:key,
                        data:obj[key]
                    });
                });
            }else{
                //do nothing
            }

            tempArr=series.map(function(item){
                return item.data;
            });

            this._range={
                min: Math.min.apply(Math, tempArr),
                max: Math.max.apply(Math, tempArr)
            };

        },
        getRange:function () {
            return this._range;
        },
        getSeries:function () {
            return this.series;
        },
        getLabels:function(){
            if(!!this.__nolabel){
                return;
            }else{
                return this.series.forEach(function(item){
                    return item.label;
                });
            }
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
        }
    }
    /*
    *@Todo: add Legend to the chart
    */
    var Legend = function (options, series, layer) {
        var defaultOptions={
            legendWrap: {
                fillColor: '#EFEFEF',
                strokeColor: '#CCCCCC',
                strokeWidth: '1'
            },
            itemType: 'Rect',
            position: 'right-bottom',
            width: '120',
            height: '100'
        };
        options.legend = mix(defaultOptions, options.legend);

		var legendOptions = options.legend,
			legendWidth = legendOptions.width,
			legendHeight = legendOptions.height,
			positions = legendOptions.position,
            pos,
			positionTable = {
				'left-top' : { x: 0, y:0 },
				'right-top': { x: options.width - legendWidth, y: 0 },
				'right-bottom': { x: options.width - legendWidth, y: options.height - legendHeight }
			},
			itemType = {
				'rect': 'Rect',
				'circle': 'Circle'
			};
		for(pos in positionTable) {
			if(positions == pos) {
				pos = positionTable[pos];
				break;
			}
		}
        layer.add(new Kinetic.Rect({
            x: pos.x,
            y: pos.y,
            width: legendWidth - 2,
            height: legendHeight - 2,
            fill: options.legend.legendWrap.fillColor,
            stroke: options.legend.legendWrap.strokeColor,
            strokeWidth: options.legend.legendWrap.strokeWidth
        }));
		var showType;
		for(var type in itemType) {
			if(legendOptions.itemType == type) {
				showType = itemType[type];
				break;
			}
		}
        
		var seriesLen = series.series.length,
			labelTexts = [],
            lineHeight =  Math.ceil(legendHeight/seriesLen);
		var colors=["red","blue","green","orange", "yellow"];
	   	for(var ii = 0; ii < seriesLen; ii++) {
			labelTexts.push(series.series[ii].label);
		}
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
					 text: labelTexts[jj]+"",
					 fontSize: 16,
					 fontFamily: "Arial",
					 textFill: "green"
				});
				layer.add(itype); 
				layer.add(itext);
		}
    };
	// Grid Function to achive Grid
    var Grid = function (options, layer) {
	
		var defaultOption = {
            'color':'#666666',
            'columns': [],
            'strokeWidth': 1,
            'opacity': 0.4,
			'lineCap': 'round'
        };
		options.grid = mix(defaultOption, options.grid);  // mix user's options to default options
	     
        var beginX = this.beginX = 100,
        	beginY = this.beginY = 700,
			xAxises = options.axis.x,
			yAxises = options.axis.y,
			enableXGrid = options.grid.enableXGrid,
			enableYGrid =  options.grid.enableYGrid;

			if(enableXGrid) {
                var yTickWidth = yAxises.tickWidth,
				    yTickLength =  yAxises.ticks.length;

			   for(var kk = 1; kk <= yTickLength; kk++) {
	  			  var yAxis = new Kinetic.Line({
				          points: [beginX, beginY - yTickWidth * kk, yAxises.tickWidth * yAxises.ticks.length, beginY - yTickWidth * kk],
				          stroke: options.grid.color,
				          strokeWidth: options.grid.strokeWidth,
				          lineCap: options.grid.lineCap,
						  alpha: options.grid.opacity
				    });
				 	layer.add(yAxis);
			   } 
			}
			if(enableYGrid) {
			   var xTickWidth = xAxises.tickWidth,
			   	   xTickLength = xAxises.ticks.length;
				for(var kk = 1; kk <= xTickLength; kk++) {
		  			  var xAxis = new Kinetic.Line({
					          points: [beginX + xTickWidth * kk, beginY, beginX + xTickWidth * kk, beginY - yTickWidth * yTickLength],
					          stroke: options.grid.color,
					          strokeWidth: options.grid.strokeWidth,
					          lineCap: options.grid.lineCap,
							  alpha: options.grid.opacity
					    });
				 		layer.add(xAxis);
			   }
			}
    }
    global.DPChart = DPChart;

    //for test
    global.Series = Series;

})(this);
