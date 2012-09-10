;
(function () {
    //extend Raphael element ,svg g Element
    Raphael._engine.g = function (svg) {
        var ns = 'http://www.w3.org/2000/svg';
        var el = document.createElementNS(ns, 'g')
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Raphael.el.constructor(el, svg);
        res.type = "g";
        el.setAttributeNS(ns, 'fill', '#fff')
        return res;
    };
    //call the paper.g() just like paper.rect() and other method
    Raphael.fn.g = function () {
        var out = Raphael._engine.g(this);
        this.__set__ && this.__set__.push(out);
        return out;
    };


    var cacheData = function (data) {
            //covert array to object
            var allNodes = {}
            data.forEach(function (d) {
                //easy to find node by id
                d.id !== undefined && (allNodes[d.id] = d);
            });
            return allNodes;
        },
        layNodes = function (data, allNodes) {
            /**
             * layout all the nodes
             * @param data{object}
             * @param allNodes{Object}
             *
             */

            var layers = {}, //layers in object and finally convert to array
                resultLayers = [], //layers in array,convert from layers
                nodes = {}, //nodes have been laid
                base = 0 , //base layer id

                lay = function (id, layer) {
                    /*
                     * lay a node in the target layer
                     * @param id{String} id of the node
                     * @param layer{Number} id of the layer
                     *
                     * */
                    if (nodes[id] || !allNodes[id]) {
                        //this node has been laid or not exists
                        return false;
                    }

                    //if layer not exist , init it
                    layers[layer] || (layers[layer] = []);

                    //tag node laid
                    nodes[id] = true;

                    //put it in the layer
                    layers[layer].push(allNodes[id]);

                    return true;
                },
                layParents = function (parents, currentLayer) {
                    /*
                     * lay parents in the previous layer
                     * @param parents{Array}
                     * @param currentLayer{Number} layer of the current node in
                     *
                     * */
                    if (!Venus.util.isArray(parents)) {
                        return;
                    }
                    var grandParents = [], //grand parents
                        grandChildren = []; //children of parents

                    parents.forEach(function (parent) {
                        if (lay(parent, currentLayer - 1)) {
                            //lay the parent and if returns true lay the parent's parents and children
                            allNodes[parent] && allNodes[parent].parents && Venus.util.isArray(allNodes[parent].parents) && (
                                //concat  parent's parents with the 'grandParents' above
                                grandParents = grandParents.concat(allNodes[parent].parents));
                            allNodes[parent] && allNodes[parent].children && Venus.util.isArray(allNodes[parent].children) && (
                                //concat parent's children with the 'grandChildren' above
                                grandChildren = grandChildren.concat(allNodes[parent].children));
                        }
                    });

                    //lay grandParents and grandChildren
                    grandParents.length && layParents(grandParents, currentLayer - 2);
                    grandChildren.length && layChildren(grandChildren, currentLayer);
                },
                layChildren = function (children, currentLayer) {
                    /*
                     * lay children in the next layer
                     * @param children{Array}
                     * @param currentLayer{Number} layer of the current node in
                     *
                     * very close to layParents function
                     * */
                    if (!Venus.util.isArray(children)) {
                        return;
                    }
                    var grandParents = [],
                        grandChildren = []
                    children.forEach(function (child, i) {
                        if (lay(child, currentLayer + 1)) {
                            allNodes[child] && allNodes[child].parents && Venus.util.isArray(allNodes[child].parents) && (
                                grandParents = grandParents.concat(allNodes[child].parents));
                            allNodes[child] && allNodes[child].children && Venus.util.isArray(allNodes[child].children) && (
                                grandChildren = grandChildren.concat(allNodes[child].children));
                        }
                    });
                    grandParents.length && layParents(grandParents, currentLayer);
                    grandChildren.length && layChildren(grandChildren, currentLayer + 2);
                }


            //start lay nodes
            data.forEach(function (d) {
                if (lay(d.id, base)) {
                    d.parents && layParents(d.parents, base);
                    d.children && layChildren(d.children, base);
                }
            });
            Object.keys(layers).sort(
                //sort the keys of the layers in number order
                function (a, b) {
                    return a - b;
                }).forEach(function (key) {
                    //cover the layer object to layer array
                    resultLayers.push(layers[key]);
                    layers[key].forEach(function (node, i) {
                        node._indexInLayer = i;//index of nodes in same layer,convenient for the later function
                    });
                });

            return  resultLayers;
        },
        layEdges = function (layers, allNodes, arrowDirection) {
            /*
             * lay edges
             * @param layers{Array} result of layNodes function
             * @param allNodes{Object} reference of the allNodes
             * @param arrowDirection{String} arrow direction from child to parent or from parent to child
             *
             * */

            var edgeGroups = []

            layers.forEach(function (layer, index) {
                //init edges between layer and the next layer

                var edges = [] //edges array

                if (index == layers.length - 1) {
                    //is the last layer and got no next layer
                    return;
                }
                var nextLayer = layers[index + 1]

                layer.forEach(function (node) {
                    nextLayer.forEach(function (node2) {
                        var isRelate = false
                        //check whether node and node2 are related
                        node2.parents && node2.parents.forEach(function (parent) {
                            if (node.id == parent && !isRelate) {
                                isRelate = true;
                                var edge = {
                                    node1:node,
                                    node2:node2
                                }
                                if (arrowDirection == CHILD_TO_PARENT) {
                                    edge.from = node2;
                                    edge.to = node
                                } else {
                                    edge.from = node;
                                    edge.to = node2;
                                }
                                edges.push(edge);
                            }
                        });
                        !isRelate && node2.children && node2.children.forEach(function (child) {
                            if (node.id == child && !isRelate) {
                                isRelate = true;
                                var edge = {
                                    node1:node,
                                    node2:node2
                                }
                                if (arrowDirection == CHILD_TO_PARENT) {
                                    edge.from = node;
                                    edge.to = node2
                                } else {
                                    edge.from = node2;
                                    edge.to = node;
                                }
                                edges.push(edge);
                            }
                        });
                    });
                });

                edgeGroups.push(edges);
            });
            return edgeGroups;
        },
        reduceCrossing = function (edgeGroup, layers) {
            //重心启发式算法，refer：http://ksei.bnu.edu.cn/old/paper/2005/gainiantudebujusuanfayanjiu.pdf

            //from top to bottom
            edgeGroup.forEach(function (edges, i) {
                var weight = {},
                    nodesWidthEdge = [],
                    index = 0
                edges.forEach(function (edge) {
                    var node2Id = edge.node2.id
                    weight[node2Id] || ((weight[node2Id] = {value:0, count:0}) && nodesWidthEdge.push(edge.node2));
                    weight[node2Id].value += edge.node1._indexInLayer;
                    weight[node2Id].count++;
                });

                //sort all the nodes which have edges
                nodesWidthEdge.sort(function (a, b) {
                    var aId = a.id,
                        bId = b.id
                    return weight[aId].value / weight[aId].count - weight[bId].value / weight[bId].count;
                });
                layers[i + 1].forEach(function (n, m) {
                    if (weight[n.id]) {
                        layers[i + 1][m] = nodesWidthEdge[index++];
                    }
                });
                //rewrite _indexInLayer
                layers[i + 1].forEach(function (node, j) {
                    node._indexInLayer = j;
                });
            });

            //from bottom to top
            for (var l = edgeGroup.length - 2; l >= 0; l--) {
                var weight = {},
                    nodesWidthEdge = [],
                    edges = edgeGroup[l],
                    index = 0
                edges.forEach(function (edge) {
                    var node1Id = edge.node1.id
                    weight[node1Id] || ((weight[node1Id] = {value:0, count:0}) && nodesWidthEdge.push(edge.node1));
                    weight[node1Id].value += edge.node2._indexInLayer;
                    weight[node1Id].count++;
                });

                //sort
                nodesWidthEdge.sort(function (a, b) {
                    var aId = a.id,
                        bId = b.id
                    return weight[aId].value / weight[aId].count - weight[bId].value / weight[bId].count;
                });
                layers[l].forEach(function (n, m) {
                    if (weight[n.id]) {
                        layers[l][m] = nodesWidthEdge[index++];
                    }
                });
                //rewrite _indexInLayer
                layers[l].forEach(function (node, j) {
                    node._indexInLayer = j;
                });
            }
        },
        arrowPath = function (paper, x1, y1, x2, y2, r, arrowLength, arrowWidth) {
            /*
             * calculate the arrow path string and rotate degree
             * arrow path is horizontal and the rotate to the target point
             * which is easy to calculate
             *
             * @param paper{Object} instance of Raphael
             * @param x1{Number}
             * @param y1{Number}
             * @param x2{Number}
             * @param y2{Number}
             * @param arrowLength{Number} length of the arrow
             * @param arrowWidth{Number}  width of the arrow
             *
             * */

            var length = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - 2 * r,
                degree45 = Math.PI / 4,
                hArrow = arrowLength * Math.cos(degree45),
                vArrow = arrowLength * Math.sin(degree45),
                alpha = Math.acos((x2 - x1) / (length + 2 * r)) * ( y1 > y2 ? 1 : -1);

            return {
                path:['M', x1 + r, y1, "h", length, 'l', -hArrow, -vArrow, 'm', hArrow, vArrow, 'l', -hArrow, vArrow],
                alpha:360 - alpha * 180 / Math.PI
            }

        },
        arrow = function (paper, r, edge, arrowLength, arrowWidth) {
            /*
             * draw arrow
             * @param paper{Object} instance of Raphael
             * @param r{Number} radius of the Node Circle
             * @param edge{Object} edge object which contains key info
             * @param arrowLength{Number} length of the arrow
             * @param arrowWidth{Number}  width of the arrow
             *
             * */

            var x1 = edge.from._x,
                y1 = edge.from._y,
                x2 = edge.to._x,
                y2 = edge.to._y,
                path = arrowPath(paper, x1, y1, x2, y2, r, arrowLength, arrowWidth)

            return paper.path().attr({
                'path':path.path,
                'stroke-width':arrowWidth,
                'stroke':'#2f69bf'
            }).rotate(path.alpha, x1, y1);

        },
        initController = function (group, stage, chartWidth, chartHeight, options) {
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
            var scaledX = 1, //already scaled x
                scaledY = 1, //already scaled y
                translatedX = 0, //already translated x
                translatedY = 0 //already translated y

            var scale = function (lager) {
                    /*
                     * scale the chart
                     * @param lager{Boolean} if true scale larger else smaller
                     *
                     * */
                    if (lager) {
                        //each time 1.25 by default
                        scaledX *= 1.25;
                        scaledY *= 1.25;

                    } else {
                        scaledX /= 1.25;
                        scaledY /= 1.25;
                    }
                    group.transform('S' + scaledX + "," + scaledY + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translatedX + "," + translatedY);
                },
                move = function (x, y) {
                    /*
                     * move the chart
                     * @param x{Number}
                     * @param y{Number}
                     * x and y are relative not absolute
                     *
                     * */
                    translatedX += x;
                    translatedY += y;
                    group.transform('S' + scaledX + "," + scaledY + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translatedX + "," + translatedY);
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

        },
        PARENT_ON_TOP = 'parent_on_top',
        PARENT_ON_BOTTOM = 'parent_on_bottom',
        PARENT_TO_CHILD = 'parent_to_child',
        CHILD_TO_PARENT = 'child_to_parent'

    var Topology = function (container, data, opt) {
        if (!container || !container.nodeType) {
            return;
        }
        this.container = container;
        this.data = data || [];

        var options = Venus.util.mix({
                width:container.clientWidth,
                height:container.clientHeight,
                layerDirection:PARENT_ON_TOP, //layer direction which is parent_on_top or parent_on_bottom
                arrowDirection:PARENT_TO_CHILD, //arrow direction which is parent_to_child or child_to_parent
                padding:40, //chart padding to svg border
                layerHeight:null,
                nodeRadius:30, //node radius
                arrowLength:10, //arrow length
                arrowWidth:2, //arrow width
                colorMap:{                          //color maps the status
                    1:'#FF0000',
                    2:'#7CFC00',
                    3:'#B1C9ED'
                },
                enableController:true, //enable the controller or not
                useAsText:'text', //use which property of the data as Text
                enableDrag:true, //enable node drag or not
                keepLayerWhenDrag:true, //whether keep the node on the layer when dragging it
                click:function (data) {
                    //'this' will be parsed as circle object , data is the node data
                },
                mouseover:function (data) {
                },
                mouseout:function (data) {
                }
            }, opt),
            stage = this.stage = new Raphael(container, options.width, options.height);

        //draw the chart now
        var allNodes = cacheData(this.data),
            layers = layNodes(this.data, allNodes)

        if (options.layerDirection == PARENT_ON_BOTTOM) {
            //parent is on the top by default ,if need to bottom , reverse it
            layers.reverse();
        }
        var edges = layEdges(layers, allNodes, options.arrowDirection)

        reduceCrossing(edges, layers);

        if (!layers.length)return;

        var chartWidth = options.width,
            chartHeight = options.height,
            maxLengthInLayer = 0;                //max count of nodes on layer

        maxLengthInLayer = Math.max.apply(Math, layers.map(function (layer) {
            return layer.length
        })) || 1;
        maxLengthInLayer == 2 && (maxLengthInLayer = 3); // if max is 2 then set it to 3 to let width be half of chart

        //draw nodes
        var height = options.layerHeight || (layers.length > 1 ? (chartHeight - options.padding * 2 ) / (layers.length - 1) : (chartHeight - options.padding * 2 ) ),
            width = maxLengthInLayer > 1 ? (chartWidth - options.padding * 2) / (maxLengthInLayer - 1) : 0,
            _circles = stage.set(),
            _texts = stage.set(),
            relation = {},
            _edges = stage.set(),
            group = stage.g();      //move , scale will all operated on this element

        if (options.enableController) {
            //width is too small and set it to 4 times of node radius
            width < 4 * options.nodeRadius && (width = 4 * options.nodeRadius);
            height < 4 * options.nodeRadius && (height = 4 * options.nodeRadius);
        }
        layers.forEach(function (layer, i) {
            //draw nodes on each layer
            //each layer is placed in middle
            var startX = (chartWidth - (layer.length - 1) * width) / 2
            layer.forEach(function (node, j) {
                var x = startX + j * width,
                    y = i * height + options.padding

                node._x = x;
                node._y = y;
                var color = options.colorMap[node.status] || 'green',
                    rgb = Raphael.getRGB(color),
                    hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b),
                    _circle, _text

                _circle = stage.circle(x, y, options.nodeRadius).attr({
                    //fill:options.colorMap[node.status],
                    fill:"r(.5,.5)" + color + "-" + Raphael.hsl2rgb(hsl.h, hsl.s - .1, hsl.l - .2).hex,
                    'stroke':'none',
                    'stroke-width':1,
                    cursor:'pointer'
                }).data('node', node).click(
                    function (e) {
                        //bind click event
                        //if is dragging , don't fire it
                        if (this._isDragging) {
                            this._isDragging = false;
                            return
                        }
                        options.click.call(this,e, node);
                    }).mouseover(
                    //mouseover
                    function (e) {
                        if (this._isDragging) {
                            this._isDragging = false;
                            return;
                        }
                        options.mouseover.call(this,e, node);
                    }).mouseout(function (e) {
                        //mouseout
                        if (this._isDragging) {
                            this._isDragging = false;
                            return;
                        }
                        options.mouseout.call(this,e, node);
                    });
                //put the node into group which is a svg g element
                group.node.appendChild(_circle.node);
                _circles.push(_circle);
                _text = stage.text(x, y, node[options.useAsText] === undefined ? node.id : node[options.useAsText])
                group.node.appendChild(_text.node);
                _texts.push(_text);
            });
        });

        //draw edges
        edges.forEach(function (layer) {
            layer.forEach(function (edge) {
                var _arrow = arrow(stage, options.nodeRadius, edge, options.arrowLength, options.arrowWidth)
                group.node.appendChild(_arrow.node);

                //save the related node , drag node will use this relation object
                relation[edge.node1.id] || (relation[edge.node1.id] = []);
                relation[edge.node1.id].push({arrow:_arrow, edge:edge});
                relation[edge.node2.id] || (relation[edge.node2.id] = []);
                relation[edge.node2.id].push({arrow:_arrow, edge:edge});
            });
        });

        //init node drag
        if (options.enableDrag) {
            _circles.forEach(function (circle, i) {
                var currentX,
                    currentY
                circle.drag(function (dx, dy, x, y, e) {
                    //on move , dx and dy are relative to the START POINT  of this drag
                    e.stopPropagation();
                    var targetX ,
                        targetY
                    this._isDragging = true; //tag _isDragging ,so that not to fire click event
                    targetX = dx + currentX;
                    targetY = dy + currentY;
                    if (options.keepLayerWhenDrag) {
                        this.attr({
                            cx:targetX
                        });
                        targetY = currentY;
                    } else {
                        this.attr({
                            cx:targetX,
                            cy:targetY
                        });
                    }

                    //reset _x and _y
                    this.data('node')._x = targetX;
                    this.data('node')._y = targetY;
                    _texts[i].attr({
                        x:targetX,
                        y:targetY
                    })

                    //move related edges
                    var id = circle.data('node').id
                    relation[id] && relation[id].forEach(function (obj) {
                        var edge = obj.edge,
                            arrow = obj.arrow

                        var x1 = edge.from._x,
                            y1 = edge.from._y,
                            x2 = edge.to._x,
                            y2 = edge.to._y,
                            path = arrowPath(stage, x1, y1, x2, y2, options.nodeRadius, options.arrowLength, options.arrowWidth)

                        //reset the path property
                        arrow.attr({
                            path:path.path
                        }).transform('R' + path.alpha + "," + x1 + "," + y1);
                    });
                }, function (x, y, e) {
                    //on start
                    e.stopPropagation();
                    //reset currentX,currentY to the node's current cx,cy
                    currentX = this.attr('cx');
                    currentY = this.attr('cy');
                }, function (e) {
                    e.stopPropagation();
                });
            })
        }

        //init controller
        if (options.enableController) {
            initController.call(this, group, stage, chartWidth, chartHeight, options);
        }

        //for unit test
        this._topology = {
            allNodes:allNodes,
            layers:layers,
            edges:edges
        }
    }

    Venus.Topology = Topology;

})();

