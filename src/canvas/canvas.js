/*
 * class DPChart
 */
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

	this._initLegend();

	this.draw();
}

/*
 * static attr & method
 */
DPChart.graphTypes={};
/*
 * add graphType
 */
DPChart.addType = function(name,graphType){
	this.graphTypes[name]=graphType;
}

/*
 * add bars
 */
DPChart.addType("bars", {
	draw: function(layer, series, options){
		var width=options.width/series.length,
				barWidth=width*0.98,
				_options;
		for(var i=0, len=series.length; i < len; i++){
			_options={
					x:width/2+i*width,
					y:(options.height-20)*(1 -series[i].height) ,
					width:barWidth,
					height:series[i].height*(options.height-20),
					fill:"#00D2FF"		
				};
			layer.add(new Kinetic.Rect(_options));
		}	
	}		
});

DPChart.prototype={
	constructor: DPChart,
	draw: function(){
		/*
		 * graphType match
		 */
		var graphType;
		for(graphType in DPChart.graphTypes){
			if(this.options[graphType]){
				break;
			}
		}
		DPChart.graphTypes[graphType].draw(this.layer,this.series.getSeries(), this.options);
		this.stage.add(this.layer);
	},
	_initLegend:function(){},
	_initData:function(data){
		this.series=new Series(data);						
	},
	_initAxis:function(){
		var xobj = this.options.axis.x,
				yobj = this.options.axis.y;
		if(xobj['enable']) {
			var linex = new Kinetic.Line({
					points: [14, this.options.height - 20,this.options.width, this.options.height - 20 ],
          stroke: "#000000",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round"
        });
			this.layer.add(linex);		
		}
		// text x
		var textx,
				texty,
				maxval = Math.ceil(this.series.getRange().max);
		for(texty = 1; texty <= maxval; texty += 1) {
			var texts = new Kinetic.Text({
          x: 0,
          y: this.options.height - 25 * (texty + 1),
          text: '' + texty,
          fontSize: 10,
          textFill: "#000000",
					align:"center"
        });
			var hrs = new Kinetic.Rect({
          x: 11,
          y: this.options.height - 25 * (texty + 1) ,
          width: 1,
          height: 1,
          stroke: "#000000"
        });
				this.layer.add(hrs);
				this.layer.add(texts);			
		}
		var labels = this.series.getLabels();
				len = labels.length;
		for(var i=0; i<=len; i++) {
			var texts = new Kinetic.Text({
                x: ((this.options.width - 5)/len) * i,
                y: this.options.height - 10,
                text: labels[i] + '',
                fontSize: 10,
                textFill: "#000000",
		        align:"right"
        });
			var hrs = new Kinetic.Rect({
          x: ((this.options.width - 5)/len) * i + 14,
          y: this.options.height - 19 ,
          width: 1,
          height: 1,
          stroke: "#000000"
        });
			this.layer.add(hrs);
			this.layer.add(texts);	
		}
		if(yobj['enable']) {
			var liney = new Kinetic.Line({
					points: [ 14, this.options.height - 20, 14 , 0 ],
          stroke: "#000000",
          strokeWidth: 1,
          lineCap: "round",
          lineJoin: "round"
        });
			this.layer.add(liney);		
		}
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
	getLabels: function() {
		return this.data.map(function(item){
			return item[0];		
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


