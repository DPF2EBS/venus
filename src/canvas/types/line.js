(function () {
	function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));

        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;

        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);

        return {
            x1:p2x - dx1,
            y1:p2y + dy1,
            x2:p2x + dx2,
            y2:p2y + dy2
        };
    }
	/*
	*@Todo: add Line to the Chart
	*/
    function VerticalLine(layer, x, y, ox, oy, color, d) {
        layer.add(new Kinetic.Line({
            points: [x, y, x + ox, y - oy],
	        stroke: color,
	        strokeWidth: 2,
	        lineCap: "round",
	        lineJoin: "round"
        }));
    }
    DPChart.addChart('line', {

        draw:function () {

			var options = this.options,
                lineOptions,
				points = [];

			lineOptions = DPChart.mix({
				smooth: false,
				lineStroke: '#F48307',
                hasDot: false,
                dotRadius: 8,
                dotFill: '#F74D8B',
                shadow:false
            }, options.line);
			
            var series = this.series.getSeries();

            var range = this.series.getRange();

            var layer = this.layer;

            var xAxis = this.axises.x,

                yAxis = this.axises.y;

            var xOrigin = xAxis.getOrigin();

            var yOrigin = yAxis.getOrigin();


            var colors=DPChart.getColors(series.length+1);

            var data, posOffset = {x:0, y:0}, posX, posY, width, height;

			series.forEach(function(item, index) {
			   	points.push({
	                x: xAxis.getX(index),
	                y: yAxis.options.beginY - yAxis.getY(item.data),  
	                val: item.data,
					label: item.label
	            });
			});
			
			var beginPiont = {
				
			    x: xAxis.getX(0), 
			
				y: yAxis.options.beginY - yAxis.getY(series[0].data)  
				
		   	},
		    pathString = [], fillPathString;
			
            (points.length <= 2) && (lineOptions.smooth = false);
            
            if(lineOptions.smooth) {
            	// 曲线
            	var i, l,
            		x0, y0,
            		x, y,
            		x1, y1,
 					p;

				pathString = [ 'M' , beginPiont.x , beginPiont.y, 'C', beginPiont.x, beginPiont.y];
				
            	for (i = 1, l = points.length - 1; i < l; i++) {

            			x0 = points[i-1].x;

                		y0 = points[i-1].y;

                		x = points[i].x;

                		y = points[i].y;

                		x1 = points[i+1].x;

                		y1 = points[i+1].y;

                        p = getAnchors(x0, y0, x, y, x1, y1);
						                                     
						pathString.push(p.x1, p.y1, x, y, p.x2, p.y2); 
                        
                    }
					pathString.push(x1, y1, x1, y1);
					
            } else {
	
			   	pathString = ['M', beginPiont.x, beginPiont.y];

				
                points.forEach(function (d, i) {
                    pathString.push('L', d.x, d.y);
                });
            }

            fillPathString=pathString;
            pathString =  pathString.join(',');

            var endPoint= points[points.length - 1 ];
            fillPathString.push("L", endPoint.x, xAxis.options.beginY-1);
            fillPathString.push("L", beginPiont.x, xAxis.options.beginY-1);

            fillPathString = fillPathString.join(",");

            console.log(fillPathString);
            console.log(pathString);
			

            if(!!lineOptions.shadow){
                var path = new Kinetic.Path({
                          data: fillPathString,
                          scale: 1,
                          draggable: true,
                          fill:lineOptions.lineStroke,
                          alpha:0.5
                });
                layer.add(path);    
            }
            
            var path = new Kinetic.Path({
                      data: pathString,
                      stroke: lineOptions.lineStroke,
                      scale: 1,
                      strokeWidth:4,
                      draggable: true
            });
            layer.add(path);

            var stage = this.stage;
            // if the line has dot

            if(lineOptions.hasDot) {
                
                points.forEach(function (d, i) {
                   var dot = new Kinetic.Circle({
                        x: d.x,
                        y: d.y,
                        radius: lineOptions.dotRadius,
                        fill: series[i].color,
                        draggable: true
                    }),
                    newLayer;
                    dot.on('mouseover', function(evt) {
                    this.transitionTo({
                        radius:{
                            x:lineOptions.dotRadius * 1.5,
                            y:lineOptions.dotRadius * 1.5
                        },
                        duration:0.2
                    });
                    
                    newLayer = DPChart.tooltips(d.x, d.y, points[i].val, 'right');

                    stage.add(newLayer);

                    });
                    dot.on('mouseout', function(evt) {
                        this.transitionTo({
                            radius:{
                                x:lineOptions.dotRadius,
                                y:lineOptions.dotRadius
                            },
                            duration:0.2
                        });
                        DPChart.toolTipHide(newLayer);
                    });
                    
                    
                    layer.add(dot);
                });
                
                
            }
        }
    });
})();
