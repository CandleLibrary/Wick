import {SchemaType} from "./schemas.js" 

let STRING = new (class extends SchemaType {
	parse(value){
		return value + "";
	}
})

export {STRING}; 