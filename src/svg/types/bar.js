;
(function () {
    var util = Venus.util;
    Venus.SvgChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                xAxis = this.axises.x,
                xTickWidth = xAxis.options.tickWidth,
                yAxis = this.axises.y,
                beginY = yAxis.beginY,
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
                self = this


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
            function drawBar(x, y, width, height, color, value) {
                var bar
                if (barOptions.beginAnimate) {
                    bar = paper.rect(x, yAxis.beginY, width, 0, barOptions.radius).animate({height:height, y:y}, 500)
                } else {
                    bar = paper.rect(x, y, width, height, barOptions.radius)
                }

                bar.attr({
                    'fill':color,
                    'stroke-width':0,
                    'opacity':barOptions.opacity || 1
                }).hover(function (e) {
                        this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y'), value);
                    }, function () {
                        this.toolTipHide()
                    })
                return bar;
            }

            function bindLegendEvents() {
                /*
                 * bind legend click event
                 * when click the related bar toggles hide
                 * */
                self.legend && self.legend.on('click', (function () {
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
                })());
            }

            function getPositions(i, j,sumY) {
                /*
                 * when there are several bars on one tick
                 * this function returns each position of the bar
                 *
                 * @param i{Number} index of series
                 * @param j{Number} index of bar on the tick
                 * @param sumY{Number} current height of the bar
                 *
                 * return {
                 *  x:Number,
                 *  y:Number,
                 *  width:Number,
                 *  height:Number
                 * }
                 * */


                var oX = xAxis.getX(j),
                    oY = yAxis.getY(i,j);

                if (barOptions.multiple == sideBySide) {
                    var times = 5, // width/space=times
                        total = xTickWidth * .8,
                        space = total / ((times + 1) * series.length + 1),
                        bWidth = times * space,
                        x = oX - total / 2 + i * bWidth + (i + 1) * space,
                        y = oY;
                    return {
                        x:x,
                        y:y,
                        width:bWidth,
                        height:beginY - y
                    }
                }else{
                    return {
                        x:oX - xTickWidth / 4,
                        y:oY - sumY,
                        width:xTickWidth / 2,
                        height:beginY - oY
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
                        elements[i] = drawBar(xAxis.getX(i) - xTickWidth / 4, yAxis.getY(i), xTickWidth / 2, beginY - yAxis.getY(i), colors[i], d.data);
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
                            var p = getPositions(i, j, sumY[j]);
                            sumY[j] += p.height;
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], value));
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
                            var p = getPositions(i, o, sumY[j]);
                            sumY[j] += p.height;
                            elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], d.data[o]));
                            j++;
                        }
                    });
                }
                bindLegendEvents();
            }
        }
    });
})();
