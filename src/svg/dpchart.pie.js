(function (undefined) {	
	function SectorChart(paper, x, y, r, startAngle, endAngle, color, d, dir) {
		var path,sector,dir=dir||1;
		
		var rad = Math.PI / 180,
			angleOffset=endAngle-startAngle;
            x1 = x + r * Math.cos(dir*startAngle * rad),
			y1 = y + r * Math.sin(dir*startAngle * rad),
			
            x2 = x + r * Math.cos(dir*endAngle * rad),  
            y2 = y + r * Math.sin(dir*endAngle * rad),
			
			xm = x + r / 2 * Math.cos(dir*(startAngle + angleOffset / 2) * rad),
            ym = y + r / 2 * Math.sin(dir*(startAngle + angleOffset / 2) * rad),
            path = [
                "M", x, y,
                "L", x1, y1,
                "A", r, r, 0, +(Math.abs(angleOffset) > 180), +(dir*(endAngle-startAngle)>0), x2, y2, //clockwise
                "z"
            ];
			
		sector=Math.abs(angleOffset)===360?paper.circle(x,y,r):paper.path(path.join(' '));
		
		color&&sector.attr({
			'stroke' : 'none',
			'fill' : color
		});
		
		// paper.text(x,y, 'P1');
		// paper.text(x1,y1, 'P2');
		// paper.text(x2,y2, 'P3');
		
		d&&(Math.abs(angleOffset)===360?paper.text(x, y, d):paper.text(xm, ym, d));
	}
	
	DPChart.addChart('pie', {
		draw : function (options) {
			// options=mix(options,{x:this.options.width/2,y:this.options.height/2,radius:Math.min(this.options.width,this.options.height)/2});
			
			var defaultOptions={x:this.options.width/2,y:this.options.height/2,radius:Math.min(this.options.width,this.options.height)/2.5};
			for(var key in defaultOptions){
				if(options[key]===undefined){
					options[key]=defaultOptions[key];
				}
			}
			
			var series = this.series.getSeries(),
				colors = this.colors,
				data,total=0,
				startAngle=-90,endAngle;
			
			for (var i = 0, L = series.length; i < L; i++) {total+=series[i].data;}
			
			for (var i = 0, L = series.length; i < L; i++) {
				endAngle=series[i].data/total*360+startAngle;

				SectorChart(this.raphael, options.x, options.y, options.radius, startAngle, endAngle, colors[i], series[i].data);
				
				startAngle=endAngle;
			}
		}
	});
})();
