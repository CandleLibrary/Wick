export default {
    input: "./source/root/client",
    inputOptions: {
        treeshake: {
            pureExternalModules: true,
        },
    },
    output: {
        name: "wick",
        file: "./build/wick-dev.js",
        format: "iife"
    },

    plugins: []
};