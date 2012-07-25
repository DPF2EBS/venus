(function () {
	var colors=["red","blue","green","orange","yellow"];
    function VerticalLine(layer, x, y, ox, oy, w, h, color, d) {
        var path, Line = {};
        Line = {
            x:x-ox/4,
            y:y
        };
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
			var options = this.options;
            var series = this.series.getSeries();
            var range = this.series.getRange();

            var layer = this.layer;
            var xAxis = this.axises.x,
                yAxis = this.axises.y

            var xOrigin = xAxis.getOrigin();
            var yOrigin = yAxis.getOrigin();

            console.log('data series elements count: ', series.length);
			// 是否需要line中的dot
            var needDot = options.line.dot.enable , radius;
			if(needDot) {
				radius =  options.line.dot.radius;
			}
            var data, posOffset = {x:0, y:0}, posX, posY, width, height;
            for (var i = 0, L = series.length; i < L; i++) {
                data = series[i];

                posX = xAxis.getX(i);

                posY = yAxis.getY(i);
                
				var bai = (i < series.length - 1) && ((series[i + 1].data > series[i].data ) ? (series[i + 1].data - series[i].data)/10 : -(series[i].data - series[i+1].data)/10);

                posOffset.x = xAxis.options.tickWidth;

				posOffset.y = Math.ceil(yAxis.options.tickWidth * bai);

                width =  yOrigin.x-posX;
                height =  xOrigin.y-posY; 

                var dotTag = new Kinetic.Circle({
		          	x: posX,
				  	y: posY,
   		          	radius: radius,
	  	          	fill: colors[i]
				}),
				tipBox,
			   	tipLayer = new Kinetic.Layer();
				(function(data) {
				   	dotTag.on('mouseover', function(evt) {
					   var xtip = evt.offsetX,
						   ytip = evt.offsetY,
						   wtip = 100,
						   htip =  30;
					   tipBox = new Kinetic.Rect({
						      x: xtip - wtip/2,
						      y: ytip - htip - 10,
						      width: wtip,
						      height: htip,
						      fill: "#EFEFEF",
						      stroke: "#CCCCCC",
						      strokeWidth: 1
						 });
						tipWord = new Kinetic.Text({
						          x: xtip - wtip/2 + 10,
						          y: ytip - htip - 5,
						          text: data.label + ':' + data.data,
						          fontSize: 14,
						          textFill: "#333333"
						});
						tipLayer.removeChildren();
						tipLayer.add(tipBox);
						tipLayer.add(tipWord);
						tipLayer.draw();
					});
					dotTag.on('mouseout', function(evt) {
						tipLayer.clear(); 
					}); 
				})(data)
				this.stage.add(tipLayer);
				layer.add(dotTag);
                (i < L - 1) && VerticalLine(layer, posX, posY, posOffset.x, posOffset.y, width, height, colors[i], data.data);
            }
        }
    });
})();
