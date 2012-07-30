window.onload = function () {
    var r = Raphael("holder");
    r.customAttributes.segment = function (x, y, r, a1, a2) {
        var flag = (a2 - a1) > 180,
            clr = (a2 - a1) / 360;
        a1 = (a1 % 360) * Math.PI / 180;
        a2 = (a2 % 360) * Math.PI / 180;
        return {
            path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
            fill: "hsb(" + clr + ", .75, .8)"
        };
    };

    function animate(ms) {
        var start = 0,
            val;
        for (i = 0; i < ii; i++) {
            val = 360 / total * data[i];
            paths[i].animate({segment: [200, 200, 150, start, start += val]}, ms || 1500, "bounce");
            paths[i].angle = start - val / 2;
        }
    }

    var data = [24, 92, 24, 52, 78, 99, 82, 27],
        paths = r.set(),
        total,
        start,
        bg = r.circle(200, 200, 0).attr({stroke: "#fff", "stroke-width": 4});
    data = data.sort(function (a, b) { return b - a;});

    total = 0;
    for (var i = 0, ii = data.length; i < ii; i++) {
        total += data[i];
    }
    start = 0;
    for (i = 0; i < ii; i++) {
        var val = 360 / total * data[i];
        (function (i, val) {
            paths.push(r.path().attr({segment: [200, 200, 1, start, start + val], stroke: "#fff"}).click(function () {
                total += data[i];
                data[i] *= 2;
                animate();
            }));
        })(i, val);
        start += val;
    }
    bg.animate({r: 151}, 1000, "bounce");
    animate(1000);
    var t = r.text(200, 20, "Click on segments to make them bigger.").attr({font: '100 16px Courier, "Consolas", Arial, sans-serif', fill: "#F48307"});
    };
/* svg demo begins */ 
var container = document.getElementById('chart_container'),
    bingData = [25,30,40,10,60,15,9,20,25,33],
    bingOptions = {
        pie:{
            /*x:220,
            y:220,
            radius:90*/
        }
    };
    new DPChart(container, bingData, bingOptions);

// bar
var container1 = document.getElementById('chart_container1'),
            barData = [],
            barOptions = {
                axis:{
                    x:{
                        tickWidth:150,
                        ticks:['Q1', 'Q2', 'Q3', 'Q4']
                    },
                    y:{
                        min:0,
                        max:100,
                        tickWidth:65,
                        tickSize:10
                    }
                },
                bar:{
                    radius:2
                },
                grid:{
                    enableRow:true,
                    enableColumn:true
                },
                legend:{
                    direction:'horizontal',
                    position:['center','bottom']
                }

            }
    for (var i = 0, l = 3; i < l; i++) {
        var arr = {}
        barOptions.axis.x.ticks.forEach(function (month) {
            arr[month] = parseInt(Math.random() * 100)
        })
        barData.push({name:i, data:arr})
    }
    var bar = new DPChart(container1, barData, barOptions);

    // line

    var container2 = document.getElementById('chart_container2'),
        lineData = [],
            lineOptions = {
                axis:{
                    x:{
                        tickWidth:50,
                        ticks:['Jan', 'Feb', "Mar", 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    y:{
                        min:0,
                        max:100,
                        tickWidth:20,
                        tickSize:10
                    }
                },
                line:{
                    smooth:true
                },
                grid:{
                    enableColumn:true
                }

            }
    for (var i = 0, l = 5; i < l; i++) {
        var arr = []
        lineData.push({name:i, data:arr})
        for (var j = 0; j < 12; j++) {
            arr.push(parseInt(Math.random() * 100))
        }

    }
    var line = new DPChart(container2, lineData, lineOptions);
// dot
var container = document.getElementById('chart_container3'),
            data = [25,25,40,10,5,10,22,33],
            options = {
                axis:{
                    x:{
                        max:400,
                        ticks:['FF', 'IE', 'Chrome', 'other'],
                        tickWidth:200

                    },
                    y:{
                        min:0,
                        max:100,
                        tickWidth:40,
                        tickSize:10
                    }
                }, dot:{}
            }
    data=[];
    for (var i = 0, l = 4; i < l; i++) {
        var arr = []
        options.axis.x.ticks.forEach(function (month) {
            //arr[month] = parseInt(Math.random() * 100)
            arr.push(parseInt(Math.random() * 40+20))
        })
        data.push({name:options.axis.x.ticks[i], data:arr})
    }
    
    
    //console.log(data);
    var dot = new DPChart(container, data, options);