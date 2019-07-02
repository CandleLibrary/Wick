const err = function(...vals){
    vals[vals.length-1].message = vals.slice(0,-1).join("\n") + "\n"+ vals[vals.length-1].message;
    return vals[vals.length-1];
};

export default {
    IO_FUNCTION_FAIL : (e, o) => {
       return err(`Problem found while running JavaScript in ${(o.url || o.origin_url) + ""}`
            ,e );
    },
    ELEMENT_PARSE_FAILURE : (e, o) => {
       return err(`Problem found while parsing resource ${o.url + ""}`,e);
    },
    COMPONENT_PARSE_FAILURE : (e, o) => {
       return err(`Problem found while parsing component defined in ${o.url + ""}`,e);
    },
    RESOURCE_FETCHED_FROM_NODE_FAILURE: (e, o) => {
       return err(`Error while trying to fetch ${o.url + ""}`,e);
    },
    SCRIPT_FUNCTION_CREATE_FAILURE: (e, o) => {
       return err(`Error while trying to create function from script

${o.val + ""} 

in file ${o.url || o.origin_url}`,e);
        
    },
    default: e => {
        return err(`Unable to retrieve error handler`, e);
    }
};
