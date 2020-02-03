import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
//import { gzipPlugin } from 'rollup-plugin-gzip';

const output = [{
    name: "wl",
    file: "./build/wick.lite.js",
    format: "iife",
    exports: "default",
}];

export default {
    input: "./source/lite/lite.js",
    output,
    treeshake: true,
    plugins: [
        resolve({jail:"",modulesOnly: true}),  
        terser({mangle:true, module:false}), 
        // /gzipPlugin()
    ]
};
