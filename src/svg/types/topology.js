;
(function () {
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
        PARENT_ON_TOP = 'parent_on_top',
        PARENT_ON_BOTTOM = 'parent_on_bottom',
        PARENT_TO_CHILD = 'parent_to_child',
        CHILD_TO_PARENT = 'child_to_parent'


    DPChart.addChart('topology', {
        draw:function () {
            var options = DPChart.mix({
                    layerDirection:PARENT_ON_TOP,
                    arrowDirection:CHILD_TO_PARENT,
                    padding:40,
                    nodeRadius:30,
                    arrowLength:10,
                    arrowWidth:2,
                    colorMap:{
                        1:'#FF0000',
                        2:'#7CFC00',
                        3:'#B1C9ED'
                    },
                    enableDrag:true,
                    onclick:function (data) {
                        //'this' will be parsed as circle object , data is the node data
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
                _edges = stage.set()
            layers.forEach(function (layer, i) {
                var startX = (chartWidth - (layer.length - 1) * width) / 2
                layer.forEach(function (node, j) {
                    var x = startX + j * width,
                        y = i * height + options.padding

                    node._x = x;
                    node._y = y;
                    var color = options.colorMap[node.status] || 'green',
                        rgb = Raphael.getRGB(color),
                        hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b)
                    _circles.push(stage.circle(x, y, options.nodeRadius).attr({
                        //fill:options.colorMap[node.status],
                        fill:"r(.5,.5)" + color + "-" + Raphael.hsl2rgb(hsl.h, hsl.s - .1, hsl.l - .2).hex,
                        'stroke':'none',
                        'stroke-width':1,
                        cursor:'pointer'
                    }).data('node', node).click(function () {
                            if (this._isDragging) {
                                this._isDragging = false;
                                return
                            }
                            options.onclick.call(this, node)
                        }))
                    _texts.push(stage.text(x, y, node.text));

                });
            });

            //draw edges
            edges.forEach(function (layer) {
                layer.forEach(function (edge) {
                    var _arrow = arrow(stage, options.nodeRadius, edge, options.arrowLength, options.arrowWidth)
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
                        this._isDragging = true;
                        this.attr({
                            cx:dx + currentX,
                            cy:dy + currentY
                        });
                        this.data('node')._x = dx + currentX;
                        this.data('node')._y = dy + currentY;
                        _texts[i].attr({
                            x:dx + currentX,
                            y:dy + currentY
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
                        currentX = this.attr('cx');
                        currentY = this.attr('cy');
                    }, function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                })
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

