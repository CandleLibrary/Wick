import {terser} from 'rollup-plugin-terser';

export default {
	input : "./source/root/wick",
	output: {
		file : "./build/wick.min.js",	
		format : "iife",
		name:"wick"
	},
	plugins: [
		terser({
        	compress:{
        		warnings:true,
        		unsafe_arrows:true,
        		//module:true,
        		passes:3
        	},
            mangle :{
                module: true,
                //toplevel:true,
                properties:{
                    regex : /[_]+[\w]+[_]+/
                }

            },
            output : {
            	beautify : false
            }
        })
	]
};