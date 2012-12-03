(function () {
    var util = Venus.util;
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
	
	Venus.SvgChart.addChart('dot', {
		draw : function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                coordinate = this.coordinate,
                xAxis = coordinate.x,
                yAxis = coordinate.y,
                axisLength = Math.min(xAxis.model.totalWidth, yAxis.model.totalWidth),
                data,
                xy,
                posX,
                posY,
                radius,
                total = 0,
                elements = [],
                paper = this.stage;
			
			/**calculate summation of all data*/
			for (var i = 0, L = series.length; i < L; i++) {
				if(util.isArray(series[i].data)){
					series[i].data.forEach(function(item){
						total+=item;
					});
				}else if(util.isObject(series[i].data)){
					for(var key in series[i].data){
						total+=series[i].data[key];
					}
				}else if(util.isNumber(series[i].data)){
					total+=series[i].data;
				}
			}
			total*=2;
			
			for (var i = 0, L = series.length; i < L; i++) {
				elements.push([]);
				if(util.isArray(series[i].data)){
					series[i].data.forEach(function(item,j){
						data = item;
                        xy = coordinate.get(j,item)
                        posX = xy.x;
                        posY = xy.y;
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
					});
				}else if(util.isObject(series[i].data)){
					var j=0;
					for(var key in series[i].data){
						data =series[i].data[key];
                        xy = coordinate.get(key,data);
                        posX = xy.x;
                        posY = xy.y;
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
						j++;
					}
				}else if(util.isNumber(series[i].data)){
					data=series[i].data;
                    xy = coordinate.get(i,data);
                    posX = xy.x;
                    posY = xy.y;
					radius=data/total*axisLength;

					elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
				}				
			}
			
			/**Legend events*/
            if (this.legend) {
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

                this.legend.on('click', (function () {
                    var arr = new Array(series.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].forEach(function (item) {
                                item.attr('opacity', 0);
                            });
                        } else {
                            arr[i] = true;
                            elements[i].forEach(function (item) {
                                item.attr('opacity', 1);
                            });
                        }
                    }
                })());
            }
		}
	});
})();