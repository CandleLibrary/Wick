# Wick Components

d1

Wick is an HTML componentization system. It allows complex UI logic to be broken up into independent parts that can communicate with each other through message passing. Wick has a minimal opinion of how these parts are formed, and allows a great freedom of expression when building components.


## Messages

The central paradigm with a Wick component is the propagation and transimsion of messages throughout the component and among other components. A message is simply a key:value tuple. Bindings respond to specific keys and perform some type of action based on the value. It terms of JavaScript, a message is simply a property:value pair found in any given object. Passing objects to a component will result in certain bindings updating parts of that component based on the properties of a given object. Bindings only act if the property (key) is present in the object that is passed to it.  

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


## Source

The items

Source - This is the heart of the component. It defines data flow and message propagation throughout the system. Messages are passed through it, and elements that have binding to certain messages will respond with some action based on the definition of the binding. The default binding action is to simply place the value of a message at the location of the binding.

Complex components can be created from multiple sources.

	Taps -
		import
		export
		put
		place


Source Package - This contains compiled Sources. It is used to create DOM components and bind them to a Source and Model. It can also be used
