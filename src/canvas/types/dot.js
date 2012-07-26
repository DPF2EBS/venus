(function () {
	var colors=["red","blue","green","orange","yellow"];
    DPChart.addChart('dot', {
        draw:function () {
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer,
                stage=this.stage,
                messageLayer,
                options=this.options;
            var xAxis = this.axises.x,
                yAxis = this.axises.y;

            var x,y;

            var circle;

            var max = series.map(function(data){
                return data[2];
            });

            max= Math.max.apply(Math, max);

            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];
                //console.log(data);
                x = xAxis.getX(data[1]);
                y = yAxis.beginY - yAxis.options.tickWidth * (data[0]+1);
    
                circle=new Kinetic.Circle({
                    x:x,
                    y:y,
                    radius:data[2]/max*Math.min(xAxis.options.tickWidth, yAxis.options.tickWidth)/2,
                    fill:"black"
                });

                layer.add(circle);

                circle.on("mouseover", function(){
                    this.setFill("green");
                    this.setStroke("#ddd");
                    layer.draw();
                });
                circle.on("mouseout",function(){
                    this.setFill("black");
                    this.setStroke("");
                    layer.draw();
                });

            }
        }
    });
})();
