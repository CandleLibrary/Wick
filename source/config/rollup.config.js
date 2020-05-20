import resolve from 'rollup-plugin-node-resolve';

const output = [{
    name: "wick",
    file: "./build/wick.js",
    format: "iife",
    globals: { "worker_threads": "null", "os": "null" },
}];

export default {
    input: "./build/library/wick.js",
    treeshake: { unknownGlobalSideEffects: true },
    output,
    plugins: [resolve({ jail: "", modulesOnly: true })],
    shimMissingExports: true
};

