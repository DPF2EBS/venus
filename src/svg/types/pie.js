;
(function (undefined) {
    var util = Venus.util;


    /**
     *get sector path string and position parameters
     *@param {Object} options {
        x:coordinate y of sector,
        y:coordinate x of sector,
        r:radius,
        startAngle:,
        endAngle:,
        dir:circle direction,
        rotate:sector rotation
     }
     *@return path and positions
     *@type {Object} an object contain path and positions
     */
    function getSectorPath(options) {
        var opt = options || {}, dir = opt.dir || 1;

        var rad = Math.PI / 180,
            angleOffset = opt.endAngle - opt.startAngle,
            x1, y1, xm, ym, x2, y2, path,xmr,ymr;

        x1 = opt.x + opt.r * Math.cos(dir * opt.startAngle * rad);
        y1 = opt.y + opt.r * Math.sin(dir * opt.startAngle * rad);

        xm = opt.x + opt.r / 2 * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
        xmr = opt.x + opt.r  * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
        ym = opt.y + opt.r / 2 * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);
        ymr = opt.y + opt.r  * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);

        x2 = opt.x + opt.r * Math.cos(dir * opt.endAngle * rad);
        y2 = opt.y + opt.r * Math.sin(dir * opt.endAngle * rad);

        if (parseInt(opt.hollow, 10) > 0) {
            var xh1, yh1, xh2, yh2;
            xh1 = opt.x + opt.hollow * Math.cos(dir * opt.startAngle * rad);
            yh1 = opt.y + opt.hollow * Math.sin(dir * opt.startAngle * rad);

            xm = opt.x + (opt.hollow + opt.r / 2 - opt.hollow / 2) * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
            ym = opt.y + (opt.hollow + opt.r / 2 - opt.hollow / 2) * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);

            xh2 = opt.x + opt.hollow * Math.cos(dir * opt.endAngle * rad);
            yh2 = opt.y + opt.hollow * Math.sin(dir * opt.endAngle * rad);

            path = [
                "M", xh2, yh2,
                "A", opt.hollow, opt.hollow, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) < 0), xh1, yh1,
                "L", x1, y1,
                "A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) > 0), x2, y2,
                "z"
            ];
        } else {
            path = [
                "M", opt.x, opt.y,
                "L", x1, y1,
                "A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) > 0), x2, y2,
                "z"
            ];
        }

        return {path:path, pos:{xstart:x1, ystart:y1, xmiddle:xm,xMiddleOnBound:xmr, ymiddle:ym,yMiddleOnBound:ymr, xend:x2, yend:y2}};
    }

    /**
     *draw sector and text
     *@param {Object} options {
        x:coordinate y of sector,
        y:coordinate x of sector,
        r:radius, startAngle:,
        endAngle:,
        color:sector fill color,
        d:data of sector,
        callback:animation callback function,
        dir:circle direction,
        rotate:sector rotation
     }
     *@return sector raphael object
     *@type {Object} an object instance of raphael
     */
    function SectorChart(options) {
        var sector,
            text,
            opt = options || {},
            angleOffset = opt.endAngle - opt.startAngle,
            sectorPath = getSectorPath(opt),
            strokeOpt = util.mix({'stroke-width':1, 'stroke':'#dedede', "stroke-linejoin":"round", 'fill':opt.color}, opt.stroke),
            pos;

        if (!opt.animation) {
            sector = Math.abs(angleOffset) === 360 ? opt.paper.circle(opt.x, opt.y, opt.r) : opt.paper.path(sectorPath.path.join(' '));
        } else {
            sector = opt.paper.path().attr({arc:[opt.x, opt.y, opt.r, opt.hollow, opt.startAngle, opt.startAngle, opt.dir]}).animate({arc:[opt.x, opt.y, opt.r, opt.hollow, opt.startAngle, opt.endAngle, opt.dir]}, opt.time || 100, opt.callback);
        }

        opt.color && sector.attr(strokeOpt);

      //  opt.d && (text = Math.abs(angleOffset) === 360 ? opt.paper.text(opt.x, opt.y, opt.d) : opt.paper.text(sectorPath.pos.xmiddle, sectorPath.pos.ymiddle, opt.d)).attr({'font-size':Math.max(Math.round(opt.r / 10), 10)});

      //  opt.animation && opt.d && text.hide();

        pos = sectorPath.pos;
        util.mix(sector, {cx:opt.x, cy:opt.y, mx:pos.xmiddle, mxr:pos.xMiddleOnBound, my:pos.ymiddle, myr:pos.yMiddleOnBound,_data:opt.d,_index:opt.index, text:text,startAngle:opt.startAngle});

        return sector;
    }

    /*
    * function to compute the positions of text
    * @param pos{Object} position of the bound of the sector
    *
    * */

    function textPosition(pos){

    }
    textPosition.rows = {
        left:{},
        right:{}
    }

    function initTexts(s,percents, opt, paper) {
        var rows = {
                0:[], // area 0
                1:[],
                2:[],
                3:[]
            },
            lineHeight = 16,
            maxRow = Math.ceil(opt.r / lineHeight) - 1,
            cx = opt.x,
            cy = opt.y,
            self = this,
            sectors = s.slice(0),
            startSwitch;

        function getArea(x, y) {
            if (x > cx && y < cy) {
                return 0;
            } else if (x > cx && y > cy) {
                return 1;
            } else if (x < cx && y > cy) {
                return 2;
            } else {
                return 3;
            }
        }

        function getPos(area, row) {
            var l = lineHeight * (row + 0.5);
            if (area == 0 || area == 3) {
                return cy - l;
            } else {
                return cy + l;
            }
        }

        sectors.forEach(function (sector,i) {
            var mxr = sector.mxr,
                myr = sector.myr,
                area = getArea(mxr, myr),
                row = Math.floor(Math.abs(myr - cy) / lineHeight);

            if (rows[area][row] !== undefined) {
                // got text on this row
                if (area == 0 || area == 2) {
                    rows[area].splice(row, 0, i);
                } else {
                    if (area == 3 && row == maxRow && mxr > cx - .1 * opt.r) {
                        if (startSwitch === undefined) {
                            //compute the start index to switch to area 0
                            if (sectors.length - i <= rows[3].length - maxRow) {
                                // all switch
                                startSwitch = i;
                            } else {
                                startSwitch = Math.ceil(sectors.length - i - (rows[3].length - maxRow)) / 2 + i;
                            }
                        }
                        if (i >= startSwitch) {
                            //area 3 and in max Row, put the text in area 0
                            rows[0][maxRow + sectors.length - i] = i;
                            return;
                        }
                    }
                    for (var index = row + 1; ; index++) {
                        if (rows[area][index] === undefined) {
                            rows[area][index] = i;
                            break;
                        }
                    }
                }
            } else {
                rows[area][row] = i;
            }
        });

        for (var area in rows) {
            rows[area].forEach(function (index,i) {
                if(index!==undefined){
                    var sector = sectors[index],
                        originIndex = sector._index,
                        label = self.labels[originIndex],
                        percent = percents[originIndex] +"%",
                        span = 30,
                        text = paper.text(sector.mxr, getPos(area, i), label).attr({
                            'font-size':13,
                            'font-weight':'bolder'
                        }),
                        percentText = paper.text(sector.mxr, getPos(area, i), " "+percent).attr({
                            'font-size':13
                        });
                    var width = text.getBBox().width,
                        percentWidth = percentText.getBBox().width+10;

                    text.attr({
                        'x':sector.mxr + (area > 1 ? -(span + percentWidth + width / 2) : +(span + width / 2))
                    });
                    percentText.attr({
                        'x':sector.mxr + (area > 1 ? -(span + percentWidth / 2) : (span + width + percentWidth / 2))
                    });
                    paper.path().attr({
                        path:['M', sector.mxr, sector.myr, 'S', sector.mxr, getPos(area, i), sector.mxr + (area > 1 ? -span : span), getPos(area, i)],
                        "stroke-width":1,
                        "stroke":"#000000"
                    });

                }
            });
        }


    }

    Venus.SvgChart.addChart('pie', {
        draw:function (opt) {
            /*
                initialize chart options
            */
            var chartWidth = this.options.width,
                chartHeight = this.options.height,
                self = this,
                options = util.mix({
                x:chartWidth/ 2,                                //position of the pie center
                y:chartHeight/ 2,
                radius:Math.min(chartWidth, chartHeight) / 2.5, //radius of the p
                duration:900,
                animation:true,
                showText:true,
                rotate:-90,
                dir:1,
                hollow:0,
                stroke:{}
            }, opt);

            if (options.hollow >= options.radius) {
                options.hollow = 0;
            }
            options.r = options.radius;
            delete options.radius;

            /**define variables needed*/
            var series = this.series.getSeries().slice(0).sort(function (a, b) {
                    return b.data - a.data
                }),
                colors = this.colors,
                paper = this.stage,
                data,
                total = 0,
                elements = [],
                percents = [],
                startAngle = options.rotate * options.dir,
                endAngle,
                opts = [], t = 0;

            /**add coustomer attribute*/
            paper.customAttributes.arc = function (x, y, r, hollow, startAngle, endAngle, dir) {
                return {
                    path:getSectorPath({x:x, y:y, r:r, hollow:hollow, startAngle:startAngle, endAngle:endAngle, dir:dir}).path
                };
            };

            /**calculate summation of all data*/
            series.forEach(function(s){
                total+= s.data;
            });


            /**draw each sector chart*/
            series.forEach(function(s,i){
                data = s.data;
                percents.push((data/total*100).toFixed(2));
                endAngle = s.data / total * 360 + startAngle;
                opts.push({
                    startAngle:startAngle,
                    endAngle:endAngle,
                    color:colors[i],
                    d:options.showText && data,
                    time:Math.round(data / total * options.duration),
                    index:i
                });
                startAngle = endAngle;
            });

            opts.forEach(function (item, i) {
                if (options.animation) {
                    switch (options.animation) {
                        case 'simultaneous':
                            t = 0;
                            item.time = Math.max(Math.round(options.duration / opts.length), 400);
                            break;
                        default:
                            i > 0 ? t += opts[i - 1].time : t = 0;
                            break;
                    }
                }

                setTimeout(function () {
                    elements.push(SectorChart(util.mix({
                        paper:paper,
                        callback:function () {
                        this.text && this.text.show();
                    }}, util.mix(options, item))));
                    if (i == opts.length - 1 && options.showText) {
                        //last sector finish
                        //draw texts
                        initTexts.call(self,elements,percents,options,paper);
                    }
                }, t);
            });

            /**
             *bind sector elements event actions
             */
            function bindElementsAction() {
                elements && elements.forEach(function (item) {
                    item.hover(function () {
                        this.stop();
                        this.transform('s1.1,1.1,' + this.cx + ',' + this.cy);

                        // this.transform('t'+(this.mx-this.cx)/5+','+(this.my-this.cy)/5);
                    }, function () {
                        this.animate({
                            transform:'s1,1,' + this.cx + ',' + this.cy
                        }, 500, "bounce");
                    });
                });
            }

            /**
             *bind legends event actions
             */
            function bindLegendsAction() {
                if (!this.legend) {
                    return false;
                }

                this.legend.itemSet.forEach(function (item, i) {
                    var el = elements[i];
                    item.hover(
                        function () {
                            this.rotate(45);

                            el.stop();
                            el.transform('t' + (el.mx - el.cx) / 5 + ',' + (el.my - el.cy) / 5);
                            if (el.text) {
                                el.text.stop();
                                el.text.transform('t' + (el.mx - el.cx) / 5 + ',' + (el.my - el.cy) / 5);
                            }
                        },
                        function () {
                            this.rotate(-45);

                            el.animate({
                                transform:'s1,1,' + el.cx + ',' + el.cy
                            }, 500, "bounce");

                            if (el.text) {
                                el.text.animate({
                                    transform:'t0,0'
                                }, 500, "bounce");
                            }
                        }
                    );
                });

                this.legend.on('click', (function () {
                    var arr = new Array(series.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].attr('opacity', 0).text.attr('opacity', 0);
                        } else {
                            arr[i] = true;
                            elements[i].attr('opacity', 1).text.attr('opacity', 1);
                        }
                    }
                })());
            }

            /**
             *initialize all event actions
             */
            (function (context) {
                setTimeout(function () {
                    bindElementsAction.call(context);
                    bindLegendsAction.call(context);
                }, t);
            })(this);
        }
    });
})();
