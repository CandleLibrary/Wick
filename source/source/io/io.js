import {
    SourceBase
} from "../base"

/** @namespace IO */

/**
	The IO is the last link in the Source chain. It is responsible for putting date into the DOM through it's connected element, and present it to the viewer. 
	It is also responsible for responding to user input, though the base IO object does not provide any code for that. 
*/
export class IO extends SourceBase{

	constructor(parent, data, presets){
		super(parent, data, presets)
		this.prop = data.prop;
	}

	/**
		Inheritors of IO should use this function to push data back up to the Source from input by the user. 
	*/
	up(){
		//This is empty for the basic IO object. 
	}

	/**
		Puts data into the watched element. The default action is to simply update the elements innerHTML with data.value.  
	*/
	down(data){
		this.element.innerHTML = data.value;
	}
}