const err = console.error.bind(console);

export default {
    IO_FUNCTION_FAIL : (e, o) => {
        err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`);
        err(e);
    },
    ELEMENT_PARSE_FAILURE : (e, o) => {
        err(`Problem found while parsing resource ${o.url + ""}`);
        err(e);
    },
    COMPONENT_PARSE_FAILURE : (e, o) => {
        err(`Problem found while parsing component defined in ${o.url + ""}`);
        err(e);
    },
    RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
        err(`Error while trying to fetch ${o.url + ""}`);
        err(e);
    },
    SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
        err(`Error while trying to create function from script 

${o.val + ""} 

in file ${o.url || o.origin_url}`);
        err(e);
    },
    default: e => {
        err(`Unable to retrieve error handler`);
        throw e;
    }
};
