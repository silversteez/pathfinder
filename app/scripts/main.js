$(function(){

  window.nodes = {};
  var selectedNode1;

  var Node = function(id) {
    this.x = Math.floor(document.width * Math.random());
    this.y = Math.floor(document.height * Math.random());
    this.id = id;
    this.neighbors = [];
    this.open = true;
    this.parent;
    this.costFromParent;
    this.costToEnd;
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
    var openNodes = [curNode];
    var closedNodes = [];

    while (openNodes.length > 0) {
      // TODO assumes curNode has the best score? openNodes is sorted? or loop and get the lowest cost node
      curNode = openNodes.pop();

      if (curNode === endNode) {
        // TODO return path
      }

      curNode.open = false;

      for (var i = 0; i < curNode.neighbors.length; i++) {
        var neighbor = curNode.neighbors[i];
        if (neighbor.open && openNodes.indexOf(neighbor) === -1) { // If neighbor isn't in openNodes, add it
          neighbor.parent = curNode;
          neighbor.costFromParent = calcPathCost(curNode, neighbor);
          neighbor.costToEnd = calcPathCost(neighbor, endNode);
          neighbor.totalCost = neighbor.costFromParent + neighbor.costToEnd;
          // neighbor.open = false;
          openNodes.push(neighbor);
        }

        if (true) { // If neighbor is in openNodes, compare cost and fix parent if better

        }
      }
    }

  };

  var calcPathCost = function(node1, node2) {
    return Math.sqrt((node1.x-node2.x)*(node1.x-node2.x)+(node1.y-node2.y)*(node1.y-node2.y))
  }

  var createPaths = function(pathNodes) {
    // console.log(pathNodes);
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