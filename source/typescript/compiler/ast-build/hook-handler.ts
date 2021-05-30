import { HookHandlerPackage } from "../../types/hook";

const registered_hook_handlers = new Map();

export function registerHookHandler<InputNodeType, OutputNodeType>(hook_handler_obj:
    HookHandlerPackage<InputNodeType, OutputNodeType>) {
    //Verify Basic functions
    if (!hook_handler_obj)
        throw new Error("Missing Argument For hook_handler_obj");

    if (!Array.isArray(hook_handler_obj.types) || !hook_handler_obj.types.every(t => typeof t == "number"))
        throw new Error("hook_handler_obj.types should be an array of ExtendedType numbers");

    if (typeof hook_handler_obj.name != "string")
        throw new Error("Missing name string for hook_handler_obj");

    if (typeof hook_handler_obj.verify != "function")
        throw new Error("Missing verify function");

    if (typeof hook_handler_obj.buildJS != "function")
        throw new Error("Missing buildJS function");

    if (typeof hook_handler_obj.buildHTML != "function")
        throw new Error("Missing buildHTML function");

    registered_hook_handlers.set(hook_handler_obj.name, hook_handler_obj);
}
/*
*   Returns an array of active hookHandlerPackages
*/


export function getHookHandlers(): HookHandlerPackage[] {
    return [...registered_hook_handlers.values()];
}
;
