      
'use strict';

var cumul = '';

//function check(input, obj, comment="") {
//  var r = of(obj);
//  cumul += "| `of("+input+")` | " + "`{type:'"+r.type+"', super:'" + r.super + "'}` | " + comment + " |\n";
//}

function tests() {
  console.clear();
  
  //console.log(BBCode.html("hey[b]ça va ?[/b]"));
  /*
  // improved console.log()
  BBCode.log("[b]bbcode[/b][font=Impact]hello [/font][color=red]world[/color] of [b]bbcode[/b]");
  BBCode.log("this is a [b]bold [u]underlined and [color=blue]colored[/color][/u][/b] [size=125%]big text[/size]");

  // bbcode to html
  console.log(BBCode.html("[font=Impact]hello [/font][color=red]world[/color]"));
  console.log(BBCode.html("this is a [b]bold [u]underlined and [color=blue]colored[/color][/u][/b] [size=125%]big text[/size]"));

  document.body.innerHTML = "Open console for see console tests (ctrl+k)<br>";
  */

  //var s = "[b]salut[b]salut2[/b][/b]";
  var s = "[size=150%]salut[b]salut2[/b][/size]";

  var html = BBCode.html(s);
  document.body.innerHTML += html;
  console.log("\n")
  console.warn("original string:", s)
  console.log(html)
  //document.body.innerHTML += BBCode.html("[b]bbcode[/b] hello [s]bbcode[/s]");
}






