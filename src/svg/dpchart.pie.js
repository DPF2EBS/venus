(function () {	
	function SectorChart(paper, x, y, r, startAngle, endAngle, color, d) {
		var path,sector;
		
		var rad = Math.PI / 180,
            x1 = x + r * Math.cos(-startAngle * rad),
			y1 = y + r * Math.sin(-startAngle * rad),
			
            x2 = x + r * Math.cos(-endAngle * rad),  
            y2 = y + r * Math.sin(-endAngle * rad),
			
			xm = x + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
            ym = y + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
            path = [
                "M", x, y,
                "L", x1, y1,
                "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
                "z"
            ];
		
		d&&paper.text(xm, ym, d);
		
		sector=paper.path(path.join(' '));
		
		color&&sector.attr({
			'stroke' : 'none',
			'fill' : color
		});;
	}
	
	DPChart.addChart('pie', {
		draw : function () {
			var series = this.series.getSeries(),
				colors = DPChart.getColors(series.length),
				xAxis = this.axises.x,
				yAxis = this.axises.y;
			
			var data,posX,posY,radius;
			for (var i = 0, L = series.length; i < L; i++) {
				data = series[i];
				
				posX = xAxis.getX(i);				
				posY = yAxis.getY(i);
				radius=yAxis.getRadius(i)||(Math.random()+1)*10;
				startAngle=yAxis.getStartAngle(i)||360/series.length;
				endAngle=yAxis.getEndAngle(i)||360/series.length;

				SectorChart(this.raphael, posX, posY, radius, startAngle, endAngle, colors[i], data.data);
			}
		}
	});
})();
