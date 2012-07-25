(function () {
	var colors=["red","blue","green","orange","yellow"];
    function VerticalLine(layer, x, y, ox, oy, w, h, color, d) {
        var path, rect = {};

        Line = {
            x:x-ox/4,
            y:y
        };

        // paper.path(path.join(''));
        layer.add(new Kinetic.Line({
            points: [x, y, x + ox, y - oy],
	        stroke: color,
	        strokeWidth: 1,
	        lineCap: "round",
	        lineJoin: "round"
        }));
    }

    DPChart.addChart('line', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y

            var xOrigin = xAxis.getOrigin();
            var yOrigin = yAxis.getOrigin();

            console.log('data series elements count: ', series.length);

            var data, posOffset = {x:0, y:0}, posX, posY, width, height;
            for (var i = 0, L = series.length; i < L-1; i++) {
                data = series[i];

                posX = xAxis.getX(i);

                posY = yAxis.getY(i);
                
				var bai = (i < series.length - 1) && ((series[i + 1].data > series[i].data ) ? (series[i + 1].data - series[i].data)/10 : -(series[i].data - series[i+1].data)/10);

                posOffset.x = xAxis.options.tickWidth;

				posOffset.y = Math.ceil(yAxis.options.tickWidth * bai);

                width =  yOrigin.x-posX;
                height =  xOrigin.y-posY;

				//heightN =  xOrigin.y-posYN;
                console.log(height);
                // VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
                VerticalLine(layer, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
            }
        }
    });
})();
