import { registerHookHandler } from "../../build/library/compiler/ast-build/hook-handler.js";



const valid_handler = {
    types: [1, 2, 3],
    name: "test",
    verify: () => true,
    buildJS: (node) => node,
    buildHTML: (node) => node,
};

const invalid_handler_name = {
    types: [1, 2, 3],
    //name: "test",
    verify: () => true,
    buildJS: (node) => node,
    buildHTML: (node) => node,
};


const invalid_handler_types = {
    //types: [1, 2, 3],
    name: "test",
    verify: () => true,
    buildJS: (node) => node,
    buildHTML: (node) => node,
};


const invalid_handler_verify = {
    types: [1, 2, 3],
    name: "test",
    //verify: () => true,
    buildJS: (node) => node,
    buildHTML: (node) => node,
};


const invalid_handler_buildJS = {
    types: [1, 2, 3],
    name: "test",
    verify: () => true,
    //buildJS: (node) => node,
    buildHTML: (node) => node,
};


const invalid_handler_buildHTML = {
    types: [1, 2, 3],
    name: "test",
    verify: () => true,
    buildJS: (node) => node,
    //buildHTML: (node) => node,
};

assert(registerHookHandler(valid_handler));

assert(!registerHookHandler(invalid_handler_name));

assert(!registerHookHandler(invalid_handler_types));

assert(!registerHookHandler(invalid_handler_verify));

assert(!registerHookHandler(invalid_handler_buildJS));

assert(!registerHookHandler(invalid_handler_buildHTML));