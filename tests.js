      

var s = "If I give [shake]you[/shake] this [color=aqua]goat butter[/color], will you make some [color=aqua]salmon maunière[/color] for Genli? She sould be in the [color=red]kitchen[/color]."

var canvas;
var bbparser;


function animate() {
  bbparser.fillCanvas();
  window.requestAnimationFrame(animate);
}



function tests() {
  console.clear();
  //document.body.innerHTML += 'BBCODE to HTML TESTS:<br><br>';

/*
  var s = "- this is a [b]bold [u]underlined, [color=blue]blue[/color] and [color=red]red[/color][/u][/b] [size=200%]big text[/size]";
  var sres = BBCode.html(s);
  BBCode.log(s);
  document.body.innerHTML += sres;
  console.log(sres)

  document.body.innerHTML += '<br>';

  var s = "- [font=Impact]this is 'Impact' font [/font][color=rgb(255,0,0)] red [i]italic text[/i][/color] ";
  var sres = BBCode.html(s);
  BBCode.log(s);
  document.body.innerHTML += sres;
  console.log(sres)
  console.log(document.body.innerHTML)
*/


  
  //var s = "- [font=Impact]this is 'Impact' font [/font][color=rgb(255,0,0)] red [i]italic text[/i][/color] ";
  //var s = "[size=20px]test [b]Paul:[/b] [color=red]Salut[/color], comment vas-tu ?[/size]";

  /*var bbtags = Object.assign({}, BBCode.TAGS_DEFAULT, {
    "shake": function(text,tags) {
      console.log(text)
      return "color:red";
    }});*/

  //var bbtags = BBCode.TAGS_DEFAULT;
  //{
  //  "b": {},
  //};

  //var context = {text:"",style:[]};
  //BBCode.parse(s, bbtags, callback, context);
  //console.log(context.text, ...context.style);
  //BBCode.log(s);
  //var html = BBCode.html(s);
  //document.body.innerHTML += html;
  //console.log(html)



  canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 200;
  canvas.style = "border: 1px solid black";
  document.body.appendChild(canvas);

  bbparser = new BBCode(s, {canvas:canvas, x:10,y:30, fontSize:20});
  //bbparser.fillCanvas();
  //ctx.font = "30px ";
  //ctx.fillText("Draw text on Canvas", 10, 30);
  //var s = "If I give [shake]you[/shake] this [color=aqua]goat butter[/color], will you make some [color=aqua]salmon maunière[/color] for Genli? She sould be in the [color=red]kitchen[/color]."
  //BBCode.fillCanvas(s, canvas, {x:10,y:30,fontSize:20});

  //BBCode.log(s)

  //console.log(context)


  //BBCode.log(s, bbtags);
  //document.body.innerHTML += sres;
  //console.log(sres)
  //console.log(document.body.innerHTML)
  animate();
}



