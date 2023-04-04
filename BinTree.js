
const [BinTree,BinTreeNode,BinTreeIterator] = (function() {
  "use strict";

  function stringify(node) {
    var data = node.data;
    if (typeof data.toString === "function") {
      return data.toString();
    }
    return JSON.stringify(data);
  }


  ////////////////////////////////////////////////////////////////////
  function BinTreeNode(data) {
    this.data = data;
    this.parent = null;
    this.left = null;
    this.right = null;
    BinTreeNode.count++;
  }
  BinTreeNode.count = 0|0;

  BinTreeNode.prototype.getDepth = function() {
    for (var l=0,cur=this; (cur = cur.parent); ++l);
    return l;
  };

  BinTreeNode.prototype.print = function(prefix="") {
    if (this.left) {
      if (this.right) {
        console.log(prefix + "├── " + stringify(this.left));
        this.left.print(prefix + "│   ");
      } else {
        console.log(prefix + "└── " + stringify(this.left));
        this.left.print(prefix + "    ");
      }
    }
    if (this.right) {
      console.log(prefix + "└── " + stringify(this.right));
      this.right.print(prefix + "    ");
    }
  };


  BinTreeNode.prototype.addLeft = function(data) {
    this.left = new BinTreeNode(data);
    this.left.parent = this;
    return this.left;
  };
  BinTreeNode.prototype.addRight = function(data) {
    this.right = new BinTreeNode(data);
    this.right.parent = this;
    return this.right;
  };
  BinTreeNode.prototype.addChilds = function(dataLeft, dataRight) {
    this.left = new BinTreeNode(dataLeft);
    this.left.parent = this;
    this.right = new BinTreeNode(dataRight);
    this.right.parent = this;
    return [this.left, this.right];
  };




  ////////////////////////////////////////////////////////////////////
  function BinTreeIterator(btree,traverseType="breadthfirst") {
    this.btree = btree;
    this.list = null;
    this.currentNode = null;
    this.prevNode = null;
    this.lastNode = null;
    this.traverseType = traverseType;
    this.next = this[this.traverseType+"Next"] || this.breadthfirstNext;
    this.hasNext = this[this.traverseType+"HasNext"];
    this.create();
  }
  BinTreeIterator.prototype.create = function() {
    this.list = new List();
    if (this.btree && this.btree.root) {
      this.currentNode = this.btree.root;
      this.prevNode = this.btree.root;
      if (this.traverseType === "preorder" ||
          this.traverseType === "breadthfirst") this.list.push(this.currentNode);
    }
  };
  BinTreeIterator.prototype.breadthfirstHasNext = function() {
    return !this.list.isEmpty();
  };
  BinTreeIterator.prototype.preorderHasNext = function() {
    return !this.list.isEmpty();
  };
  BinTreeIterator.prototype.inorderHasNext = function() {
    return !this.list.isEmpty() || this.currentNode;
  };
  BinTreeIterator.prototype.postorderHasNext = function() {
    return !this.list.isEmpty() || this.currentNode;
  };


  BinTreeIterator.prototype.breadthfirstNext = function() {
    if (!this.hasNext()) return null;
    this.currentNode = this.list.pop();
    if (this.currentNode.left) this.list.unshift(this.currentNode.left);
    if (this.currentNode.right) this.list.unshift(this.currentNode.right);
    return this.currentNode;
  };

  BinTreeIterator.prototype.preorderNext = function() {
    if (!this.hasNext()) return null;
    this.currentNode = this.list.pop();
    if (this.currentNode.right) this.list.push(this.currentNode.right);
    if (this.currentNode.left) this.list.push(this.currentNode.left);
    return this.currentNode;
  };

  // TODO: cette fonction reste à faire
  // Il faut transformer l'arbre généraliste en arbre binaire.
  // https://en.wikipedia.org/wiki/Binary_BinTree#Encoding_general_BinTrees_as_binary_BinTrees
  BinTreeIterator.prototype.inorderNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.pop(); // node
    //for (var i = n.childNodes.length-1; i >= 0; i--) {
    //  l.push(n.childNodes[i]);
    //}
    return n;
  };
  // TODO: cette fonction reste 
  BinTreeIterator.prototype.postorderNext = function() {
    if (!this.hasNext()) return null;
    var l = this.list;
    var n = l.pop(); // node
    //for (var i = 0, length = n.childNodes.length; i < length; ++i) {
    //  l.push(n.childNodes[i]);
    //}
    return n;
  };





  ////////////////////////////////////////////////////////////////////
  function BinTree(data) {
    this.root = null;
    if (data) this.root = new BinTreeNode(data);
  }

  function treeToBtree(node,bnode) {
    var child = node.childNodes[0];
    if (!child) return;
    bnode = bnode.addLeft(child.data);
    treeToBtree(child,bnode);

    for (var i = 1; i < node.childNodes.length; i++) {
      child = node.childNodes[i];
      bnode = bnode.addRight(child.data);
      treeToBtree(child,bnode);
    }
  }

  BinTree.prototype.fromTree = function(tree) {
    if (!tree.root) return;
    this.root = new BinTreeNode(tree.root.data);
    treeToBtree(tree.root,this.root);
  };
  //BinTree.fromTree.prototype = Object.create(BinTree.prototype);



  BinTree.prototype.isEmpty = function() {
    return !this.root;
  };

  BinTree.prototype.findNodeIndex = (arr, data) => {
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i].data === data) return i;
    }
    return -1;
  };



  // parcours en profondeur (du haut vers le bas)
  BinTree.prototype.breadthfirstTraverse = BinTree.breadthfirstTraverse = function(callback, data) {
    if (!callback) return null;
    var iter = new BinTreeIterator(this,"breadthfirst");
    while (iter.hasNext()) {
      if (callback(iter.next(),data)) break;
    }
    return iter.currentNode;
  };


  // prefixe
  BinTree.prototype.preorderTraverse = BinTree.preorderTraverse = function(callback, data) {
    if (!callback) return null;
    var iter = new BinTreeIterator(this,"preorder");
    while (iter.hasNext()) {
      if (callback(iter.next(),data)) return false;
    }
    return true;
  };



  function inorder(node, data, callback) {
    if (!node) return;
    inorder(node.left, data, callback);
    callback(node,data);
    inorder(node.right, data, callback);
  }
  // TODO: cette fonction reste à faire
  // infixe - parcours en largeur (de la gauche vers la droite)
  BinTree.prototype.inorderTraverse = BinTree.postorderTraverse = function(callback, data) {
    if (!callback) return null;
    var iter = new BinTreeIterator(this,"inorder");

    while (iter.hasNext()) {
      if (iter.currentNode) {
        iter.list.push(iter.currentNode);
        iter.currentNode = iter.currentNode.left;
      } else {
        iter.currentNode = iter.list.pop();
        callback(iter.currentNode,data);
        iter.currentNode = iter.currentNode.right;
      }
    }

/*
    while (iter.hasNext()) {
      node = iter.list.pop();
      callback(node,data);
      if (node.right) iter.list.push(node.right);
      if (node.left) iter.list.push(node.left);
    }
*/

    //inorder(this.root, data, callback);
    /*var node,iter = new BinTreeIterator(this,"inorder");
    while (node = iter.next()) {
      if (callback(node,data)) {
        return node;
      }
    }*/
    return null;
  };



  function postorder(node, data, callback) {
    if (!node) return;
    postorder(node.left, data, callback);
    postorder(node.right, data, callback);
    callback(node,data);
  }
  // TODO: cette fonction reste à faire
  // suffixe
  BinTree.prototype.postorderTraverse = BinTree.postorderTraverse = function(callback, data) {
    if (!callback) return null;
    var iter = new BinTreeIterator(this,"postorder");

    while (iter.hasNext()) {
      if (iter.currentNode) {
        iter.list.push(iter.currentNode);
        iter.currentNode = iter.currentNode.left;
      } else {
        var peekNode = iter.list.peek();
        if (peekNode.right && iter.lastNode !== peekNode.right) {
          iter.currentNode = peekNode.right;
        } else {
          callback(peekNode,data);
          iter.lastNode = iter.list.pop();
        }
      }
    }

    //postorder(this.root, data, callback);
    /*
    var node,it = new BinTreeIterator(this,"postorder");
    while (node = it.next()) {
      if (callback(node,data)) {
        return node;
      }
    }*/
    return null;
  };


  BinTree.prototype.print = function() {
    if (!this.root) return;
    console.log(stringify(this.root));
    this.root.print();
  };



  // compare function (can be changed)
  BinTree.prototype.compare = (node,data) => {
    if (node.data === data) return node;
    return null;
  };

  BinTree.prototype.contains = function(traversalCallback, data) {
    return traversalCallback.call(this, this.compare, data);
  };

  BinTree.prototype.addToData = function(data, toData, traversalCallback) {
    var child = new BinTreeNode(data);
    if (!toData || !this.root) {
      if (!this.root && !toData) this.root = child;
      return this;
    }
    traversalCallback = traversalCallback || this.breadthfirstTraverse;
    var parent = this.contains(traversalCallback, toData);
    if (parent) {
      //parent.childNodes.push(child);
      parent.left = child;
      child.parent = parent;
    }
    return this;
  };

  BinTree.prototype.addRoot = function(data) {
    var node = new BinTreeNode(data);
    if (!this.root) {
      this.root = node;
    } else {
      node.left = this.root;
      this.root = node;
    }
    return this.root;
  };

  BinTree.prototype.remove = function(data, fromData, traversalCallback) {
    var childToRemove = null;
    traversalCallback = traversalCallback || this.breadthfirstTraverse;
    var parent = this.contains(traversalCallback, fromData);
    if (parent) {
      var index = this.findNodeIndex(parent.childNodes, data);
      //if (index >= 0) childToRemove = parent.childNodes.splice(index, 1);
    }
    return childToRemove;
  };

  return [BinTree,BinTreeNode,BinTreeIterator];
})();


