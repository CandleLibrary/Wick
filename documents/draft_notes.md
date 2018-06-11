## Element
 
An element tag represents an area of interest and segregation of data. Same named elements with same named components will share those components

## Component

a component is a distinct presentation object that holds information pertinent to the user. It can be used to morph into other components on other pages. 

## Template
A template is used in conjuction with  case tag to create presentation elements for models. 

## Case
A presentation object for creating complex UI's around Models

Predefined data attributes
	schema - The model type that should be constructed to contain the data this case works one
	model_template - The template that contains json formatted data that will be imported into a model schema
	url - The API url that can be called to fill a model schema with data. 
	class - this type of cassette that will bind to the element
	import - data that can be imported into the model from the url query string.
	iprop - data that will be imported into the model from a parent case
	prop - default data that a cassette has access to
	model - existing model name that the case will bind to.

Model Lift - Allow internal wick elements to create modal.

## Model

Immutable model - Every add action cases a collapse and rebuild of the model.
Mutable model - Model is mutated at every add action

Container Purging - Data in container can be set to be deleted.The purge start action will mark all nodes as purgable. any set action following purge start will change that nodes status to unpurgable. pargeend will scan all Models that are purgable and remove the from the container. 

## Cassettes 
    
| Name | Data | Result |
|:-|-|-:|
|raw|any|sets the innerHTML of the element to the raw form of the data property|
|edt|Epoch date integer| Sets the innerHTML of of the element to a formated date/time |
|exists|any|If the property of the object does not have a value the element is removed from the document|
|raw|||

	
	
