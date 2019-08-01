import resolve from 'rollup-plugin-node-resolve';
const output = [{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    exports: "default",
}];

export default {
    input: "./source/wick.mjs",
    output,
    treeshake: false,
    plugins: [
        resolve({jail:"",modulesOnly: true}),  
        //terser({mangle:true, module:true}), 
        //gzipPlugin()
    ]
};
