(function (Chart, undefined) {
    /*
     * line chart
     *
     * */


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

    Chart.addChart('line', {
        draw:function () {
            var opt = this.options,
                lineOpt = DPChart.mix({
                    'line-width':2,
                    smooth:false,
                    dots:true,
                    dotRadius:3
                }, opt.line),
                series = this.series,
                axises = this.axises,
                data = series.getSeries(),
                self = this,
                raphael = this.raphael,
                colors = this.colors,//this.colors,
                elements = []

            function drawLine(arr, indexOfSeries, color, dotColor) {
                var points = []

                //put all points in the point array, ignore some miss point
                if (DPChart.isArray(arr)) {
                    arr.forEach(function (d, i) {
                        if (indexOfSeries == undefined) {
                            points.push({
                                x:axises.x.getX(i),
                                y:axises.y.getY(i)
                            })
                        } else {
                            points.push({
                                x:axises.x.getX(i),
                                y:axises.y.getY(indexOfSeries, i)
                            });
                        }
                    })
                } else {
                    //arr is object
                    for (var o in arr) {
                        points.push({
                            x:axises.x.getX(o),
                            y:axises.y.getY(indexOfSeries, o)
                        })
                    }
                }
                if (lineOpt.smooth) {
                    //draw smooth line
                    var x, y,
                        pathString,
                        i, l,
                        x0, y0, x1, y1,
                        p
                    pathString = [ 'M' , points[0].x , points[0].y, 'C', points[0].x, points[0].y];
                    for (i = 1, l = points.length - 1; i < l; i++) {
                        x0 = points[i - 1].x;
                        y0 = points[i - 1].y;
                        x = points[i].x;
                        y = points[i].y;
                        x1 = points[i + 1].x;
                        y1 = points[i + 1].y;
                        p = getAnchors(x0, y0, x, y, x1, y1);
                        pathString.push(p.x1, p.y1, x, y, p.x2, p.y2)
                    }
                    pathString.push(x1, y1, x1, y1)
                } else {
                    //straight line
                    var pathString = ['M', points[0].x, points[0].y]
                    points.forEach(function (d, i) {
                        pathString.push('L', d.x, d.y)
                    });
                }
                var line = raphael.path().attr({
                        'stroke-width':lineOpt['line-width'],
                        'stroke':color,
                        path:pathString
                    }),
                    dots = raphael.set()
                if (lineOpt.dots) {
                    //draw dots
                    points.forEach(function (d, i) {
                        var dot = raphael.circle(d.x, d.y, lineOpt.dotRadius).attr({
                            'fill':dotColor || colors[i],
                            'stroke':'none'
                        }).mouseover(
                            function () {
                                this.animate({
                                    r:lineOpt.dotRadius * 2
                                }, 100)
                            }).mouseout(function () {
                                this.animate({
                                    r:lineOpt.dotRadius
                                }, 100)
                            });
                        dots.push(dot);
                    })
                }
                elements.push({line:line, dots:dots});
            }

            function bindLegendEvents() {
                self.legend.on('click', (function () {
                    var arr = new Array(data.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].line.attr('opacity', 0);
                            elements[i].dots.attr('opacity', 0);
                        } else {
                            arr[i] = true;
                            elements[i].line.attr('opacity', 1);
                            elements[i].dots.attr('opacity', 1);
                        }
                    }
                })())
            }

            if (data[0]) {
                if (typeof data[0].data === "number") {
                    //data is simple number
                    //TODO bug data.length<3
                    drawLine(data, undefined, undefined, this.colors[4]);
                } else if (DPChart.isArray(data[0].data)) {
                    data.forEach(function (item, i) {
                        //item is data[0],...which is an array and draws an line
                        drawLine(item.data, i, colors[i], colors[i]);
                    });
                    bindLegendEvents();

                } else {
                    //is object
                    data.forEach(function (item, i) {
                        // item is an object ,..which is an array and draws an line
                        drawLine(item.data, i, colors[i], colors[i])
                    });
                    bindLegendEvents();

                }
            }


        }
    });

})(DPChart);
