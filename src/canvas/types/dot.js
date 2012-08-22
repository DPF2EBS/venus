(function () {
    var colors = ["red", "blue", "green", "orange", "yellow"];
    Venus.CanvasChart.addChart('dot', {
        draw: function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer,
                stage = this.stage,
                messageLayer,
                options = this.options;
            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var x, y, dotOptions;

			dotOptions = Venus.util.mix({
				radius: 2,
				easing: 'elastic-ease-out'
			}, options.dot);
            
			
            var circle, data;

            var max = this.data.map(function (data) {
                return data[2];
            });

            var scale = Math.min(xAxis.options.tickWidth, yAxis.options.tickWidth) / 2;

            max = Math.max.apply(Math, max);

            for (var i = 0, L = series.length; i < L; i++) {
                data = this.data[i];

                x = xAxis.getX(data[1]),
                y = yAxis.options.beginY - (1 + data[0]) * yAxis.options.tickWidth,

                circle = new Kinetic.Circle({
                    x: x,
                    y: y,
                    radius: 0,
                    fill: Venus.util.getColors(data[2])[data[2] - 1]
                });

                layer.add(circle);

                circle.transitionTo({
                    radius: {
                        x: data[2] / max * scale,
                        y: data[2] / max * scale
                    },
                    duration: 1,
                    easing: dotOptions.easing
                });

                circle.on("mouseover", function () {
                    var radius = this.getRadius();
                    this.transitionTo({
                        radius: {
                            x: radius.x * 1.4,
                            y: radius.y * 1.4
                        },
                        duration: 0.2
                    });
                });
                circle.on("mouseout", function () {
                    var radius = this.getRadius();
                    this.transitionTo({
                        radius: {
                            x: radius.x / 1.4,
                            y: radius.y / 1.4
                        },
                        duration: 0.2
                    });
                });

            }
        }
    });
})();
