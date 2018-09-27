#### Wick Change Log

## v0.4.2a

### 8/29/2018

1. Updated model container code. setup new tests for btree containers.

2. Numerous tweaks and changes to improve stability. 

### 8/11/2018

1. Revised how data is stored and accessed in Models and ModelContainers. 
> Models now have better support for adhoc creation of data structures from basic Javascript object. Models can be versioned and sealed to create Immutable data structures. 
> 
> A Store object has been added to allow model histories to be tracked.
> 
> Renamed objects in library:
> Model has been renamed to SchemedModel, and AnyModel has been renamed to Model.
> 
> New objects exposed by `wick`:
> - #### Model
>   - `wick.model.scheme` - **SchemedModel Constructor** *object constructor factory*
>   > This is a function that takes as input an object that serves as the schema for a SchemedModel, and returns a SchemedModel constructor based on that schema. 
>   - `wick.model.store` - **Store** *object factory*

2. Added new tests for Models.

## v0.4.1a

### 8/2/2018

1. Modified routing, component, and element objects to work with changes to other portions of Wick. 

2. Changed dynamic and static CSS scoping in templates to scope to <w-s> elements. 

3. Added timing functions to Scheduler. 
> - `Scheduler.queueUpdate(object, timestart, timeend)` can be called with millisecond values for `timestart` and `timeend` arguments. A value of 0 or more for `timestart` will cause the Scheduler to delay calling `_update_` on the requesting object until a period of time equal to `timestart` elapses. A value of 1 or more for `timeend` will cause the Scheduler to repeatedly call `_update_` on the requesting object for a period of time equal to `timeend`

## v0.4.0a

### 7/31/2018

1. Completed major templating/component feature set. Templating patterns now defined. See /docs/guide/TEMPLATE_PATTERNS.md for static examples. 
> - The core Wick template/component system is now in place. Components can be built with template bindings that can be both static and dynamic. Bindings can made on attributes, text areas, and CSS properties in `<style>` elements. Additional binding detection is done in `<input>` elements to create events user input, and on standard HTML `on*` event attributes that automatically bind message passing functions to events. 
> - JS expressions are supported in all bindings and are live. 
> - Data can controlled with `Source` objects to allow data flows to move between parent and children components. Using `import`, `export` and `put`, attributes on `<w-s>` elements allow explicit data flow strategies that can be mixed together to form complex component hierarchies with one, two, and three way data bindings between components and sub-components. 
> - `Source` objects can be used to define what models or schema a particular component can bind to. 
> - Component compilation takes advantage of `url`  attribute in elements tags to import data from other files on the fly. Additionally, compiled components can be passed back into the compiler and used to fill out the inner scope of custom HTML tags. 

2. Added Component transitioning using CSS. Used with `SourceTemplate`s.

3. Added tests for the new features.

### 7/24/2018

1. Integrating new HTML parser back into SourceCompiler

2. Optimized Lexer
 > ###### Changed core loop in Lexer to use lookup tables to process token stream. So not really a loop now and more of a jump list. It's about 3.0x faster than the previous implementation.
> Defined two different implementations of the new design, one that parses the input string itself, and one that copies character codes to an array buffer then parses the buffer as pure as a collection of pure numbers. The array backed method has absolute top performance when parsing and tokenizing a string containing 80000 characters.
> - This test case, which creates a single Lexer object before the test loop and then reuses it for each iteration, using Lexer.reset to point the lexer back at the beginning of the input data, shows the Array backed preforming 3.9x faster then the original, whereas the string only Lexer is just 2.9x faster.
> ```console
> Original lexer version 0.3.2a x 180 ops/sec ±1.68% (83 runs sampled)
> Lexer Beta version A - Pure String 0.4.0a x 527 ops/sec ±0.87% (90 runs sampled) - 2.9x
> Lexer Beta version B - Array Backed 0.4.0a x 713 ops/sec ±1.35% (90 runs sampled) - 3.9x
> ```
> - However, if the calling function creates new lexer objects frequently, performance of the Array drops, as expected since creating a new array store takes some extra time in the constructor function. The version that just processes the input string stays fairly consistent:
> ```console
> Recreating Original lexer version 0.3.2a x 175 ops/sec ±0.98% (81 runs sampled)
> Recreating Lexer Beta version A - Pure String 0.4.0a x 533 ops/sec ±0.88% (91 runs sampled) - 3.0x
> Recreating Lexer Beta version B - Array Backed 0.4.0a x 494 ops/sec ±0.62% (91 runs sampled) - 2.8x
> ```
>
>I'll use the pure string version going forward, as it provides a consistent performance improvement without using more memory.


3.Improved HTML parser
> Parser will remove extra whites space and leading and trailing white spaces and new lines

### 7/22/2018

1. Improved and consolidated URL methods into the  WURL (**W**ick **URL**) object.
> - It uses a regex expression to pull info from a string, or it can pull info from document.location
> - Can be used to fetch and catch resources.
> - Used in the CSS parser for fetching of `@import` CSS documents.
> - Used by the HMTL parser to fetch additional content
> - Can be used to assign to, and pull from, object data values store in the page URL using the query field.

2. Improved HTML parser.





### 7/21/2018

1. Removed dependencies
> `esdoc`;`esdoc-standard-plugin`;`save-dev`;

2. Improved CSSParser
> - Added `@import` and `@media` parsing.
> - CSSParser returns a `Promise` now, which allows for Asynchronous fetches of external CSS data:
```javascript
 wick.core.css(`@import url("/test/data/import.css"); a{font-size:2px}`).then((css) => { //...
 ```

3. Created HTMLParser
> Essentially moved HTML  specific code found in `./source/compiler/compiler` into it's own module. The interface is the same as the CSSParser, allowing for fetching of external resources. Returns a `Promise` which will return  an AST for HTML elements.

4. Changed objects exposed by `wick`
> - #### Presets
>   - `wick.core.presets`
> - #### Model
>   - `wick.model` - **Model | AnyModel** *object factory*
>   - `wick.model.constr` - **Model** *constructor*
>      - ##### AnyModel
>          - `wick.model.any` - **AnyModel** *object factory*
>          - `wick.model.any.constr` - **AnyModel** *constructor*
>      - ##### ModelContainer
>           - `wick.model.container.multi` - **MultiIndexedContainer** *constructor*
>           - `wick.model.container.array` - **ArrayModelContainer** *constructor*
>           - `wick.model.container.btree` - **BTreeModelContainer** *constructor*
>           - `wick.model.container.constr` - **ModelContainerBase** *constructor*
>   - `wick.core.model` same as `wick.model`
> - #### Schema
>   - ##### Instances
>       - `wick.scheme.date` - **DateSchemeConstructor** *instance*
>       - `wick.scheme.time` - **TimeSchemeConstructor** *instance*
>       - `wick.scheme.string` - **StringSchemeConstructor** *instance*
>       - `wick.scheme.number` - **NumberSchemeConstructor** *instance*
>       - `wick.scheme.bool` - **BoolSchemeConstructor** *instance*
>   - ##### Constructors
>       - `wick.scheme.constr` - **SchemeConstructor**  *constructor*
>       - `wick.scheme.constr.date` - **DateSchemeConstructor**  *constructor*
>       - `wick.scheme.constr.time` - **TimeSchemeConstructor**  *constructor*
>       - `wick.scheme.constr.string` - **StringSchemeConstructor**  *constructor*
>       - `wick.scheme.constr.number` - **NumberSchemeConstructor**  *constructor*
>       - `wick.scheme.constr.bool` - **BoolSchemeConstructor**  *constructor*
>   - `wick.core.scheme` same as `wick.scheme`
> - #### Source
>   - `wick.source` - **SourcePackage** *object factory*
>   - `wick.source.package` - **SourcePackage** *constructor*
>   - `wick.source.base` - **SourceBase** *constructor*
>   - `wick.core.source` same as `wick.source`
> - #### View
>    - `wick.core.view` - **View** *constructor*
> - #### Network
>   - `wick.core.network.url` - **WURL** *constructor*
>   - `wick.core.network.router` - **Router** *constructor*
>   - `wick.core.network.getter` - **Getter** *constructor*
>   - `wick.core.network.setter` - **Setter** *constructor*
> - #### CSS
>   - `wick.core.css` - **CSSParser** *object factory* <sup><sup>**returns
 promise**</sup>
> - #### HTML
>   - `wick.core.html` - **HTMLParser** *object factory* <sup><sup>**returns promise**
> - #### Lexer
>   - `wick.core.lexer` - **Lexer** *object factory*
> - #### Common
>   - `wick.core.common` - See API

5. Provided a way for **SourcePackage** to return a `Promise`
>```javascript
(new SourcePackage(ele,presets,dom_context_ele,true /** <= RETURN PROMISE **/)).then((source_package)=>{
    source_package.mount(/* ... */)
})
```
With `wick.source`
```javascript
wick.source(ele,presets,dom_context_ele,true /** <= RETURN PROMISE **/)).then((source_package)=>{
    source_package.mount(/* ... */)
})
```


### 7/20/2018

1. Removed SourceConstructor class
> The utility SourceConstructor provided was rolled into the constructor function for SourcePackage. At the time of removal, SourceConstructor was nothing more than a trivial factory function for SourcePackage: `const SourceConstructor = (...args)=> new SourcePackage(...args)`. Such a function can be easily redefined if necessary.

2. Added CHANGELOG.md
> Location in: ./docs/meta/CHANGELOG.md

3. Renamed roadmap.md to ROADMAP.md; moved ROADMAP.md.
> Location now in: ./docs/meta/ROADMAP.md
