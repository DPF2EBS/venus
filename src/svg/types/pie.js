;(function (undefined) {
	/**
	*get sector path string and position parameters
	*@param {Object} options {
		x:coordinate y of sector, 
		y:coordinate x of sector, 
		r:radius, 
		startAngle:, 
		endAngle:, 
		dir:circle direction, 
		rotate:sector rotation
	}
	*@return path and positions
	*@type {Object} an object contain path and positions
	*/
	function getSectorPath(options){
		var opt=options||{}, dir=opt.dir||1;
		
		var rad = Math.PI / 180,
			angleOffset=opt.endAngle-opt.startAngle,
			x1,y1, xm,ym, x2,y2;
			
			x1 = opt.x + opt.r * Math.cos(dir*opt.startAngle * rad),
			y1 = opt.y + opt.r * Math.sin(dir*opt.startAngle * rad),			
			
			xm = opt.x + opt.r / 2 * Math.cos(dir*(opt.startAngle + angleOffset / 2) * rad),
            ym = opt.y + opt.r / 2 * Math.sin(dir*(opt.startAngle + angleOffset / 2) * rad),
			
			x2 = opt.x + opt.r * Math.cos(dir*opt.endAngle * rad),  
			y2 = opt.y + opt.r * Math.sin(dir*opt.endAngle * rad);
		
		if(parseInt(opt.hollow,10)>0){
			var xh1,yh1, xh2,yh2;
			xh1 = opt.x + opt.hollow * Math.cos(dir*opt.startAngle * rad),
			yh1 = opt.y + opt.hollow * Math.sin(dir*opt.startAngle * rad),
			
			xm = opt.x + (opt.hollow +opt.r/2-opt.hollow/2) * Math.cos(dir*(opt.startAngle + angleOffset / 2) * rad),
            ym = opt.y + (opt.hollow+opt.r/2-opt.hollow/2)* Math.sin(dir*(opt.startAngle + angleOffset / 2) * rad),
			
			xh2 = opt.x + opt.hollow * Math.cos(dir*opt.endAngle * rad),  
			yh2 = opt.y + opt.hollow * Math.sin(dir*opt.endAngle * rad),
			
			path = [
				"M", xh2, yh2,
				"A", opt.hollow, opt.hollow, 0, +(Math.abs(angleOffset) > 180), +(dir*(opt.endAngle-opt.startAngle)<0), xh1, yh1,
				"L", x1, y1,
				"A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir*(opt.endAngle-opt.startAngle)>0), x2, y2,
				"z"
			];
		}else{			
			path = [
				"M", opt.x, opt.y,
				"L", x1, y1,
				"A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir*(opt.endAngle-opt.startAngle)>0), x2, y2,
				"z"
			];
		}
			
        return {path: path, pos:{xstart:x1,ystart:y1, xmiddle:xm,ymiddle:ym, xend:x2,yend:y2}};				
    }
	
	/**
	*draw sector and text
	*@param {Object} options {
		x:coordinate y of sector, 
		y:coordinate x of sector, 
		r:radius, startAngle:, 
		endAngle:, 
		color:sector fill color,
		d:data of sector, 
		callback:animation callback function, 
		dir:circle direction, 
		rotate:sector rotation
	}
	*@return sector raphael object
	*@type {Object} an object instance of raphael
	*/
	function SectorChart(options){
		var sector,
			text,
			opt=options||{},
			angleOffset=opt.endAngle-opt.startAngle,
			sectorPath=getSectorPath(opt),
			strokeOpt=DPChart.mix({'stroke-width':1,'stroke':'#dedede',"stroke-linejoin":"round",'fill':opt.color},opt.stroke);
		
		if(!opt.animation){
			sector=Math.abs(angleOffset)===360?opt.paper.circle(opt.x,opt.y,opt.r):opt.paper.path(sectorPath.path.join(' '));
		}else{
			sector=opt.paper.path().attr({arc: [opt.x,opt.y,opt.r,opt.startAngle,opt.startAngle,opt.dir]}).animate({arc: [opt.x,opt.y,opt.r,opt.startAngle,opt.endAngle,opt.dir]}, opt.time||100, opt.callback);
		}
		
		opt.color&&sector.attr(strokeOpt);
		
		opt.d&&(text=Math.abs(angleOffset)===360?opt.paper.text(opt.x, opt.y, opt.d):opt.paper.text(sectorPath.pos.xmiddle, sectorPath.pos.ymiddle, opt.d)).attr({'font-size':Math.max(Math.round(opt.r/10),10)});
		
		opt.animation&&opt.d&&text.hide();
		
		DPChart.mix(sector,{cx:opt.x,cy:opt.y, mx:sectorPath.pos.xmiddle,my:sectorPath.pos.ymiddle, text:text});
		
		return sector;
	}
	
	DPChart.addChart('pie', {
		draw : function (options) {
			/**initialize chart options*/
			options=DPChart.mix({
				x:this.options.width/2,
				y:this.options.height/2,
				radius:Math.min(this.options.width,this.options.height)/2.5,
				duration:900,
				animation:true, 
				showText:true,
				rotate:-90,
				dir:1,
				hollow:0,
				stroke:{}
			}, options);
			
			if(options.hollow>=options.radius){options.hollow=0;}
			options.r=options.radius;
			delete options.radius;
			
			/**define variables needed*/
			var series = this.series.getSeries().sort(function(a,b){return b.data-a.data}),
				colors = this.colors,
				paper=this.stage,
				data,
				total=0,
				elements=[],
				value,
				// startAngle=-90,
				startAngle=options.rotate*options.dir,
				opts=[],t=0,
				endAngle;
				
			/**add coustomer attribute*/
			paper.customAttributes.arc = function (x,y,r,startAngle,endAngle,dir){
				return {path: getSectorPath({x:x,y:y,r:r,startAngle:startAngle,endAngle:endAngle,dir:dir}).path};				
            };
			
			/**calculate summation of all data*/
			for (var i = 0, L = series.length; i < L; i++) {total+=series[i].data;}
			
			/**draw each sector chart*/
			for(var i=0,L=series.length;i<L;i++){
				data=series[i].data;
				endAngle=series[i].data/total*360+startAngle;				
				opts.push({startAngle:startAngle, endAngle:endAngle, color:colors[i], d:options.showText&&data, time:Math.round(data/total*options.duration)});				
				startAngle=endAngle;
			}
			
			opts.forEach(function(item,i){
				if(options.animation){
					switch(options.animation){
						case 'simultaneous':
							t=0;
							item.time=Math.max(Math.round(options.duration/opts.length),400);
						break;
						default:
							i>0?t+=opts[i-1].time:t=0;
						break;
					}
				}
				
				setTimeout(function(){
					elements.push(SectorChart(DPChart.mix({paper:paper,
						callback:function(){
							this.text&&this.text.show();
						}
					},DPChart.mix(options,item))));
				},t);
			});
			
			/**
			*bind sector elements event actions
			*/
			function bindElementsAction(){
				elements&&elements.forEach(function(item){
					item.hover(function(){
						this.stop();
						this.transform('s1.1,1.1,'+this.cx+','+this.cy);
							
						// this.transform('t'+(this.mx-this.cx)/5+','+(this.my-this.cy)/5);
					}, function () {
						this.animate({
							transform : 's1,1,'+this.cx+','+this.cy
						}, 500, "bounce");
					});
				});
			}
			
			/**draw pie cover for animation*/
			// paper.path().attr({arc: [options.x, options.y ,options.radius, 0, 359],'fill':'#fff','stroke':'#fff','stroke-width':2}).animate({arc: [options.x, options.y ,options.radius, 0, 0, ]}, 900, "<",function(){this.remove()});
			
			/**
			*bind legends event actions
			*/
			function bindLegendsAction(){
				if (!this.legend) {return false;}
				
				Array.prototype.forEach.call(this.legend.itemSet, function (item, i) {
					var el = elements[i];
					item.hover(
						function () {
							this.rotate(45);
						
							el.stop();
							el.transform('t' + (el.mx - el.cx) / 5 + ',' + (el.my - el.cy) / 5);
							if(el.text){
								el.text.stop();
								el.text.transform('t'+(el.mx-el.cx)/5+','+(el.my-el.cy)/5);
							}
						},
						function () {
							this.rotate(-45);
							
							el.animate({
								transform : 's1,1,' + el.cx + ',' + el.cy
							}, 500, "bounce");
							
							if(el.text){
								el.text.animate({
									transform : 't0,0'
								}, 500, "bounce");
							}
						}
					);
				});
				
				this.legend.on('click', (function () {
					var arr = new Array(series.length);
					return function (e, i) {
						if (arr[i] == true || arr[i] == undefined) {
							arr[i] = false;
							elements[i].attr('opacity', 0).text.attr('opacity', 0);
						} else {
							arr[i] = true;
							elements[i].attr('opacity', 1).text.attr('opacity', 1);
						}
					}
				})());
			}
			
			/**
			*initialize all event actions
			*/
			(function(context){
				setTimeout(function(){
					bindElementsAction.call(context);
					bindLegendsAction.call(context);
				},t);
			})(this);
		}
	});
})();
