# WICK
## Component Framework
[v0.3.1a](./roadmap.md/#v031a-current-component-routing)

### Purpose

> Wick is a component framework that thinks it's a library that think's it's a framework, that think its a...

Wick is a multi paradigm system that is focused on providing a data driven, modern standards appreciating framework for the creation of single-page-app (SPA) style sites. Wick provides a number of tools for quickly creating sites that act as apps, while still providing a browser aware website that respects RESTful methodologies. This means that you can have your cake, and eat it too!

Wick takes advantage of URL query syntax to pass data between pages. This is the heart of the RESTful nature of Wick. Data is stored in the URL and allows pages to be indexed and bookmarked.

*HTML*, *CSS*, and *JS* are the defacto technologies for creating much of today's websites and application interfaces. Individually, they each represent a formidable collection of rules, methodologies, and quirks that can take awhile to get right. Together, they

Handling these beasts can be somewhat unwieldy
Wick is
- Simple and quick to start using.
- Incredibly deep when you need it to be.

Wick takes a holistic approach to using all three technologies to create components, and stays true to the forms these technologies have. Component markup is defined in HTML, not JavaScript. Likewise CSS is defined in style tags or link tags. Wick provides JavaScript bindings that to these elements through **((** * **))**<sup>[1]()</sup> shockwave injection.

Wick does it's best to embrace the Web as largely know it to be, a collection of documents accessible through the HTTP(S) protocol. With Wick, Styles stay in cascading style sheets, JavaScript stays in .js documents, and HTML markup stays in, well, .HTMLs. This separation, though it may seem to lead to extra work, preserves the now natural way websites are organized today. Turning an existing site into a Wick enabled site takes little work, as Wick will integrate naturally with the they documents are organized. The best part is, Wick is designed to be an opt-in system. It can be totally ignored on pages, and all will be fine. Well, maybe, no one likes to be completely ignored.

```html
<my-component class="super" style="color=((color))"> My Name is: ((name))</my-component>
```

Wick provides multiple tools to create components, bind them to data, and present them to the end user. You can use wick to create a single dynamic component in your HTML bound to data specific to the app, or it can create a full web based application, handling.

When compiling components, Wick has a deep understanding of HTML and CSS through it's build CSS Rules parser and HTML parser. This allows Wick to get into the guts of a component and affect nearly anything that can be affected.


- Binding of CSS and HTML to JavaScript data through the **[Model](./sources/model) ** and **[Source]()** systems.



- Handling the networking of data through JSON and form POST  based API's.
- Dynamically loading content asynchronously and integrating into a Single Page App interface.

  - Page Transitions

- Sanitizing data and forcing data integrity through the **[Schema](./source/schemas)** system.

- URL query string data binding to **Models** for caching page state.

All this in a package less then 80KB ... unzipped.

#### Architecture

Ease of use, flexibility, and modularity are the primary concerns with the way wick is designed. Additionally care has been taken to reduce the size of the library overall without sacrificing its feature set.  

#### Classes




### What Now ?

[Getting Started]()

To see were Wick will end up from here, check out the [Road Map]().

-
