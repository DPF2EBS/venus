(function () {
    DPChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                xAxis = this.axises.x,
                xTickWidth = xAxis.options.tickWidth,
                yAxis = this.axises.y,
                beginY = yAxis.beginY,
                paper = this.raphael,
                barOptions = DPChart.mix({
                    radius:0
                }, this.options.bar),
                elements = [],
                self = this

            function drawBar(x, y, width, height, color, value) {
                return paper.rect(x, y, width, height, barOptions.radius).attr({
                    'fill':color,
                    'stroke-width':0
                }).hover(function (e) {
                        this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y'), value);
                    }, function () {
                        this.toolTipHide()
                    })
            }

            function bindLegendEvents() {
                self.legend.on('click', (function () {
                    var arr = new Array(series.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].hide();
                        } else {
                            arr[i] = true;
                            elements[i].show();
                        }
                    }
                })())
            }

            function getPositions(i, j) {
                var times = 5, //bar的宽度是空隙的倍数
                    total = xTickWidth * .8,
                    space = total / ((times + 1) * series.length + 1),
                    bWidth = times * space,
                    x = xAxis.getX(j) - total / 2 + i * bWidth + (i + 1) * space,
                    y = yAxis.getY(i, j)
                return {
                    x:x,
                    y:y,
                    width:bWidth,
                    height:beginY - y
                }
            }

            // console.log('data series elements count: ', series.length);

            if (series.length) {
                if (typeof series[0].data === "number") {
                    series.forEach(function (d, i) {
                        elements[i] = drawBar(xAxis.getX(i) - xTickWidth / 4, yAxis.getY(i), xTickWidth / 2, beginY - yAxis.getY(i), colors[i], d.data);
                    });
                } else if (DPChart.isArray(series[0].data)) {
                    series.forEach(function (d, i) {
                        elements[i] = paper.set();
                        d.data.forEach(function (value, j) {
                            var p = getPositions(i, j)
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], value[j]));
                        });
                    })
                } else {
                    //object
                    series.forEach(function (d, i) {
                        elements[i] = paper.set()
                        for (var o in d.data) {
                            var p = getPositions(i, o)
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], d.data[o]));
                        }
                    })
                }
                bindLegendEvents();
            }
        }
    });
})();
