import {terser} from 'rollup-plugin-terser';

export default {
	input : "./source/wick",
	output: {
		file : "./build/wick-min.jsm",	
		format : "es"
	},
	plugins: [
		terser()
	]
}