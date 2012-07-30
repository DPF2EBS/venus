(function (undefined) {	
	function SectorChart(paper, x, y, r, startAngle, endAngle, color, d, dir) {
		var sector,text,dir=dir||1,strokeOpt={width:1,stroke:'#dedede'};
		
		var rad = Math.PI / 180,
			angleOffset=endAngle-startAngle;
            x1 = x + r * Math.cos(dir*startAngle * rad),
			y1 = y + r * Math.sin(dir*startAngle * rad),
			
            x2 = x + r * Math.cos(dir*endAngle * rad),  
            y2 = y + r * Math.sin(dir*endAngle * rad),
			
			xm = x + r / 2 * Math.cos(dir*(startAngle + angleOffset / 2) * rad),
            ym = y + r / 2 * Math.sin(dir*(startAngle + angleOffset / 2) * rad),
            path = [
                "M", x, y,
                "L", x1, y1,
                "A", r, r, 0, +(Math.abs(angleOffset) > 180), +(dir*(endAngle-startAngle)>0), x2, y2, //clockwise
                "z"
            ];
			
		sector=Math.abs(angleOffset)===360?paper.circle(x,y,r):paper.path(path.join(' '));
		
		color&&sector.attr({
			'stroke' : strokeOpt.stroke,
			'stroke-width':strokeOpt.width,
			"stroke-linejoin": "round",
			'fill' : color
		});		
		
		d&&(text=Math.abs(angleOffset)===360?paper.text(x, y, d):paper.text(xm, ym, d)).attr({'font-size':Math.max(Math.round(r/10),10)});
		
		DPChart.mix(sector,{cx:x,cy:y,mx:xm,my:ym,text:text});
		
		return sector;
	}
	
	DPChart.addChart('pie', {
		draw : function (options) {
			/**initialize chart options*/
			options=DPChart.mix({x:this.options.width/2,y:this.options.height/2,radius:Math.min(this.options.width,this.options.height)/2.5}, options);
			
			/**define variables needed*/
			var series = this.series.getSeries().sort(function(a,b){return b.data-a.data}),
				colors = this.colors,
				paper=this.raphael,
				data,
				total=0,
				elements=[],
				value,
				startAngle=-90,endAngle;
			
			/**calculate summation of all data*/
			for (var i = 0, L = series.length; i < L; i++) {total+=series[i].data;}
			
			/**draw each sector chart*/
			for (var i = 0, L = series.length; i < L; i++) {
				data=series[i].data;
				endAngle=series[i].data/total*360+startAngle;

				elements.push(SectorChart(paper, options.x, options.y, options.radius, startAngle, endAngle, colors[i], data));
				
				
				elements[i].hover(function(){
						this.stop();
						this.transform('s1.1,1.1,'+this.cx+','+this.cy);
						
						// this.transform('t'+(this.mx-this.cx)/5+','+(this.my-this.cy)/5);
						
						// this.text.stop();
						// this.text.transform('t'+(this.mx-this.cx)/5+','+(this.my-this.cy)/5+',s1.1,1.1,'+this.cx+','+this.cy);
					}, function () {
						this.animate({
							transform : 's1,1,'+this.cx+','+this.cy
						}, 500, "bounce");
				});
				
				startAngle=endAngle;
			}
			
			/**Legend events*/
			if(this.legend){
			Array.prototype.forEach.call(this.legend.itemSet,function(item,i){
				var el=elements[i];
				item.hover(
					function(){
						this.rotate(45);
						
						el.stop();
						el.transform('t'+(el.mx-el.cx)/5+','+(el.my-el.cy)/5);;
					},
					function(){
						this.rotate(-45);
						
						el.animate({
							transform : 's1,1,'+el.cx+','+el.cy
						}, 500, "bounce");
					}
				);
			});
			
			this.legend.on('click', (function (){
                var arr = new Array(series.length);
                return function (e, i) {
                    if (arr[i] == true || arr[i] == undefined) {
                        arr[i] = false;
                        elements[i].attr('opacity', 0).text.attr('opacity',0);
                    } else {
                        arr[i] = true;
                        elements[i].attr('opacity', 1).text.attr('opacity',1);
                    }
                }
            })());
			}
		}
	});
})();
