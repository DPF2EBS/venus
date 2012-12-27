if (typeof _gaq == "undefined") {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36468754-1']);
    _gaq.push(['_trackPageview']);
    var vga = function (key) {
        _gaq.push(['_trackPageview', key || ''])
    }, pageTracker = {_trackPageview:vga};

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    document.getElementsByTagName('head')[0].appendChild(ga);
}
try {
    pageTracker._trackPageview('venus_topology');
} catch (e) {
}