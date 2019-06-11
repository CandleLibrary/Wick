import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import gzipPlugin from 'rollup-plugin-gzip';
const output = [{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    exports: "default"
}, {
    name: "wick.node",
    file: "./build/wick_node.js",
    format: "cjs",
    exports: "named"
}];

export default {
    input: "./source/wick.mjs",
    output,
    plugins: [
    resolve({jail:"",modulesOnly: true}),  
    terser({mangle:true, module:true}), 
    gzipPlugin()
    ]
};
