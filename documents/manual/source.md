# Source, Templates, Taps, Pipes, and IOs,

A Source's purpose is to link UI elements to a Model. It is used in combination with other object, such as IOs and Taps, to build UI systems. 

Templates are used with ModelContainers to display groups of Sources. They can be used to list things such as product listings or gallery pictures.   
In an HTML document, Source's are stored in <template> elements, which are then parsed by the SourceConstuctor to create a SourceSkeleton. Think of a SourceSkeleton as the basic framework with which a Model's data will fill out with actual content.  

If you are using the complete

## Extending Source

Wick provides a special type of Source class called CustomSource, which can be used to expand the functions of a Source.


## SourceConstructor

The SourceConstructor is used to convert html into a ready made Source factory, known as a SourceSkeleton. Once a skeleton is constructed, it can be used to create active Sources and bind a Model to DOM elements. 

SourceConstructor(Template, Presets, WORKING_DOM
returns a function ()=>{} Returns case or cassette object.
CustomSource(element, data, Presets);