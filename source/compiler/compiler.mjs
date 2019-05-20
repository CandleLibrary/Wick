import whind from "@candlefw/whind";

import js_compiler from "./js/js.mjs";
import js_env from "./js/env.mjs";

import html_compiler from "./html/html.mjs";
import html_env from "./html/env.mjs";

// This is a variadic function that accepts objects, string, and urls, 
//  and compiles data from the argument sources into a wick component. 

// If compilation fails, failure component is generated that provides 
// error information. 

//wick (string)
//wick (string, presets?)
//wick ({dom:})
export default async function (...data){

	if(data.length === 0)
		throw new Error("This function requires arguments. Refer to wick docs on what arguments may be passed to this function.");

	// The presets object provides global values to this component
	// and all its derivatives and descendents. 
	let presets = {}; 
	
	if(data.length > 1)
		presets = data.slice(-1); 
	
	const component_data = data[0];

	switch(typeof component_data){
		case "string": 
		/* Need to determine if string is:
			   URL to component resource
			   HTML data
			   JS data
			   or incompatible data that should cause a throw.
		*/
		const ast = html_compiler(whind(component_data), html_env);
		console.dir(ast, true)
		break;
		case "object":
			// Extract properties from the object that relate to wick component attributes. 
		break;

	}

	return {}
}
