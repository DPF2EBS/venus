///////////////////////////////////////////////////////////////////////
//  Sector
///////////////////////////////////////////////////////////////////////
/**
 * Sector constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Sector = Kinetic.Shape.extend({
    init: function (config) {
        this.setDefaultAttrs({
            radius: 20,
            startAngle: 0,
            endAngle: 180,
            counterclockwise: false
        });

        this.shapeType = "Sector";

        config.drawFunc = function (context) {
            var radius = this.getRadius(),
                startAngle = this.getStartAngle(),
                endAngle = this.getEndAngle(),
                counterclockwise = this.getCounterclockwise(),
                PI = Math.PI;
            context.beginPath();
            context.save();
            context.arc(0, 0, radius, startAngle * PI / 180, endAngle * PI / 180, counterclockwise);
            context.lineTo(0, 0);
            context.restore();
            context.closePath();
            this.fill(context);
            this.stroke(context);
        };
        // call super constructor
        this._super(config);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Sector, ['radius', "startAngle", "endAngle", "counterclockwise"]);

(function () {
    var colors;
    DPChart.addChart('pie', {
        draw: function () {


            //排序
            var series = this.series.getSeries().sort(function (a, b) {
                return b.data - a.data ;
            });
            var colors = ["skyblue", "orangered",  "yellow", "orange", "violet", "fuchsia", "yellowgreen", "khaki"];

            var layer = this.layer,
                stage = this.stage;

            var percentLayer = this.percentLayer = new Kinetic.Layer();

            var options = this.options,
                pieOptions;

            pieOptions = DPChart.mix({
                easing: false,
                radius: 50
            }, options.pie);

            //计算饼图的圆心
            var centerX = this.options.width / 2;
            var centerY = this.options.height / 2;

            var sum = 0,
                path, data;
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                sum += data.data;
            }

            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                data.percent = data.data / sum;
            }
            var startAngle = 0,
                endAngle = 0,
                sector,
                text;

            for (var i = 0, L = series.length; i < L; i++) {

                data = series[i];
                endAngle = startAngle + 360 * data.percent;

                (function (startAngle, endAngle, percent) {

                    //添加扇形
                    var textAngle = (startAngle + endAngle)/2,
                        textRadius = 0.6 * pieOptions.radius;

                    

                    sector = new Kinetic.Sector({
                        x: centerX,
                        y: centerY,
                        radius: (pieOptions.easing ? 0 : pieOptions.radius),
                        startAngle: (pieOptions.easing ? 0 : pieOptions.radius),
                        endAngle: (pieOptions.easing ? 0 : pieOptions.radius),
                        fill: colors[i],
                        stroke:"white",
                        strokeWidth:1,
                        shadow: {
                            color: "#000",
                            blur: 6,
                            alpha: 0.2
                        }
                    });
                    layer.add(sector);

                    //添加扇形上的文字
                    if(percent > 0.14){
                        console.log(percent);
                        console.log(startAngle, endAngle, textAngle);
                        text = new Kinetic.Text({
                            text:(percent*100).toFixed(2),
                            x:centerX + Math.cos(textAngle * Math.PI /180) * textRadius,
                            y:centerY + Math.sin(textAngle * Math.PI /180) * textRadius,
                            textFill:"black",
                            align:"center",
                            width:30,
                            offset:{
                                x: 12
                            }
                        });
                        console.log(text);
                        percentLayer.add(text);
                    }



                    if ( !! pieOptions.easing) {
                        sector.transitionTo({
                            radius: options.pie.radius,
                            duration: .5,
                            startAngle: startAngle,
                            endAngle: endAngle,
                            easing: "ease-out"
                        });
                    }


                    sector.on("mouseover", function () {
                        this.transitionTo({
                            radius: options.pie.radius * 1.1,
                            duration: 0.2,
                            easing: "ease-in"
                        });
                    });
                    sector.on("mouseout", function () {
                        this.transitionTo({
                            radius: options.pie.radius,
                            duration: 0.2,
                            easing: "ease-out"
                        });
                    });

                })(startAngle, endAngle, data.data);

                startAngle = endAngle;

            }
        }
    });
})();