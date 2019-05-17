//Environment object for HTML parser
import wick_html_element from "./nodes/root.mjs"

const env = {
	functions : {
		wick_html_element,
	},
	options : {
		integrate : false
	}
}

export default env;
