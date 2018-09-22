analogous# WICK
v0.4.2a

## Dynamic Component Template Framework

## What do we have here?

Wick is a tool for building component based web pages and web apps using HTML, CSS, and JavaScript. It acts a runtime manager that handles the compiling of webpages from individual files, the rendering of web page content with effects and transitions, routing based on resource URI's, and binding of data to UI with responsive updating.

Wick is organized as a collection of semi-independent libraries that can be used individually or as whole through the `wick` entry point. All together Wick is a framework for building modern webpages, but it can be used in part to provide other useful features, such as CSS and HTML parsing and rendering, animation tools, and data containers for observable based UI updating. Overall, Wick is a sum of many individual parts that are designed to work both independently and in unison to a deliver a versatile framework library.

## The parts of Wick

Component
    Template
        CSS Parser
        HTML Parser
    Source
    Container

Models & Model Container

Animation and Transition

Router

## The Wick Component

Wick components are built from HTML files containing traditional markup and special wick specific attributes and tags. Combined with templating data binding and inline JavaScript expressions, Wick provides powerful ways to create dynamic HTML components that can be integrated into existing pages. Wick also provides ways to define data flow between components and link components from different files to create complex component structures that can handle more advanced application interfaces.

### Componetization

Creating a component with Wick begins with passing an HTMLElement or string containing HTML markup to the `wick.source` function, as in this example

```JavaScript

let RETURN_PROMISE = false; //If true, wick.source will return a promise that resolves to a `SourcePackage`. This is optional
let presets = {}, // An object of compilation options can be passed to wick.source. This is also optional
let SourcePackage = wick.source(
                          `<div>Hello Component</div>`,
                          presets,
                          RETURN_PROMISE)

```

The return value is a compiled `SourcePackage` that contains objects and code needed to render the component to the DOM. Its `mount` method takes an existing HTMLElement and inserts a copy of the component into the Element's DOM tree. The `mount` method also returns a `SourceManager` that can be used to update the component with new data and create special effects like transitions.  

<sup>Additional options can be provided to `wick.source` in the form of the `presets` object. More information can be found in the guide.</sup>

> #### Ok, what's up with this source talk?
> The term source stems from the idea of a "single source of truth" and relates to the concept that a component will always take on a single form given the state of the data that it binds to. Though it has yet to be discussed, data binding is one of the primary functions of Wick and the "Source" object represents the single connection point between data and components.  

Wick provides several ways to define a component. In addition to using a string of DOM markup, an HTMLElement ``<template>`` object can be passed to the `wick.source` function.

```HTML
...
<body>
  <template id="template">
    This will only show up in the component.
    <span>Hello World</span>
  </template>
  <div id="div">This will end up in the component and in the document</div>
</body>
<script>
  let SourcePackageA = wick.source(document.getElementById("template"))
  let SourcePackageB = wick.source(document.getElementById("div"))
</script>
...
```
This method takes advantage of the ``<template>`` behavior of containing markup within an HTML document that is not rendered until it inserted through a script. `wick.source` will also accept any other HTMLElement as input for the component and will simply extract the inner HTML of that element to compile into a `SourcePackage`.

#### Asynchronous

Wick component compilation is an asynchronous process that supports cross file compilation of components. The `SourcePackage` object return by `wick.source` will not actually create any components until after compilation is completed, which can be some time after the `wick.source` returns. This allows component definitions to be placed in multiple files which then can be loaded and parsed asynchronously. Once compilation is complete, calls to `SourcePackage.mount` will work actually create live components.

In this example document `A.html` contains part of a component
```HTML
<!-- A.html -->
<div id="main_component" component="my-component">
  <div url="/B.html"></div>
</div>
```
The `component` attribute allows a component to be declared by tag value, as in this case the component can now be referred to as the `<my-element>` tag in other components. Once a `component` is defined this way and compiled into a `SourcePackage`, its tag can be used in any other component

File `B.html` contains the rest of the component.

```HTML
<!-- B.html -->
<a href="https://wick.example.com">Hello From Wick</a>
```
This component can now be constructed by linking in `A.html` in an HTML string.
```JavaScript
let SourcePackage = wick.source("<link url='/A.html'> <my-component></my-component>")
```

In the above example the component will be rendered as
``` HTML
<div id="main_component">
  <a href="https://wick.example.com">Hello From Wick</a>
</div>
```

> #### Link tag
> Within a component declaration, the `<link>` tag is used to pull in data from other HTML files without actually placing the contents of that file into the component. This allows the importation of libraries that contain multiple components that are bound to tags through the `component` attribute.
>
> ```html
> <!-- library.html -->
> <button class="buttonA" component="button-a">Click Me!</button>
> <button class="buttonB" component="button-b">No Click Me!</button>
> <button class="buttonC" component="button-c">My Click is the Best Click</button>
> ```
>
> Once a file like this is linked into another component through `<link url="/library.html">` the tags `<button-a>`, `<button-b>`, and `<button-c>` are made available to use in that component and any other subsequent component.

> #### URL attribute
> If the `url`* attribute is defined on other tags, as in `<div url="/B.html">...`, the data from that URL resource is automatically inserted into the inner HTML of the tag.
> This method is also useful when defining Script and CSS tags within a component.
>
> ```HTML
> <div element="my-component">
>   <script url="/script.js"></script>
>   <style url="/style.css"></style>
> </div>
> ```
>  <sub>Currently only absolute paths from the domain are supported using the `url` attribute. </sub>

### Mics

Wick components bind data to properties and expressions defined in double parenthesis `(( * ))` *mic* containers to create dynamic behavior. The term *mic* is anagolous to microphones listing for sounds. In Wick terms, a mic will listen for messages on a certain channel and respond when a message is received. The channel generally corresponds to properties of data objects passed to the component. The double parenthesis style of mic bindings is used in part to avoid conflicting with other the popular curly bracket `{{ * }}` styles used in other templating libraries, allowing these libraries to be used alongside Wick

The mic can be used in many ways to add dynamic behavior to HTML markup. First and foremost, using a mic in the text area of an element will allow property values of JavaScript objects to be injected into the DOM. When a property changes, a message with the name of the property is dispatched to all mics. Any mic listening for that particular message name, the channel, will process the value of that message, The following example illustrates this process.

 ```JavaScript
 let sourcePackage = wick.source(`<div>((name))</div>`)
 let manager = sourcePackage.mount(document.body)

 manager.update({name:"Ingrid"})
 ```
 ```HTML
 ...<body><div>Ingrid</div></body>...
 ```
```JavaScript
 manager.update({name:"Nelson"}
 ```
 ```HTML
 ...<body><div>Nelson</div></body>...
 ```

> ###### Text Nodes
Mics create TextNode elements in the final markup to avoid issues with client side malicious behavior. Any HTML markup found within a property value will simply be appended as text to the DOM without it actually being parsed as HTML.


Mics can be used in many different to provide dynamic behavior.
```HTML
<div id="((id_name))" class="((contents.length > 0 ? class_name : 'no_contents')) ((clicked ? "active" : "inactive"))" onclick="((clicked)(true))">((contents))</div>
```
Notice how the second mic uses a JS expression to define its behavior. Wick allows any mic that produces a change in the markup to be defined with an expression instead of just a property identifier. This way, a single mic can listen to multiple channels, and combine the results to into complex expression. Wick will automatically handle the access of multiple data properties in the expression.

When the above markup is turned into a compiled component and update with a data object like this one
```js
 let data = {id_name:"first_comment", class_name:"comment", contents:""}
 ```
 This kind of markup is produced
 ```HTML
 <div id="first_comment" class="no_contents inactive"></div>
 ```
 Updating the component with an new object that has `"This is my first comment"` set as the value for the `contents` property will produce
 ```HTML
 <div id="first_comment" class="comment inactive">This is my first comment</div>
 ```
> #### Events
> You've probably noticed the differing form of the third mic expression defined for the `onclick` attribute of the div. As a point of anology, this style of binding can be thought of as a "megaphone" which anounces new messages when an event occurs.  This style is used with `on*` event attributes to emit messages from the user. It takes the form ** ``((`` *channel_name* ``)(`` * message_value * ``))``** . Instead of binding to properties of a data object, an megaphone will instead emit it's own messages  that other mics listening on the same channel will respond to. If a user was to click or tap the on the div element of the component, the markup will change to
>  ```HTML
>  <div id="first_comment" class="comment active">This is my first comment</div>
>  ```

 Mics bound to certain attributes take on additional functions that round out their usefulness. When a mic is bound to the Wick specific `on` attribute of a script tag, it provide means to respond to messages with JavaScript.

 ```HTML
<script on="((clicked))">
    alert(clicked);
</script>
 ```
A script like this defined in a componet will be activated when the channel it's bound to receives a message. It receives the value of that message as an argument as with the same name as the channel. There are additional arguments these script receive, which we'll go into detail later.

Finally, a mic bound to an input elements `value` attribute will provide two way binding for that element. User updates to the input will cause event messages to be created and sent through the component, and JavaScript property updates will cause the of the input to change.

```HTML
<input type="text" value="((name))">
<input type="number" value="((age))">
```


### Source of Truth

Using mics provides a familiar, easy, and powerful way to create components with dynamic data binding. Combined with the Wick source system, incredibly dynamic, expressive, and modular components system can be used. A source in Wick refers to the idea that within a certain context, a component, there is a single source of truth that defines the behavior and appearance of a component. If the truth changes, then the component will be updated to accurately represent the form of the source. This source of truth is the data that a component binds to.

By default, the data that the component sees is the one provided by the `update` function of the `SourceManager`. What ever data goes into that is reflected by the state of the component. This provides a convenient way to control the state of components, and allows for easy integration into existing projects. But, to get the most out of the component state system, Wick provides a special element that controls what data the component sees and works with.

#### The source element
The `<w-s>` element, along with its alias tag `<w-source>`, allows the component to be bound to a specific JS object at the component level, as apposed to controlling the data binding outside of the component through `manager.update`. These tags have two unique attributes, `schema` and `model`, that provide a way for a component to bind to specific data, even when the component is a child of another component several layers deep.

The `model` attribute is used to specify the name of a particular model that a component will bind to. The model is picked from `presets.models` that was passed into `wick.source(..., presets, ...)`. If a match is found, the component will bind to that model and pull all data from it.

The `schema` attribute allows a component to create it's data model once it's mounted. This allows user input to turned into a fresh data structure and useful when dealing with forms.

##### Data Flow
The `<w-s>` element also provides ways for components to exchange data. Normally, data flow in a Wick component is exclusive to that component. Any changes to the data a component is observing only seen by that component. If the component is a child or parent of another component, any changes to the data seen by the component is not seen by its relatives.

It may be useful to have a component exchange messages between themselves. For example, if there is a self contained button component that needs to alert it's container component that its been clicked, the containing component should have a way to listen for that message. The solution for this scenario is within the `<w-s>` attributes `import` and `export`.

The `import` attribute defines channels which the source will accept as truth from outside its scope. If a child component needs to know the value of a parent components `name` property, the attribute `import="name"` can be defined to allow the component to accept updates of that property channel from the parent context.

`export` allows for child components to push messages from their internal context into their parent scope. In the above button scenario, the whole process would look like,

```HTML
<!-- bigbutton.html -->
<w-s component="big-button" export="clicked">
  <div class="big_button" component="button" onclick="((clicked)(true))"></div>
</w-s>
```

```HTML
<link url="/bigbutton.html">

<w-s import="clicked">
Has the button been clicked? 
(( clicked ? "yes" : "no")).

<big-button></big-button>
</w-s>
```

### A Container of Truth

Wick provides the container tag, `<w-c>` or `<w-container>`, as a way to produce lists and groups of components from an array of related data. The container system works by placing inside of a `<w-c>` tag a mic which listens for messages that have arrays as values. A component tag or a `<w-s>` must also be declared inside the `<w-c>` to serve as the blueprint for components that will be created when the channel receives array data.
```HTML
<w-c>
  ((array))
  <w-s>
    ((name))
  </w-s>
</w-c>
```
WIth both of these set, when the mic listening on the channel for "array" receives a message, if that message has an array as a value, Wick will create a component for each item in the array and append it to the `<w-c>` tag. By default, when a `<w-c>` tag is rendered, it will be converted into a `<ul>` tag. All components will also be wrapped into a `<li>`tag.

If the previous component fragment receives this type of data,
```JavaScript
{array:[{name:"Paul"},{name:"Ruth"}]}
```
then this markup will be rendered.
```HTML
<ul>
  <li>Paul</li>
  <li>Ruth</li>
</ul>
```
> <ul>  <li>Paul</li>  <li>Ruth</li></ul>


## Dealing with Data


## Building Wick

```
npm install
npm run build-production
```


## What to see.

Checkout the roadmap and changelog

## Dependencies

Wick is a self contained library and has no runtime dependencies, but it does rely on a number of tools for building and testing the library.

### Building:
- Rollup.js - Javascript bundler
- Terser.js - Minifier

### Testing:
- mocha.js - Testing Framework
- chai.js - Assertion Library
- jsdom.js - Javascript DOM implementation for testing browser interaction with Node.js
- nyc- Test coverage tool

### Documentation:
- JSdocs - Documentation generator

# Copyright

MIT License

Copyright (c) 2018 Anthony Weathersby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
