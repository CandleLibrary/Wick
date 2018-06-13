/**
	Schema type. Handles the parsing and verification of data of models. 
*/
class SchemaType {
	constructor(){

	}

	parse(value){
		return value;
	}

	verify(value, result){
		if(!value){
			result.valid = false;
			result.reason = "No value supplied for member."
		}else{
			result.valid = true;
		}
	}
}

export {SchemaType}; 