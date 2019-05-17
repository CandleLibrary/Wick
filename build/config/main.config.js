import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
const output = [{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    exports: "default"
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
    plugins: [resolve({jail:"",modulesOnly: true})]
};