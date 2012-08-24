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
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
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
    Venus.CanvasChart.addChart('line', {

        draw: function () {

            var options = this.options,
                lineOptions,
                points = [];

            lineOptions = Venus.util.mix({
                smooth: false,
                lineStroke: '#4FEE30',
                hasDot: true,
                dotRadius: 8,
                dotFill: '#F74D8B',
                shadow: false,
                autoMouseOut: false,
				easing: true,
				tipPos: 'right'
            }, options.line);

            var series = this.series.getSeries();

            var range = this.series.getRange();

            var layer = this.layer;

            var xAxis = this.axises.x,

                yAxis = this.axises.y;

            var xOrigin = xAxis.getOrigin();

            var yOrigin = yAxis.getOrigin();


            var colors = Venus.util.getColors(series.length + 1);

            var data, posOffset = {
                x: 0,
                y: 0
            }, posX, posY, width, height;

            series.forEach(function (item, index) {
                points.push({
                    x: xAxis.getX(index),
                    y: yAxis.options.beginY - yAxis.getY(item.data),
                    val: item.data,
                    label: item.name
                });
            });

            var beginPiont = {

                x: xAxis.getX(0),

                y: yAxis.options.beginY - yAxis.getY(series[0].data)

            },
            pathString = [],
                fillPathString;

            (points.length <= 2) && (lineOptions.smooth = false);

            if (lineOptions.smooth) {
                // 曲线
                var i, l,
                x0, y0,
                x, y,
                x1, y1,
                p;

                pathString = ['M', beginPiont.x, beginPiont.y, 'C', beginPiont.x, beginPiont.y];

                for (i = 1, l = points.length - 1; i < l; i++) {

                    x0 = points[i - 1].x;

                    y0 = points[i - 1].y;

                    x = points[i].x;

                    y = points[i].y;

                    x1 = points[i + 1].x;

                    y1 = points[i + 1].y;

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

            fillPathString = pathString;
            pathString = pathString.join(',');

            var endPoint = points[points.length - 1];

            fillPathString.push("L", endPoint.x, xAxis.options.beginY - 1);
            fillPathString.push("L", beginPiont.x, xAxis.options.beginY - 1);

            fillPathString = fillPathString.join(",");

            var path, fillPath;

            if ( !! lineOptions.shadow) {
                fillPath = new Kinetic.Path({
                    y: xAxis.options.beginY,
                    data: fillPathString,
                    scale: 1,
                    draggable: true,
                    fill: lineOptions.lineStroke,
                    alpha: 0.2,
                    scale: {
                        y: 0
                    }
                });
                layer.add(fillPath);

                if(lineOptions.easing) {
					fillPath.transitionTo({
	                    y: 0,
	                    scale: {
	                        y: 1
	                    },
	                    duration: 1
	                });
				}
			   
            }

            path = new Kinetic.Path({
                y: xAxis.options.beginY,
                data: pathString,
                stroke: lineOptions.lineStroke,
                strokeWidth: 2,
                draggable: true,
                scale: {
                    y: 0
                }
            });
            layer.add(path);
                             
            
			if(lineOptions.easing) {
				path.transitionTo({
	                y: 0,
	                scale: {
	                    y: 1
	                },
	                duration: 1
	            });
			}
            

            var stage = this.stage,
                newLayer;
            // if the line has dot

            if (lineOptions.hasDot) {

                points.forEach(function (d, i) {
                    var dot = new Kinetic.Circle({
                        x: d.x,
                        y: yAxis.options.beginY,
                        radius: lineOptions.dotRadius,
                        fill: series[i].color,
                        draggable: true
                    });
					layer.add(dot);
                    /*
                    var rect = new Kinetic.Rect({
                        x: d.x - xAxis.options.tickWidth,
                        y: yAxis.options.endY,
                        height: yAxis.options.length,
                        width: xAxis.options.tickWidth
                    });

                    layer.add(rect);   


                    (function (dot) {
	      			 
                        rect.on("mouseover", function () {

                            if (newLayer) {
                                DPChart.toolTipHide(newLayer);
                            }
                            dot.transitionTo({
                                radius: {
                                    x: lineOptions.dotRadius * 1.5,
                                    y: lineOptions.dotRadius * 1.5
                                },
                                duration: 0.2
                            });

                            newLayer = DPChart.tooltips(d.x, d.y, points[i].val, 'right');

                            stage.add(newLayer);
                        });
                    })(dot);
                    					*/

                    
                    dot.on('mouseover', function (evt) {
                        if (newLayer) {
                            Venus.CanvasChart.toolTipHide(newLayer);
                        }
                        this.transitionTo({
                            radius: {
                                x: lineOptions.dotRadius * 1.5,
                                y: lineOptions.dotRadius * 1.5
                            },
                            duration: 0.2
                        });
                        newLayer = Venus.CanvasChart.tooltips(d.x, d.y, points[i].label + ':' + points[i].val, lineOptions.tipPos);

                        stage.add(newLayer);

                    });
                    dot.on('mouseout', function (evt) {
                        this.transitionTo({
                            radius: {
                                x: lineOptions.dotRadius,
                                y: lineOptions.dotRadius
                            },
                            duration: 0.2
                        }); !! lineOptions.autoMouseOut && Venus.CanvasChart.toolTipHide(newLayer);
                    });
                     
                    if(lineOptions.easing) {
	                   	(function (y) {
	                        dot.transitionTo({
	                            y: y,
	                            duration: 1
	                        });
	                    })(d.y);
					}
                });

            }
        }
    });
})();
