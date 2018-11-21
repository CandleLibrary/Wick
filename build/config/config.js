import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: "./source/root/client",
    inputOptions: {
        treeshake: {
            pureExternalModules: true,
        },
    },
    output: [{
        name: "wick",
        file: "./build/wick.js",
        format: "iife"
    },{
        name: "wick_es",
        file: "./build/wick-es.js",
        format: "es"
    },{
        name: "wick_cjs",
        file: "./build/wick-cjs.js",
        format: "cjs"
    }],
    plugins: [commonjs({ include: ['./main.js', './node_modules/*.*'] }),            resolve()]
};