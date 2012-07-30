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
	var colors;
    DPChart.addChart('pie', {
        draw:function () {


            //排序
            var series = this.series.getSeries().sort(function(a,b){
                return a.data - b.data;
            });
            var colors;

            var layer = this.layer,
                stage=this.stage;

            var options=this.options,
                pieOptions;

            pieOptions = DPChart.mix({
                easing:false,
                radius:50
            }, options.pie);

            //计算饼图的圆心
            var centerX=this.options.width/2;
            var centerY=this.options.height/2;

            var sum=0,path,data;
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
                sector = new Kinetic.Sector({
                    x:centerX,
                    y:centerY,
                    radius:(pieOptions.easing ? 0 : pieOptions.radius),
                    startAngle:startAngle,
                    endAngle:endAngle,
                    fill:data.color
                });
                sector.on("mouseover", function(){
                    this.transitionTo({
                        radius: options.pie.radius*1.1,
                        duration: 0.2,
                        easing:"ease-in"
                      });
                });
                sector.on("mouseout",function(){
                        this.transitionTo({
                        radius: options.pie.radius,
                        duration: 0.2,
                        easing:"ease-out"
                      });
                });

                layer.add(sector);

                if(!!pieOptions.easing){
                    sector.transitionTo({
                        radius:options.pie.radius,
                        duration:1,
                        easing:pieOptions.easing
                    });    
                }
                
                
                startAngle = endAngle;

            }
        }
    });
})();
