(function(){
	function VerticalBar(paper, x,y,ox,oy,w,h){
		var path, rect={};
		
		path=[
			'M',x,y-h,
			'L',x,y, x+(ox-x)/2,y, x+(ox-x)/2,y-h,
			'z'
		];
		
		rect={
			x:x,
			y:y,
			w:(ox-x)/2,
			h:h
		};
		
		// paper.path(path.join(''));
		
		paper.rect(rect.x, rect.y, rect.w, rect.h);
	}
	
	DPChart.addChart('bar',{
		draw:function(){
			var series=this.getSeries();
			var range=this.getRange();
			
			var paper=this.raphael;
			
			var xOrigin=this.axises.x.getOrigin();
			var yOrigin=this.axises.y.getOrigin();
			
			console.log('data series elements count: ', series.length);
			
			var data,posOffset={x:0,y:0},posX,posY,width,height;
			for(var i=0,L=series.length;i<L;i++){
				data=series[i];
				
				console.log('data', i, data);				
				
				posX=this.getX(i);
				posY=this.getY(i);
				
				if(series[i+1]){
					posOffset.x=this.getX(i+1);
					posOffset.y=this.getY(i+1);
				}
				
				width=posX-yOrigin.x;
				height=posY-xOrigin.y;
				
				// VerticalBar.call(this, posX, posY, posOffset.x, posOffset.y, width, height);
				VerticalBar(paper, posX, posY, posOffset.x, posOffset.y, width, height);
			}
		}
	});
})();