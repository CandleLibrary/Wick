import resolve from 'rollup-plugin-node-resolve';
const output = [{
    name: "wick",
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
        //terser({mangle:true, module:true}), 
        //gzipPlugin()
    ]
};
