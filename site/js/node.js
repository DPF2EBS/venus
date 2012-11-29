(function () {
    var index = 0;
    var Node = function (info) {
        this.info = info;
        this.id = info.id;
        this.parents = [];
        this.children = [];
        this._parentsHash = {};
        this._childrenHash = {};
        this.parentsEdges = [];
        this.childrenEdges = [];
        Node.index++;
    };

    Node.prototype = {
        addParent:function (parent) {
            !this._exist(this.parents, parent) && this.parents.push(parent) && (this._parentsHash[parent.id] = parent);
        },
        addParentEdge:function(edge){
            this.parentsEdges.push(edge);
        },
        addChild:function (child) {
            !this._exist(this.children, child) && this.children.push(child) && (this._childrenHash[child.id] = child);
        },
        addChildEdge:function(edge){
            this.childrenEdges.push(edge);
        },
        hasChild:function (node) {
            return !!this._childrenHash[node.id];
        },
        hasParent:function (node) {
            return !!this._parentsHash[node.id];
        },
        setIndex:function (i) {
            this.indexInLayer = i;
        },
        setGraph:function(graph){
            this.graph = graph;
        },
        getIndex:function(){
            return this.indexInLayer;
        },
        _exist:function (parentsOrChildren, node) {
            var exist = false;
            parentsOrChildren.forEach(function (d) {
                if (d.id === node.id) {
                    exist = true;
                }
            });
            return exist;
        },
        render:function (paper,type, x, y, radius) {
            this.type  = type;
            this.view =  Node.types[type].create.call(this,paper, x, y, radius);
            this.view.data('node',this);
        },
        position:function(x,y){
            return Node.types[this.type].position.call(this,x, y);
        },
        highlight:function(){
            var attr = {
                    'stroke':'#FF6600',
                    'stroke-width':2
                };
            //high light edges
            if(!this.isHighlight){
                this.isHighlight = true;
                this.viewCache = {
                    'stroke':this.view.attr('stroke'),
                    'stroke-width':this.view.attr('stroke-width')
                };
                this.view.attr(attr);
                return true;
            }
        },
        cancelHighlight:function(){
            if(this.isHighlight){
                this.isHighlight = false;
                this.view.attr(this.viewCache);
                return true;
            }
        }
    };
    Node.types = {};

    Node.extend = function (type, interfaces) {
        //interfaces must contain create,
        Node.types[type] = interfaces;
    };

    Node.extend('circle', {
        create:function (paper, x, y, radius) {
            return paper.circle(x, y, radius);
        },
        position:function (x, y) {
            if(x===undefined && y===undefined){
                return {
                    x:this.view.attr('cx'),
                    y:this.view.attr('cy')
                }
            }
            this.view.attr({
                "x":x,
                "y":y
            });
        }
    });
    Node.extend('rect', {
        create:function (paper, x, y, radius) {
            return paper.rect(x - radius, y - radius, radius * 2, radius * 2);
        },
        position:function (x, y) {
            if (x === undefined && y === undefined) {
                return {
                    x:this.view.attr('x') + this.view.attr('width') / 2,
                    y:this.view.attr('y') + this.view.attr('height') / 2
                }
            }
            this.view.attr({
                "x":x - this.view.attr('width') / 2,
                "y":y - this.view.attr('height') / 2
            });
        }
    });



    Venus.Topology.Node = Node;

    Node.index = 0;

})();