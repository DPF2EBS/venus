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


            layers.forEach(function (layer) {
                var edges = [] //一层边

                layer.forEach(function (node) {
                    node.parents && node.parents.forEach(function (parent) {
                        if (!allNodes[parent]) {
                            return;
                        }
                        var id = getId(parent, node.id),
                            edge
                        if (edge = existEdges[id]) {
                            return;
                        } else {
                            edge = existEdges[id] = {
                                node1:allNodes[parent],
                                node2:node
                            }
                            if (arrowDirection == CHILD_TO_PARENT) {
                                edge.from = node;
                                edge.to = allNodes[parent]
                            } else {
                                edge.from = allNodes[parent];
                                edge.to = node;
                            }

                            edges.push(edge);
                        }
                    });
                    node.children && node.children.forEach(function (child) {
                        var id = getId(node.id, child)
                        if (!allNodes[child]) {
                            return;
                        }
                        var id = getId(node.id, child),
                            edge
                        if (edge = existEdges[id]) {
                            return;
                        } else {
                            edge = existEdges[id] = {
                                node1:node,
                                node2:allNodes[child]
                            }
                            if (arrowDirection == CHILD_TO_PARENT) {
                                edge.from = allNodes[child];
                                edge.to = node
                            } else {
                                edge.from = node
                                edge.to = allNodes[child];
                            }
                            edges.push(edge);
                        }
                    });
                });
                edges.length && edgeGroups.push(edges);

            });
            return edgeGroups;
        },
        swapNode = function (layer, i1, i2) {
            if (i1 == i2) {
                return;
            }
            var temp = layer[i1];
            layer[i1] = layer[i2];
            layer[i1]._indexInLayer = i2;
            layer[i2] = temp;
            layer[i2]._indexInLayer = i1;
        },
        reduceCrossing = function (edgeGroup, allNodes) {
            edgeGroup.forEach(function (edges) {
                var lastTopIndex = 0,
                    lastBottomIndex = 0   //上层和下层的最后一个节点index,用于和当前边比较
                edges.forEach(function (edge) {

                });
            });
        },
        arrow = function (paper, r, edge, arrowLength) {
            //@param r : radius of circle
            var x1 = edge.from._x,
                y1 = edge.from._y,
                x2 = edge.to._x,
                y2 = edge.to._y,
                length = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - 2 * r,
                degree45 = Math.PI / 4,
                hArrow = arrowLength * Math.cos(degree45),
                vArrow = arrowLength * Math.sin(degree45),
                alpha = Math.acos((x2 - x1) / (length + 2 * r)) * ( y1 > y2 ? 1 : -1)

            return paper.path().attr({
                path:['M', x1 + r, y1, "h", length, 'l', -hArrow, -vArrow, 'm', hArrow, vArrow, 'l', -hArrow, vArrow],
                'stroke-width':.5,
                'stroke':'#2f69bf'
            }).rotate(360 - alpha * 180 / Math.PI, x1, y1);

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
                    nodeRadius:20,
                    arrowLength:10,
                    colorMap:{
                        1:'#b22222',
                        2:'#7CFC00',
                        3:'#B1C9ED'
                    },
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
                relation = {},
                _edges = stage.set()
            layers.forEach(function (layer, i) {
                var startX = (chartWidth - (layer.length - 1) * width) / 2
                layer.forEach(function (node, j) {
                    var x = startX + j * width,
                        y = i * height + options.padding

                    node._x = x;
                    node._y = y;
                    _circles.push(stage.circle(x, y, options.nodeRadius).attr({
                        fill:options.colorMap[node.status], //"r(.5,.5)" + options.colorMap[node.status] + "-white",
                        'stroke':'none',
                        cursor:'pointer'
                    }).data('node', node).click(function () {
                            options.onclick.call(this, node)
                        }))
                    //  stage.text(x, y, node.text);

                });
            });

            //draw edges
            edges.forEach(function (layer) {
                layer.forEach(function (edge) {
                    arrow(stage, options.nodeRadius, edge, options.arrowLength)
//                    relation[edge.from.id] || (relation[edge.from.id] = []);
//                    relation[edge.from.id].push(arrow);
//                    relation[edge.to.id] || (relation[edge.to.id] = []);
//                    relation[edge.to.id].push(arrow);
                });
            });

            //init drag
//            _circles.forEach(function (circle) {
//                var currentX,
//                    currentY
//                circle.drag(function (dx, dy, x, y, e) {
//                    //onmove
//                    this.attr({
//                        cx:dx + currentX,
//                        cy:dy + currentY
//                    })
//                }, function (x, y, e) {
//                    currentX = this.attr('cx');
//                    currentY = this.attr('cy');
//                });
//            })


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

