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
                if (lineOpt.smooth) {
                    //draw smooth line
                    var x, y,
                        pathString,
                        i, l,
                        x0, y0, x1, y1,
                        points
                    if (indexOfSeries == undefined) {
                        x = axises.x.getX(0);
                        y = axises.y.getY(0)
                    } else {
                        x = axises.x.getX(0);
                        y = axises.y.getY(indexOfSeries, 0);
                    }
                    pathString = [ 'M' , x , y, 'C', x, y];

                    for (i = 1, l = arr.length - 1; i < l; i++) {
                        x0 = x;
                        y0 = y;
                        if (indexOfSeries === undefined) {
                            x = axises.x.getX(i);
                            y = axises.y.getY(i);
                            x1 = axises.x.getX(i + 1);
                            y1 = axises.y.getY(i + 1);
                        }
                        else {
                            x = axises.x.getX(i);
                            y = axises.y.getY(indexOfSeries, i);
                            x1 = axises.x.getX(i + 1);
                            y1 = axises.y.getY(indexOfSeries, i + 1);
                        }

                        points = getAnchors(x0, y0, x, y, x1, y1);

                        pathString.push(points.x1, points.y1, x, y, points.x2, points.y2)
                    }
                    pathString.push(x1, y1, x1, y1)
                } else {
                    //straight line
                    var pathString
                    indexOfSeries === undefined ? pathString = ['M', axises.x.getX(0), axises.y.getY(0)] : pathString = ['M', axises.x.getX(indexOfSeries, 0), axises.y.getY(indexOfSeries, 0)]
                    arr.forEach(function (d, i) {
                        indexOfSeries === undefined ? (pathString.push('L', axises.x.getX(i), axises.y.getY(i))) : (pathString.push('L', axises.x.getX(indexOfSeries, i), axises.y.getY(indexOfSeries, i)))
                    });
                }
                var line = raphael.path().attr({
                        'stroke-width':lineOpt['line-width'],
                        'stroke':color,
                        path:pathString
                    }),
                    dots = raphael.set()
                if (lineOpt.dots) {
                    arr.forEach(function (d, i) {
                        var dot,
                            x, y
                        if (indexOfSeries === undefined) {
                            x = axises.x.getX(i);
                            y = axises.y.getY(i)
                        } else {
                            x = axises.x.getX(i);
                            y = axises.y.getY(indexOfSeries, i);
                        }
                        dot = raphael.circle(x, y, lineOpt.dotRadius).attr({
                            'fill':dotColor || colors[i],
                            'stroke':'none'
                        });
                        dots.push(dot);
                    })
                }
                elements.push({line:line, dots:dots});
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
                    self.legend.on('click',  (function () {
                        var arr = new Array(data.length);
                        return function (e, i) {
                            if (arr[i] == true || arr[i] == undefined) {
                                arr[i] = false;
                                elements[i].line.attr('opacity',0);
                                elements[i].dots.attr('opacity',0);
                            } else {
                                arr[i] = true;
                                elements[i].line.attr('opacity',1);
                                elements[i].dots.attr('opacity',1);
                            }
                        }
                    })())
                } else {

                }
            }


        }
    });

})(DPChart);
