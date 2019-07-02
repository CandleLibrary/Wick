import defaults from "./default_errors.mjs";

const error_list = {};

function integrateErrors(error_list_object) {
    if (typeof error_list_object !== "object") return void console.trace("An object of function properties must be passed to this function");
    for (const label in error_list_object) {
        const prop = error_list_object[label];
        if (typeof prop == "function") {
            error_list[label] = prop;
            prop.error_name = label;
        }
    }
}

integrateErrors(defaults);

export default new Proxy(function(error_function, error_object, errored_node) {
	//console.warn(`Encountered error ${error_function.error_name}`);
    return error_function(error_object, errored_node);
}, {
    get: (obj, prop) => {

        if (prop == "integrateErrors")
            return integrateErrors;

        if (!error_list[prop]) {
            error_list.default.error_name = prop;
            return error_list.default;
        }

        return error_list[prop];
    }
});

