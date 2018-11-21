# Wick Road Map

> Wick is an ongoing and very active project that is subject to change without notice. The goal here is to determine what changes are to occur with the corresponding version code, and to document changes that have already occurred. At this point, versioning is not bound to release dates, and there is no guideline or schedule to determine when a particular version code will be released.

## Wick Versioning

The versioning scheme of Wick is as follows:
>{*Major*} **.** {*Feature* **|** *Breaking*} **.** {*Build* **|** *Bug Fix*} {**a**lpha **|** **b**eta}

1. **Major**  
    - This version number corresponds to a feature complete build state with all major bugs squashed. This version represents a freeze on API, and any version match that has both a matching {*Major*} and matching {*Feature***|***Breaking*} is guaranteed to have a stable API.

2. **Feature** | **Breaking**  
    - This version number corresponds to the inclusion of new features, which may break existing API forms. If you are using a version of Wick that has a matching {*Major Version*} but a different {*Feature***|***Breaking*}, expect the need to rewrite code that relies on Wick. At the very least, review the version log to see if it introduced any breaking changes.

3. **Build** | **Bug Fix**  
    - This version marks the addressing of bugs, errata, and core configuration that does not change the fundamental API. If you are using a build of Wick that has {*Major*} . {*Feature* **|** *Breaking*} but an lower {*Build* **|** *Bug Fix*}, it is encouraged to update your Wick build to the latest {*Build* **|** *Bug Fix*}.

4. **Alpha** | **Beta**
    1. A version code with the symbol {**a**} appended to it indicates the build is in alpha status, and to expect both incomplete test coverage and unresolved bugs. Further, introduced features may have incomplete API implementation. Documentation is not a concern in this version.
    1. A version code with the symbol {**b**} is in beta status, and to the best of our abilities, test coverage should be complete for all new features and any changed code. Bugs may still be present, but major bugs should all be addressed. Documentation is an elevated concern in this version, and either a framework or a draft of documentation for new and changed features should be included with this version.
    1. Version codes without a symbol appended to it are considered ***release*** builds. Documentation is a primary concern of this type of build, and all new features and changed API should be completely documented to warrant a beta version status. All concerns of beta and alpha are also concerns of this version.<sup>[1](#note1)</sup>

# Wick Versions

## v1.0.0

### Planned Features and Improvements
- Full API Documentation
- Full Test Coverage
- Full feature set, as defined by previous version goals
- Simplify, Optimize code base

## v0.6.*

## v0.5.*

### Planned Features and Improvements
- Any container index matching.
- Plugin system for client side page parsing, such as MarkDown
- Define a more thorough API for the template/source system. Change nomenclature for templating from *source construction* to *template construction.
- Complete test coverage for all major classes
- API documentation for all major classes
- Simplify, Optimize code base


## v0.4.* - In Active Development

### Planned Features and Improvements
- ShadowDOM polyfill
- HTML Slot polyfill implementation
- Helpful error hints to indicate a **Pipe**, **Tap**, **IO**, or some other component has failed
- Simplify, Optimize code base.
- Getting Started Guide
- Dynamic string templating
- Server side JSON API tooling
- Simplify, Optimize code base
- Form Validation using Schemes
- Tween Binding
- Define, design, and document data flow. Determine allowed and not allowed patterns, e.i. single direction, bi-directional, cross-component, cross-page (URL mapping), cross-instance (URL mapping), server-client.

## Features Introduced
- Model Store
- CSS templating
- Templating system designed and implemented.
- [Lexer]("./source/common/string_parsing/lexer") Optimization
- Deferred template rendering; allow a template to be "pre-compiled" and ready to plugin to any number of other templates.
- CSS `<style>` **IO** binding
- Asynchronous network importing of templates from within templates.
- CSS @Media Queries support
- CSS @import support

## Major Changes
- Objects exposed by `wick` have been changed
- `HTMLParser` introduced

### v0.4.2a - *current* - Revision to Model and ModelContainer objects.
#### commit: 5a06470af1da93f36611ad38e4e522a745d2f6d2
See [changes]("./CHANGELOG.md#v042a")

### v0.4.1a - *current* - Updating router, element & component objects.
#### commit: cb0b9013b515fc83ed634351071231b5eab53fab
See [changes]("./CHANGELOG.md#v041a")

### v0.4.0a - Exposed Objects Now Defined, CSS Improvements, Changelog.
See [changes]("./CHANGELOG.md#v040a").

- Added `./docs/meta/CHANGELOG.md`
> Changes are now documented in a separate document to keep ROADMAP.md clean. No plans as of yet to retro actively move entries in ROADMAP to CHANGELOG, but all new changes will be documented there, and ROADMAP will link to relevant entries.

---

## v0.3.*

### Features Introduced
- Complex HTML template components that handle bindings to forms, CSS, attributes, strings
- **IO** binding to `<input>` elements
- Component network fetch
- Started API Documentation, Guide
- CSS Selectors matched to HTMLElements

### Major Changes
- Documentation Generated
- Changed templating markers

### v0.3.2b - API Documentation Started.
##### commit: 129785ca8e5d376fd17177da42e32d002b5c8861

- Added Documentation using JSDocs, new `doc` branch.

> After spending several hours with inline documentation generators, decided to pick vanilla JSDOC3 as the generator for the API documentation. A good chunk of the main content in `./source` now has JSDOC comment blocks.

- Created a new branch `doc`, that will serve as the final staging for commits that end up in the master branch as full releases.

>The purpose of the `doc` branch is to have all code within the branch documented and tested. An ideal commit has all code changes well documented and all new features configured with a test suite. `master` will pull from `doc` for all feature release versions.
Any testing or experimental features from here on will be found within the `dev` branch. One can now look at `dev` as the branch were alpha builds are found, `doc` for beta, and `master` for release

- Changed template binding point syntax from `[`\*\*\*`]`to `((`\*\*\*\*`))` to prevent confusion with non template text. Also bind points don't need to be a descendant of a `<w>` tag. (*auto-tap insertion*).

- Added URL resource fetching for components, scripts, and CSS in the template compiler.
> Creating a new SourcePackage will now kick off the template compiling prossess, and SourcePackage#mount will asynchronously load Source trees and HTML elements once a template is compiled.
>
>
>  **Javascript Example**
> ```javascript
> let html_template_ele = document.createElement("div")
> html_template_ele.innerHTML = "<component > url="./my_component.html"></component>"
> /*
> The "url" attribute will be used to fetch the template data > from the server.
> "./my_component.html" would resolve to a document containing:
>
> <template><w-s > schema="any"><div>((name))</div></w-s></template>
> */
> let pkg = new SourcePackage(html_template_ele, presets, > document)
>
> let mount_point = {sources:[]}
> let ElementToAppendTo = document.createElement("div")
>
>
> pkg.mount(ElementToAppendTo, new AnyModel({name:"Scipio"}), > false, mount_point); //[false] - to prevent appending to > ShadowDOM.
>
> mount_point.sources.length == 0 // => true - new SourcePackage will not block, even if content is loading over network.
>
> //...
> //...
> //... Some time later, after the template is fetched and compiled
> //...
> //...
>
> mount_point.sources.length == 1 // => true
>
> ElementToAppendTo.innerHTML //-> <div>Scipio</div>
> ```

### v0.3.1a - Component routing.
##### commit: 9f36ca68e3eb06b6a0623103ce5ce0fef398b8ac

- Updating Element, Component, Router
> Added template importing code to Component. `<components>` can have a `src="*"` attribute that points to an HTML file containing component template info to build a component out of. This will fallback to a local component compiling if the request fails.


### v0.3.0a - SourcePackage, HTML templates, CSS Transitions & Animations.

##### commit: 27c37bb2b1088e643c6e96aff4dc949657a42a5d

- CSS
> Implement the first use of the CSS parser. **Transitioner** utilizes the parsed CSS data to get timing information from elements to determine how long a transition or animation will last before component can be unmounted.

- SourcePackage and SourceConstructor
> The **SourceConstructor** now has a different return value:
>
> ***SourcePackage***
>
>The **SourcePackage** class combines multiple compiled SourceSkeletons along with CSS Object Graphs into one package that can build a more complex component when it is used to bind Model's to the DOM. Like the SourceSkeleton, its purpose is to provide a repository of pre-compiled Source, Tap, Pipe, and IO constructors to allow for quick creation of new components without having to re-parse a `<template>` element. SourcePackage has a `mount(element, model, USE_SHADOW_DOM, host_object)` function property that will bind constructed Sources to an `element` and (optional)`model` passed to the function. The `USE_SHADOW_DOM` boolean can be set to true to have the SourcePackage attempt to mount new elements to the passed in element's shadow root. The `host_object` argument
> This change allows `<template>`s to store more than just a single `<w-source>` tag tree, as was previously allowed, or at least, just a single tag was parsed. Now multiple `<w-source>`, `<script>`, and `<style>` tags all allowed under one template element and are parsed by the SourceConstructor; any other tags in the `<template>` element are simply ignored.

---

## v0.2.*

### Features Introduced
- New API for objects exposed through `wick`
- Custom CSS parser

### Major Changes
- New File names and Class names

### v0.2.3a - Developing A CSS Rules and Syntax parser

##### commit: 1bcbaada5828dbf82661303f9af813f7f1c315e8

- Started implementation of a CSS parser.
> The Top level CSSParser can read CSS rules and make appropriate sub-parsers that handle the parsing of different CSS property definitions. These subparsers are created on demand. Syntax parsers created from the rule parser will only be created when a particular property needs to be read in a CSS string and a syntax parser does not exist. All CSS rule definitions are stored in [CSS_Rules](source/common/css/parser/properties/props_and_types.js). The rules list is not yet exhaustive, but adding new rules is as simple as copying a text string from a CSS specification document.
>
> Created new CSS class types that wrap native types:
> - **CSS_Color** extends **Color** extends Float64Array;
> - **CSS_Length** extends `Number`;
> - **CSS_Percentage** extends `Number`;
> - **CSS_URL** extends `String`;
> - **CSS_String** extends `String`;
> - **CSS_Id** extends `String`;
> - **CSS_Shape** extends `Array`;
> - **CSS_Number** extends `Number`;
> - **CSS_Bezier** extends **CBezier** extends Float64Array;

### v0.2.2a - Attribute Control.

##### commit: b9ec326358e7bdbbbb65cddd253636b8096a1676

- Added attribute handling to the SourceConstructor process.
> Attributes can be directly affected by adding a Tap with an AttribIO at the end. Configured AttribIO class to use element.attributes.getNamedItem to bind to attributes.

### v0.2.0a - New Names, File Refactoring, and new API.

##### commit: f5519d5c54c0a71d7f8090953e86fe9946bcd0ed

- File and Class names.
> - Renamed **Case** to **Source** and likewise for all derivatives. Case is hard to naturally reason about: "It's a case, like a suitcase, that holds and gives access to a Model". With the name *Source*, it is now easier to say, "It is the *source* of access to a Model for the DOM".
> - Got rid of Controller and Element. (Renamed Element to Component and actually got rid of the Component file.) <sub></sub>
> - Renamed Linker to Router for easier recognition of the class's usage.
> - Changed `Wick.light` to `Wick.startRouting`.
> - Reduced several names of different files, such as turning `model_base.js` into `base.js` [source/model/base.js](source/model/) and the same for `case_base.js`, now [source/source/base.js](source/source/). This makes it easier to distinguish the purpose of the file through its file name.

- Wick Library and Exposed Objects.
> Previous versions of Wick dumped nearly all classes into an object exposed as `wick`.
>
> **Javascript **
> ```javascript
> /* Exposed objects as of commit 99e7afd6ebd5b928b71508b0e45aa2acdf84b672 */
> wick = {
>     URL, Animation, ArrayModelContainer,
>     BTreeModelContainer, MultiIndexedContainer, Controller,
>     CustomCase, Rivet, CaseConstructor,
>     Cassette, Form, Filter,
>     Common, Getter, Linker,
>     Model, AnyModel, ModelContainer,
>     Setter, View, light,
>     SchemaType, schema
> }
> ```
>
> Now a more ordered form is used:
>
> ** JavaScript **
> ```javascript
>
> /* Models are considered a primary object of Wick, and they are directly exposed through wick.model > */
>
> model.any = (data) => new AnyModel(data);
> model.any.constr = AnyModel;
> //Small factory constructors for ModelContainers.
> model.container = {
>     multi: (...args) => new MultiIndexedContainer(...args),
>     array: (...args) => new ArrayModelContainer(...args),
>     btree: (...args) => new BTreeModelContainer(...args),
>     constr: ModelContainerBase
> }
> model.container.constr.multi = MultiIndexedContainer;
> model.container.constr.array = ArrayModelContainer;
> model.container.constr.btree = BTreeModelContainer;
>
> /* Schemas are the other critical component that a developer may likely use with wick. */
>
> schema = { SchemaConstructor, DateSchemaConstructor, TimeSchemaConstructor, > StringSchemaConstructor, NumberSchemaConstructor, BoolSchemaConstructor };
> schema.constr = SchemaConstructor;
> schema.constr.bool = BoolSchemaConstructor;
> schema.constr.number = NumberSchemaConstructor;
> schema.constr.string = StringSchemaConstructor;
> schema.constr.date = DateSchemaConstructor;
> schema.constr.time = TimeSchemaConstructor;
>
> /* The rest is stored in wick.core in various properties. */
> let core = {
>     Common,
>     Animation,
>     view: { View },
>     schema: {
>         instances: Schemas,
>         SchemaConstructor,
>         DateSchemaConstructor,
>         TimeSchemaConstructor,
>         StringSchemaConstructor,
>         NumberSchemaConstructor,
>         BoolSchemaConstructor
>     },
>     model: {
>         Model,
>         AnyModel,
>         ModelContainerBase,
>         MultiIndexedContainer,
>         ArrayModelContainer,
>         BTreeModelContainer
>     },
>     network: {
>         router: { WURL, URL, Router },
>         Getter,
>         Setter,
>     },
>     source: { CustomSource, SourceBase, SourceConstructor, Cassette, Form, Filter }
> }
>
> /* Good chance AnyModels will be used very frequently */
> let any = model.any;
> wick = { core, schema, model, any, startRouting };
> ```

---

## v0.1.*

### Features Introduced
- Custom HTML text parsing.
- New template component syntax.
- Testing suite.
- Direct Property Access on Models.
- Packaging using Rollup.

### v0.1.0 - Major changes to file structure, build code, Case structures, and testing.

##### commit: 99e7afd6ebd5b928b71508b0e45aa2acdf84b672


##### This update introduces new elements and a new format for building HTML templates, as well has how output files are created.

- Case and HTML Template syntax
> First off, the CaseConstructor function has been rewritten to parse actual HTML text, instead of DOM HTMLElements objects. This allows for more fine grained control over what syntax can be used in `<template>s`.
>
> Prior to this update `data-*` attribute properties were used to collect information about which Case and Cassette constructors are used and what properties of the Model they bind to.
>
> This old style:
>
> ** HTML **
> ```html
> <template>
>     <case data-model="user">
>         My name is: <span data-class="raw" data-import="name" data-prop="name"></span>.
>         I am from: <span data-class="location" data-prop="location"></span>.
>         My favorite food is:
>         <casetemplate data-model="user_favorite_foods" data-prop="food_preference">
>             <filter data-class="term" data-prop="type" data-import="prefence_type"></filter>
>             <case data-model="food">
>                 <div>
>                     <span data-class="raw" data-prop="name"></span>, which is a: <span data-class="type" data-prop="type"></span>.
>                 </div>
>             </case>
>         </casetemplate>
>     </case>
> </template>
> ```
>
> is now  written as:
>
> ** HTML **
> ```html
> <template>
>     <w-case model="user">
>         My names is:[name].
>         I am from:[location].
>         My favorite food is:
>         [user_favorite_foods]((
>             <w-filter prop="type" import="prefence_type"></w-filter>
>             <w-case model="food">
>                 [name], which is a [type].
>             </w-case>
>         ))
>     </w-case>
> </template>
> ```
>
> In the architecture of Wick, the purpose of a Case Object is to define what model the template will be bound to. Defining a Case in a template is the only way to determine what data is available to the sub-elements in a case tag, defined as `<w-c>` or `<w-case>`.
>
> The Model that the Case binds to is selected by matching a value found in the tags `model` or `schema` attribute:
>
> - Using the `model` attribute, the Case will bind to any existing model that matches the `model` value. This Model must be present in the `presets.models` object for this to work.
> - Using the `schema` attribute, the Case will create new Model with a schema type matching the value of `schema`. A value of `"any"` will cause an AnyModel to be created.
>
> New classes have been created to provide a more apparent connection between Model data, data transformers, and HTMLElement connections.
>
> - The **Tap** class represents a single property channel that is used to pull and push data from a Model attached to a Case.
>
> - The **Pipe** class takes property values and transforms them into more useful forms. It may also parse user input and make it more appropriate for Model consumption, e.g. email format verification or password policy enactment.
>
> - An **IO** represents a connection to the DOM, as it maintains a connection to the surrounding element and pushes updates from Pipes into the element, and also sends user input back through the Pipes to the Model.
>
> <sub> In light of these new classes, the utility of Cassettes, found in earlier builds, is being reconsidered. The ability to create and bind Cassettes HTMLElements have not been implemented CaseConstructor </sub>
>

- Now a Model's properties can be changed directly instead of having to call `Model#add({data:"to add"})`, and can be accessed without need to call `get()` or accessing the `Model#data` property.
> Properties will be automatically parsed using the Model's schema, which uses Object.defineProperty to create special watcher and getter properties on the Model's prototype.
If no schema object is bound to a Model through `Model#schema`, then an AnyModel is returned, which uses a Proxy object to handle updates on the Model.

- Added a **Scheduler** class to keep objects from spamming `requestAnimationFrame` or setTimeout.
> Objects can call `Scheduler#queueUpdate(this)` to have the object's `update` function be called at an appropriate time.
The Scheduler itself uses `requestAnimationFrame` if available.
**TransformTo** has been changed to use the Scheduler. Model will also now use the Scheduler to schedule an update pass when one or more of its properties are changed.

- Introduced new test suites using mocha.
> Started making tests for ModelContainer and its derivatives. Configured the `./test` folder and files to be able to be run with mocha either in browser or in NodeJS using the same source files.

- Rollup FTW.
> Rollup creates tight JavaScript packages the computational overhead introduced with Webpack, which uses things like `eval()` build out packed code strings. Rollup essentially dumps the raw scripts into one big file, exactly the way it would have been done if we ended up writing a custom source compiling script for Wick.

---

## Prior to Versioning

-  Prior to identifying changes with a version code, version tracking was implied. The following lists commits that represent sets of major changes that could have warranted a version code.  

##### commit: 58cfdafc0dba45f5b2e62876cd5555f788a671f4

*Major revision to structure and capabilities. Can be considered v0.0.4a.*

> - Focusing on caching and reusing processed data.
> > The way a Case had been previously configured caused a full parse of a DOM tree and the selection and instantiation of constructors from JavaScript object "hash tables" every single time a Case was created. A `<component>` that could be considered reusable, such as one used to present multiple items of a list, would undergo this whole parsing process for every item in that list, doing more work then necessary.
> >
> > To remedy this, this commit included new "pre-compiled" components known as CaseSkeletons, which would process the DOM tree and create a chain of Case and Cassette constructors that could then later be used to create a Case Instance with all it's Cassettes.  No more parsing would need to occur after the initial parse of a `<component>`. This also allowed for a new type of Case, a CaseTemplate, that could be used to bind multiple Case's to the Models contained within a ModelContainer.
>- Modified structure of Linker to use new Case components, elements build
them now: WIP
>- Broke Model/View code up into a separate class named ModelBase.
> > Both Model and ModelContainer inherit from this. This allows Views to attach to ModelContainers and receive updates on items added and removed from containers. CaseTemplates use this to update their scope with new Cases or remove Cases whenever a Model is added to the CaseTemplate's ModelContainer.
> ##### Objects introduced
>- Added Term Cassette and revised Filter Cassette to handle search results in ModelContainers.
>> The **Filter** Cassette is used a CaseTemplate to filter out Model members of a ModelContainer, and select only ones that match the criteria set by the Filter Cassette.
>- Added **AnyModel** type to facility easier ad hoc creation of components.
>- **BTreeContainer** replacing as **BinaryModelContainer** as a correct implementation of a Binary Tree Container.
>- **CaseSkeletons** are used to store constructor trees that can be used to quickly create a Case instance with all it's Cassette dependents. They combines HTMLElements together with the JavaScript constructors, and will create new HTMLElements through cloning and bind them to then new Cases when it's `flesh`  method is called.
>- **CaseTemplate** is an instance of Case that can attach to a ModelContainer and host child Cases that mount to all or a portion of the Models stored in the container. The HTMLElements these Cases bind to appended to the CaseTemplate's own HTMLElement.
>- **CaseConstructor** this function takes over the task of parsing DOM templates from the Case class. The CaseConstructor will create a CaseSkeleton graph once it parses the input DOM, attaching relevant HTMLElements to the CaseSkeletons to later be cloned into new DOM component elements.


##### commit: 5c1730fc8be2587283870aec90151903b1e4c822

*Model and Schema Verification. Can be considered v0.0.3a*

>- Moved the storage location for export_data from the Model to its schema.
> >This should improve performance, as the export_data object is only created once per parsing of a model schema, and not every time a Model is created.
>- Model now has verify function member that can be called to see if the current state of a data property member is valid for that properties schema type.
>- Created a verify cassette that will display a string value in an element if the data prop is not valid.
>##### Objects introduced
>- **SchemaType** allow for transformation and validation of how Model data is it both set and read.  
> > A SchemaType instance has two methods that deal with Model data, `parse` and `verify`. As data is added to a Model, the new data will be run the SchemaType's `verify` method, which will return true if the type of data being added is acceptable for the type of data that should be stored for a given property. A return of false indicates that the particular data property should not be updated with the new data. The `parse` function is used to convert one form of data into another, more suitable, form. An example is a `Date` object, which is converted into a Unix Epoch integer through the `DATE` SchemaType's `parse` method for more efficient handling of that type of data.   

##### commit: 6becc8c5f86638026d345fa0255d08ecb16ef358

*Improved data binding and networking, and other refinements. Can be considered version v0.0.2a*

>- Removed requirement for Models to contain an `identifier` String property in their schema. This is still a requirement for ModelContainers.
>- Added a `getDataStatus` method to Model Class. This will allows Views on the model to check and see if the data property they are interested in has been updated.
>- Allowed a Getter's `get` function to have a `stored_data` object passed along side the query. This can store info that can be later accessed by the Getter's return functions to make comparisons on data stored and data returned.
>- Renamed **RID** (no idea why that name) to **TransformTo**, for obvious reasons.
> > **TransformTo** is used to map the CSS properties of one object onto another and then transform those properties back to their original state. This gives the appearance of one object transforming into another. (In reality the reverse is happening: the destination object is transformed to appear like the source object and then transforms back to itself). TransformTo supports currying (partial function application) to make it is easier to use with multiple components of different pages.
> - **Linker** now supports "modals", pages that can be loaded on top of an existing page, instead of replacing it. Linker also supports the loading of content that does not have Wick integration. The SPA experience is still maintained.
> ##### Objects introduce
> - New Cassette types: EpochToDateTime, Exists, Filter.
- **WURL** (Wick URL) is a class that allows for the conversion of a Model or it's properties to a URL query string and also the reverse.
- **Page** Represents an entire web page stored in a `<app>` element. Maintains a collection of Elements and is responsible for handling the transitions of Elements of different web pages whose `<element>` has matching CSS id attributes.

##### commit: 0521ec7e215bd9a473bf17ddea6095be0b2cfd36

*The first real commit of code to this project. This build used Webpack to build files. Can be considered v0.v0.1a*
> Introducing a Data Binding Framework design emphasizing progressive integration that allows existing HTML markup to be converted into PWA components in part or in whole with minimal overhead. The framework includes a router subsystem that can load pages dynamically, without having to refresh or load the browser context. Data passing between pages can be handle through a URL system that can map Model data to the query string to allow RESTful pages to act dynamically. Data can be bound to network
> ###### Objects introduced
> - **Model** is an inheritable class that stores data in properties that adhere to a Schema data object, which is bound to a Model's constructor.
> > The Schema defines what properties names and types are available in the Model. If an attempt is made to pass data to the Model that does not match the schema of the Model, the Model will refuse the data and will not update its properties.
- **ModelContainer** stores Model instances and provide methods to access data based on identifier keys specified in the ModelContainer's schema.
- **View** is an inheritable class that can subscribe to a Model and respond to a Model's updated event.
- **Controller** is an inheritable class whose purpose is to update the Model's properties open some event received by the Controller.<sup>***This object is no longer in Wick***</sup>
- **Case** is a class that combines a collection of Views and Controllers, called Cassettes, into a component that is then bound to a DOM subtree.  
> > Cases handle the parsing of DOM trees and creating and attaching Cassettes to various HTMLElements that it finds, selecting appropriate Cassette types based on the `data-class="####"` attributes defined on the elements. The Case inherits from the View class and is bound to a Model when it is loaded by the Linker. <sup>***This object's purpose and use has been revised and it is now called Source***</sup>
- **Cassettes** are classes that attach to HTMLELements and allow output of Model property data into user space through those elements and also connect element events to actions that change Model data.<sup>***This object is deprecated as of version v0.3.1a***</sup>
- **Linker** is a singleton object that handles the loading of HTML pages and determines whether page content can be parsed by Wick to bind it to a current set of Model.
> > Once a page is loaded and Wick is started, User Agent loading / reloading is prevented and instead document.location changes are intercepted and processed by the Linker. This allows new content to be loaded asynchronously and integrated into the current DOM, providing  a "single page" experience. The Linker also provides a mechanism to transition page `<elements>` to give a more pleasant and seamless experience.  <sup>**This object is now called** ***Router***</sup>
- *Other objects introduced, such as content in `./source/common/` and `./source/animation/`, provide various utilities to handle Model data, deal with page transitions and URL's, and provide animation capabilities.*
>- **Element** Element is created by the Linker to bind to `<element>` HTMLElements and control a set of Components. An `<element>` is considered a self contained UI section.
>- **Component** is a class inheriting from Case that is created by the Linker to bind to a `<component>` HTMLElement. It build out the `<component>` with data from a Model through Cassette instances. It can take a template from anywhere in the DOM to build out the `<component>`, matching the first CSS `class` attribute with the `id` property of the template.


### Notes


Copyright 2018 Anthony Weathersby - All Rights Reserved

<a name="note1">1</a>: This document was created as of v0.3.1a. Previous versioning codes of Wick may not have been correctly set for the type of build that is created at a particular commit. It is our intention to ensure that versioning in commits following v0.3.1a adhere to the standard set within this document.
