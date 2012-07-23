function DPChart(container, data, options){
	var layer;
	this.options=options=options || {};
	this.stage=new Kinetic.Stage({
		container:container,
		width:options.width,
		height:options.height		
	});
	this.layer=new Kinetic.Layer();

	this._initData(data);

	this._initAxis();

	this.draw();
}

DPChart.prototype={
	constructor: DPChart,
	draw: function(){

		var width=this.options.width/this.series.length,
				barWidth=width*0.618,
				options;
		for(var i=0, len=this.series.length; i < len; i++){
			options={
					x:width/2+i*width,
					y:0,
					width:barWidth,
					height:this.series[i].height*this.options.height,
					fill:"#00D2FF"		
				};
			this.layer.add(new Kinetic.Rect(options));
		}
		
		this.stage.add(this.layer);
	},
	_initData:function(data){
		this.series=new Series(data).getSeries();						
	},
	_initAxis:function(){
	}
}

function Series(data){
	this.data=data;
}

Series.prototype={
	constructor: Series,
	getSeries: function(){
		var range=this.getRange(),
		span=range.max-range.min;
		return this.data.map(function(item){
			item.height=item[1]/range.max;
			return item;		
		});
	},
	getRange:function(){
		var _data=this.data.map(function(item){
					return item[1];
			}),
			min=Math.min.apply(Math, _data),
			max=Math.max.apply(Math, _data);

		return {
			min: min,
			max: max
		};
	}
}

function Axis(options){
	this.options=options;
}

Axis.prototype={
	constructor: Axis
}


