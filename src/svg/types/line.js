;(function (Chart, undefined) {
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
                    dotRadius:4,
                    area:true,
                    beginAnimate:true,
                    areaOpacity:0.1,
                    dotSelect:true,
                    columnHover:true
                }, opt.line),
                series = this.series,
                axises = this.axises,
                data = series.getSeries(),
                self = this,
                raphael = this.stage,
                colors = this.colors, //this.colors,
                elements = [], //按series 存放element
                dotsByXAxis = {}  //按x轴存放dot


            function drawLine(arr, indexOfSeries, color, dotColor) {
                var points = []

                //put all points in the point array, ignore some miss point
                if (DPChart.isArray(arr)) {
                    arr.forEach(function (d, i) {
                        if (indexOfSeries == undefined) {
                            points.push({
                                x:axises.x.getX(i),
                                y:axises.y.getY(i),
                                value:arr[i].data
                            })
                        } else {
                            points.push({
                                x:axises.x.getX(i),
                                y:axises.y.getY(indexOfSeries, i),
                                value:arr[i]
                            });
                        }
                    })
                } else {
                    //arr is object
                    for (var o in arr) {
                        points.push({
                            x:axises.x.getX(o),
                            y:axises.y.getY(indexOfSeries, o),
                            value:arr[o]
                        })
                    }
                }
                if (!points.length) {
                    return;
                }

                //sort by xAxis
                points.sort(function (a, b) {
                    return a.x - b.x;
                });

                points.length <= 2 && (lineOpt.smooth = false)
                if (lineOpt.smooth) {
                    //draw smooth line
                    var x, y,
                        pathString,
                        areaPathString,
                        i, l,
                        x0, y0, x1, y1,
                        p
                    pathString = [ 'M' , points[0].x , points[0].y, 'C', points[0].x, points[0].y];
                    areaPathString = ['M', points[0].x, axises.y.beginY, 'V', points[0].y, 'C', points[0].x, points[0].y];
                    for (i = 1, l = points.length - 1; i < l; i++) {
                        x0 = points[i - 1].x;
                        y0 = points[i - 1].y;
                        x = points[i].x;
                        y = points[i].y;
                        x1 = points[i + 1].x;
                        y1 = points[i + 1].y;
                        p = getAnchors(x0, y0, x, y, x1, y1);
                        pathString.push(p.x1, p.y1, x, y, p.x2, p.y2);
                        areaPathString.push(p.x1, p.y1, x, y, p.x2, p.y2);
                    }
                    pathString.push(x1, y1, x1, y1)
                    areaPathString.push(x1, y1, x1, y1, 'V', axises.y.beginY, 'H', points[0].x, 'Z')
                } else {
                    //straight line
                    var pathString = ['M', points[0].x, points[0].y],
                        areaPathString = ['M', points[0].x, axises.y.beginY, 'V', points[0].y]
                    points.forEach(function (d, i) {
                        pathString.push('L', d.x, d.y)
                        areaPathString.push('L', d.x, d.y)
                    });
                    areaPathString.push('V', axises.y.beginY, 'H', points[0].x, 'Z')
                }
                var line = raphael.path().attr({
                        'stroke-width':lineOpt['line-width'],
                        'stroke':color,
                        path:pathString
                    }),
                    dots = raphael.set(),
                    area
                if (lineOpt.area) {
                    //draw area path
                    area = raphael.path().attr({
                        'stroke-width':0,
                        'path':areaPathString,
                        'fill':color,
                        'opacity':lineOpt.areaOpacity
                    });
                }

                if (lineOpt.dots) {
                    //draw dots
                    points.forEach(function (d, i) {
                        var dot = raphael.circle(d.x, d.y, lineOpt.dotRadius).attr({
                            'fill':dotColor || colors[i],
                            'stroke':'none'
                        }).hover(
                            function () {
                                if (this._selected_) {
                                    return;
                                }
                                this.animate({
                                    r:lineOpt.dotRadius * 2
                                }, 100);
                                this.toolTip(raphael, this.attr('cx'), this.attr('cy') - 10, d.value);
                            },
                            function () {
                                if (this._selected_) {
                                    return;
                                }
                                this.animate({
                                    r:lineOpt.dotRadius
                                }, 100);
                                this.toolTipHide()
                            }).data('point', d);
                        if (lineOpt.dotSelect) {
                            //选中dot 显示tip
                            dot.click(function () {
                                if (!this._selected_) {
                                    this.toolTip(raphael, this.attr('cx'), this.attr('cy') - 10, d.value);
                                    this._selected_ = true;
                                } else {
                                    this._selected_ = false;
                                    this.toolTipHide();
                                }
                            })
                        }

                        dots.push(dot);
                        dotsByXAxis[d.x] || (dotsByXAxis[d.x] = raphael.set());
                        dotsByXAxis[d.x].push(dot);
                    });
                }
                elements.push({line:line, dots:dots, area:area});
            }

            function bindLegendEvents() {
                self.legend && self.legend.on('click', (function () {
                    var arr = new Array(data.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].line.hide();
                            elements[i].dots.hide();
                            elements[i].area.hide();
                        } else {
                            arr[i] = true;
                            elements[i].line.show();
                            elements[i].dots.show();
                            elements[i].area.show();
                        }
                    }
                })())
            }

            if (data[0]) {
                if (DPChart.isNumber( data[0].data)) {
                    //data is simple number
                    drawLine(data, undefined, this.colors[0], undefined);
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

                if (lineOpt.columnHover) {
                    for (var x in dotsByXAxis) {
                        //创建一条透明的rect
                        var width = axises.x.options.tickWidth,
                            height = axises.y.axisLength;
                        (function (xValue) {
                            var set = dotsByXAxis[xValue]
                            raphael.rect(xValue - width / 2, axises.y.beginY - height, width, height).attr({
                                'stroke':'none', 'fill':'#fff', 'opacity':0
                            }).hover(
                                function () {
                                    set.forEach(function (d) {
                                        if (d._selected_) {
                                            return;
                                        }
                                        d.animate({r:lineOpt.dotRadius * 2}, 100);
                                        d.node.style.display !== 'none' && (d.toolTip(raphael, d.attr('cx'), d.attr('cy') - 10, d.data('point').value));
                                    })
                                }, function () {
                                    set.forEach(function (d) {
                                        if (d._selected_) {
                                            return;
                                        }
                                        d.animate({r:lineOpt.dotRadius}, 100);
                                        d.toolTipHide();
                                    })
                                });
                        })(x);


                    }

                }
                if (lineOpt.area) {
                    //把左右的点都放到最前面来 防止被盖住
                    elements.forEach(function (el) {
                        el.dots && el.dots.forEach(function (dot) {
                            dot.toFront();
                        })
                    })
                }

            }
        }
    });

})(DPChart);
