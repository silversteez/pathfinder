$(function(){

  window.nodes = {};
  var selectedNode1;

  var Node = function(id) {
    this.x = Math.floor(document.width * Math.random());
    this.y = Math.floor(document.height * Math.random());
    this.id = id;
    this.neighbors = [];
  };

  Node.prototype.findNeighbors = function() {
    for (var key in nodes) {
      if (nodes[key] !== this && Math.abs(this.x-nodes[key].x)+Math.abs(this.y-nodes[key].y) < 200) {
        this.neighbors.push(nodes[key]);
      }
    }
  };

  Node.prototype.createDomNode = function(key) {
    $('<div>')
    .addClass('node')
    .attr('id', key)
    .text(key)
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

    while (openNodes.length > 0) {

      // Sort nodes so we're always working from the current best path option
      openNodes.sort(function(a,b) {
        return b.totalCost - a.totalCost;
      });

      curNode = openNodes.pop();
      curNode.visited = true;

      if (curNode === endNode) {
        console.log('path found!');

        var pathNodes = [endNode];
        while (curNode.parent) {
          pathNodes.push(curNode.parent);
          curNode = curNode.parent;
        }
        return createPaths(pathNodes);
      }

      for (var i = 0; i < curNode.neighbors.length; i++) {
        var neighbor = curNode.neighbors[i];

        if (!neighbor.visited && openNodes.indexOf(neighbor) === -1) { // If neighbor isn't in openNodes, add it
          neighbor.parent = curNode;
          neighbor.costFromParent = calcPathCost(curNode, neighbor);
          neighbor.costToEnd = calcPathCost(neighbor, endNode);
          neighbor.totalCost = neighbor.costFromParent + neighbor.costToEnd;
          openNodes.push(neighbor);
        } else if (!neighbor.visited) { // If neighbor is already in openNodes, compare cost from curNode and replace parent if path is better
          var costFromParent = calcPathCost(curNode, neighbor);
          var costToEnd = calcPathCost(neighbor, endNode);
          var totalCostFromCurNode = costFromParent + costToEnd;

          if (totalCostFromCurNode < neighbor.totalCost) {
            neighbor.parent = curNode;
            neighbor.costFromParent = costFromParent;
            neighbor.costToEnd = costToEnd;
            neighbor.totalCost = totalCostFromCurNode;
          }
        }
      }
    }

    console.log("no path found");
    resetGraph();
  };

  var resetGraph = function() {
    $('.path').remove();
    for (var key in nodes) {
      var node = nodes[key];
      delete node.parent;
      delete node.costFromParent;
      delete node.costToEnd;
      delete node.totalCost;
      delete node.visited;
    }
  }

  var calcPathCost = function(node1, node2) {
    return Math.sqrt((node1.x-node2.x)*(node1.x-node2.x)+(node1.y-node2.y)*(node1.y-node2.y))
  }

  var createPaths = function(pathNodes) {
    // console.log(pathNodes);
    for (var i = 0; i < pathNodes.length-1; i++) {
      createPath(pathNodes[i], pathNodes[i+1]);
    }
    setTimeout(resetGraph, 1000);
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