{
    IO_FUNCTION_FAIL: (e, o) => {
        err(`Problem found while running script in ${o.script.origin_url}`);
        err(e);
    },
    ELEMENT_PARSE_FAILURE: (e, o) => {
        err(`Problem found while parsing resource ${o.origin_url + ""}`);
        err(e);
    },
    RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
        err(`Error while trying to fetch ${o.origin_url + ""}`);
        err(e);
    },
    default: (e, o, n) => {
        err(`Unable to retrieve error handler ${n}`);
        throw e;
    }
};
