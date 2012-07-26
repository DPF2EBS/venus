///////////////////////////////////////////////////////////////////////
//  Ellipse
///////////////////////////////////////////////////////////////////////
/**
 * Ellipse constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */

Kinetic.Sector = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            radius:20,
            startAngle:0,
            endAngle:180,
            counterclockwise:false
        });

        this.shapeType = "Sector";

        config.drawFunc = function(context) {
            var radius = this.getRadius(),
                startAngle = this.getStartAngle(),
                endAngle = this.getEndAngle(),
                counterclockwise = this.getCounterclockwise(),
                PI=Math.PI;
            context.beginPath();
            context.save();
            context.arc(0, 0, radius, startAngle * PI / 180 , endAngle * PI / 180, counterclockwise);
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
	var colors=["red","blue","green","orange","yellow"];
    DPChart.addChart('pie', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer,
                stage=this.stage,
                messageLayer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y

            var xOrigin = xAxis.getOrigin();
            var yOrigin = yAxis.getOrigin();

            var options=this.options;

            //计算饼图的圆心
            var centerX=(this.options.width - xOrigin.x)/2;
            var centerY=xOrigin.y/2;

            console.log(centerX, centerY);

            console.log('data series elements count: ', series.length);
            console.log(xOrigin, yOrigin);

            var sum=0,path;
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                sum+=data.data;
            }

            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                data.percent=data.data/sum;
            }

            var startAngle = 0,
                endAngle = 0,
                sector;
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                endAngle = startAngle + 360 * data.percent;
                console.log(startAngle);
                console.log(endAngle);
                sector = new Kinetic.Sector({
                    x:centerX,
                    y:centerY,
                    radius:options.pie.radius,
                    startAngle:startAngle,
                    endAngle:endAngle,
                    fill:colors[i]
                });
                (function(data){
                    sector.on("mouseover", function(){
                        this.setRadius(220);
                        this.getLayer().draw();
                        writeMessage(messageLayer, data.data);
                    });
                    sector.on("mouseout",function(){
                        this.setRadius(options.pie.radius);
                        this.getLayer().draw();
                        messageLayer.clear();
                    });
                    layer.add(sector);
                })(data);


                startAngle = endAngle;

            }

            function writeMessage(messageLayer, message) {
                var context = messageLayer.getContext();
                messageLayer.clear();
                context.font = "18pt Calibri";
                context.fillStyle = "black";
                context.fillText(message, 100, 25);
              }

            messageLayer=new Kinetic.Layer();
            stage.add(messageLayer);
        }
    });
})();
