# CandleFW WICK

v0.6.0a

## Dynamic Component Template Framework

CandleFW Wick is a tool for building component based web pages and web applications using HTML, CSS, and JavaScript. It allows for dynamic data driven updates to a web page's HTML and CSS content. 

## Usage

>**note**:
>This script uses ES2015 module syntax,  and has the extension ***.mjs***. To include this script in a project, you may need to use the node flag ```--experimental-modules```; or, use a bundler that supports ES modules, such as [rollup](https://github.com/rollup/rollup-plugin-node-resolve).

```
npm install @candlefw/wick

```

>Pre-built builds can be found in the `build` directory. `wick.js` will work with standard ``<script>`` tags and `wick.node.js` is compatible with NodeJS's Commonjs module system.

```javascript

//Create a model to store data. 
var fooModel = wick.model({
    user_count: 2,
    users: [{
        name: "Doug",
        age: 18
    }, {
        name: "Carly",
        age: 38
    }]
});
//Create a source package that can be used to generate dynamic HTMLElement components. 
//wick.source Accepts Strings, HTMLELments, URL's and 
wick.source(`
<div>
  <w-c element="ul">
    ((users))

    <w-s element="li">
      User: ((name)) Age: ((age < 30 ?  "Young Adult" : "Adult"))
    </w-s>
  </w-c>
</div>
`).then(package => {
  //Package is already compiled and allows for quick generation of dynamic data bound DOM trees without the need to re-parse the input. 
  package.mount(document.body, fooModel);

  /* => 
  ...
  <body>
    <div>
      <ul>
        <li> User:Doug Age:Young Adult </li>
        <li> User:Carly Age:Adult </li>
      </ul>
    </div>
  </body>

  */
});
```
```html
<div>
  <ul>
    <li> User: Doug Age: Young Adult </li>
    <li> User: Carly Age: Adult </li>
  </ul>
</div>
```
