(function () {
	var colors = getColors();
	
	console.log(colors);
	
	function hsv2rgb(h, s, v) {
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
	
	function getColors() {
		var hues = [0.6, 0.2, 0.05, 0.1333, 0.75, 0],
		colors = [],rgb=[];
		
		for (var i = 0; i < 10; i++) {
			if (i < hues.length) {
				// colors.push('hsb(' + hues[i] + ',.75, .75)');
				rgb=hsv2rgb(hues[i]*360,0.75,0.75);
				colors.push('rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')');
			} else {
				// colors.push('hsb(' + hues[i - hues.length] + ', 1, .5)');
				rgb=hsv2rgb(hues[i - hues.length]*360,1,0.5);
				colors.push('rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')');
			}
		}
		
		return colors;
	}
	
	function VerticalBar(paper, x, y, ox, oy, w, h, color, d) {
		var path,
		rect = {};
		
		path = [
			'M', x, y - h,
			'L', x, y, x + (ox - x) / 2, y, x + (ox - x) / 2, y - h,
			'z'
		];
		
		rect = {
			x : x - ox / 4,
			y : y,
			w : ox / 2,
			h : h
		};
		
		// paper.path(path.join(''));
		
		paper.text(x, y - 10, d);
		
		paper.rect(rect.x, rect.y, rect.w, rect.h).attr({
			'stroke' : 'none',
			'fill' : color
		});
	}
	
	DPChart.addChart('bar', {
		draw : function () {
			var series = this.series.getSeries();
			var range = this.series.getRange();
			
			var paper = this.raphael;
			var xAxis = this.axises.x,
			yAxis = this.axises.y
				
				var xOrigin = xAxis.getOrigin();
			var yOrigin = yAxis.getOrigin();
			
			// console.log('data series elements count: ', series.length);
			
			var data,
			posOffset = {
				x : 0,
				y : 0
			},
			posX,
			posY,
			width,
			height;
			for (var i = 0, L = series.length; i < L; i++) {
				data = series[i];
				
				posX = xAxis.getX(i);
				
				posY = yAxis.getY(i);
				//  console.log('data', i, data);
				// console.log(posX, posY);
				
				//                if (series[i + 1]) {
				//                    posOffset.x = xAxis.getX(i + 1);
				//                    posOffset.y = yAxis.getY(i + 1);
				//                }
				posOffset.x = xAxis.options.tickWidth
					
					width = yOrigin.x - posX;
				height = xOrigin.y - posY;
				
				// VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
				VerticalBar(paper, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
			}
		}
	});
})();
