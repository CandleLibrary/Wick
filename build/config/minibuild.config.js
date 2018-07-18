import {terser} from 'rollup-plugin-terser';

export default {
	input : "./source/root/wick",
	output: {
		file : "./build/wick-min.js",	
		format : "iife",
		name:"wick"
	},
	plugins: [
		terser()
	]
}