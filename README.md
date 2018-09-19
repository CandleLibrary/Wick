# WICK
v0.4.2a

## Dynamic Component Templating Framework

## What do we have here?

Wick is a tool for building component based webpages and web apps using HTML, CSS, and Javascript. It acts a runtime manager that handles the compiling of webpages from individual files, the rendering of webpage content with effects and transitions, routing based on resource URI's, and binding of data to UI with responsive updating. 

Wick achieves this through a combination of small libraries that can be used individually for expressed purposes. All together Wick is a framework for building modern webpages, but it can be used in part to provide other useful features, such as CSS and HTML parsing and rendering, animation tools, and data containers for observable based UI updating. Overall, Wick is a sum of many individual parts that are designed to work both independantly and in unison to a deliver a versatile framworking library. 

## The parts of Wick. 

The core of Wick is a templating system that that can be used to create HTML components that can be inserted into the DOM.

```
<div id="((my_id))" class="base_class ((dynamic_class_name))">
    <input type="text" value="((output_value))">
</div>
```
Using ```wick.source``` the above code will be turned into a component that can be integrated into the DOM.

Wick uses a bracket based syntax for most of it's component definitions to keep things simple. There a few nonstandard attributes that can be used to further customize components:
- url - used with any element to append data from another file
- on - used with `<script>` tags to bind a JS script to a particular message.
- badge - can be used to identifier speceific elements 
- element - Defines the element type a w-s or w-c will take. By default, a w-s will be bound to a `<div>` element (unless the source is in a w-c, then it will default to `<li>` element), and a w-c will bind to a `<ul>` element.
- import - Allows a source to accept messages originating from outside the local source of truth.
- export - Outputs messages to parent scope.
- put - Messages received will also update the state of the model. 

There are two elements native to wick that provide advanced functionality
Custom elements:
w-s / w-source - Determines data flow and model binding
w-c / w-container - Used to create lists of components from data found in arrays and other containers. 
filter - allows sorting and filtering actions to be applied to w-c source's


Animation, Routing, Components, Sources, Models, Schemes, Presets, CSS parsing, HTML parsing.

## Building Wick

Wick is available through NPM. 

```
npm install
npm install build-production
```

## The data model

Wick's templating system works by treating data as messages that are passed between components and subcomponents. 


## What to see.

Checkout the roadmap and changelog

## Dependancies

Wick is a self contained library and has no runtime dependancies, but it does rely on a number of tools for building and testing the library.

### Building:
- Rollup.js - Javascript bundler
- Terser.js - Minifier

### Testing:
- mocha.js - The testing framework used by wick. 
- chai.js - Assertion Library
- jsdom.js - Javascript DOM implementation for testing browser interaction with Node.js.
- instanbul.js - Test coverage tool.

### Documenation:
- JSdocs - Documentation generator.
