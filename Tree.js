

/**
 * Generic Tree Class
 */
const [Tree,TreeNode,TreeIterator] = (function() {
  "use strict";

  function stringify(node) {
    var data = node.data;
    if (typeof data.toString === "function") {
      return data.toString();
    }
    return JSON.stringify(data);
  }


  // Class
  function TreeNode(data) {
    this.data = data;
    this.parent = null;
    this.childNodes = [];
    TreeNode.count++;
  }
  TreeNode.count = 0|0;

  TreeNode.prototype.getDepth = function() {
    for (var l=0,cur=this; (cur = cur.parent); ++l);
    return l;
  };

  TreeNode.prototype.print = function(prefix="") {
    var childNodes = this.childNodes;
    if (childNodes.length === 0) return;
    for (var i = 0; i < childNodes.length-1; ++i) {
      console.log(prefix + "├── " + stringify(childNodes[i]));
      childNodes[i].print(prefix + "│   ");
    }
    console.log(prefix + "└── " + stringify(childNodes[i]));
    childNodes[i].print(prefix + "    ");
  };

  TreeNode.prototype.addChilds = function() {
    for (var i = 0; i < arguments.length; ++i) {
      var child = new TreeNode(arguments[i]);
      this.childNodes.push(child);
      child.parent = this;
    }
    return this.childNodes.slice(this.childNodes.length - arguments.length);
  };

  // Class
  function TreeIterator(tree,traverseType="breadthfirst") {
    this.tree = tree;
    this.list = null;
    this.currentNode = null;
    this.traverseType = "breadthfirst";
    this.next = this[this.traverseType+"Next"] || this.breadthfirstNext;
    this.create();
  }
  TreeIterator.prototype.create = function() {
    this.list = new List();
    if (this.tree) this.list.push(this.tree.root);
  };
  TreeIterator.prototype.hasNext = function() {
    return !this.list.isEmpty();
  };


  TreeIterator.prototype.breadthfirstNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.shift(); // node
    for (var i = 0, length = n.childNodes.length; i < length; ++i) {
      l.push(n.childNodes[i]);
    }
    return n;
  };

  TreeIterator.prototype.preorderNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.pop(); // node
    for (var i = n.childNodes.length-1; i >= 0; i--) {
      l.push(n.childNodes[i]);
    }
    return n;
  };

  // TODO: cette fonction reste à faire
  // Il faut transformer l'arbre généraliste en arbre binaire.
  // https://en.wikipedia.org/wiki/Binary_tree#Encoding_general_trees_as_binary_trees
  TreeIterator.prototype.inorderNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.pop(); // node
    for (var i = n.childNodes.length-1; i >= 0; i--) {
      l.push(n.childNodes[i]);
    }
    return n;
  };
  // TODO: cette fonction reste 
  TreeIterator.prototype.postorderNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.pop(); // node
    for (var i = 0, length = n.childNodes.length; i < length; ++i) {
      l.push(n.childNodes[i]);
    }
    return n;
  };





  // Class
  function Tree(data) {
    this.root = null;
    if (data) this.root = new TreeNode(data);
  }


  Tree.prototype.findNodeIndex = (arr, data) => {
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i].data === data) return i;
    }
    return -1;
  };

  // parcours en profondeur (du haut vers le bas)
  Tree.prototype.breadthfirstTraverse = Tree.breadthfirstTraverse = function(callback, data) {
    if (!callback) return null;
    var node = null, iter = new TreeIterator(this,"breadthfirst");
    while (iter.hasNext()) {
      node = iter.next();
      if (callback(node,data)) break;
    }
    return node;
  };

  // TODO: cette fonction reste à faire
  // prefixe
  Tree.prototype.preorderTraverse = Tree.preorderTraverse = function(callback, data) {
    if (!callback) return null;
    var node,iter = new TreeIterator(this,"preorder");
    while (node = iter.next()) {
      if (callback(node,data)) {
        return node;
      }
    }
    return null;
  };

  // TODO: cette fonction reste à faire
  // infixe - parcours en largeur (de la gauche vers la droite)
  Tree.prototype.inorderTraverse = Tree.postorderTraverse = function(callback, data) {
    if (!callback) return null;
    var node,iter = new TreeIterator(this,"inorder");
    while (node = iter.next()) {
      if (callback(node,data)) {
        return node;
      }
    }
    return null;
  };

  // TODO: cette fonction reste à faire
  // suffixe
  Tree.prototype.postorderTraverse = Tree.postorderTraverse = function(callback, data) {
    if (!callback) return null;
    var node,it = new TreeIterator(this,"postorder");
    while (node = it.next()) {
      if (callback(node,data)) {
        return node;
      }
    }
    return null;
  };


  Tree.prototype.print = function() {
    if (!this.root) return;
    console.log(stringify(this.root));
    this.root.print();
  };


  // compare function (can be changed)
  Tree.prototype.compare = (node,data) => {
    if (node.data === data) return node;
    return null;
  };

  Tree.prototype.contains = function(traversalCallback, data) {
    return traversalCallback.call(this, this.compare, data);
  };

  Tree.prototype.addToData = function(data, toData, traversalCallback) {
    var child = new TreeNode(data);
    if (!toData || !this.root) {
      if (!this.root && !toData) this.root = child;
      return this;
    }
    traversalCallback = traversalCallback || this.breadthfirstTraverse;
    var parent = this.contains(traversalCallback, toData);
    if (parent) {
      parent.childNodes.push(child);
      child.parent = parent;
    }
    return this;
  };

  Tree.prototype.addRoot = function(data) {
    var node = new TreeNode(data);
    if (!this.root) {
      this.root = node;
    } else {
      node.childNodes.push(this.root);
      this.root = node;
    }
    return this.root;
  };

  Tree.prototype.remove = function(data, fromData, traversalCallback) {
    var childToRemove = null;
    traversalCallback = traversalCallback || this.breadthfirstTraverse;
    var parent = this.contains(traversalCallback, fromData);
    if (parent) {
      var index = this.findNodeIndex(parent.childNodes, data);
      if (index >= 0) childToRemove = parent.childNodes.splice(index, 1);
    }
    return childToRemove;
  };

  return [Tree,TreeNode,TreeIterator];
})();
