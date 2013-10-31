$(function(){

  window.nodes = {};
  var selectedNode1;

  var Node = function(id) {
    this.x = Math.floor(document.width * Math.random());
    this.y = Math.floor(document.height * Math.random());
    this.id = id;
    this.neighbors = [];
    this.paths = [];
  };

  Node.prototype.findNeighbors = function() {
    for (var key in nodes) {
      if (nodes[key] !== this && Math.abs(this.x-nodes[key].x)+Math.abs(this.y-nodes[key].y) < 300) {
        this.neighbors.push(nodes[key]);
      }
    }
  };

  Node.prototype.createDomNode = function(key) {
    $('<div>')
    .addClass('node')
    .attr('id', key)
    .css({"left": this.x+"px", "top": this.y+"px"})
    .click(toggleSelectedNode)
    .appendTo('body');
  }

  var createNodes = function() {
    var numNodes = parseInt(window.location.hash.substring(1)) || 50;
    for (var i = 0; i < numNodes; i++) {
      nodes[i] = new Node(i);
    }

    for (var key in nodes) {
      nodes[key].findNeighbors();
      nodes[key].createDomNode(key);
    }
  };

  var toggleSelectedNode = function(event) {
    var id = event.target.id;
    if (!selectedNode1) {
      selectedNode1 = nodes[event.target.id];
    } else if (selectedNode1 && selectedNode1 !== nodes[event.target.id]) {
      // Handle two nodes selected
      var selectedNode2 = nodes[event.target.id];
      findShortestPath(selectedNode1, selectedNode2);
      // Set node back to undefined after finding path
      selectedNode1 = undefined;
    } else {
      selectedNode1 = undefined;
    }
  };

  var findShortestPath = function(curNode, endNode) {
    var paths = [];

    var pathFinder = function(curNode, pathNodes, pathCost) {
      pathNodes = pathNodes || [curNode];
      pathCost = pathCost || 0;

      for (var i = 0; i < curNode.neighbors.length; i++) {
        var neighbor = curNode.neighbors[i];
        if (neighbor === endNode) {
          pathNodes.push(neighbor);
          paths.push([pathCost, pathNodes]);
        } else if (pathNodes.indexOf(neighbor) === -1) { // if neighbor is NOT already in the pathNodes
          var cost = pathCost + Math.sqrt((curNode.x-neighbor.x)*(curNode.x-neighbor.x)+(curNode.y-neighbor.y)*(curNode.y-neighbor.y));
          pathFinder(neighbor, pathNodes.concat(neighbor), cost);
        }
      }
    };

    pathFinder(curNode);
    console.log('paths', paths);

    var shortestPath = paths[0];
    if (paths.length > 1) {
      for (var i = 1; i < paths.length; i++) {
        if (paths[i][0] < shortestPath[0]) {
          shortestPath = paths[i];
        }
      }
    } else if (!shortestPath) {
      return console.log('no valid path');
    }

    createPaths(shortestPath[1]);
  };

  var createPaths = function(pathNodes) {
    console.log(pathNodes);
    for (var i = 0; i < pathNodes.length-1; i++) {
      createPath(pathNodes[i], pathNodes[i+1]);
    }
  };

  var createPath = function(node1, node2) {
    var x1 = node1.x;
    var y1 = node1.y;
    var x2 = node2.x;
    var y2 = node2.y;

    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';

    var path = $('<div>')
        .addClass('path')
        .css({'transform': transform})
        .width(length)
        .offset({left: x1+10, top: y1+10})
        .appendTo('body');

    return path;
  };

  createNodes();
});