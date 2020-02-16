const err = function(...vals) {
    return vals.join("\n");
};

export default {
    IO_FUNCTION_FAIL: (e, o) => {
        return err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`, e.stack);
    },

    /*
      The Error Object should container the following. 
      [url] a url of the file that generated the parse errors.
      [lex] a lexer object that has the location of the parse failure.
      [msg] a message that contains the description of the parse error. 
    */
    ELEMENT_PARSE_FAILURE: (e) => {
        return err(`Problem found while parsing resource ${e.url + ""}`, e.lex.errorMessage(e.msg));
    },
    COMPONENT_PARSE_FAILURE: (e, o) => {
        return err(`Problem found while parsing component defined in ${o.url + ""}`, e.stack);
    },
    RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
        return err(`Error while trying to fetch ${o.url + ""}`, e.stack);
    },
    SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
        return err(`Error while trying to create function from script

${o.val + ""} 

in file ${o.url || o.origin_url}`, e.stack);

    },
    default: e => {
        return err(`Unable to retrieve error handler`, e.stack);
    }
};