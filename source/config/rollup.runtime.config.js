import resolve from 'rollup-plugin-node-resolve';

const output = [{
    name: "wick",
    file: "./build/wick.rt.js",
    format: "iife",
    globals: { "worker_threads": "null", "os": "null" },
}];

export default {
    input: "./build/library/wick.runtime.js",
    treeshake: { unknownGlobalSideEffects: true },
    output,
    plugins: [resolve({ jail: "", modulesOnly: true })],
    shimMissingExports: true
};

