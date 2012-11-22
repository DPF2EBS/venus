/*!
 * Minify URI Builder
 */
var MUB = {
    _uid : 0,
    _minRoot : '/min/?',
    /**
     * In a given array of strings, find the character they all have at
     * a particular index
     * @param Array arr array of strings
     * @param Number pos index to check
     * @return mixed a common char or '' if any do not match
     */
    getCommonCharAtPos : function (arr, pos) {
        var i,
            l = arr.length,
            c = arr[0].charAt(pos);
        if (c === '' || l === 1)
            return c;
        for (i = 1; i < l; ++i)
            if (arr[i].charAt(pos) !== c)
                return '';
        return c;
    },
    /**
     * Get the shortest URI to minify the set of source files
     * @param Array sources URIs
     */
    getBestUri : function (sources) {
        var pos = 0,
            base = '',
            c;
        while (true) {
            c = MUB.getCommonCharAtPos(sources, pos);
            if (c === '')
                break;
            else
                base += c;
            ++pos;
        }
        base = base.replace(/[^\/]+$/, '');
        var uri = MUB._minRoot + 'f=' + sources.join(',');
        if (base.charAt(base.length - 1) === '/') {
            // we have a base dir!
            var basedSources = sources,
                i,
                l = sources.length;
            for (i = 0; i < l; ++i) {
                basedSources[i] = sources[i].substr(base.length);
            }
            base = base.substr(0, base.length - 1);
            var bUri = MUB._minRoot + 'b=' + base + '&f=' + basedSources.join(',');
            uri = uri.length < bUri.length ? uri : bUri;
        }
        return uri;
    },
    /**
     * Create the Minify URI for the sources
     */
    update : function () {
        var sources = [],
            ext = false,
            fail = false;
		var downloadFile = function (url) {
				try{
					var eleF = document.createElement('iframe');
					eleF.src = url;
					eleF.style.display = 'none';
					document.body.appendChild(eleF);
				} catch(e) { }
		 };
        $('#sources input:checked').each(function (e) {
            var m, val;
            if (! fail && this.value && (m = this.value.match(/\.(css|js)$/))) {
                var thisExt = m[1];
                if (ext === false)
                    ext = thisExt; 
                else if (thisExt !== ext) {
                    fail = true;
                    return alert('extensions must match!');
                }
                this.value = this.value.replace(/^\//, '');
                if (-1 !== $.inArray(this.value, sources)) {
                    fail = true;
                    return alert('duplicate file!');
                }
                sources.push(this.value);
            } 
        });
        if (fail || ! sources.length)
            return;
        var uri = MUB.getBestUri(sources),
            uriH = uri.replace(/</, '&lt;').replace(/>/, '&gt;').replace(/&/, '&amp;')
		$('#uriA').html('点击我下载吧~');
		$('#uriA').attr('href',uri);
        $('#results').show();
    },
    /**
     * Runs on DOMready
     */
    init : function () {
		$('#update').click(MUB.update);
    }
};
$(MUB.init);