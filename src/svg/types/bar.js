;
(function () {
    var util = Venus.util;
    Venus.SvgChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                coordinate = this.coordinate,
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
                    multiple:sideBySide   //how to layout bars when there are multiple bars in one tick, sidebyside or nestification
                }, this.options.bar),

                elements = [],
                self = this,
                duration = 500;


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
                    if(isHorizontal()){
                        bar = paper.rect(x, y, 0, height, barOptions.radius).animate({width:width}, 500);
                    }else{
                        bar = paper.rect(x, coordinate.y.model.beginY, width, 0, barOptions.radius).animate({height:height, y:y}, 500);
                    }
                } else {
                    bar = paper.rect(x, y, width, height, barOptions.radius);
                }

                bar.attr({
                    'fill':color,
                    'stroke-width':0,
                    'opacity':barOptions.opacity || 1
                }).hover(function (e) {
                        if(isHorizontal()){
                            this.toolTip(paper, this.attr('x') + this.attr('width'), this.attr('y') + this.attr('height') / 2, self.options.tooltip.call(self, tipObj), 'right');
                        }else{
                            this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y'), self.options.tooltip.call(self,tipObj));
                        }
                    }, function () {
                        this.toolTipHide();
                    });
                return bar;
            }


            function bindLegendEvents() {
                /*
                 * bind legend active change event
                 * related bar toggles hide
                 * */
                self.legend && self.legend.onActiveChange(function (active,activeArray) {
                    active.forEach(function (truth, i) {
                        truth ? elements[i].show() : elements[i].hide();
                    });
                    render(activeArray);
                });
            }

            function getPositions(x, y, i,count, sumY) {
                /*
                 * when there are several bars on one tick
                 * this function returns each position of the bar
                 *
                 * @param x{Number} x tick
                 * @param y{Number} y value
                 * @param i{Number} index of series
                 * @param count{Number} numbers of bars
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
                    oY = xy.y,
                    xTickWidth = coordinate.x.model.tickWidth,
                    xTickSize = coordinate.x.model.tickSize,
                    beginY = coordinate.x.model.beginY,
                    times = 5; // width/space=times

                if (barOptions.multiple == sideBySide) {
                    var total = xTickWidth / xTickSize * .8,
                        space = total / ((times + 1) * count + 1),
                        bWidth = times * space;

                    if (isHorizontal()) {
                        return {
                            x:coordinate.x.model.beginX,
                            y:oY - total/2+ i* bWidth+(i+1)*space+ xTickWidth/2,
                            width:Math.abs(coordinate.distance(coordinate.x, xy)),
                            height:bWidth,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    } else {
                        x = oX - total / 2 + i * bWidth + (i + 1) * space;
                        y = oY;
                        return {
                            x:x - xTickWidth/2,
                            y:y,
                            width:bWidth,
                            height:beginY - y,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    }
                }else{
                    if (isHorizontal()) {
                        return {
                            x:sumY + coordinate.y.model.beginX,
                            y:oY + xTickWidth / 4,
                            width:Math.abs(coordinate.distance(coordinate.x, xy)),
                            height:xTickWidth / 2,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    } else {
                        return {
                            x:oX - xTickWidth / 4 - xTickWidth/2,
                            y:oY - sumY,
                            width:xTickWidth / 2,
                            height:beginY - oY,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    }
                }
            }


            function isHorizontal(){
                return coordinate.x.model.rotate == 90 && coordinate.y.model.rotate == 0;
            }

            if (barOptions.multiple == nestification) {
                this.series.accumulation = true;
                var range = this.series.getRange();
                coordinate.y.set({
                    min:range.min,
                    max:range.max
                })
            }


            function render(seriesArray) {
                if (!seriesArray) {
                    seriesArray = [];
                    series.forEach(function (d, i) {
                        seriesArray.push(i);
                    });
                }
                sumY = [];
                if (util.isNumber(series[0].data)) {
                    /*
                     * if data is Number ,that means series  format as
                     * [{data:Number},{data:Number},...]
                     * draw each data a bar
                     * */

                    coordinate.use(coordinate.getAxisUse(0));
                    series.forEach(function (d, i) {
                        var xTickWidth = coordinate.x.model.tickWidth,
                            xy = coordinate.get(i, d.data),
                            isH = isHorizontal(),
                            x, y, width, height;
                        if (isH) {
                            x = coordinate.x.model.beginX;
                            y = xy.y + xTickWidth / 4;
                            width = Math.abs(coordinate.distance( coordinate.x,xy));
                            height = xTickWidth / 2;
                        } else {
                            x = xy.x - xTickWidth / 4 - xTickWidth / 2;
                            y = xy.y;
                            width = xTickWidth / 2;
                            height = coordinate.y.model.beginY - xy.y;
                        }

                        if (elements[i]) {
                            //change , animate
                            if(isH){
                                elements[i].animate({
                                    width:width
                                }, duration);
                            }else{
                                elements[i].animate({
                                    y:xy.y,
                                    height:height
                                }, duration);
                            }
                        } else {
                            //init and draw
                            elements[i] = drawBar(x, y, width, height, colors[i], {
                                x:xy.xTick,
                                y:xy.yTick,
                                label:self.labels[i]
                            });
                        }
                    });
                } else if (util.isArray(series[0].data)) {
                    /*
                     * if data is array,that means series format as
                     * [{data:[Number,..]},...]
                     * draw each data data.length bar
                     *
                     * */

                    series.forEach(function (d, i) {
                        coordinate.use(coordinate.getAxisUse(i));
                        var indexOfI = seriesArray.indexOf(i),
                            xTickWidth = coordinate.x.model.tickWidth;

                        if( indexOfI== -1){
                            return;
                        }
                        elements[i] = elements[i] || paper.set();
                        d.data.forEach(function (value, j) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(j, value, indexOfI,seriesArray.length, sumY[j]);
                            sumY[j] += (isHorizontal()? p.width: p.height);
                            if(elements[i][j]){
                                elements[i][j].animate({
                                    x:p.x,
                                    y:p.y,
                                    width:p.width,
                                    height:p.height
                                },duration);
                            }else{
                                elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                    x:p.xTick,
                                    y:p.yTick,
                                    label:self.labels[i]
                                }));
                            }
                        });
                    });
                } else if (util.isObject(series[0].data)) {
                    /*
                     * data is object ,that means series format as
                     * [{data:{key:value,...}},...]
                     * draw each data keys.length bar
                     * */

                    series.forEach(function (d, i) {
                        coordinate.use(coordinate.getAxisUse(i));
                        var indexOfI = seriesArray.indexOf(i)
                        if( indexOfI== -1){
                            return;
                        }
                        var j = 0, o;
                        elements[i] = elements[i]|| paper.set();
                        for (o in d.data) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(o, d.data[o], indexOfI,seriesArray.length, sumY[j]);
                            sumY[j] += (isHorizontal()? p.width: p.height);

                            if(elements[i][j]){
                                elements[i][j].animate({
                                    x:p.x ,
                                    y:p.y,
                                    width:p.width,
                                    height:p.height
                                },duration);
                            }else{
                                elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                    x:p.xTick,
                                    y:p.yTick,
                                    label:self.labels[i]
                                }));
                            }
                            j++;
                        }
                    });
                }
            }

            if (series.length) {
                render();
                bindLegendEvents();
                coordinate.x.options.labelPosition = "between_ticks";
                coordinate.y.on(function () {
                    render(self.legend.activeArray);
                });
            }


        }
    });
})();
