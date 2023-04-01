


const BBCode = (function() {

  /* 
   * BBCode main class
   */ 
  function BBCode(text, bbtags = {}) {
    this.tree = new Tree();
    this.btree = null;
    this.text = text;
    this.bbtags = bbtags;
    this.debug = true;
    this.create();
  }


  const skipSpaces = (text,i) => {
    while (i < text.length && (text[i] === " " || text[i] === "\t")) ++i;
    return i;
  };


  // var text = "[b]hey[/b]";
  // var section = new Section();
  // text.substring(open.begin,open.end)
  function Tag(opts = {}) {
    this.left = opts.left || 0;
    this.right = opts.right || 0;
    this.leftBracket = opts.leftBracket || 0;
    this.rightBracket = opts.rightBracket || 0;
    this.leftAttribute = opts.leftAttribute || 0;
    this.rightAttribute = opts.rightAttribute || 0;
  }

  function TagSection(textOrigin, openOpts = {}, closeOpts = {}) {
    this.textOrigin = textOrigin;
    this.tags = {};
    this.open = new Tag(openOpts);
    this.close = new Tag(closeOpts);
  }
  Object.defineProperty(TagSection.prototype, 'text', {
    get: function() { return this.textOrigin.substring(this.open.rightBracket, this.close.leftBracket); },
    set: function(v) { },
    //enumerable: true,
    //configurable: true
  });
  Object.defineProperty(TagSection.prototype, 'attribute', {
    get: function() { return this.textOrigin.substring(this.open.leftAttribute, this.open.rightAttribute); },
    set: function(v) { },
    //enumerable: true,
    //configurable: true
  });

  TagSection.prototype.openTag = function() {
    return this.textOrigin.substring(this.open.left, this.open.right);
  };
  TagSection.prototype.fullOpenTag = function() {
    return this.textOrigin.substring(this.open.leftBracket, this.open.rightBracket);
  };
  TagSection.prototype.closeTag = function() {
    return this.textOrigin.substring(this.close.left, this.close.right);
  };
  TagSection.prototype.fullCloseTag = function() {
    return this.textOrigin.substring(this.close.leftBracket, this.close.rightBracket);
  };
  TagSection.prototype.section = function() {
    return this.textOrigin.substring(this.open.rightBracket, this.close.leftBracket);
  };
  TagSection.prototype.fullSection = function() {
    return this.textOrigin.substring(this.open.leftBracket, this.close.rightBracket);
  };
  TagSection.prototype.toString = function() {
    if (this.openTag().length === 0)
      //return '['+this.openTag()+']' + this.section() + '[/'+this.closeTag()+']';
      return JSON.stringify(this.tags) + this.section();

    //return '['+this.openTag()+']' + '[/'+this.closeTag()+']';
    return JSON.stringify(this.tags);
  };






  // [b] hey [b]ça va[/b] bien[/b]
  function extractTagSection(text, bbtags, i = 0) {
    if (text[i] !== "[") return null;
    var ts = new TagSection(text);
    ts.open.leftBracket = i;

    i = skipSpaces(text,i+1);
    ts.open.left = i;
    ts.open.right = i;

    if (text[i] === "/") {
      //console.error('open.left is a closing tag "[/]"');
      return null;
    }

    // récupère l'ouverture de la balise
    for (; i < text.length; i = skipSpaces(text,i+1)) {
      c = text[i];
      if (c === '[') break;
      if (c === ']' || c === '=') {
        ts.open.right = i;
        ts.open.rightBracket = i+1;
        break;
      }
    }

    if (c === '=') {
      i = skipSpaces(text,i+1);
      ts.open.leftAttribute = i;
      for (; i < text.length; i++) {
        c = text[i];
        if (c === ']') {
          ts.open.rightAttribute = i;
          ts.open.rightBracket = i+1;
          break;
        }
      }
      //console.error("open:" + ts.openTag() + " attribute:" + ts.attribute);
    }


    if (ts.open.left === ts.open.right) {
      console.error('open.left is empty "[]" or malformed "[","[["');
      return null;
    }

    var openTag = ts.openTag();
    if (!bbtags[openTag]) {
      //console.error(openTag);
      return null;
    }


    // cherche la balise fermante
    ts.close.left = ts.open.right;
    ts.close.right = ts.open.right;
    //for (i = text.length; i > ts.open.right+1; --i) {
    for (i = ts.open.right+1; i < text.length; ++i) {
      if (text[i] !== '[') continue;
      var orig = i;
      ts.close.leftBracket = i;
      i = skipSpaces(text,i+1);
      if (text[i] !== "/") {
        i = orig;
        continue;
      }
      i = skipSpaces(text,i+1);
      ts.close.left = i;
      ts.close.right = -1;
      for (; i < text.length; ++i) {
        if (text[i] === ']') {
          ts.close.right = i;
          ts.close.rightBracket = i+1;
          break;
        }
      }


      if (ts.close.right >= 0) {
        if (openTag == ts.closeTag()) {
          // DEBUG:
          //console.log("trouvé:", text.substring(ts.open.left,ts.open.right),
          //                       text.substring(ts.open.leftBracket,ts.close.rightBracket));
          //console.log('(openTag)"'+ts.openTag()+'"')
          //console.log('(text)"'+ts.text+'"')
          //console.log('(attribute)"'+ts.attribute+'"')
          //console.log('(closeTag)"'+ts.closeTag()+'"')
          return ts;
        }
        //console.log("pas trouvé", closeTag);
        i = orig;
      } else {
        break;
      }

    }

    return null;
  }


  //const clone = o => Object.assign({},o)
  const cloneDeep = o => JSON.parse(JSON.stringify(o))

  // tags: accumulation de tous les tags en provenence des ascendants.
  function fillTree(text, index, bbtags, tags, node) {
    if (!node) return;
    var child, tagSection, textSection, first = index;

    for (var i = index; i < text.length; ++i) {

      if (text[i] === '[') {
        tagSection = extractTagSection(text,bbtags,i);

        if (tagSection) {
          // si la tag section est valide, ça signifie que le texte avant
          // peut être ajouté dans le scope courant.
          if (i !== first) {
            textSection = new TagSection(text, {rightBracket:first}, {leftBracket:i});
            textSection.tags = tags;
            //console.log("text(1):" + textSection.fullSection());
            child = node.addChilds(textSection)[0];
          }


          //tagSection.tags = clone(tags);
          var tagsNew = cloneDeep(tags);
          var openTag = tagSection.openTag();
          if (tagsNew[openTag]) {
            tagsNew[openTag].depth++;
            tagsNew[openTag].attribute = tagSection.attribute;
          } else {
            tagsNew[openTag] = {depth:0, attribute:tagSection.attribute};
          }
          tagSection.tags = tagsNew;

          //console.log("tag(1): " + tagSection.fullSection() );
          child = node.addChilds(tagSection)[0];
          fillTree(text.substring(0,tagSection.close.leftBracket),
                   i + tagSection.fullOpenTag().length,
                   bbtags, tagsNew, child);

          i += tagSection.fullSection().length-1;
          first = i+1;
        }
        
      }

    }

    if (i !== first) {
      textSection = new TagSection(text, {rightBracket:first}, {leftBracket:i});
      textSection.tags = tags; 
      //console.log("text(2):" + textSection.fullSection());
      child = node.addChilds(textSection)[0];
      //console.log("ajout(3) " + child.data.toString() + " dans " + node.data.toString(), deep);
    }

  }


  BBCode.prototype.create = function() {
    this.tree = new Tree(new TagSection(this.text));
    fillTree(this.text, 0, this.bbtags, {}, this.tree.root);
    this.btree = new BinTree();
    this.btree.fromTree(this.tree);
    if (this.debug) this.tree.print();
  };


  BBCode.prototype.reduce = function(callback, initialValue) {
    if (typeof callback !== "function") return;
    var currentIndex = 0;
    this.btree.preorderTraverse((node,data) => {
      var currentValue = node.data;
      if (currentValue.openTag().length > 0) return;
      if (currentValue.section().length === 0) return;
      initialValue = callback(initialValue, currentValue, currentIndex++);
    });
    return initialValue;
  };


  BBCode.BBTAGS_DEFAULT = {
    b:{},
    i:{},
    u:{},
    s:{},
    o:{},
    color:{attribute:true},
    size:{attribute:true},
    font:{attribute:true},
  };

  // Size: [size=150%]test[/size] or [size=24px]test[/size] 
  // Family: [font=Autumn]test[/font]
  // Color: [color=red]test[/color]
  // Bold: [b]test[/b]
  // Italic: [i]test[/i]
  // Underline: [u]test[/u]
  // Overline: [o]test[/o]
  // Strikethrough: [s]test[/s]
  BBCode.log = function(text, bbtags) {
    bbtags = bbtags || BBCode.BBTAGS_DEFAULT;
    var bbcode = new BBCode(text, bbtags);
    var res = bbcode.reduce(
        (total,data) => {
          var style = total.style.concat("");
          var len = style.length-1;
          var hasStyle = 0;

          // font-weight
          var fontWeight = "";
          if (data.tags['b']) { hasStyle++; fontWeight += " bold"; }
          
          // font-style
          var fontStyle = "";
          if (data.tags['i']) { hasStyle++; fontStyle += " italic"; }

          // color (for font color)
          var color = "";
          if (data.tags['color']) {
            hasStyle++;
            color += data.tags['color'].attribute;
          }

          // size
          var fontSize = "";
          if (data.tags['size']) {
            hasStyle++;
            fontSize += data.tags['size'].attribute;
          }

          // family
          var fontFamily = "";
          if (data.tags['font']) {
            hasStyle++;
            fontFamily += data.tags['font'].attribute;
          }

          // text-decoration
          var textDeco = "";
          if (data.tags['u']) { hasStyle++; textDeco += " underline"; }
          if (data.tags['o']) { hasStyle++; textDeco += " overline"; }
          if (data.tags['s']) { hasStyle++; textDeco += " line-through"; }

          var span = '';
          if (hasStyle) {
            if (fontWeight.length) span += 'font-weight:' + fontWeight + ';';
            if (fontStyle.length) span += 'font-style:' + fontStyle + ';';
            if (color.length) span += 'color:' + color + ';';
            if (fontSize.length) span += 'font-size:' + fontSize + ';';
            if (fontFamily.length) span += 'font-family:' + fontFamily + ';';
            if (textDeco.length) span += 'text-decoration:' + textDeco + ';';
            style[len] += span;
          }

          if (style[len] === "" && ((len-1) < 0 || style[len-1] === "")) {
            total.text += data.text;
          } else {
            total.style = style;
            total.text += "%c" + data.text;
          }

          return total;
      }, {text:"", style:[]});
    
    console.log(res.text, ...res.style);
  };


  BBCode.html = function(text, bbtags) {
    bbtags = bbtags || BBCode.BBTAGS_DEFAULT;
    var bbcode = new BBCode(text, bbtags);
    var res = bbcode.reduce(
        (total,data) => {
          var hasStyle = 0;

          // font-weight
          var fontWeight = "";
          if (data.tags['b']) { hasStyle++; fontWeight += " bold"; }
          
          // font-style
          var fontStyle = "";
          if (data.tags['i']) { hasStyle++; fontStyle += " italic"; }

          // color (for font color)
          var color = "";
          if (data.tags['color']) {
            hasStyle++;
            color += data.tags['color'].attribute;
          }

          // size
          var fontSize = "";
          if (data.tags['size']) {
            hasStyle++;
            fontSize += data.tags['size'].attribute;
          }

          // family
          var fontFamily = "";
          if (data.tags['font']) {
            hasStyle++;
            fontFamily += data.tags['font'].attribute;
          }

          // text-decoration
          var textDeco = "";
          if (data.tags['u']) { hasStyle++; textDeco += " underline"; }
          if (data.tags['o']) { hasStyle++; textDeco += " overline"; }
          if (data.tags['s']) { hasStyle++; textDeco += " line-through"; }

          if (hasStyle) {
            var span = '<span style="';
            if (fontWeight.length) span += 'font-weight:' + fontWeight + ';';
            if (fontStyle.length) span += 'font-style:' + fontStyle + ';';
            if (color.length) span += 'color:' + color + ';';
            if (fontSize.length) span += 'font-size:' + fontSize + ';';
            if (fontFamily.length) span += 'font-family:' + fontFamily + ';';
            if (textDeco.length) span += 'text-decoration:' + textDeco + ';';
            span += '">';
            total += span + data.text + "</span>";
          } else {
            total += data.text;
          }

          return total;
        }, "");

    return res;
    
  };

  return BBCode;
})();


