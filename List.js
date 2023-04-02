

/**
 * Double Linked List Class
 * En interne la librairie utilise une liste chainée de type "circular"
 */
var [List,ListNode] = (function() {
   "use strict";

  function setProperty(obj, name) {
    Object.defineProperty(obj, name, {
      enumerable: false,
      get: function() { return this.getNodeByIndex(name).data; },
      set: function(val) {
        this.getNodeByIndex(name).data = val;
      }
    });
  }

  function ListNode(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }

  function List() {
    this.first = null;
    this.length = 0|0;
    for (var i = 0; i < arguments.length; ++i) {
      this.push(arguments[i]);
      //setProperty(this,i);
    }
  }

  // compare function (can be changed)
  List.prototype.cmp = (a,b) => (a === b);


  // remplacer par List.prototype.at ?
  List.prototype.getNodeByIndex = function(id) {
    var cur = this.first;
    if (cur) {
      do {
        if (id-- === 0) return cur;
      } while ((cur = cur.next) !== this.first);
    }
    return null;
  };

  // remplacer par List.prototype.at ?
  List.prototype.getByIndex = function(id) {
    var node = this.getNodeByIndex(id);
    return node ? node.data : null;
  };

  List.prototype.getFirstNode = function() {
    return this.first;
  };
  List.prototype.getLastNode = function() {
    if (!this.first) return null;
    return this.first.prev;
  };


  // Description:
  // the peek() method retrieves, but does not remove, the head (first element) of this list
  List.prototype.getFirst = function() {
    const node = this.first;
    if (!node) return null;
    return node.data;
  };
  List.prototype.peek = List.prototype.getFirst;

  List.prototype.getLast = function() {
    const node = this.first;
    if (!node || !node.prev) return null;
    return node.prev.data;
  };



  List.prototype.isFirstNode = function(node) {
    if (!node) return false;
    return this.first === node;
  };
  List.prototype.isLastNode = function(node) {
    if (!node) return false;
    if (!this.first) return false;
    return this.first.prev === node;
  };


  List.prototype.isFirst = function(data) {
    const node = this.first;
    if (!data || !node) return false;
    return node.data === data;
  };
  List.prototype.isLast = function(data) {
    const node = this.first;
    if (!data || !node) return false;
    if (!node.prev) return false;
    return node.prev.data === data;
  };

  // Returns true if this list contains no elements.
  List.prototype.isEmpty = function() {
    return !this.first;
  };

  // Returns the hash code value for this list. (TODO)
  List.prototype.hashCode = function() {
    return 0;
  };


  List.prototype.toArray = function() {
    const ret = [];
    var cur = this.first;
    if (cur) {
      do {
        ret.push(cur.data);
      } while ((cur = cur.next) !== this.first);
    }
    return ret;
  };

  List.prototype.toString = function() {
    var ret = "";
    var cur = this.first;
    if (cur) {
      do {
        ret += cur.data.toString();
        if (cur.next !== this.first) ret += ",";
      } while ((cur = cur.next) !== this.first);
    }
    //ret += "]";
    return ret;
  };

  List.prototype.stringify = function() {
    var ret = "";
    var cur = this.first;
    if (cur) {
      do {
        ret += JSON.stringify(cur.data);
        if (cur.next !== this.first) ret += ",";
      } while ((cur = cur.next) !== this.first);
    }
    return ret;
  };

  List.prototype.popFirst = function() {
    var node = this.first;
    if (!node) return undefined;
    if (node === node.next) {
      this.first = null;
    } else {
      this.first = node.next;
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    --this.length;
    return node.data;
  };
  List.prototype.shift = List.prototype.popFirst;


  List.prototype.popLast = function() {
    var node = this.first;
    if (!node) return undefined;
    if (node === node.prev) {
      this.first = null;
    } else {
      node = node.prev;
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    --this.length;
    return node.data;
  };
  List.prototype.pop = List.prototype.popLast;


  // Returns the index of the first occurrence of the specified element in this list,
  // or -1 if this list does not contain the element.
  List.prototype.indexOf = function(item, start) {
    var i = 0;
    var cur = this.first, next = cur;
    if (!cur) return -1;

    if (start) {
      if (start < 0 || start >= this.length) return -1;
      for (; i < start; ++i) {
        if ((cur = cur.next) === this.first) return -1;
      }
    }

    do {
      next = cur.next;
      if (this.cmp(item, cur.data)) return i;
      ++i;
    } while ((cur = next) !== this.first);

    return -1;
  };

  // Returns the index of the last occurrence of the specified element in this list,
  // or -1 if this list does not contain the element.
  List.prototype.lastIndexOf = function(item, start) {

  };

  List.prototype.nodeOf = function(item, start) {
    var cur = this.first, next = cur;
    if (!cur) return null;

    if (start) {
      if (start < 0 || start >= this.length) return null;
      for (var i = 0; i < start; ++i) {
        if ((cur = cur.next) === this.first) return null;
      }
    }

    do {
      next = cur.next;
      if (this.cmp(item, cur.data)) return cur;
    } while ((cur = next) !== this.first);

    return null;
  };


  List.prototype.remove = function(itemOrListNode) {
    var node;
    if (!itemOrListNode || !this.first) return undefined;
    if (itemOrListNode instanceof ListNode) {
      node = itemOrListNode;
    } else if (!(node = this.nodeOf(itemOrListNode))) return undefined;

    if (node === node.prev) {
      this.first = null;
    } else {
      if (node === this.first) this.first = node.next;
      node.prev.next = node.next;
      node.next.prev = node.prev;
      //node = null; // useless
    }
    --this.length;
    return node.data;
  };


  // delete all the list
  List.prototype.clear = function() {
    var cur = this.first, next = cur;
    if (cur) {
      do {
        next = cur.next;
        cur.data = null;
        cur.prev = null;
        cur.next = null;
      } while ((cur = next) !== this.first);
      this.first = null;
    }
    this.length = 0|0;
    return 0;
  };


  List.prototype.insertPrev = function(data,node) {
    if (!node) return null;
    var pnew = new ListNode(data);
    if (!node) {
      this.first = pnew;
      pnew.prev = pnew;
      pnew.next = pnew;
    } else {
      if (node === this.first) this.first = pnew;
      pnew.prev = node.prev;
      pnew.next = node;
      node.prev.next = pnew;
      node.prev = pnew;
    }
    ++this.length;
    return pnew;
  };
  List.prototype.insert = List.prototype.insertPrev;


  List.prototype.insertNext = function(data,node) {
    if (!node) return null;
    var pnew = new ListNode(data);
    if (!node) {
      this.first = pnew;
      pnew.prev = pnew;
      pnew.next = pnew;
    } else {
      pnew.prev = node;
      pnew.next = node.next;
      node.next.prev = pnew;
      node.next = pnew;
    }
    ++this.length;
    return pnew;
  };

  List.prototype.pushFirst = function(data) {
    var first = this.first;
    var pnew = new ListNode(data);

    this.first = pnew;
    if (!first) {
      pnew.prev = pnew;
      pnew.next = pnew;
    } else {
      pnew.next = first;
      pnew.prev = first.prev;
      first.prev.next = pnew;
      first.prev = pnew;
    }
    ++this.length;
    return pnew;
  };
  List.prototype.unshift = List.prototype.pushFirst;

  List.prototype.pushLast = function() {
    if (arguments.length === 0) return null;

    // first one
    var first = this.first;
    var n = new ListNode(arguments[0]);
    if (!first) {
      this.first = n;
      n.prev = n;
      n.next = n;
    } else {
      n.next = first;
      n.prev = first.prev;
      first.prev.next = n;
      first.prev = n;
    }

    // all others
    for (var i = 1; i < arguments.length; ++i) {
      first = this.first;
      n = new ListNode(arguments[i]);
      n.next = first;
      n.prev = first.prev;
      first.prev.next = n;
      first.prev = n;
    }

    this.length += arguments.length;
    return n;
  };
  List.prototype.push = List.prototype.pushLast;


  List.prototype.forEach = function(callback) {
    var cur = this.first, next = cur;
    var index = 0;
    if (cur && callback) {
      do {
        next = cur.next;
        callback(cur.data, index++, cur);
      } while ((cur = next) !== this.first);
    }
  };

  List.prototype.slice = function(begin, end) {
    const ret = new List();
    const len = this.length;
    begin = begin || 0;
    end = end || len;
    var size = end - begin - 1;

    if (begin < 0) {
      begin = len + begin;
      if (end < 0) end = len + end - 1;
      size = end - begin;
    } else {
      if (end < 0) {
        end = len + end - 1;
        size = end - begin;
      }
    }
    if (size < 0) return ret;

    var cur = this.getNodeByIndex(begin);
    if (cur) {
      do {
        ret.push(cur.data);
        if (size-- <= 0) break;
      } while ((cur = cur.next) !== this.first);
    }

    return ret;
  }


  List.prototype.concat = function() {
    const ret = new List();

    // copy
    var cur = this.first;
    if (cur) {
      do {
        ret.push(cur.data);
      } while ((cur = cur.next) !== this.first);
    }

    // concat
    for (var i = 0; i < arguments.length; i++) {
      var List = arguments[i];
      cur = List.first;
      if (cur) {
        do {
          ret.push(cur.data);
        } while ((cur = cur.next) !== List.first);
      }

    }

    return ret;
  };


  return [List,ListNode];
})();



