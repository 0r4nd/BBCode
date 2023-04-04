BBCode parsing library
=====================

Standard tags (customisable)
---------------------

| tag             | exemple      |
|:------------------|:------------|
| Size | [size=150%]test[/size] or [size=24px]test[/size] |
| Family | [font=Autumn]test[/font] |
| Color | [color=red]test[/color] |
| Bold | [b]test[/b] |
| Italic | [i]test[/i] |
| Underline | [u]test[/u] |
| Overline | [o]test[/o] |
| Strikethrough | [s]test[/s] |
| Typewriter | [typing=0.1]test[/typing] |



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

BBCode.fillCanvas() function
---------------------
Description: Draw bbcode on a canvas


