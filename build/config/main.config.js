import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import gzipPlugin from 'rollup-plugin-gzip';
const output = [{
    name: "wick",
    file: "./build/wick_dev.js",
    format: "iife",
    exports: "default",
},{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    exports: "default",
    sourcemap:"inline"
}, {
    name: "css_cjs",
    file: "./build/wick.node.js",
    format: "cjs",
    exports: "named"
}];

export default {
    input: "./source/wick.mjs",
    treeshake: false,
    output,
    plugins: [
    resolve({jail:"",modulesOnly: true}),  
    //terser(), 
    //gzipPlugin()
    ]
};