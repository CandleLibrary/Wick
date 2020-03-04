# cfw.Wick 

## HTML componentization on FIRE

<sub> v0.9.0-ts </sub>

What Is this?

Component compiler. Compiles Files into components. Supports JS, HTML, and CSS files and will join them into a single consumable component. 

Why is this?

Want a general system with minimal opinions to create dynamic content easily. 

What makes it worth it?
Easy to lean. Minimal syntax. Supports existing files. 
The only truly different syntax is the binding, which by default is > `(( ))`. The main takaway from a binding is that that's where a Javascript expression statement goes. 
    How does it work?

## Scopes

```html
<scope> <!-- Every file is a scope - Global variables are attached to the scope's closure. -->
    <script>
        import {douglas as mable} from $scope;
        // Variables that are not declared within in 
        // script tags are bound to the scope's closure.
        the_best_color = "green";
    </script>
    <!-- bindings reveal the data of assignments -->
    The best color is (( the_best_color )).
</scope>
```
Scripts run automatically when their globals changes. `on=(())`-less scripts are evaluated once on script load, provided their dependencies are met. They can also be run based a single watch variable `{JS}on=(({watch_variable}))`.

A JSX/JS style can also be defined as a wick component
```jsx
//my-color-component.js
import {douglas as mable} from $parent;
import { a } from $model;

export { d } // Exports are either components or variables.
//variables get ejected to parent scope.

//How to capture and push to model? define model? 
// model import statement is a built in that links to the scope's model
// outer is the data flow between parent any varialbe imported from model will be bound to the model, and the global scope, if there is no assignement within the current script. 

the_best_color = "green";

export default const scope = 
<scope>
    <scope2 bind=(( name ))/>
    The best color is (( the_best_color )).
</scope>

```

The two files are symantically equivilant, just written in different, partial to your preference.

## Javascript and HTML Overrides
Wick performs what it does by overriding and expanding the meanings of a few things. The global execution environenment for a component is a scope
### Bindings

``
(( containerize(value)
    .filter(name) 
    .sort(name)
    .limit(name)
    .scrub(name)
))(
    <test>((name))<</test>>
))
``

### Attributes

**bind** = List of assignment expressions or Identifier. Hoist's a child's export variable name to the parent's scope, optionally renaming the name to a different value. 

**url** = The resource at URL will be meged within the element.

**component** = Declares a global component name.

### Data flow
$parent import - these valles allow the a variable within the parent scope to be pulled into the child's scope. If it is found within a 

$model import - these values allow bindings to the scopes model. Same as parent, if the import name is not assigned to within the current script, variable will be hoisted to the scope's closure. 

> #### How are schemes defined?

## Components
Components can be declared from any scope. In ***mycomponent.html***
`<div defines-component="my-component">`.

Allows the component `<my-component>` to 

How can I learn more?
How can I get involved?

#### Docs - Wip

#### Contribution - Please read the contributers guideline

License MIT