import resolve from '@rollup/plugin-node-resolve';

const output = [{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    exports: "default",
}];

export default {
     external: ["path", "http", "fs"],
    input: "./source/wick.js",
    output,
    treeshake: {moduleSideEffects:false},
    plugins: [
        resolve({jail:"",modulesOnly: true}),  
   //     terser({mangle:true, module:true}), 
        //gzipPlugin()
    ]
};
