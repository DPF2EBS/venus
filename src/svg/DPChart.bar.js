(function () {

    function VerticalBar(paper, x, y, ox, oy, w, h) {
        var path, rect = {};

        path = [
            'M', x, y - h,
            'L', x, y, x + (ox - x) / 2, y, x + (ox - x) / 2, y - h,
            'z'
        ];

        rect = {
            x:x,
            y:y,
            w:ox/ 2,
            h:h
        };

        // paper.path(path.join(''));

        paper.rect(rect.x, rect.y, rect.w, rect.h);
    }

    DPChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var paper = this.raphael;
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
                VerticalBar(paper, posX, posY, posOffset.x, posOffset.y, width, height);
            }
        }
    });
})();