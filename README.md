# WICK
v0.4.2a

## Dynamic Component Templating Framework

## What do we have here?

Wick is a tool for building component based webpages and web apps using HTML, CSS, and Javascript. It acts a runtime manager that handles the compiling of webpages from individual files, the rendering of webpage content with effects and transitions, routing based on resource URI's, and binding of data to UI with responsive updating.

Wick achieves this through a combination of small libraries that can be used individually for expressed purposes. All together Wick is a framework for building modern webpages, but it can be used in part to provide other useful features, such as CSS and HTML parsing and rendering, animation tools, and data containers for observable based UI updating. Overall, Wick is a sum of many individual parts that are designed to work both independantly and in unison to a deliver a versatile framework library.

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

## The Wick Component

Wick components are built from HTML files containing traditional markup and special wick specific attributes and tags. Combined with templating data binding and inline javascript expressions, Wick provides powerful ways to create dynamic HTML components that can be integrated into existing pages. Wick also provides ways to define data flow between components and link components from different files to create complex component structures that can handle more advanced application interfaces.

### Componetization


### Shockwave

Wick, by default, uses properties and expressions bound in double parenthasis `(( ** ))` *shockwave* containers to create dynamic behaviour. The double parenthasis style of shockwave binding is used in part to avoid conflicting with other the popular "handlebar" or "mustache" `{{ ** }}` styles used in other templating libraries.

The shockwaves can be used in many ways to add dynamic behavior to HTML markup. First and foremost, using a shockwave in the text area of an element will allow property values of JavaScript objects to be injected into the DOM. The following example illustrates this process.

> ```JavaScript
> let component = wick.source(`<div>((name))</div>`) // "wick.source" will create a compiled component based on the input data, which can be a string or a <template> HTMLElement
> let manager = component.mount(document.body) //Compiled components are used as constructors for actual HTML markup, and must be "mounted" to an existing DOM node. When this is done, a component manager is created, allowing data to be passed to the now fully constructed component.
>
> manager.update({name:"Ingrid"})
> //--> <body><div>Ingrid</div></body>
>
> manager.update({name:"Nelson"})
> //--> <body><div>Nelson</div></body>
> ```


Shockwaves can be used in many places to provide dynamic behaviour.
```HTML
<div id="((id_name))" class="((contents.length > 0 ? class_name : 'no_contents')) ((clicked ? "active" : "inactive"))" onclick="((clicked)(true))">((contents))</div>
```
Notice how the the second shockwave uses a JS expression to define it's behavior. Wick allows any shockwave that produces a change in the markup to be defined with an expression instead of just a property identifier. Wick will automatically handle the access of multiple data properties in the expression.

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

You've probably noticed the different form of the third shockwave expression defined for the `onclick` attribute of the div.  This style is used with `on*` event attributes to emit messages based on events. It takes the form ** ``((`` *event_name* ``)(`` * event_value * ``))``** . Instead of binding to properties of a data object, an event shockwave will instead emit it's own data object that other shockwaves in the component can bind to. If a user was to click or tap the on the div element of the component, the markup will change to
 ```HTML
 <div id="first_comment" class="comment active">This is my first comment</div>
 ```

 Shockwaves bound to certain attributes take on additional functions that round out their usefulness. When a shockwave s\is bound to the Wick specific `on` attribute of a script tag, it provide means to use Javascript to react to property changes

 ```HTML
<script on="((clicked))">
    alert(clicked);
</script>
 ```
A script defined this way will be activated when the property it's bound to changes. It receives the value of that property as an argument as with the same name as the property. There are additional arguments these script receive, which we'll go into detail later.

Finaly, a shockwave bound to an input elements `value` attribute will provide two way binding for that element. User updates to the input will cause event messages to be created and sent through the component, and Javascript property updates will cause the of the input to change.

```HTML
<input type="text" value="((name))">
<input type="number" value="((age))">
```


### Source of Truth

Using shockwaves provides a familiar, easy, and powerful way to create components with dynamic data binding. Combined with the Wick source system, incredibly dynamic, expressive, and modular components system can be used. A source in wick refer's to the idea that within a certain context, a component, there is a single source of truth that defines the behavior and appearence of a component. If the truth changes, then the component will be updated to accuratly represent the form of the source. This source of truth is the data that a component binds to.

By default, the data that the component sees is the one provided by the `update` function of the SourceManager. What ever data goes into that is reflected by the state of the component. This provides a convienent way to control the state of components, and allows for easy integration into existing projects. But, to get the most out of the component state system, Wick provides a special element that controls what data the component see's and works with.

#### The source element
The `<w-s>` element, along with its alias `<w-source>`, allows the component to be to specific JS object at the component level, as apposed to control the data outside of the component through `manager.update`. These tags have two unique attributes, `schema` and `model`, that provide a way for a component to bind to specific data, even when the component is a child of another component several layers deep.

The `model` is used to specify a particalur model that a component will bind to. This is accomposhid by matching the name of a model to the models defined in `presets.models`. If such a match is found, the component will bind to that model and pull all data from it.

The 'schema` attribute allows a component to create it's data once it's mounted. This allows user input to turned into a fresh data structure and useful when dealing with forms.

##### Data Flow
The `<w-s>` element also provides ways for components to exchange data. Normally, data flow in a Wick component is exclusive to that component. If it is a child or parent of another component, any changes to the data seen by those components are not seen by its relatives.

It may be useful to have a component exchange data updates between themselves. For example, if there is a self contained button component that needs to alert it's container component that its been tapped, the containing component should have way to listen on that event. The solution for this scenarior is within the attributes `import` and `export`.

The `import` attribute defines properties which the source will accept as truth from outside its scope. If a child component needs to know the value of a parent components `name` property, the attribute `import="name"` can be defined to allow the component to accept updates of that property from the parent context.

`export` allows for child components to push messages from their internal context into the parent scope. In the above button scenario, the whole process would look clicked
```HTML


<w-s>
  <div class="big_button" component="button" onclick="((clicked)(true))"></div>
</w-s>
```



### Messaging

### Dealing with Data


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
- mocha.js - Testing Framework
- chai.js - Assertion Library
- jsdom.js - Javascript DOM implementation for testing browser interaction with Node.js
- nyc- Test coverage tool

### Documenation:
- JSdocs - Documentation generator
