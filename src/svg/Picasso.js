/**
 * Created with JetBrains WebStorm.
 * User: allanma
 * Date: 12-6-28
 * Time: 下午5:14
 */
(function (undefined) {
    var SVG_NS = "http://www.w3.org/2000/svg",
        SupportSvg = !!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect,
        Picasso;

//    var SVG = require('svg'),
//        VML = require('vml');


    Picasso = SupportSvg ? SVG : VML;

    try {
        exports.Picasso = Picasso;
    } catch (e) {
        this.Picasso = Picasso;
    }
})();
