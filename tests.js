      

function tests() {
  console.clear();
  document.body.innerHTML += 'BBCODE to HTML TESTS:<br><br>';

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
}




