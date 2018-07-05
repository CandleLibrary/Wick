# Cases, Cassettes, and CaseTemplates

A Cases's purpose is to link UI elements to a Model. It is used in combination with Cassettes to build UI systems. A Cassette represents a single interest on a particalar set of Model's data property, typically one property, but there is no restriction on which data properties a Cassette has access to. CaseTempletes are used with ModelContainers to show the result of multiple Models all at one time. They can be used to list things such as product listings or gallery pictures.   

In an HTML document, Cases are stored in <template> elements, which are then parsed by the CaseConstuctor to create a CaseSkeleton. Think of a CaseSkeleton as the basic framework with which a Model's data will fill out with actual content.  

If you are using the complete



## Extending Cases and Cassettes

Wick provides a special type of Case class called CustomCase, which can be used to expand the functions of a Case types.

```JavaScript
import {CustomCase} from "wick"

MyCase extends CustomCase{
	constructor(Parent, HTMLElement, Data, Presets){ // <- if you use a constructor, make sure to pass these values to the super constructor.
		super(Parent, HTMLElement, Data, Presets)

	}
}
```

Cassettes can be extended in a similar manner

```JavaScript
import {Cassette} from "wick"

MyCassette extends Cassette{
	constructor(Parent, HTMLElement, Data, Presets){ // <- if you use a constructor, make sure to pass these values to the super constructor.
		super(Parent, HTMLElement, Data, Presets)

	}
}
```

## CaseConstructor

The CaseConstructor is used to convert html into ready made Case builders, known as case_skeletons. Once a skeleton is constructed, it can be used to create active UI elements. 

CaseConstructor(Template, Presets, WORKING_DOM)
returns a function ()=>{} Returns case or cassette object.
CustomCase(element, data, Presets);