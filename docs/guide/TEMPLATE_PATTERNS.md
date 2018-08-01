# Wick Template Patterns


### Containers
```html
<w-c>
((**property**)) <-- A property on the Model that is an Array.
<f 
on="((/* expression or 'falsey/truthy' value indicate whether the filter should be active */ ))" 
filter="((/* an expression that can be used with the `array.prototype.filter` JavaScript method */))"
sort="((/* an expression that can be used with the `array.prototype.sort` JavaScript method */))"
>
<!-- Start content to be applied to child models. --> 
<div>
    ...
</div>
<!-- End content. -->
</w-c>
```

### Attributes
```html
<div attrib_name="((data1)) template string  now ((data2))" >
    <a class="my class ((special_class))"></a>
    <div style=
</div>
```

### Inputs 
```html
<input type="string" value="((form_name))">
```

### Inline HTML

```html
<div>((data1 + data2)) template string now ((data3))</div>
```

### Inline CSS `<style>`
```html
<style>
    div {
        color : ((style_color))
    }
</style>
```
### Events 
```html
<button onmouseover="((hovering)(true))" onmouseleave="((hovering)(false))">(( hovering ? "That Tickles!" : "Enter"))</button>
```
### Scripts
```html
<div onclick="((question)('asking'))">What's the Meaning of Life, the Universe and Everything?</div>
<div>((The_Answer))</div>

<script on="((question))">
    console.log(`Hurray, you using this script! It has access to a ${model}, a ${value == "asking"} passed from other elements, the originating ${event}, and an ${emit("The_Answer", 42 )} function that can be used to pass messages`);
</script>
```

> ### As a Game
>
>```html
><unit>
>    <div>((chosen + " " + exclamation))</div>
>    <div onclick="((my_choice)('Rock'))">Rock</div>
>    <div onclick="((my_choice)('Paper'))">Paper</div>
>    <div onclick="((my_choice)('Scissors'))">Scissors</div>
>    <div>Computer chose: ((computer_choice))</div>
>    <script on=((my_choice))>
>        let sys_vals = ["Rock", "Paper", "Scissors"];
>        let val_lu = { Rock: 0, Paper: 1, Scissors: 2 };
>        let sys_choice = Math.floor((Math.random() * 3));
>        let my_choice = val_lu[value];
>        emit("computer_choice", sys_choice);
>        if (my_choice == sys_choice) {
>            emit("exclamation", "👔");
>            return emit(`chosen`, `You both chose the same thing:${sys_vals[my_choice]} `);
>        } else {
>            switch (my_choice) {
>                case 0: //Rock
>                    switch (sys_choice) {
>                        case 1: //Paper
>                            emit("exclamation", "😞");
>                            return emit(`chosen`, `Your Rock succumbs to computer's Paper`);
>                        case 2: //Scissors
>                            emit("exclamation", "✌️");
>                            return emit(`chosen`, `Computer's Scissors are shattered by your Rock`);
>                    }break;
>                case 1: // Paper
>                    switch (sys_choice) {
>                        case 0: //Rock
>                            emit("exclamation", "✌️");
>                            return emit(`chosen`, `Computer's rock is suffocated by your scissors`);
>                        case 2: //Scissors
>                            emit("exclamation", "😞");
>                            return emit(`chosen`, `Your Paper is torn asunder by Computer's Scissors`);
>                    }break;
>                case 2: //Scissors
>                    switch (sys_choice) {
>                        case 0: //Rock
>                            emit("exclamation", "😞");
>                            return emit(`chosen`, `Computer's Rock shatters your scissors`);
>                        case 1: //Paper
>                            emit("exclamation", "✌️");
>                            return emit(`chosen`, `Computer's Paper are sliced by your Scissors`);
>                    }
>            }
>        }
>        return emit("chosen", "Not sure what happened, but nothing happened.");
>    </script>
></unit>
>```

## NOT ALLOWED!!! *Wick will yell at you!*

#### HTML tag value.
```html
<((element_tag_data)) id="my element">...</((element_tag_data))>
```


## IGNORED

#### Inside JavaScript `<script>` tags
```javascript
var myImportantFunction = ()=>{((potentialy_potentialy_dangerous_external_code))}
```