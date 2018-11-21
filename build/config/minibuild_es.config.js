import { terser } from 'rollup-plugin-terser';

import gzip from "rollup-plugin-gzip";

export default {
    input: "./source/root/client",
    output: {
        file: "./build/wick-min-es.js",
        format: "es"
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
        }),
        gzip()
    ]
}