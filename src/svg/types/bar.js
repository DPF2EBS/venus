;
(function () {
    var util = Venus.util;
    Venus.SvgChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                coordinate = this.coordinate,
                xAxis = coordinate.x,
                xTickWidth = xAxis.model.tickWidth,
                xTickSize = xAxis.model.tickSize,
                yAxis = coordinate.y,
                beginY = yAxis.model.beginY,
                paper = this.stage,
                sideBySide = "sidebyside",
                nestification = "nestification",
                sumY = [],
            /*
             * default of the bar config options
             * which could be parsed from the SvgChart.options.bar
             * */
                barOptions = util.mix({
                    radius:0,               //radius of bars
                    beginAnimate:true,      //enable begin animate or not
                    opacity:1,              //opacity of the bars
                    multiple:'sidebyside'   //how to layout bars when there are multiple bars in one tick, sidebyside or nestification
                }, this.options.bar),
                elements = [],
                self = this;


            /*
             * Main Function of draw bar
             * @param x{Number} x svg coordinate of left top point of the bar
             * @param y{Number}
             * @param width{Number} width of the bar
             * @param height{Number} height of the bar
             * @param color{String} color of the bar
             * @param value{String} Text of the toolTip
             *
             * */
            function drawBar(x, y, width, height, color, tipObj) {
                var bar
                if (barOptions.beginAnimate) {
                    bar = paper.rect(x, beginY, width, 0, barOptions.radius).animate({height:height, y:y}, 500)
                } else {
                    bar = paper.rect(x, y, width, height, barOptions.radius)
                }

                bar.attr({
                    'fill':color,
                    'stroke-width':0,
                    'opacity':barOptions.opacity || 1
                }).hover(function (e) {
                        this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y'), self.options.tooltip.call(self,tipObj));
                    }, function () {
                        this.toolTipHide()
                    })
                return bar;
            }

            function bindLegendEvents() {
                /*
                 * bind legend active change event
                 * related bar toggles hide
                 * */
                self.legend && self.legend.onActiveChange(function (active) {
                    active.forEach(function (truth, i) {
                        truth ? elements[i].show() : elements[i].hide();
                    });
                });
            }

            function getPositions(x, y,i,sumY) {
                /*
                 * when there are several bars on one tick
                 * this function returns each position of the bar
                 *
                 * @param x{Number} x tick
                 * @param y{Number} y value
                 * @param i{Number} index of series
                 * @param sumY{Number} current height of the bar
                 *
                 * return {
                 *  x:Number,
                 *  y:Number,
                 *  width:Number,
                 *  height:Number
                 * }
                 * */

                var xy = coordinate.get(x, y),
                    oX = xy.x,
                    oY = xy.y;

                if (barOptions.multiple == sideBySide) {
                    var times = 5, // width/space=times
                        total = xTickWidth /xTickSize * .8,
                        space = total / ((times + 1) * series.length + 1),
                        bWidth = times * space,
                        x = oX - total / 2 + i * bWidth + (i + 1) * space,
                        y = oY;
                    return {
                        x:x,
                        y:y,
                        width:bWidth,
                        height:beginY - y,
                        xTick:xy.xTick,
                        yTick:xy.yTick
                    }
                }else{
                    return {
                        x:oX - xTickWidth / 4,
                        y:oY - sumY,
                        width:xTickWidth / 2,
                        height:beginY - oY,
                        xTick:xy.xTick,
                        yTick:xy.yTick
                    }
                }
            }

            // console.log('data series elements count: ', series.length);

            if (series.length) {
                if (util.isNumber(series[0].data)) {
                    /*
                     * if data is Number ,that means series  format as
                     * [{data:Number},{data:Number},...]
                     * draw each data a bar
                     * */
                    series.forEach(function (d, i) {
                        var xy =coordinate.get(i, d.data);
                        elements[i] = drawBar(xy.x - xTickWidth / 4, xy.y, xTickWidth / 2, beginY - xy.y, colors[i], {
                            x:xy.xTick,
                            y:xy.yTick,
                            label:self.labels[i]
                        });
                    });
                } else if (util.isArray(series[0].data)) {
                    /*
                     * if data is array,that means series format as
                     * [{data:[Number,..]},...]
                     * draw each data data.length bar
                     *
                     * */


                    series.forEach(function (d, i) {
                        elements[i] = paper.set();
                        d.data.forEach(function (value, j) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(j, value,i, sumY[j]);
                            sumY[j] += p.height;
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                x:p.xTick,
                                y:p.yTick,
                                label:self.labels[i]
                            }));
                        });
                    });
                } else if (util.isObject(series[0].data)) {
                    /*
                     * data is object ,that means series format as
                     * [{data:{key:value,...}},...]
                     * draw each data keys.length bar
                     * */

                    series.forEach(function (d, i) {
                        var j = 0, o;
                        elements[i] = paper.set();
                        for (o in d.data) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(o, d.data[o], i, sumY[j]);
                            sumY[j] += p.height;
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                x:p.xTick,
                                y:p.yTick,
                                label:self.labels[i]
                            }));
                            j++;
                        }
                    });
                }
                bindLegendEvents();
            }
        }
    });
})();
