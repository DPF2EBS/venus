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


    var STRAITLINE = 'straightline',
        POLYLINE = "polyline",
        PARENT_ON_TOP = 'parent_on_top',
        PARENT_ON_BOTTOM = 'parent_on_bottom',
        PARENT_TO_CHILD = 'parent_to_child',
        CHILD_TO_PARENT = 'child_to_parent';
    var Topology = Venus.Topology;

    var Graph = function (container, data, opt) {
        if (!container || !container.nodeType) {
            return;
        }
        this.container = container;
        this.data = data || [];

        var options = this.options = Venus.util.mix({
                width:container.clientWidth,
                height:container.clientHeight,
                layerDirection:PARENT_ON_TOP, //layer direction which is parent_on_top or parent_on_bottom
                arrowDirection:PARENT_TO_CHILD, //arrow direction which is parent_to_child or child_to_parent
                padding:40, //chart padding to svg border
                layerHeight:null,
                nodeRadius:30, //node radius
                nodeType:'circle',
                arrowLength:10, //arrow length
                arrowWidth:1, //arrow width
                colorMap:{                          //color maps the status
                    1:'#FF0000',
                    2:'#7CFC00',
                    3:'#B1C9ED'
                },
                badStatus:[],
                align:'left',
                singleMax:4,
                edgeType:STRAITLINE,
                enableController:true, //enable the controller or not
                useAsText:'text', //use which property of the data as Text
                enableDrag:true, //enable node drag or not
                keepLayerWhenDrag:false, //whether keep the node on the layer when dragging it
                click:function (data) {
                    //'this' will be parsed as circle object , data is the node data
                },
                mouseover:function (data) {
                },
                mouseout:function (data) {
                },
                contextmenu:function(e,node){

                },
                showCrossLayerEdge:false,
                reduceCrossing:true
            }, Venus.util.clone(opt || {})),
            stage = this.stage = new Raphael(container, options.width, options.height),
            self = this;
        //create nodes and relations
        this._prepareNodes();

        //lay nodes
        this._layNodes();


        if (options.layerDirection == PARENT_ON_BOTTOM) {
            //parent is on the top by default ,if need to bottom , reverse it
           this.graphs.forEach(function(graph){
               graph.resultLayers.reverse();
           })
        }
        this.graphs.sort(function(a,b){
            return b.resultLayers.length - a.resultLayers.length;
        });




        //lay edges
    //    this.layEdges();

       options.reduceCrossing && this._reduceCrossing();

       Object.keys(this.nodes).forEach(function(id){
           var node = self.nodes[id];
           node.parents.sort(function (a, b) {
               return  a.indexInLayer - b.indexInLayer;
           });
//           node.children.sort(function (a, b) {
//               return a.indexInLayer - b.indexInLayer;
//           });
        });

        this._renderNodes();

        this._renderEdges();

       options.showCrossLayerEdge &&  this._renderCrossLayerEdges();


        options.badStatus.length && this._focusBad();

        //init node drag
       options.enableDrag && this._enableDrag();

        //init controller
        if (options.enableController) {
            Venus.initController.call(this, self.group, stage, options.width, options.height, options,self.transformX ,self.transformY );
        }
    };

    Graph.prototype = {
        _prepareNodes:function () {
            var noParentNodes = {},
                noChildrenNodes = {},
                nodes = {},
                self = this;
            function operateParents(d, parents) {
                var id = d.id;
                if (parents && parents.length) {
                    parents.forEach(function (pid) {
                        var node = nodes[pid];
                        if(!node){
                            self.data.forEach(function(dd){
                               if(dd.id == pid){
                                   node = new Topology.Node(dd);
                                   nodes[pid] = node;
                                   //put in noParentNodes
                                   noParentNodes[pid] = node;
                               }
                            });
                        }

                        if (node) {
                            //add to node's parent
                            d.addParent(node);
                            node.addChild(d);
                            //delete node in noParentNodes
                            delete noParentNodes[id];
                            delete noChildrenNodes[pid];
                        }
                    });
                }
            }

            function operateChildren(d, children) {
                var id = d.id;
                children.forEach(function (cid) {
                    var node = nodes[cid];
                    if (!node) {
                        self.data.forEach(function (dd) {
                            if (dd.id == cid) {
                                node = new Venus.Topology.Node(dd);
                                nodes[cid] = node;
                                //put in noParentNodes
                                noChildrenNodes[cid] = node;
                            }
                        });
                    }

                    if(node){
                        //add to node's parent
                        d.addChild(node);
                        node.addParent(d);
                        //delete node in noParentNodes
                        delete noChildrenNodes[id];
                        delete noParentNodes[cid];
                    }

                });
            }

            this.data.forEach(function (d) {
                var id = d.id,
                    node;
                if(!id){return}
                node = nodes[id];
                if (!nodes[id]) {
                    //never dealing the node
                    node = new Venus.Topology.Node(d);
                    noParentNodes[id] = node;
                    noChildrenNodes[id] = node;
                    nodes[id] = node;
                }
                operateChildren(node, d.children);
                operateParents(node, d.parents);
            });

            this.nodes = nodes;
            this.noParentNodes = noParentNodes;
            this.noChildNodes = noChildrenNodes;

        },
        _layNodes:function () {
            /**
             * layout all the nodes
             * @param data{object}
             * @param allNodes{Object}
             *
             */

            var roots,
                graphs = [], //each separated graphs
                laidNodes = {}, //nodes have been laid
                crossLayerEdges = [],

                hasThisEdge = function(edges,from,to){
                    var has = false;
                    edges.forEach(function(edge){
                        if(edge.from == from && edge.to==to){
                            has = true
                        }
                    });
                    return has;
                },

                lay = function (node, layer, layers,edges) {
                    /*
                     * lay a node in the target layer
                     * @param id{String} id of the node
                     * @param layer{Number} id of the layer
                     *
                     * */

                    //if layer not exist , init it
                    layers[layer] || (layers[layer] = []);
                    edges[layer] || (edges[layer] = []);

                    if (laidNodes[node.id]) {
                        return false;
                    }

                    //tag node laid
                    laidNodes[node.id] = true;

                    //put it in the layer
                    layers[layer].push(node);
                    node._layer = layer;

                    return true;
                },
                layRelation = function (nodes,  layers,edges) {
                    /*
                     * lay children in the next layer
                     * @param children{Array}
                     * @param currentLayer{Number} layer of the current node in
                     *
                     * very close to layParents function
                     * */
                    if (!Venus.util.isArray(nodes) || !nodes.length) {
                        return;
                    }
                    var parents = [],
                        children= [];
                    nodes.forEach(function (node) {
                        var currentLayer = node._layer;
                        if (node.children && node.children.length) {
                            //lay children
                            node.children.forEach(function (child) {
                                if (lay(child, node._layer + 1, layers, edges)) {
                                    children.push(child);
                                }
                                if(hasThisEdge(edges[node._layer ], node,child)){
                                    return;
                                }
                                var edge = {
                                    from:node,
                                    to:child
                                };
                                //add edge
                                if (layers[node._layer  + 1].indexOf(child) != -1) {
                                    edge.node1 = node;
                                    edge.node2 = child;
                                    edges[node._layer ].push(edge);
                                } else if (layers[node._layer  - 1] && layers[node._layer  - 1].indexOf(child) != -1) {
                                    edge.node1 = child;
                                    edge.node2 = node;
                                    edges[node._layer-1 ].push(edge);
                                }else{
                                    //cross layer edge
                                    crossLayerEdges.push(edge);
                                }
                            });
                        }
                        if (node.parents && node.parents.length) {
                            node.parents.forEach(function (parent) {
                                if(lay(parent, currentLayer - 1, layers, edges)){
                                    parents.push(parent);
                                }
                                if(hasThisEdge(edges[currentLayer - 1], parent,node)){
                                    return;
                                }
                                var edge = {
                                    from:parent,
                                    to:node
                                };
                                //add edge
                                if (layers[currentLayer - 1].indexOf(parent) != -1) {
                                    edge.node1 = parent;
                                    edge.node2 = node;
                                    edges[currentLayer-1].push(edge);
                                } else if (layers[currentLayer + 1] && layers[currentLayer + 1].indexOf(parent) != -1) {
                                    edge.node1 = node;
                                    edge.node2 = parent;
                                    edges[currentLayer].push(edge);
                                }else{
                                    //cross layer edge
                                    crossLayerEdges.push(edge);
                                }
                            });
                        }
                    });

                    layRelation(children.concat(parents), layers, edges);
                };

            roots = this.noParentNodes;

            //start lay nodes
            Object.keys(roots).forEach(function (id) {
                var node = roots[id];
                if (laidNodes[id]) {
                    //has laid this node
                    return;
                }

                var layers = {},
                    resultLayers = [],
                    tempEdgeGroups = {},
                    edgeGroups = [],
                    graph = {
                        layers:layers,
                        resultLayers:resultLayers,
                        start:node,
                        edgeGroups:edgeGroups
                    },
                    base = 0;       //base layer id
                graphs.push(graph);

                if (lay(node, base, layers, tempEdgeGroups)) {
                    layRelation([node],  layers, tempEdgeGroups);
                }
                Object.keys(layers).sort(
                    //sort the keys of the layers in number order
                    function (a, b) {
                        return a - b;
                    }).filter(
                    function (a) {
                        return !!layers[a].length;
                    }).forEach(function (key) {
                        //cover the layer object to layer array
                        resultLayers.push(layers[key]);
                        layers[key].forEach(function (node, i) {
                            node.setIndex(i);   //index of nodes in same layer,convenient for the later function
                            node.setGraph(graph);
                        });
                    });
                Object.keys(tempEdgeGroups).sort(
                    function (a, b) {
                        return a - b;
                    }).filter(
                    function (a) {
                        return !!tempEdgeGroups[a].length;
                    }).forEach(function (key) {
                        edgeGroups.push(tempEdgeGroups[key]);
                    });

            });
            this.graphs = graphs;
            this.crossLayerEdges = crossLayerEdges;
        },
        _reduceCrossing:function () {
            //重心启发式算法，refer：http://ksei.bnu.edu.cn/old/paper/2005/gainiantudebujusuanfayanjiu.pdf

            //from top to bottom
            var self = this;
            this.graphs.forEach(function (graph,i) {
                if(i!==0){
                    return;
                }
                var edgeGroup = graph.edgeGroups,
                    layers = graph.resultLayers;

                edgeGroup.forEach(function (edges, i) {
                    var weight = {},
                        nodesWithEdge = [],
                        index = 0;
                    edges.forEach(function (edge) {
                        var node2Id = edge.node2.id;
//                        if(node2Id==2000432012102600){
//                            console.log(i, layers[i+1].indexOf(self.nodes[node2Id]))
//                        }
                        weight[node2Id] || ((weight[node2Id] = {value:0, count:0}) && nodesWithEdge.push(edge.node2));
                        weight[node2Id].value += edge.node1.getIndex();
                        weight[node2Id].count++;
                    });

                    //sort all the nodes which have edges
                    nodesWithEdge.sort(function (a, b) {
                        var aId = a.id,
                            bId = b.id;
                        return weight[aId].value / weight[aId].count - weight[bId].value / weight[bId].count;
                    });
                    layers[i + 1].map(function (n, m) {
                        return weight[n.id]? nodesWithEdge[index++]: n;
                    });
                    //rewrite _indexInLayer
                    layers[i + 1].forEach(function (node, j) {
                        node.setIndex(j);
                    });
                });

                //from bottom to top
                for (var l = edgeGroup.length - 1; l >= 0; l--) {
                    var weight = {},
                        nodesWithEdge = [],
                        edges = edgeGroup[l],
                        index = 0;
                    edges.forEach(function (edge) {
                        var node1Id = edge.node1.id;
                        weight[node1Id] || ((weight[node1Id] = {value:0, count:0}) && nodesWithEdge.push(edge.node1));
                        weight[node1Id].value += edge.node2.getIndex();
                        weight[node1Id].count++;
                    });

                    //sort
                    nodesWithEdge.sort(function (a, b) {
                        var aId = a.id,
                            bId = b.id;
                        return weight[aId].value / weight[aId].count - weight[bId].value / weight[bId].count;
                    });
                    layers[l].map(function (n, m) {
                        return weight[n.id]? nodesWithEdge[index++]: n;
                    });
                    //rewrite _indexInLayer
                    layers[l].forEach(function (node, j) {
                        node.setIndex(j);
                    });
                }

            });
        },
        _renderNodes:function(){
            var options = this.options,
                chartWidth = options.width,
                chartHeight = options.height,
                stage = this.stage,
                self = this,
                group = stage.g(),              //move , scale will all operated on this element
                currentY = options.padding,
                currentIndex = 0,
                width,height;

            this.group = group;

            function drawNode(node,x,y){
                //TODO types , onmenutext
                node.render(stage, options.nodeType, x, y, options.nodeRadius);

               var _circle = node.view.attr({
                    fill:options.colorMap[node.info.status] , //"r(.5,.5)" + color + "-" + Raphael.hsl2rgb(hsl.h, hsl.s - .1, hsl.l - .2).hex,
                    'stroke':'none',
                    'stroke-width':1,
                    cursor:'pointer'
                }).click(
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
                if(options.contextmenu){
                    _circle.node.addEventListener('contextmenu',function(e){
                        options.contextmenu.call(_circle, e, node);
                    });
                }

                //put the node into group which is a svg g element
                group.node.appendChild(_circle.node);
                return _circle;
            }

            this.graphs.forEach(function (graph,i) {
                var _circles = stage.set(),
                    _texts = stage.set(),
                    relation = {},
                    _edges = stage.set(),
                    layers = graph.resultLayers,
                    max = options.singleMax,
                    right = 100;

                if (i == 0) {
                    var maxLengthInLayer ; //max count of nodes on layer

                    maxLengthInLayer = Math.max.apply(Math, layers.map(function (layer) {
                        return layer.length
                    })) || 1;
                    maxLengthInLayer == 2 && (maxLengthInLayer = 3); // if max is 2 then set it to 3 to let width be half of chart

                    //draw nodes
                    height = options.layerHeight || (layers.length > 1 ? (chartHeight - options.padding * 2 ) / (layers.length - 1) : (chartHeight - options.padding * 2 ) );
                    width = maxLengthInLayer > 1 ? (chartWidth - options.padding * 2) / (maxLengthInLayer - 1) : 0;

                    if (options.enableController) {
                        //width is too small and set it to 4 times of node radius
                        width < 4 * options.nodeRadius && (width = 4 * options.nodeRadius);
                        height < 4 * options.nodeRadius && (height = 4 * options.nodeRadius);
                    }
                    self.layerHeight = height;
                    layers.forEach(function (layer, i) {
                        //draw nodes on each layer
                        //each layer is placed in middle
                        var startX = options.align=="left"? options.nodeRadius: (chartWidth - (layer.length - 1) * width) / 2;
                        layer.forEach(function (node, j) {
                            var x = startX + j * width,
                                y = i * height + options.padding;

                            var color = options.colorMap[node.info.status] || 'green',
                                rgb = Raphael.getRGB(color),
                                hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b),
                                _circle, _text;


                            _circle =  drawNode(node, x, y);

                            _circles.push(_circle);
                            _text = stage.text(x, y, options.useAsText === undefined ? node.id : node.info[options.useAsText]);
                            group.node.appendChild(_text.node);
                            _texts.push(_text);
                        });
                    });
                }else{
                    if (layers.length > 1) {
                        layers.forEach(function(layer,i){
                            var startX = (options.align == "left" ? -options.nodeRadius : -(chartWidth - (layer.length - 1) * width) / 2)-right,
                                startY = currentY;
                            layer.forEach(function (node, j) {
                                var x = startX - j * width,
                                    y =  startY ;

                                var color = options.colorMap[node.info.status] || 'green',
                                    rgb = Raphael.getRGB(color),
                                    hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b),
                                    _circle, _text;

                                _circle =  drawNode(node, x, y);

                                _circles.push(_circle);
                                _text = stage.text(x, y, options.useAsText === undefined ? node.id : node.info[options.useAsText]);
                                group.node.appendChild(_text.node);
                                _texts.push(_text);

                            });
                            currentY += height;
                        });
                    }else{
                        if (layers[0] && layers[0][0]) {
                            var node = layers[0][0],
                                x = -options.nodeRadius  -(currentIndex % max) * width - right ,
                                y = height * Math.floor(currentIndex / max) + currentY;

                            var _circle =  drawNode(node, x, y);
                            _circles.push(_circle);
                            var _text = stage.text(x, y, options.useAsText === undefined ? node.id : node.info[options.useAsText]);
                            group.node.appendChild(_text.node);
                            _texts.push(_text);
                            currentIndex++;
                        }
                    }
                }
                graph.relation = relation;
                graph.nodeElements  = _circles;
                graph.textElements  = _texts;

            });
        },
        _renderEdges:function(){
            var group = this.group,
                options = this.options,
                stage = this.stage,
                self = this;

            this.graphs.forEach(function (graph,i) {
                graph.edgeGroups.forEach(function (layer,i) {
                    layer.forEach(function (edge) {
                       self.arrow(stage, edge, (self.layerHeight- 2* options.nodeRadius - options.arrowLength*2) / graph.resultLayers[i].length);


                        group.node.appendChild(edge.line.node);
                        group.node.appendChild(edge.arrow.node);

                        //save node's parent edge and child edge
                        edge.from.addChildEdge(edge);
                        edge.to.addParentEdge(edge);
                    });
                });
            });
        },
        _renderCrossLayerEdges:function(){
            var self = this,
                stage = self.stage,
                group = self.group;
            this.crossLayerEdges.forEach(function(edge){
                self.arrow(stage, edge);

                group.node.appendChild(edge.line.node);
                group.node.appendChild(edge.arrow.node);

                //save node's parent edge and child edge
                edge.from.addChildEdge(edge);
                edge.to.addParentEdge(edge);
            });
        },
        _focusBad:function(){
            var self = this;
            for(var i= 0,l=this.graphs.length;i<l;i++){
                for(var j= 0,len=this.graphs[i].resultLayers.length;j<len;j++){
                    for(var k= 0,length=this.graphs[i].resultLayers[j].length;k<length;k++){
                        var node = this.graphs[i].resultLayers[j][k];
                        if(self.options.badStatus.indexOf(node.info.status)!==-1){
                            self.transformX = 0;//self.options.width / 2 - node.position().x;
                            self.transformY = -node.position().y + self.options.nodeRadius;
                            self.group.transform('T' + self.transformX  + "," + self.transformY );
                            return;
                        }
                    }
                }
            }
        },
        straightPath:function (x1, y1, x2, y2) {
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

            var options = this.options,
                r = options.nodeRadius,
                arrowLength = options.arrowLength,
                length = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) - 2 * r,
                alpha ,
                path = ['M', x1 + r, y1, "h", length],
                arrowPath = ['M', x1 + r + length, y1, 'l', -arrowLength, -arrowLength / 2, 'l', arrowLength / 2, arrowLength / 2, -arrowLength / 2, arrowLength / 2, arrowLength, -arrowLength / 2],
                rx = x1,
                ry = y1;
            if (y1 == y2) {
                if (x1 > x2) {
                    alpha = Math.PI;
                } else {
                    alpha = 0;
                }
            } else {
                alpha = ( Math.acos((x2 - x1) / (length + 2 * r)) * ( y1 > y2 ? 1 : -1));
            }

            if (options.nodeType == "rect") {
                length = Math.sqrt(Math.pow(Math.abs(y1 - y2) - 2 * r, 2) + Math.pow(x2 - x1, 2));
                alpha = Math.acos((x2 - x1) / length) * ( y1 > y2 ? 1 : -1);
                path = ['M', x1, (y1 > y2 ? y1 - r : y1 + r), 'h', length];
                arrowPath = ['M', x1 + length, (y1 > y2 ? y1 - r : y1 + r), 'l', -arrowLength, -arrowLength / 2, 'l', arrowLength / 2, arrowLength / 2, -arrowLength / 2, arrowLength / 2, arrowLength, -arrowLength / 2]
                rx = x1;
                ry = (y1 > y2 ? y1 - r : y1 + r);
                if (y1 == y2) {
                    length = Math.abs(x1-x2)-2*r;
                    path = ['M', x1 + r, y1, 'h', length];
                    arrowPath = ['M', x1 + r + length, y1, 'l', -arrowLength, -arrowLength / 2, 'l', arrowLength / 2, arrowLength / 2, -arrowLength / 2, arrowLength / 2, arrowLength, -arrowLength / 2]
                    ry = y1;
                    if (x1 > x2) {
                        alpha =Math.PI;
                    } else {
                        alpha = 0;
                    }
                }
            }

            return {
                path:path,
                arrowPath:arrowPath,
                alpha:360 - alpha * 180 / Math.PI,
                x:rx,
                y:ry
            }

        },
        arrow:function (paper, edge, unitHeight) {
            /*
             * draw arrow
             * @param paper{Object} instance of Raphael
             * @param r{Number} radius of the Node Circle
             * @param edge{Object} edge object which contains key info
             * @param arrowLength{Number} length of the arrow
             * @param arrowWidth{Number}  width of the arrow
             *
             * */

            var pos1 = edge.from.position(),
                pos2 = edge.to.position(),
                x1 = parseInt(pos1.x),
                y1 = parseInt(pos1.y),
                x2 = parseInt(pos2.x),
                y2 = parseInt(pos2.y),
                options = this.options,
                path;

            if (options.edgeType == POLYLINE && y1 < y2) {
                var hasStraight, straightIndex, xOffset;
                edge.to.parents.forEach(function (p, i) {
                    if (parseInt(p.position().x) == x2) {
                        straightIndex = i;
                        hasStraight = true;
                    }
                });
                if (x1 === x2) {
                    xOffset = 0
                } else {
                    if (hasStraight) {
                        xOffset = options.arrowLength * (edge.to.parents.indexOf(edge.from) - straightIndex);
                    } else {
                        xOffset = options.arrowLength * ( edge.to.parents.indexOf(edge.from) - Math.floor(edge.to.parents.length / 2));
                    }
                }

                path = this.polyLinePath(x1, y1, x2, y2, xOffset, (edge.from.indexInLayer + 1) * unitHeight);
            } else {
                path = this.straightPath(x1, y1, x2, y2);
            }

            edge.arrow  = (edge.arrow || paper.path()).attr({
                path:path.arrowPath,
                'fill':'#999',
                stroke:'none'
            });

            edge.line= (edge.line || paper.path()).attr({
                'path':path.path,
                'stroke-width':options.arrowWidth,
                'stroke':'#999'
            });

            edge.line.transform('R' + path.alpha + "," + path.x + "," + path.y);
            edge.arrow.transform('R' + path.alpha + "," + path.x + "," + path.y);
            if (y1 > y2) {
                edge.arrow.attr('fill', '#999');
                edge.line.attr('stroke', '#999');
            }
        },
        polyLinePath:function (x1, y1, x2, y2,xOffset, yOffset) {
            var options = this.options,
                radius = options.nodeRadius,
                arrowLength = options.arrowLength,
                arrowPath,
                path;
            if (y1 < y2) {
                if (x1 == x2) {
                    path = ["M", x1, y1 + radius, 'V',  y2 - radius,'M', x2, y2 - radius,'l',-arrowLength/2,-arrowLength,'l',arrowLength/2,arrowLength/2,'l',arrowLength/2,-arrowLength/2,'l',-arrowLength/2,arrowLength];
                    arrowPath = ['M', x2, y2 - radius,'l',-arrowLength/2,-arrowLength,'l',arrowLength/2,arrowLength/2,'l',arrowLength/2,-arrowLength/2,'l',-arrowLength/2,arrowLength]
                } else {
                    path = ["M", x1, y1 + radius, 'v', yOffset, 'H', x2 + xOffset , 'V', y2 - radius];
                    arrowPath = ['M', x2+xOffset, y2 - radius,'l',-arrowLength/2,-arrowLength,'l',arrowLength/2,arrowLength/2,'l',arrowLength/2,-arrowLength/2,'l',-arrowLength/2,arrowLength]
                }
            }else{
                if (x1 == x2) {
                    path = ["M", x1, y1 - radius, 'V', y2 + radius];
                    arrowPath = ['M', x2, y2 + radius,'l',-arrowLength/2,arrowLength,'l',arrowLength/2,-arrowLength/2,'l',arrowLength/2,arrowLength/2,'l',-arrowLength/2,-arrowLength]

                } else {
                    path = ["M", x1, y1 - radius, 'v', -yOffset, 'H', x2 + xOffset , 'V', y2 + radius];
                    arrowPath = ['M', x2+xOffset, y2 + radius,'l',-arrowLength/2,arrowLength,'l',arrowLength/2,-arrowLength/2,'l',arrowLength/2,arrowLength/2,'l',-arrowLength/2,-arrowLength]
                }
            }
            return {
                path:path,
                arrowPath:arrowPath,
                alpha:0
            }
        },
        _enableDrag:function(){
            var self = this;
            self.graphs.forEach(function(graph){
                graph.nodeElements.forEach(function (circle, i) {
                    var currentX,
                        currentY;
                    circle.drag(function (dx, dy, x, y, e) {
                        //on move , dx and dy are relative to the START POINT  of this drag
                        e.stopPropagation();
                        var targetX ,
                            targetY;
                        this._isDragging = true; //tag _isDragging ,so that not to fire click event
                        targetX = dx + currentX;
                        targetY = dy + currentY;
                        if (self.options.keepLayerWhenDrag) {
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
                        this.data('node').position(targetX,targetY);
                        graph.textElements[i].attr({
                            x:targetX,
                            y:targetY
                        });

                        //move related edges
                        var node = circle.data('node');
                        node.parentsEdges.forEach(function (edge) {
                            self.arrow(self.stage, edge);
                        });
                        node.childrenEdges.forEach(function (edge) {
                            self.arrow(self.stage, edge);
                        });
                    }, function (x, y, e) {
                        //on start
                        e.stopPropagation();
                        //reset currentX,currentY to the node's current cx,cy
                        currentX = this.data('node').position().x;
                        currentY =  this.data('node').position().y;
                    }, function (e) {
                        e.stopPropagation();
                    });
                })
            });
        },
        highlightParents:function(node){
            var parents = [];

            function h(n) {
                if (parents.indexOf(n) !== -1) {
                    //already highlight it's parents
                    return false;
                }
                parents.push(n);
                n.highlight();
                n.parentsEdges.forEach(function (edge) {
                    edge.viewCache = {
                        arrow:{
                            'fill':edge.arrow.attr('fill')
                        },
                        line:{
                            'stroke':edge.line.attr('stroke')
                        }
                    };
                    edge.arrow.attr('fill', '#FF6600');
                    edge.line.attr('stroke', '#FF6600');
                    edge.line.attr('stroke-width', 2);
                });
                n.parents.forEach(function (p) {
                    h(p);
                });
            }
            h(node);

        },
        cancelHighlightParents:function(node){
            var parents = [];
            function h(n) {
                if (parents.indexOf(n) !== -1) {
                    //already highlight it's parents
                    return false;
                }
                parents.push(n);
                n.cancelHighlight();
                n.parentsEdges.forEach(function (edge) {
                    if(edge.viewCache){
                        edge.arrow.attr(edge.viewCache.arrow);
                        edge.line.attr(edge.viewCache.line);
                    }
                });
                n.parents.forEach(function (p) {
                    h(p);
                });
            }
            h(node);
        }
    };

    Venus.util.mix(Graph,Venus.Topology);
    Venus.Topology = Graph;


})();

