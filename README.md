# CandleFW WICK <img src="https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjGlcGpgaPiAhWH4FQKHZ_kBioQjRx6BAgBEAU&url=https%3A%2F%2Fwww.designfreelogoonline.com%2Flogoshop%2Ffree-logo-creator-3d-flame-logo-maker%2F&psig=AOvVaw3HjQ7tgVo6r_YSHP8RO6SZ&ust=1558197806327072" alt="Candle Framework Logo">

<sub> v0.8.0a </sub>

** Test results go here **

## Installation

>**note**:
>This script uses ES2015 module syntax,  and has the extension ***.mjs***. To include this script in a project, you may need to use the node flag ```--experimental-modules```; or, use a bundler that supports ES modules, such as [rollup](https://github.com/rollup/rollup-plugin-node-resolve).

```bash

#install from NPM

npm install @candlefw/wick

#build library

npm run build

```

Include ``wick.js`` in an HTML **&lt; script &gt;** file or use the wick CLI to build self contained and self hosting components. 

### Production Files

#### From CandleFW Website:
<a href="https://downloads.candlefw.com/wick/latest">CandleFW Link</a>
<sub> this link is not yet active </sub>


<sub> this link is limited to one download per IP per 24 hours </sub>
#### From CDN
<sub> todo - CDN hosting links </sub>


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
