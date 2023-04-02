
const BBCode = (function() {

  const DEBUG = false;

  /**
   * BBCode main class
   */ 
  function BBCode(text, bbtags = {}) {
    this.tree = new Tree();
    this.btree = null;
    this.text = text;
    this.bbtags = bbtags;
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
    if (this.openTag().length === 0) {
      return JSON.stringify(this.tags) + this.section();
    }
    return JSON.stringify(this.tags);
  };

  // [b]1[b]2[/b]3[/b]
  function extractTagSection(text, bbtags, i = 0) {
    if (text[i] !== "[") return null;
    var ts = new TagSection(text);
    ts.open.leftBracket = i;

    i = skipSpaces(text,i+1);
    ts.open.left = i;
    ts.open.right = i;

    if (text[i] === "/") {
      if (DEBUG) console.error('open.left is a closing tag "[/]"');
      return null;
    }

    // search for open tag
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
      if (DEBUG) console.error("open:" + ts.openTag() + " attribute:" + ts.attribute);
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


    // search for closed tag
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
          if (DEBUG) {
            console.log("found:", text.substring(ts.open.left,ts.open.right),
                                  text.substring(ts.open.leftBracket,ts.close.rightBracket));
            console.log('(openTag)"'+ts.openTag()+'"')
            console.log('(text)"'+ts.text+'"')
            console.log('(attribute)"'+ts.attribute+'"')
            console.log('(closeTag)"'+ts.closeTag()+'"')
          }
          return ts;
        }
        if (DEBUG) console.log("not found", closeTag);
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
    if (DEBUG) this.tree.print();
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

  // this object is frozen (for prevent bad usage of Object.assign())
  BBCode.TAGS_DEFAULT = {
    b:{},
    i:{},
    u:{},
    s:{},
    o:{},
    color:{attribute:true},
    size:{attribute:true},
    font:{attribute:true},
  };
  Object.freeze(BBCode.TAGS_DEFAULT);


  // Size: [size=150%]test[/size] or [size=24px]test[/size] 
  // Family: [font=Autumn]test[/font]
  // Color: [color=red]test[/color]
  // Bold: [b]test[/b]
  // Italic: [i]test[/i]
  // Underline: [u]test[/u]
  // Overline: [o]test[/o]
  // Strikethrough: [s]test[/s]
  function bb_to_html(text, data) {
    if (data.tags['color']) {
      text += 'color:' + data.tags['color'].attribute + ';';
    }
    if (data.tags['size']) {
      text += 'font-size:' + data.tags['size'].attribute + ';';
    }
    if (data.tags['font']) {
      text += 'font-family:' + data.tags['font'].attribute + ';';
    }
    if (data.tags['b']) text += 'font-weight:bold;';
    if (data.tags['i']) text += 'font-style:italic;';

    // text-decoration
    if (data.tags['u'] || data.tags['o'] || data.tags['s']) {
      text += 'text-decoration:';
      if (data.tags['u']) text += " underline";
      if (data.tags['o']) text += " overline";
      if (data.tags['s']) text += " line-through";
      text += ';';
    }
    return text;
  }

  function bb_to_canvasFont(text, data, ctx) {
    if (data.tags['b']) text += ' bold';
    if (data.tags['i']) text += ' italic';

    if (data.tags['size']) text += ' ' + data.tags['size'].attribute;
    else text += ' ' + ctx.size + 'px';
    
    if (data.tags['font']) text += ' ' + data.tags['font'].attribute;
    else text += ' sans-serif';
    
    return text;
  }


  function console_callback(ctx,data) {
    var style = ctx.style.concat("");
    var len = style.length-1;
    var parsed = bb_to_html("", data);

    if (parsed.length > 0) style[len] += parsed;
    if (style[len] === "" && ((len-1) < 0 || style[len-1] === "")) {
      ctx.text += data.text;
    } else {
      ctx.style = style;
      ctx.text += "%c" + data.text;
    }
    return ctx;
  };

  function html_callback(ctx,data) {
    var parsed = bb_to_html('<span style="', data);

    if (parsed.length > 0) {
      parsed += '">';
      ctx += parsed + data.text + "</span>";
    } else {
      ctx += data.text;
    }
    return ctx;
  };

  function canvas_callback(ctx,data) {
    var canvasCtx = ctx.canvas.getContext("2d");
    var parsed = bb_to_canvasFont("", data, ctx);

    if (parsed.length > 0) {
      if (data.tags['color']) canvasCtx.fillStyle = data.tags['color'].attribute;
      else canvasCtx.fillStyle = "black";
      canvasCtx.font = parsed;
      canvasCtx.fillText(data.text, ctx.x,ctx.y);
    } else {
      //ctx.text += data.text;
      canvasCtx.fillText(data.text, ctx.x,ctx.y);
    }
    ctx.x += canvasCtx.measureText(data.text).width;
    return ctx;
  };

  BBCode.parse = function(text, bbtags, callback, ctx) {
    bbtags = bbtags || BBCode.TAGS_DEFAULT;
    var bbcode = new BBCode(text, bbtags);
    return bbcode.reduce((total,data) => callback(total,data), ctx);
  };



  BBCode.log = function(text, callback_log = console.log) {
    var ctx = {text:"",style:[]};
    BBCode.parse(text, BBCode.TAGS_DEFAULT, console_callback, ctx);
    callback_log(ctx.text, ...ctx.style);
  };

  BBCode.html = function(text) {
    return BBCode.parse(text, BBCode.TAGS_DEFAULT, html_callback, "");
  };

  BBCode.fillCanvas = function(text, canvas, opts={}) {
    opts.x = opts.x || 10;
    opts.y = opts.y || 10;
    opts.size = opts.size || 10;
    var ctx = {text:"", style:[], canvas, x:opts.x,y:opts.x, size:opts.size};
    BBCode.parse(text, BBCode.TAGS_DEFAULT, canvas_callback, ctx);
  };

  return BBCode;
})();







/*
          // custom tags
          //if (bbtags !== BBCode.TAGS_DEFAULT) {
            var keys = Object.keys(data.tags);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = data.tags[key];
              //console.warn(key, typeof value)
              //if (typeof BBCode.TAGS_DEFAULT[key] !== 'undefined') continue;
              if (typeof value === 'function') {
                //span += value(data.text, data_params.tags);
              }
              if (typeof value.attribute === 'undefined') {
                
              } else {
                hasStyle++;
              }
            }
          //}
*/
