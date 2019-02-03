# A Wick Introduction

d1

Wick is an HTML componentization library and data-binding system. It allows complex UI logic to be broken up into independent parts that can communicate and store data through message passing. Wick has a minimal opinion of how these parts are formed, and allows great freedom when building components.

Using Wick is easy:


# A basic component

### Build it
In HTML
```HTML
<body>
    <template id="component_a">
        <div>((name))</div>
    </template>
</body>

```

In JavaScript
```js
const elementB = `<div>((name))</div>`;
```

### Compile it

```javascript
const wick = import("wick");

const packageA = wick.compile(document.querySelector("#component_a"));
const packageB = wick.compile(elementB);
```

### Present it

```JavaScript
const Winston = {name:"Churchill"};
const Abraham = {name:"Lincoln"};

packageA.mount(document.body, Winston);
packageB.mount(document.body, Abraham);
```

# It's dangerous out there, use the Source
The ``<wick-source>`` element, aka ``<w-s>`` allows you to do fancy things with Wick, such as:
### Store and retrieve models from the presets object
```JavaScript

const presets = {models : {Abraham}};
Abraham.WAS_PRESIDENT = true;

const componentC = `
<w-s model="Abraham">
  ((name)) was ((WAS_PRESIDENT ? "a" : "not a")) president of the U.S.A.
</w-s>
`
const packageC = wick.compile(componentC, presets);
packageC.mount(document.body);
```

### Create importable components

```JavaScript
const componentC = `
<w-s model="Abraham" component="a-snappy-button" element="button">

</w-s>
`
const packageC = wick.compile(componentC, presets);
packageC.mount(document.body);
```

## Things that Wick does that Vanilla HTML does not

### Import InnerHTML through the network 

### Element Level CSS Scoping



 