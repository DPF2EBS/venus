(function(V){
    V.initController = function (group, stage, chartWidth, chartHeight, options) {
    /*
     * init the controller panel and mouse events
     * move , scale , full screen
     *
     * @param group{Object} Raphael G Element
     * @param stage{Object} instance of raphael
     * @param chartWidth{Number} width of the svg
     * @param chartHeight{Number} height of the svg
     * @param options{Object}
     *
     * */
//    var scaledX = 1, //already scaled x
//        scaledY = 1, //already scaled y
//        translatedX = x||0, //already translated x
//        translatedY = y||0 //already translated y

        var scaled = options.scale,
            translated = options.translate;

    var scale = function (lager) {
            /*
             * scale the chart
             * @param lager{Boolean} if true scale larger else smaller
             *
             * */
            if (lager) {
                //each time 1.25 by default
                scaled.x *= 1.25;
                scaled.y *= 1.25;

            } else {
                scaled.x /= 1.25;
                scaled.y /= 1.25;
            }
            group.transform('S' + scaled.x + "," + scaled.y + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translated.x + "," + translated.y);
        },
        move = function (x, y) {
            /*
             * move the chart
             * @param x{Number}
             * @param y{Number}
             * x and y are relative not absolute
             *
             * */
            translated.x += x;
            translated.y += y;
            group.transform('S' + scaled.x + "," + scaled.y  + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translated.x + "," + translated.y);
        },
        lastX, lastY,
    //use google map's hand picture
        openHandUrl = 'http://maps.gstatic.cn/intl/zh-CN_cn/mapfiles/openhand_8_8.cur',
        closeHandUrl = 'http://maps.gstatic.cn/intl/zh-CN_cn/mapfiles/closedhand_8_8.cur'

    //change the cursor property to let users know it's draggable
    stage.canvas.style.cursor = 'url("' + openHandUrl + '"), move';

    //add box inset shadow
    this.container.style.boxShadow = "0 0 1px 1px #ccc inset";

    //mouse scroll event
    //FireFox has no 'mousewheel' event but 'DOMMouseScroll' instead
    var mousewheel = navigator.userAgent.indexOf('Firefox') == -1 ? 'mousewheel' : 'DOMMouseScroll'
    stage.canvas.addEventListener(mousewheel, function (e) {
        e.preventDefault();
        //FireFox has no e.wheelDelta but e.detail instead
        scale(e.wheelDelta !== undefined ? e.wheelDelta > 0 : e.detail < 0);
    }, false);

    //drag event

    //first create an Raphael Element which is the svg Element so that we can use drag function of Raphael Element on the svg
    //we don't bind the drag on the 'g' element because there is a bug that g element  fires mouse event only on it's children
    //and could not on the space area

    (new Raphael.el.constructor(stage.canvas, stage)).drag(function (dx, dy, x, y, e) {
        //on move, dx and dy are the relative value to the drag START POINT

        //convert to relative value to current point and move
        move(dx - lastX, dy - lastY);

        //lastX and lastY use to save the last drag dx , dy
        lastX = dx;
        lastY = dy;
    }, function () {
        //on start

        //change cursor to closeHand
        stage.canvas.style.cursor = 'url("' + closeHandUrl + '"),move';

        //reset lastX and lastY to 0
        lastX = 0;
        lastY = 0;
    }, function () {
        //on end

        //change cursor back to openHand
        stage.canvas.style.cursor = 'url("' + openHandUrl + '"),move';
    });

    //init controller panel
    var panel = stage.g(), //controller panel is also kept in svg g element
        moveCircle, moveLeft, moveTop, moveRight, moveBottom,
        cx = 31, cy = 31, r = 30, arrowPadding = 5,
        arrowHeight = 10, arrowWeight = 6 , arrowInnerHeight = arrowHeight - arrowWeight

    //init move controller
    moveCircle = stage.circle(cx, cy, r).attr({
        'stroke':'#ccc',
        'stroke-width':1,
        'fill':'#fff',
        'cursor':'default'
    });
    panel.node.appendChild(moveCircle.node);

    //init four direction arrow, create one and use clone and rotate to create other three
    moveTop = stage.path().attr({
        'path':['M', cx, arrowPadding, 'l', -arrowHeight, arrowHeight, 'h', arrowWeight, 'l', arrowInnerHeight, -arrowInnerHeight, 'l', arrowInnerHeight, arrowInnerHeight, 'h', arrowWeight, 'l', -arrowHeight, -arrowHeight, 'z'],
        'fill':"#999999",
        'stroke':'none',
        'cursor':'pointer'
    });
    panel.node.appendChild(moveTop.node);
    moveLeft = moveTop.clone().transform('r' + -90 + ',' + cx + "," + arrowPadding + 't' + (arrowPadding - r ) + "," + (arrowPadding - r)).click(function (e) {
        e.stopPropagation();
        move(chartWidth / 10, 0);
    });
    panel.node.appendChild(moveLeft.node);
    moveRight = moveTop.clone().transform('r' + 90 + ',' + cx + ',' + arrowPadding + 't' + (r - arrowPadding ) + "," + (arrowPadding - r)).click(function (e) {
        e.stopPropagation();
        move(-chartWidth / 10, 0);
    });
    panel.node.appendChild(moveRight.node);
    moveBottom = moveTop.clone().transform('r' + 180 + ',' + cx + ',' + arrowPadding + 't' + 0 + "," + 2 * (arrowPadding - r)).click(function (e) {
        e.stopPropagation();
        move(0, -chartHeight / 10);
    })
    panel.node.appendChild(moveBottom.node);

    moveTop.click(function (e) {
        e.stopPropagation();
        move(0, chartHeight / 10);
    });

    //init scale controller
    var plus, minus,
        plusText, minusText,
        fullScreen,
        fullScreenArrow,
        existFullScreen,
        existFullScreenArrow,
        container = this.container,
        marginLeft = 10, marginTop = 5,
        rectWidth = 20

    //plus element ,minus clone it
    plus = stage.rect(2 * (r + 1) + marginLeft, marginTop, rectWidth, rectWidth).attr({
        'stroke':'#000',
        'stroke-width':1,
        'stroke-opacity':.5,
        'cursor':'pointer',
        'fill':'#fff'
    });
    minus = plus.clone().attr({
        'y':2 * (r + 1) - 1 - rectWidth - marginTop
    });

    //plus text '+' and minus text '-'
    plusText = stage.text(2 * (r + 1) + marginLeft + rectWidth / 2, marginTop + 1 + rectWidth / 2, '+').attr({
        'font-size':16,
        'cursor':'pointer'
    });
    minusText = stage.text(2 * (r + 1) + marginLeft + rectWidth / 2, 2 * (r + 1) - 1 - marginTop - 1 - rectWidth / 2, '-').attr({
        'font-size':16,
        'cursor':'pointer'
    });

    panel.node.appendChild(plus.node);
    panel.node.appendChild(minus.node);
    panel.node.appendChild(plusText.node);
    panel.node.appendChild(minusText.node);

    //bind plus and minus click event to scale
    plus.click(function (e) {
        e.stopPropagation();
        scale(true);
    });
    plusText.click(function (e) {
        e.stopPropagation();
        scale(true);
    });
    minus.click(function (e) {
        e.stopPropagation();
        scale(false);
    });
    minusText.click(function (e) {
        e.stopPropagation();
        scale(false);
    });

    //full screen
    //full screen button clones plus element
    fullScreen = plus.clone().attr('x', 2 * (r + 1) + marginLeft * 2 + 2 + rectWidth);
    panel.node.appendChild(fullScreen.node);
    fullScreen.click(function (e) {
        var container = stage.canvas
        //W3C suggest to use requestFullScreen
        //but webkit use webkitRequestFullScreen ,FireFox use mozRequestFullScreen
        //Opera and IE don't support the fullScreen API
        //careful fullScreen is called on the element but exitFullScreen is called on the document!!
        //WHAT THE FUCK!!
        container.requestFullScreen ? container.requestFullScreen() : (container.webkitRequestFullScreen ? container.webkitRequestFullScreen() : (container.mozRequestFullScreen && container.mozRequestFullScreen()));
    });

    //4 full screen arrows clone moveTop element and scale and rotate it
    fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 2  ) + "," + 2 + 'r' + 45 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(fullScreenArrow.node);
    fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth + 4  ) + "," + 2 + 'r' + (-45) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(fullScreenArrow.node);
    fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 2  ) + "," + (rectWidth - 2) + 'r' + 135 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(fullScreenArrow.node);
    fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth + 4  ) + "," + (rectWidth - 2) + 'r' + (-135) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(fullScreenArrow.node);

    //exist full screen
    //exist full screen button clone minus element
    existFullScreen = minus.clone().attr('x', 2 * (r + 1) + marginLeft * 2 + 2 + rectWidth);
    panel.node.appendChild(existFullScreen.node);
    existFullScreen.click(function (e) {
        e.stopPropagation();
        //W3C suggest to use exitFullScreen
        //but webkit use webkitCancelFullScreen ,FireFox use mozCancelFullScreen
        //all is called on the document ,unlike the fullScreen method !!
        document.exitFullScreen ? document.existFullScreen() : (document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : (document.mozCancelFullScreen && document.mozCancelFullScreen()));
    });
    existFullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 1.5 + 4  ) + "," + (2 * (r + 1) - rectWidth) + 'r' + (-45) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(existFullScreenArrow.node);
    existFullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 1.5  ) + "," + (2 * r - rectWidth) + 'r' + 135 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(existFullScreenArrow.node);
    existFullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 1.5 + 4  ) + "," + (2 * r - rectWidth) + 'r' + (-135) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(existFullScreenArrow.node);
    existFullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 1.5  ) + "," + (2 * (r + 1) - rectWidth) + 'r' + 45 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
    panel.node.appendChild(existFullScreenArrow.node);


    //the width of the total panel used when translate
    var panelWidth = (2 * (r + 1) + marginLeft * 2 + 4 + rectWidth * 2)

    function adjust() {
        //handler of the fullscreenchange event

        if (document.webkitIsFullScreen || document.mozFullScreen) {
            //webkit use webkitIsFullScreen , FireFox use mozFullScreen
            // true means full screen ,false opposite

            //is full screen and change the width and height of the svg to screen width height
            stage.setSize(window.screen.width, window.screen.height);
            panel.transform('T' + (window.screen.width - panelWidth - 20) + "," + 10);
        } else {
            //change width height to origin
            stage.setSize(chartWidth, chartHeight);
            panel.transform('T' + (chartWidth - panelWidth - 20) + ',' + 10)
        }
    }

    //WHAT THE FUCK again!
    //webkit fire the webkitfullscreenchange event on the element
    stage.canvas.addEventListener('webkitfullscreenchange', adjust, false);

    //FireFox fire the mozfullscreenchange event on the DOCUMENT !!
    document.addEventListener('mozfullscreenchange', adjust, false)

    //move to right
    panel.transform('T' + (chartWidth - panelWidth - 20) + ',' + 10)

}
})(Venus);