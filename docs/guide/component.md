# Wick Components

d2

Wick is an HTML componentization and data-binding system. It allows complex UI logic to be broken up into independent parts that can communicate and store data through message passing. Wick has a minimal opinion of how these parts are formed, and allows great freedom when building components.

## Messages

The central paradigm with a Wick component is the propagation and transmission of messages throughout the component and among other components. A message is simply a key:value tuple. Bindings respond to specific keys and perform some type of action based on the value. It terms of JavaScript, a message is simply a property:value pair found in any given object. Passing objects to a component will result in certain bindings updating parts of that component based on the properties of a given object. Bindings only act if the property (key) is present in the object that is passed to it.  

Defining a component is done through HTML files that are passed to a compile function, which processes the HTML and builds a Dynamic Syntax Tree which describes the structure of component and it's data bindings. This DST can then be used to create DOM elements that have all the necessary binding and JavaScript code to actively respond to both user and JavaScript inputs. The use of a DST allows for efficient caching and reuse of common components.  

Here is an example of a basic Wick component:

```html
<!-- example.html -->

<w-s>
	<div class=((class_name)) >

		Please enter your name: <input type="text" value=((name)())>

		Your name is ((name_length)) character(( name_length > 1 ? "s" : "" )) long.
	</div>

	<script on=((name)) >

		console.log(`The user has enter ${name} for their name`);

		emit.name_length = name.length;

	</script>
</w-s>

```

The bindings are defined using ``((`` ``))`` brackets, and can be used in large number of HTML element tags and text areas. In the example above, bindings are used to define attribute values, script events. Two way bindings are created on &lt;input&gt; value attributes with the special binding form ``((`` ``)(`` ``))``, which allows messages to be sent as well as received from this binding.

Source packages are compiled components ASTs that can be used and reused to create actual dynamic HTML markup within the DOM. 

# Special ML Tags

##### Wick introduces specialized HTML tags that provides core functions beyond template binding.

## Import ``<import>`` || ``<link>``


## Source ``<w-s>``

This is the heart and soul of Wick is found in the source element. This defines a component and is used to specify what messages the component will respond to. It can bind to existing Models to out put that models information, or it can creates it's own model.

### Attributes
#### Message passing
- **import** - This source will accept messages generated external to the element whose names are in this attribute.
- **export** - This will allow messages in this list to pass out of the source to it's parent source.
- **put** - Values of messages matching this list will be inserted into the sources model.

#### HTML

- **element** - The source element will be turned into the element specified by this attribute. If this attribute is not set then the default type will be **div**.
- **component** - This will allow other components to accept

#### Models

- **model** - If this attribute is set, the source will bind to the model in **presets.models** whoe's name matches this attributes value.
- **schema** - If this attribute is set, the source will create a new model based


## Container - ``<w-c>`` || ``<wick-container>``
>#### Syntax:
>**&lt;w-c>** **((** *object-selector* **))** *[* **&lt;filter/>**  *]*&ast; *[* **&lt;w-s> *...* &lt;/w-s>** *||* **&lt;** *html-tag* **>** *...* **&lt;/** *html-tag* **>** *||* **&lt;** *component_name* **>**  *]* **&lt;/w-c>**

### Filter ``<filter>``



### Scripting

### CSS
