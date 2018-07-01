import {
	SchemaType
} from "./schemas.js"

let STRING = new(class extends SchemaType {
	parse(value) {
		return value + "";
	}

	verify(value, out_data) {
		out_data.valid = true;
		
		if (value.length > 20) {
			out_data.valid = false;
			out_data.reason = "Too Many Characters";
		}
	}
})()

export {
	STRING
};