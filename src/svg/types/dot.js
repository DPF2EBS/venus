(function () {
	function DotChart(paper, x, y, r, color, d) {
		var dot;

		x=Math.random()*(x+y)/2+x/2;
		
		dot=paper.circle(x, y, r);
		
		color&&dot.attr({
			'stroke' : '#fff',
			'fill' : color
		});
		
		// (d||d===0)&&paper.text(x, y - 10, d);
		
		return dot;
	}
	
	Venus.SVGChart.addChart('dot', {
		draw : function () {
			var series = this.series.getSeries(),
				colors = this.colors,
				xAxis = this.axises.x,
				yAxis = this.axises.y,
				axisLength=Math.min(xAxis.axisLength,yAxis.axisLength),
				data,
				posX,
				posY,
				radius,
				total=0,
				elements=[],
				paper=this.stage;
			
			/**calculate summation of all data*/
			for (var i = 0, L = series.length; i < L; i++) {
				if(Venus.util.isArray(series[i].data)){
					series[i].data.forEach(function(item){
						total+=item;
					});
				}else if(Venus.util.isObject(series[i].data)){
					for(var key in series[i].data){
						total+=series[i].data[key];
					}
				}else if(Venus.util.isNumber(series[i].data)){
					total+=series[i].data;
				}
			}
			total*=2;
			
			for (var i = 0, L = series.length; i < L; i++) {
				elements.push([]);
				if(Venus.util.isArray(series[i].data)){
					series[i].data.forEach(function(item,j){
						data = item;
						posX = xAxis.getX(i,j);
						posY = yAxis.getY(i,j);
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
					});
				}else if(Venus.util.isObject(series[i].data)){
					var j=0;
					for(var key in series[i].data){
						data =series[i].data[key];
						posX = xAxis.getX(i,j);
						posY = yAxis.getY(i,j);
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
						j++;
					}
				}else if(Venus.util.isNumber(series[i].data)){
					data=series[i].data;
					posX = xAxis.getX(i);
					posY = yAxis.getY(i);
					radius=data/total*axisLength;

					elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
				}				
			}
			
			/**Legend events*/
			if(this.legend){
			/* Array.prototype.forEach.call(this.legend.itemSet,function(item,i){
				var el=elements[i];
				item.hover(
					function(){
						this.rotate(45);
						
						el.stop();
						el.transform('t'+(el.mx-el.cx)/5+','+(el.my-el.cy)/5);;
					},
					function(){
						this.rotate(-45);
						
						el.animate({
							transform : 's1,1,'+el.cx+','+el.cy
						}, 500, "bounce");
					}
				);
			}); */
			
			this.legend.on('click', (function (){
                var arr = new Array(series.length);
                return function (e, i) {
                    if (arr[i] == true || arr[i] == undefined) {
                        arr[i] = false;
                        elements[i].forEach(function(item){
							item.attr('opacity', 0);
						});
                    } else {
                        arr[i] = true;
                        elements[i].forEach(function(item){item.attr('opacity', 1);});
                    }
                }
            })());
			}
		}
	});
})();