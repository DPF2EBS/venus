(function () {	
	function DotChart(paper, x, y, r, color, d) {
		var dot;
		
		(d||d===0)&&paper.text(x, y - 10, d);
		
		dot=paper.circle(x, y, r);
		
		color&&dot.attr({
			'stroke' : 'none',
			'fill' : color
		});;
	}
	
	DPChart.addChart('dot', {
		draw : function () {
			var series = this.series.getSeries(),
				colors = DPChart.getColors(series.length),
				xAxis = this.axises.x,
				yAxis = this.axises.y,
				axisLength=Math.min(xAxis.axisLength,yAxis.axisLength);
			
			// console.log('data series elements count: ', series.length);
			
			var data,posX,posY,radius,total=0;
			
			for (var i = 0, L = series.length; i < L; i++) {total+=series[i].data;}
			
			for (var i = 0, L = series.length; i < L; i++) {
				data = series[i];
				
				posX = xAxis.getX(i);
				posY = yAxis.getY(i);
				// radius=yAxis.getRadius(i)||(Math.random()+1)*10;
				radius=data.data/total*axisLength;

				DotChart(this.raphael, posX, posY, radius, colors[i], data.data);
			}
		}
	});
})();