(function () {	
	function VerticalBar(paper, x, y, ox, oy, w, h, color, d) {
		var path, rect = {}, bar;
		
		path = [
			'M', x-ox/4, y+h,
			'L', x-ox/4,y, x +ox / 4,y, x +ox/ 4,y+h,
			'z'
		];
		
		/* rect = {
			x : x - ox / 4,
			y : y,
			w : ox / 2,
			h : h
		};	 */
		
		(d||d===0)&&paper.text(x, y - 10, d);
		
		// console.log(path.join(','));
		bar=paper.path(path.join(' '));
		// bar=paper.rect(rect.x, rect.y, rect.w, rect.h);		
		
		color&&bar.attr({
			'stroke' : 'none',
			'fill' : color
		});;
	}
	
	function HorizontalBar(paper, x, y, ox, oy, w, h, color, d) {
		var path, rect = {}, bar;
		
		path = [
			'M', x, y-oy/4,
			'L', x+w, y-oy/4, x+w,y+oy/4, x,y+oy/4,
			'z'
		];
		
		/* rect = {
			x : x,
			y : y-oy/4,
			w : w,
			h : oy/2
		};*/
		
		(d||d===0)&&paper.text(x+10, y, d);
		
		bar=paper.path(path.join(' '));
		// bar=paper.rect(rect.x, rect.y, rect.w, rect.h);		
		
		color&&bar.attr({
			'stroke' : 'none',
			'fill' : color
		});;
	}
	
	DPChart.addChart('bar', {
		draw : function () {
			var series = this.series.getSeries(),
				colors = DPChart.getColors(series.length),
				xAxis = this.axises.x,
				yAxis = this.axises.y;				
			
			// console.log('data series elements count: ', series.length);
			
			var data,posOffset = {x : 0,y : 0},posX,posY,width,height;
			for (var i = 0, L = series.length; i < L; i++) {
				data = series[i];
				
				posX = xAxis.getX(i);				
				posY = yAxis.getY(i);
				
				// console.log('data', i, data);
				// console.log(posX, posY);
				
				//width and height of bar
				width = yAxis.getOrigin().x - posX;
				height = xAxis.getOrigin().y - posY;
				
				/**position offset between two bar elements*/
				//offset between current and next element
				if (series[i + 1]) {
				    posOffset.x = xAxis.options.tickWidth||xAxis.getX(i + 1)-posX;
				    posOffset.y = xAxis.options.tickHeight||yAxis.getY(i + 1)-posY;
				//offset between current and previous element
				}else if(series[i-1]){
					posOffset.x = xAxis.options.tickWidth||posX-xAxis.getX(i-1);
				    posOffset.y = xAxis.options.tickHeight||posY-yAxis.getY(i-1);
				//just one element
				}else{
					posOffset.x = xAxis.options.tickWidth||0.382*height;
				    posOffset.y = xAxis.options.tickHeight||0.382*width;
				}				
				
				// VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
				VerticalBar(this.raphael, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
			}
		}
	});

    DPChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries();
            // var range = this.series.getRange();

            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var colors = DPChart.getColors(series.length);
            // console.log(colors);

            // console.log('data series elements count: ', series.length);

            var data, posOffset = {x:0, y:0}, posX, posY, width, height;
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];

                posX = xAxis.getX(i);
                posY = yAxis.getY(i);

                // console.log('data', i, data);
                // console.log(posX, posY);

                //width and height of bar
                width = yAxis.getOrigin().x - posX;
                height = xAxis.getOrigin().y - posY;

                /**position offset between two bar elements*/
                //offset between current and next element
                if (series[i + 1]) {
                    posOffset.x = xAxis.options.tickWidth || xAxis.getX(i + 1) - posX;
                    posOffset.y = xAxis.options.tickHeight || yAxis.getY(i + 1) - posY;
                    //offset between current and previous element
                } else if (series[i - 1]) {
                    posOffset.x = xAxis.options.tickWidth || posX - xAxis.getX(i - 1);
                    posOffset.y = xAxis.options.tickHeight || posY - yAxis.getY(i - 1);
                    //just one element
                } else {
                    posOffset.x = xAxis.options.tickWidth || 0.382 * height;
                    posOffset.y = xAxis.options.tickHeight || 0.382 * width;
                }

                // VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
                VerticalBar(this.raphael, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
            }
        }
    });
})();
