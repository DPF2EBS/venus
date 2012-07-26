(function(){
	DPChart=window.DPChart||{};
	
	var _hsv2rgb = function (h, s, v) {
        var hi, f, p, q, t, result = [];
        hi = Math.floor(h / 60) % 6;
        f = hi % 2 ? h / 60 - hi : 1 - (h / 60 - hi);
        p = v * (1 - s);
        q = v * (1 - f * s);

        switch (hi) {
            case 0:
                result = [v, q, p];
                break;
            case 1:
                result = [q, v, p];
                break;
            case 2:
                result = [p, v, q];
                break;
            case 3:
                result = [p, q, v];
                break;
            case 4:
                result = [q, p, v];
                break;
            case 5:
                result = [v, p, q];
                break;
        }

        for (var j = 0, L = result.length; j < L; j++) {
            result[j] = Math.floor(result[j] * 255);
        }

        return result;
    }

    /**
     * get a group of chart colors
     * @param {Integer} colorCount How many colors needed.
     * @example DPChart.getColors(6);
     * @return a group of colors in type of rgb().
     * @type {Array}
     */
    DPChart.getColors = function (colorCount) {
        var S=[0.75,0.75,0.45,1,0.35], V=[0.75,0.45,0.9,0.6,0.9], colors = [], L;	
		
		//if colorCount is not provide, set colorCount default value 20
		colorCount=parseInt(colorCount,10)||20;
		L=Math.max(colorCount/5,6);		
		
		for(var c=0;c<colorCount;c++){
			colors.push('rgb(' + _hsv2rgb(c%L*360/L, S[Math.floor(c/L)], V[Math.floor(c/L)]).join(',') + ')');
		}

        return colors;
    }
})();