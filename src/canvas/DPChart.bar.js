(function () {
	var colors=["red","blue","green","orange","yellow"];
    function VerticalBar(layer, x, y, ox, oy, w, h, color, d) {
        var path, rect = {};

        path = [
            'M', x, y - h,
            'L', x, y, x + (ox - x) / 2, y, x + (ox - x) / 2, y - h,
            'z'
        ];

        rect = {
            x:x-ox/4,
            y:y,
            w:ox/ 2,
            h:h
        };

        // paper.path(path.join(''));
		
		layer.add(new Kinetic.Text({
            x:x,
            y:y-10,
            text:d+""
        }));

        layer.add(new Kinetic.Rect({
            x:rect.x,
            y:rect.y,
            width:rect.w,
            height:rect.h,
            fill:color
        }));
    }

    DPChart.addChart('bar', {
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
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];

                posX = xAxis.getX(i);

                posY = yAxis.getY(i);
                //  console.log('data', i, data);
                console.log(posX ,posY);

//                if (series[i + 1]) {
//                    posOffset.x = xAxis.getX(i + 1);
//                    posOffset.y = yAxis.getY(i + 1);
//                }
                posOffset.x = xAxis.options.tickWidth

                width =  yOrigin.x-posX;
                height =  xOrigin.y-posY;

                // VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
                VerticalBar(layer, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
            }
        }
    });
})();
