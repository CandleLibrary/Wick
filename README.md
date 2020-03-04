# cfw.Wick 
<sub> v0.9.0 </sub>
## HTML Components on <span style="color:red; color:linear-gradient(180deg, rgba(255,179,0,1) 0%, rgba(255,124,0,1) 49%, rgba(213,46,46,1) 84%, rgba(141,0,205,1) 100%)">FIRE</span>

> This document is in early draft stage. Wick is also currently undergoing a TypeScript conversion and engine rewrite. The features described here are indicative of the future Wick 1.0.0 version and may not be available at this point.

# What is Wick

#### Blur the line between HTML and JavaScript.
Wick is a dynamic component compiler and runtime. It is able to build complex HTML based interfaces that integrate CSS and JavaScript using a simple yet powerful 
syntax.

# Why Use Wick?

## Easy to Learn - Easy to Use 

Wick introduces a minimal amount of syntax to handle the problems of data binding, component composition, and asset wrangling. Using already powerful HTML and JavaScript expressions, Wick relies on established conventions to handle common interface problems. If you know HTML, then you know basic Wick, and if you're good with JavaScript, then Wick is the interface wrangler for you.

For example, in order to create a list of items, Wick uses a simple binding expression `((` ### `)(` ### `))` combined with HTML and JavaScript.
```html
Things I Like:
<ol>
    (( [{name:"Books"}, {name:"Parks"}, {name:"Films"}] )( <li>((name))</li> ))
</ol>
```

 The binding is the only syntax that is unique to Wick. For other tasks, well known conventions are left intact, such as using the HTML `onclick` attribute to subscribe to an element's click event, or using `import` and `export` statements to handle variable access and data flow. 

## Flexible
This is further expressed by the ability for wick components to be described in JSX syntax javascript files, or using HTML *template* style syntax. To Wick, the following components are equivalent:
#### JSX style

```jsx
the_best_color = "green";

export default <div> The best color is (( the_best_color )). </div>
```

#### HTML style
```html
<div> 
    <script> the_best_color = "green"; </script>
    The best color is (( the_best_color )).
</div>
```

The two expressions of a components will reduce to the same output, giving great flexibility in how you decide to use wick. 

Wick also support component composition, and provides several mechanisms to import component constructs described in different files. Components can be imported through an 
`import` statement,

```html
<div>
    <script>
        import my_component from "./url-to-my-component"
    </script>
    <my_component/>
</div>

``` 
a `<import>` tag, 
```html
<import url="./url-to-my-component">
<my_component/>
```
or using the `url` attribute that is made available on every element. 
```html
<div url="./url-to-my-component"/>
```

# A Brief Introduction to Wick
## Getting Started

The simplest way to use Wick is to use the CDN to load it into a web page. 
```html
<script src="someplace.that.serves-content.org/wick/1.0.0/min">
```

Then use the wick constructor object to create your first Wick component
```JS
const comp = wick("<div>Hello World!</div>");

comp.mount(document.body);
```
The ``wick`` constructor function can accept both HTML and JavaScript strings and URL's to component  files.

Learn more at [TODO](#).

## The Binding
Wick is created around the syntax of the binding `((` `))`. Like other templating systems, a Wick binding allows content to be injected into an otherwise static file. In Wick's case, the content that is injected is the result of a JavaScript expression. 

```html
This binding (( "is completely" )) unnecessary.
```

Any Javascript expression can be used in a binding.

```html
This binding is (( 2*50 ))% better.
```
Wick additionally allows JSX like HTML expressions to be used within bindings.

```html
This binding is (( <a ref=#>linked to nothing!</a>  ))
```

By itself, bindings yield moderate value, but the true benefit is found when combined with JavaScript code. 

```html
<div>
    This binding has been running for (( value )) second(( value == 1 ? "s" : "")).
    
    <script>
        value = 0;
        setInterval(()=>value++,1000);
    </script>
</div>
```
Wick automatically assigns global variables to the component's scope. This means any variable that is undeclared can be referenced in a binding. The variable will only scoped to the component's context, and it will never leak to the true global object. 
This preserves classic JavaScript variable scoping while providing a simple way to define variables for use in bindings. 

Bindings become even more powerful when paired to HTML attributes that yield values:

```html
<div>
    You typed: (( text_message ))
    <input type="text" value="(( text_message ))"/>
</div>
```

Or events:

```html
<div>
    <script> click = 0; /* Need to initialize the component variable click */ </script>
    
    <button onclick="((click++))"/> 
        Clicked ((click)) time(( click == 1 ? "s" : "" )) 
    </button>
</div>
```

Learn more at [TODO](#).

## Data

By default, global variables exist only in the component context, and there is no way to retrieve their values except from within the component through the bindings and scripts defined within it. 

Wick provides a way for the properties of an object to drive the values of component variables. 

```js
// In webpage script

const comp = wick("<div>((name))</div>");

comp.mount(document.body, {name:"Elizabeth"});

// Component HTML is now <div>Elizabeth</div>

```

When an object is assigned to a mounted component, its properties provide the initial values for component scoped variables. This is by default a one way street. Any changes to the component variable `name` would not modify the original object. 

```js
// In webpage script

const 
    comp = wick(" <div>((name))<input value=((name))></div> "),
    data = {name:"Elizabeth"};

comp.mount(document.body, data);

// A user types into the input field "Sophia".
// The component HTML is <div>Sophia<input/></div>
// but:

data.name == "Sophia" // => false

```
To overcome this, Wick provides a special virtual URL `$model` that can be used with a JavaScript `import` statement to explicitly map data object properties to the component scope with two-way bindings. 

```html
<!-- my-component.html -->

<div>
    <script> 
        import { name } from "$model"; 
    </script>
    Type in your name: <input value=((name))/>
</div>

```

```js
// In webpage script

const 
    comp = wick("my-component.html"),
    data = {name:"Elizabeth"};

comp.mount(document.body, data);

// Now a user types into the input field "Yulia".

data.name == "Yulia" // => true

```

Only object properties that have been explicitly imported into the component scope will have two way binding. 

Learn more at [TODO](#).

## Containers

An advanced use of a Wick binding to use one to bind objects stored in arrays to HTML elements. 
```html
Things I Like:
<ol>
    (( [{name:"Books"}, {name:"Parks"}, {name:"Films"}] )( <li>((name))</li> ))
</ol>
```

Wick recognizes bindings expressions of the form 

```jsx
(( [ a,b,c,... ] )( <component-template> ))
``` 
and
```jsx
(( containerize( container_object ) )( <component-template> ))
```
as container bindings. Objects within the array will be bound as `$models` to the `<component-template>`, and the templates will be appended to the DOM where ever the binding occurred. 

Containers can be taken to the next level by using functional programming to modify the results of the array output:

```jsx
(( 
    [{name:"Tom"}, {name:"Dick"}, {name:"Harry"}]
        .filter(e=>e.name == "Harry") 
)( <div>((name))</div> ))
```

Combined with component variables, you can quickly create search forms on large data sets.

```html
<div>
    <script>
        three_stooges = [
            {name:"Moe", original:true},
            {name:"Larry", original:true},
            {name:"Shemp", original:true},
            {name:"Curly", original:false},
            {name:"Joe", original:false},
            {name:"Curly Joe", original:false}
        ]
    </script>

    Characters of the three stooges:
    
    <ul>
        (( 
            /* 
                The containerize method ensures that
                we are working an object that has
                numeric indexes.
            */
            containerize(three_stooges)
            /* 
                Containerized methods will only
                run when component variables
                have values other than [undefined]
            */
                .filter(e=>e.name == search)
                .filter(e=>e.original || !original)
            )( 
            <div>((name))</div> 
        ))
    <ul>

    <input type="text" value=((search)) placeholder="Search">
    Only show original: <input type="radio" value=((original))>

</div>
```
Learn more at [TODO](#).


## Composition

### Importing

Wick is designed to work with multiple components defined in different files. It is able to  import data from these sources and integrate them into one large "master" component.

One of the simplest ways to define a component that can be imported into another file is to use the `component` attribute on a HTML element.
```html
<!-- my-comp.html -->
<span component=my-comp> cow bell <span/>
```

This component can now be imported into another component file using the `<import>` tag.

```html
<!-- my-other-comp.html -->
<import url="./my-comp.html"/>
<div> I need some more <my-comp/>. </div>
```

The same component can also be pulled into JavaScript based component file using an `import` statement.
```jsx
// my-other-comp.jsx

// Hyphenated components are automatically converted to camelCase,
// similar to css prop names are converted into HTMLElement.style properties.
import { myComp } from "./my-comp.html";

export default <div> I need some more <myComp/>. </div>
```
Learn more at [TODO](#).

### Component Data Flow

Data flow between components and sub-components is, by default, non-existent. Each component defines it's own data scope and may optionally be bound to a model that provides additional data values. There is no communication or awareness of one components variables with another. 

Wick provides the virtual URL `$parent` to allow a component to import the variables of its parent component scope. 
```html
<!-- child.html -->
<div component=child>
    <script>
        // We can additionally rename the variable to prevent 
        // namespace collisions.
        import {  name as parent_name } from "$parent";
        name = "Animal";
    </script>
    The scope ((name)) Is a child of the scope ((parent_name))
</div>

```

```html
<!-- parent.html -->
<import url="./child.html">
<div>
    <script>
        name = "Party";
    </script>
    <child/>
</div>
```

This will establish a one-way binding between the parent and the child scope. In order to have to a two-way data flow, the child must export a list of subscribable variables.
```html
<!-- child.html -->
<div component=child>
    <script>
        // We can additionally rename the variable to prevent 
        // namespace collisions.
        import {  name as parent_name } from "$parent";
            name = "Sexy Beast";
        export { name }
    </script>
    is a child of the scope ((parent_name))
</div>
```
Then the parent scope can use the `bind` attribute on the child scope to bind a local variable to one of the child's exported variable, using JavaScript object destructuring syntax.

```html
<!-- parent.html -->
<import url="./child.html">
<div>
    <script>
        name = "Disgruntled Coder";
    </script>
    (( child_name )) <child bind=`(( {name: child_name} ))`/>
</div>
```
Learn more at [TODO](#).

---

Hope that sparked your interest. There will be much more to learn about Wick with subsequent updates. 
Topics that will be introduce and expanded on, in addition to the ones covered here, include:

- Animation and Transitions using cfw.**Glow**
- Scoped CSS, CSS bindings, and CSS embedded in Javascript.
- Advanced Component Composition and Slots
- Observable Data
- Presets Object, Script Bundling, Data Model Registry
- Plugins

# Get To Know Wick Better

#### Docs - TODO

#### Contribution Guide - TODO

License MIT