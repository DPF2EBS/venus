(function () {
    Venus.CanvasChart.addChart('bar', {
        draw: function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var colors = Venus.util.getColors(series.length);

            var options, stage = this.stage;

            var data, posOffset = {
                x: 0,
                y: 0
            }, posX, posY, width, height, points = [];
            series.forEach(function (item, index) {
                points.push({
                    x: xAxis.getX(index),
                    y: yAxis.options.beginY - yAxis.getY(item.data),
                    val: item.data,
                    label: item.label
                });
            });
            points.forEach(function (d, i) {
                var y;
                y = points[i].y;
                options = {
                    x: points[i].x - xAxis.options.tickWidth * 0.618 / 2,
                    y: xAxis.options.beginY,
                    width: xAxis.options.tickWidth * 0.618,
                    height: yAxis.getY(points[i].val),
                    fill: colors[i]
                };

                (function (opt, y) {
                    var height = opt.height;
                    opt.height = 0;
                    var newRect = new Kinetic.Rect(opt),
                        newLayer;

                    layer.add(newRect);

                    newRect.transitionTo({
                        height: height,
                        y: y,
                        duration: 0.5
                    });

                    newRect.on('mouseover', function (evt) {


                        newLayer = Venus.CanvasChart.tooltips(opt.x + opt.width / 2, y, points[i].val, 'top');

                        stage.add(newLayer);

                        this.setStrokeWidth(2);
                        this.setStroke("#FFF");

                        this.setShadow({
                            color: "#000",
                            blur: 8,
                            alpha: 0.4,
                            offset: [2, - 2]
                        });

                    });
                    newRect.on('mouseout', function (evt) {

                         Venus.CanvasChart.toolTipHide(newLayer);
                        this.transitionTo({
                            alpha: 1,
                            duration: 0.2
                        });
                        this.setStrokeWidth(0);
                        this.setStroke("");
                        this.setShadow(null);

                    });

                })(options, y);



            });
        }
    });
})();
