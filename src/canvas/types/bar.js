(function () {
    DPChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var colors=DPChart.getColors(series.length);

            var options;
            console.log('data series elements count: ', series.length);

            var data, posOffset = {x:0, y:0}, posX, posY, width, height;
            for (var i = 0, L = series.length; i < L; i++) {
                console.log(series[i]);
                options = {
                    x:xAxis.getX(i) - xAxis.options.tickWidth * 0.618/2,
                    y:yAxis.options.beginY - yAxis.getY(series[i].data),
                    width:xAxis.options.tickWidth * 0.618,
                    height:yAxis.getY(series[i].data),
                    fill:colors[i]
                };
                console.log(options);
                layer.add(new Kinetic.Rect(options));
            }
        }
    });
})();
