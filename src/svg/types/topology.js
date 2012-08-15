;
(function () {
    //扩展Raphael，增加SVG g标签
    Raphael._engine.g = function (svg) {
        var ns = 'http://www.w3.org/2000/svg';
        var el = document.createElementNS(ns, 'g')
        svg.canvas && svg.canvas.appendChild(el);
        var res = new Raphael.el.constructor(el, svg);
        res.type = "g";
        el.setAttributeNS(ns, 'fill', '#fff')
        return res;
    }
    Raphael.fn.g = function (x, y, w, h) {
        var out = Raphael._engine.g(this, x || 0, y || 0, w || 0, h || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    }


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
            //分层
            var layers = {},
                resultLayers = [],
                nodes = {},
                base = 0 , //基础点所在的层
                lay = function (id, layer) {

                    if (nodes[id] || !allNodes[id]) {
                        //节点已经被分过了或者不存在
                        return false;
                    }
                    layers[layer] || (layers[layer] = []);
                    nodes[id] = true;
                    layers[layer].push(allNodes[id]);
                    return true;
                },
                layParents = function (parents, currentLayer) {
                    //层级优先，而非深度优先
                    if (!DPChart.isArray(parents)) {
                        return;
                    }
                    var grandParents = [],
                        grandChildren = []
                    parents.forEach(function (parent, i) {
                        if (lay(parent, currentLayer - 1)) {
                            allNodes[parent] && allNodes[parent].parents && DPChart.isArray(allNodes[parent].parents) && (
                                grandParents = grandParents.concat(allNodes[parent].parents));
                            allNodes[parent] && allNodes[parent].children && DPChart.isArray(allNodes[parent].children) && (
                                grandChildren = grandChildren.concat(allNodes[parent].children));
                        }
                    });
                    grandParents.length && layParents(grandParents, currentLayer - 2);
                    grandChildren.length && layChildren(grandChildren, currentLayer);
                },
                layChildren = function (children, currentLayer) {
                    if (!DPChart.isArray(children)) {
                        return;
                    }
                    var grandParents = [],
                        grandChildren = []
                    children.forEach(function (child, i) {
                        if (lay(child, currentLayer + 1)) {
                            allNodes[child] && allNodes[child].parents && DPChart.isArray(allNodes[child].parents) && (
                                grandParents = grandParents.concat(allNodes[child].parents));
                            allNodes[child] && allNodes[child].children && DPChart.isArray(allNodes[child].children) && (
                                grandChildren = grandChildren.concat(allNodes[child].children));
                        }
                    });
                    grandParents.length && layParents(grandParents, currentLayer);
                    grandChildren.length && layChildren(grandChildren, currentLayer + 2);
                }


            data.forEach(function (d) {
                if (lay(d.id, base)) {
                    d.parents && layParents(d.parents, base);
                    d.children && layChildren(d.children, base);
                }
            });
            Object.keys(layers).sort(
                function (a, b) {
                    return a - b;
                }).forEach(function (key) {
                    resultLayers.push(layers[key]);
                    layers[key].forEach(function (node, i) {
                        node._indexInLayer = i;//在同层中的位置，方便后续计算
                    });
                });

            return  resultLayers;
        },
        layEdges = function (layers, allNodes, arrowDirection) {
            var edgeGroups = [],
                existEdges = {},
                getId = function (parent, child) {
                    return "_" + parent + "_" + child
                }


            layers.forEach(function (layer, index) {
                var edges = [] //一层边
                if (index == layers.length - 1) {
                    return;
                }

                for (var i = 0, len = layer.length; i < len; i++) {
                    var node = layer[i]
                    for (var j = 0, l = layers[index + 1].length; j < l; j++) {
                        var node2 = layers[index + 1][j],
                            isRelate = false
                        //判断node是否是 node2的父节点或者子节点
                        node2.parents && node2.parents.forEach(function (parent) {
                            if (node.id === parent && !isRelate) {
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
                            if (node.id === child && !isRelate) {
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
                    }
                }
                edgeGroups.push(edges)
            });
            return edgeGroups;
        },
        reduceCrossing = function (edgeGroup, layers) {
            //重心启发式算法，refer：http://ksei.bnu.edu.cn/old/paper/2005/gainiantudebujusuanfayanjiu.pdf

            //从上往下
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

                //重新排序有边的节点
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
                //重新生成 _indexInLayer
                layers[i + 1].forEach(function (node, j) {
                    node._indexInLayer = j;
                });
            });

            //从下往上 再来一次
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

                //重新排序有边的节点
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
                //重新生成 _indexInLayer
                layers[l].forEach(function (node, j) {
                    node._indexInLayer = j;
                });
            }
        },
        arrowPath = function (paper, x1, y1, x2, y2, r, arrowLength, arrowWidth) {
            var length = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - 2 * r,
                degree45 = Math.PI / 4,
                hArrow = arrowLength * Math.cos(degree45),
                vArrow = arrowLength * Math.sin(degree45),
                alpha = Math.acos((x2 - x1) / (length + 2 * r)) * ( y1 > y2 ? 1 : -1)

            return {
                path:['M', x1 + r, y1, "h", length, 'l', -hArrow, -vArrow, 'm', hArrow, vArrow, 'l', -hArrow, vArrow],
                alpha:360 - alpha * 180 / Math.PI
            }

        },
        arrow = function (paper, r, edge, arrowLength, arrowWidth) {
            //@param r : radius of circle
            var x1 = edge.from._x,
                y1 = edge.from._y,
                x2 = edge.to._x,
                y2 = edge.to._y,
                path = arrowPath(paper, x1, y1, x2, y2, r, arrowLength, arrowWidth)

            return paper.path().attr({
                path:path.path,
                'stroke-width':arrowWidth,
                'stroke':'#2f69bf'
            }).rotate(path.alpha, x1, y1);

        },
        initController = function (group, stage, chartWidth, chartHeight, options) {
            //缩放
            var scaledX = 1,
                scaledY = 1,
                translatedX = 0,
                translatedY = 0
            var scale = function (lager) {
                    if (lager) {
                        scaledX *= 1.25;
                        scaledY *= 1.25;

                    } else {
                        scaledX *= 0.75;
                        scaledY *= 0.75;
                    }
                    group.transform('S' + scaledX + "," + scaledY + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translatedX + "," + translatedY);
                },
                move = function (x, y) {
                    translatedX += x;
                    translatedY += y;
                    group.transform('S' + scaledX + "," + scaledY + "," + chartWidth / 2 + "," + chartHeight / 2 + "T" + translatedX + "," + translatedY);
                },
                lastX, lastY,
                openHandUrl = 'http://maps.gstatic.cn/intl/zh-CN_cn/mapfiles/openhand_8_8.cur',
                closeHandUrl = 'http://maps.gstatic.cn/intl/zh-CN_cn/mapfiles/closedhand_8_8.cur'

            stage.canvas.style.cursor = 'url("' + openHandUrl + '"), move';
            this.container.style.boxShadow = "0 0 1px 1px #ccc inset";
            //mouse scroll event
            var mousewheel = navigator.userAgent.indexOf('Firefox') == -1 ? 'mousewheel' : 'DOMMouseScroll'
            stage.canvas.addEventListener(mousewheel, function (e) {
                e.preventDefault();
                scale(e.wheelDelta !== undefined ? e.wheelDelta > 0 : e.detail < 0);
            }, false);

            //drag event
            (new Raphael.el.constructor(stage.canvas, stage)).drag(function (dx, dy, x, y, e) {
                //onmove
                move(dx - lastX, dy - lastY);
                lastX = dx;
                lastY = dy;
            }, function () {
                stage.canvas.style.cursor = 'url("' + closeHandUrl + '"),move';
                lastX = 0;
                lastY = 0;
            }, function () {
                stage.canvas.style.cursor = 'url("' + openHandUrl + '"),move';
            });

            //init controller panel
            var panel = stage.g(),
                moveCircle, moveLeft, moveTop, moveRight, moveBottom,
                scaleLarger, scaleSmaller,
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
            fullScreen = plus.clone().attr('x', 2 * (r + 1) + marginLeft * 2 + 2 + rectWidth);
            panel.node.appendChild(fullScreen.node);
            fullScreen.click(function (e) {
                var container = stage.canvas
                container.requestFullScreen ? container.requestFullScreen() : (container.webkitRequestFullScreen ? container.webkitRequestFullScreen() : (container.mozRequestFullScreen && container.mozRequestFullScreen()));
            });
            fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 2  ) + "," + 2 + 'r' + 45 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
            panel.node.appendChild(fullScreenArrow.node);
            fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth + 4  ) + "," + 2 + 'r' + (-45) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
            panel.node.appendChild(fullScreenArrow.node);
            fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth * 2  ) + "," + (rectWidth - 2) + 'r' + 135 + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
            panel.node.appendChild(fullScreenArrow.node);
            fullScreenArrow = moveTop.clone().transform("t" + (r + 1 + marginLeft * 2 + rectWidth + 4  ) + "," + (rectWidth - 2) + 'r' + (-135) + "," + cx + "," + arrowPadding + "s.5,.5," + cx + "," + arrowPadding)
            panel.node.appendChild(fullScreenArrow.node);

            //exist full screen
            existFullScreen = minus.clone().attr('x', 2 * (r + 1) + marginLeft * 2 + 2 + rectWidth);
            panel.node.appendChild(existFullScreen.node);
            existFullScreen.click(function (e) {
                e.stopPropagation();
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

            var panelWidth = (2 * (r + 1) + marginLeft * 2 + 4 + rectWidth * 2)

            function adjust() {
                if (document.webkitIsFullScreen || document.mozFullScreen) {
                    stage.setSize(window.screen.width, window.screen.height);
                    stage.canvas.fill = '#fff'
                    panel.transform('T' + (window.screen.width - panelWidth - 20) + "," + 10);
                } else {
                    stage.setSize(chartWidth, chartHeight);
                    panel.transform('T' + (chartWidth - panelWidth - 20) + ',' + 10)
                }
            }

            stage.canvas.addEventListener('webkitfullscreenchange', adjust, false);
            document.addEventListener('mozfullscreenchange', adjust, false)

            // //move to right
            panel.transform('T' + (chartWidth - panelWidth - 20) + ',' + 10)


        },
        PARENT_ON_TOP = 'parent_on_top',
        PARENT_ON_BOTTOM = 'parent_on_bottom',
        PARENT_TO_CHILD = 'parent_to_child',
        CHILD_TO_PARENT = 'child_to_parent'


    DPChart.addChart('topology', {
        draw:function () {
            var options = DPChart.mix({
                    layerDirection:PARENT_ON_TOP,
                    arrowDirection:PARENT_TO_CHILD,
                    padding:40,
                    nodeRadius:30,
                    arrowLength:10,
                    arrowWidth:2,
                    colorMap:{
                        1:'#FF0000',
                        2:'#7CFC00',
                        3:'#B1C9ED'
                    },
                    enableController:true,
                    useAsText:'text',
                    enableDrag:true, //是否支持拖动
                    keepLayerWhenDrag:true, //是否只运行水平拖动
                    moveImageURL:'',
                    scaleImageURL:'',
                    click:function (data) {
                        //'this' will be parsed as circle object , data is the node data
                    },
                    mouseover:function (data) {
                    },
                    mouseout:function (data) {
                    }
                }, this.options.topology),
                stage = this.stage

            var allNodes = cacheData(this.data),
                layers = layNodes(this.data, allNodes)
            if (options.layerDirection == PARENT_ON_BOTTOM) {
                layers.reverse();
            }
            var edges = layEdges(layers, allNodes, options.arrowDirection)

            reduceCrossing(edges, layers);

            if (!layers.length)return;

            var chartWidth = this.options.width,
                chartHeight = this.options.height,
                maxLengthInLayer = 0 //层的最大个数

            maxLengthInLayer = Math.max.apply(Math, layers.map(function (layer) {
                return layer.length
            })) || 1;
            maxLengthInLayer == 2 && (maxLengthInLayer = 3); // 最大为2的时候 设为3 以使width= 一半 居中

            //draw nodes
            var height = layers.length > 1 ? (chartHeight - options.padding * 2 ) / (layers.length - 1) : (chartHeight - options.padding * 2 ) ,
                width = maxLengthInLayer > 1 ? (chartWidth - options.padding * 2) / (maxLengthInLayer - 1) : 0,
                _circles = stage.set(),
                _texts = stage.set(),
                relation = {},
                _edges = stage.set(),
                group = stage.g();

            //宽高过于小 影响美观， 反正可以缩放和拖动
            if (options.enableController) {
                width < 4 * options.nodeRadius && (width = 4 * options.nodeRadius);
                height < 4 * options.nodeRadius && (height = 4 * options.nodeRadius);
            }
            layers.forEach(function (layer, i) {
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
                        function () {
                            if (this._isDragging) {
                                this._isDragging = false;
                                return
                            }
                            options.click.call(this, node);
                        }).mouseover(
                        function () {
                            if (this._isDragging) {
                                this._isDragging = false;
                                return;
                            }
                            options.mouseover.call(this, node);
                        }).mouseout(function () {
                            if (this._isDragging) {
                                this._isDragging = false;
                                return;
                            }
                            options.mouseout.call(this, node);
                        });
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
                    relation[edge.node1.id] || (relation[edge.node1.id] = []);
                    relation[edge.node1.id].push({arrow:_arrow, edge:edge});
                    relation[edge.node2.id] || (relation[edge.node2.id] = []);
                    relation[edge.node2.id].push({arrow:_arrow, edge:edge});
                });
            });

            //init drag
            if (options.enableDrag) {
                _circles.forEach(function (circle, i) {
                    var currentX,
                        currentY
                    circle.drag(function (dx, dy, x, y, e) {
                        //onmove
                        e.stopPropagation();
                        var targetX ,
                            targetY
                        this._isDragging = true;
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

                            arrow.attr({
                                path:path.path
                            }).transform('R' + path.alpha + "," + x1 + "," + y1);
                        });
                    }, function (x, y, e) {
                        //onstart
                        e.stopPropagation();
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
            this._topology = {
                allNodes:allNodes,
                layers:layers,
                edges:edges
            }

        },
        layNodes:layNodes,
        cacheData:cacheData,
        layEdges:layEdges
    });
})();

