import {terser} from 'rollup-plugin-terser';

import gzip from "rollup-plugin-gzip";

export default {
	input : "./source/wick",
	output: {
		file : "./build/wick-min.js",	
		format : "es"
	},
	plugins: [
		terser({
			module:true
		}),
		gzip()
	]
}