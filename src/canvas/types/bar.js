(function () {
    DPChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var colors=DPChart.getColors(series.length);

            var options, stage = this.stage;

            var data, posOffset = {x:0, y:0}, posX, posY, width, height, points = [];
            series.forEach(function(item, index) {
                points.push({
                    x: xAxis.getX(index),
                    y: yAxis.options.beginY - yAxis.getY(item.data),  
                    val: item.data,
                    label: item.label
                });
            });
            points.forEach(function(d, i) {
                options = {
                    x:points[i].x - xAxis.options.tickWidth * 0.618/2,
                    y:points[i].y,
                    width:xAxis.options.tickWidth * 0.618,
                    height:yAxis.getY(points[i].val),
                    fill:colors[i]
                };
                var newRect = new Kinetic.Rect(options),
                    newLayer;
                (function(opt) {
                    
                    newRect.on('mouseover', function(evt) {

                    newLayer = DPChart.tooltips(opt.x + opt.width/2, opt.y, points[i].val, 'top');

                    stage.add(newLayer);

                    });
                    newRect.on('mouseout', function(evt) {
                        
                        DPChart.toolTipHide(newLayer);

                    });
                })(options);
                
                layer.add(newRect);

            });
        }
    });
})();
