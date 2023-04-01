BBCode parsing library (customisable)
=====================

BBCode standard tags (can be custom, see exemple below)
---------------------
Size: [size=150%]test[/size] or [size=24px]test[/size] <br>
Family: [font=Autumn]test[/font]<br>
Color: [color=red]test[/color]<br>
Bold: [b]test[/b]<br>
Italic: [i]test[/i]<br>
Underline: [u]test[/u]<br>
 Overline: [o]test[/o]<br>
Strikethrough: [s]test[/s]<br>

BBCode.html() function
---------------------
Description: Basic bbcode to html

Exemple:
```javascript
BBCode.html("- [font=Impact]this is 'Impact' font [/font][color=rgb(255,0,0)] red [i]italic text[/i][/color] ");
```

Result:
```javascript
"- <span style="font-family:Impact;">this is 'Impact' font </span><span style="color:rgb(255,0,0);"> red </span><span style="font-style: italic;color:rgb(255,0,0);">italic text</span>"
```

BBCode.log() function
---------------------
Description: Show html on the console!

Exemple:
```javascript
BBCode.log("- [font=Impact]this is 'Impact' font [/font][color=rgb(255,0,0)] red [i]italic text[/i][/color] ");
```
