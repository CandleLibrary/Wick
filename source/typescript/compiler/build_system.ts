import { matchAll } from '@candlelib/css';
import { exp, JSNode, JSNodeType, JSNodeTypeLU, stmt } from '@candlelib/js';
import { log } from '../entry-point/logger.js';
import {
    DOMLiteral,
    HookHandlerPackage, HTMLHandler,
    HTMLNode, HTMLNodeType,
    HTMLNodeTypeLU,
    JSHandler
} from "../types/all.js";
import { addIndirectHook } from './ast-build/hooks.js';
import { loadHTMLHandler, loadHTMLHandlerInternal, processBindingASTAsync } from "./ast-parse/html.js";
import { loadJSParseHandler, loadJSParseHandlerInternal } from "./ast-parse/js.js";
import { processFunctionDeclaration, processNodeAsync, processWickCSS_AST, processWickHTML_AST, processWickJS_AST } from './ast-parse/parse.js';
import { parseComponentAST } from './ast-parse/source.js';
import {
    addBindingReference, addBindingVariable,
    addHook,
    addNameToDeclaredVariables,
    addReadFlagToBindingVariable,
    addWriteFlagToBindingVariable,
    getBindingFromExternalName,
    getBindingStaticResolutionType,
    getComponentBinding,
    getExpressionStaticResolutionType,
    getStaticValue,
    getStaticValueAstFromSourceAST
} from './common/binding.js';
import { componentNodeSource, importResource, setPos } from './common/common.js';
import { css_selector_helpers } from './common/css.js';
import { getExtendTypeName, getExtendTypeVal } from './common/extended_types.js';
import { getElementAtIndex } from './common/html.js';


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

    if (registered_hook_handlers.has(hook_handler_obj.name))
        throw new Error(`A hook handler named ${hook_handler_obj.name} has already be registered`);

    registered_hook_handlers.set(hook_handler_obj.name, hook_handler_obj);
}
/*
*   Returns an array of active hookHandlerPackages
*/


export function getHookHandlers(): HookHandlerPackage[] {
    return [...registered_hook_handlers.values()];
}
;


const pending_features: {
    register: RegistrationFunction,
    name: string;
}[] = [];


const registration_system = {
    registerHookType<T>(extension_name: string, original_type: T) {
        return getExtendTypeVal(extension_name, original_type);
    },

    registerJSParserHandler(js_parse_handler: JSHandler<JSNode>, ...types: JSNodeType[]) {
        log(`    Registering JS Handler for ${types.map(g => JSNodeTypeLU[g]).join(" ")}`);
        loadJSParseHandler(js_parse_handler, ...types);
    },

    registerHTMLParserHandler<T = HTMLNode, P = HTMLNode>(
        html_parse_handler: HTMLHandler<T, P>,
        ...types: HTMLNodeType[]
    ) {
        log(`    Registering HTML Handler for ${types.map(g => HTMLNodeTypeLU[g]).join(" ")}`);
        loadHTMLHandler(<any>html_parse_handler, ...types);
    },

    registerCSSParserHandler() {
        throw Error("registerCSSHookHandler Not Implemented Yet");
    },

    registerHookHandler<InputNodeType, OutputNodeType>(
        hook_handler: HookHandlerPackage<InputNodeType, OutputNodeType>
    ) {
        log(`    Registering Hook Handler for ${hook_handler.types.map(getExtendTypeName).join(" | ")}`);
        registerHookHandler(hook_handler);
    },

    registerRenderer(renderer) {
        throw Error("registerRenderer Not Implemented Yet");
    }
};

const unregistered_system = {
    registerHookType<T>(extension_name: string, original_type: T) {
        console.log("registerHookType system not enabled");
    },

    registerJSParserHandler<T>(js_handler: JSHandler<T>, ...types: T[]) {
        console.log("registerJSParserHandler system not enabled");
    },

    registerHTMLParserHandler<T = HTMLNode, P = HTMLNode>(
        html_parse_handler: HTMLHandler<T, P>
    ) {
        console.log("registerHTMLParserHandler system not enabled");
    },

    registerCSSParserHandler() {
        throw Error("registerCSSHookHandler Not Implemented Yet");
    },

    registerHookHandler<InputNodeType, OutputNodeType>(
        hook_handler: HookHandlerPackage<InputNodeType, OutputNodeType>
    ) {
        registerHookHandler(hook_handler);
    },

    registerRenderer(renderer) {
        throw Error("registerRenderer Not Implemented Yet");
    }
};
/**
 * Primary build system for wick
 */
const build_system = {
    css: {
        matchAll: (string: string, html: DOMLiteral) => matchAll(string, html, css_selector_helpers)
    },
    /**
     * Allows the build system to import a resource and 
     * register it with the active component.
     * 
     * This feature is only available during the parsing of
     * JS and HTML AST nodes using handlers registered with
     * registerJSParserHandler & registerHTMLParserHandler
     * methods.
     */
    importResource: importResource,
    addIndirectHook: addIndirectHook,
    addBindingVariable: addBindingVariable,
    addWriteFlagToBindingVariable: addWriteFlagToBindingVariable,
    addNameToDeclaredVariables: addNameToDeclaredVariables,
    addBindingReference: addBindingReference,
    addReadFlagToBindingVariable: addReadFlagToBindingVariable,
    processBindingAsync: processBindingASTAsync,
    parseComponentAST: parseComponentAST,
    componentNodeSource: componentNodeSource,
    /**
     * Add Function hook?
     */
    addHook: addHook,
    /**
     * Process for handling declaration of functoons
     */
    processFunctionDeclaration: processFunctionDeclaration,

    /**
     * Takes an Wick JS/TS AST node as an input and incorporates
     * it into the component. 
     * 
     * Only enabled during parse process.
     */
    processJSNode: processWickJS_AST,

    /**
     * Takes an Wick CSS AST node as an input and incorporates
     * it into the component. 
     * 
     * Only enabled during parse process.
     */
    processCSSNode: processWickCSS_AST,

    processNodeAsync: processNodeAsync,

    /**
     * Takes an Wick HTML AST node as an input and incorporates
     * it into the component. 
     * 
     * Only enabled during parse process.
     */
    processHTMLNode: processWickHTML_AST,


    /**
     * Returns the resolved value of the expression
     * if all variables can be resolved statically.
     * Otherwise returns null.
     * 
     * Only enabled in build contexts.
     */
    getStaticValue: getStaticValue,
    /**
     * Retrieve the HTMLNode at a givin index 
     * 
     * Only enabled in build contexts.
     */
    getElementAtIndex: getElementAtIndex,
    /**
     * Retrieve a binding by name.
     * 
     * Only enabled in build contexts.
     */
    getComponentBinding: getComponentBinding,
    getBindingFromExternalName: getBindingFromExternalName,
    /**
     * Return variable scope requirements do resolve the 
     * expression statically (server side resolution).
     * 
     * Only enabled in build contexts.
     */
    getExpressionStaticResolutionType: getExpressionStaticResolutionType,
    getBindingStaticResolutionType: getBindingStaticResolutionType,
    getStaticValueAstFromSourceAST: getStaticValueAstFromSourceAST,

    js: {

        /**
         * Parses a JS statement string and returns an AST representation of 
         * the expression, or null if the expression is invalid. 
         */
        stmt: stmt,
        /**
         * Parses a JS expression and returns an AST representation of 
         * the expression, or null if the expression is invalid. 
         */
        expr: exp,
    },
    /**
     * Sets the parser token for this node and all its descendants
     */
    setPos: setPos
};
type RegistrationFunction = (system: typeof build_system & typeof registration_system) => void | Promise<void>;


export function enableRegistrationFeatures() {
    Object.assign(build_system, registration_system);
}

export function enableInternalRegistrationFeatures() {
    enableRegistrationFeatures();
    Object.assign(build_system, {
        registerJSParserHandler(js_parse_handler: JSHandler<JSNode>, ...types: JSNodeType[]) {
            log(`    Registering JS Handler for ${types.map(g => JSNodeTypeLU[g]).join(" | ")}`);
            loadJSParseHandlerInternal(js_parse_handler, ...types);
        },

        registerHTMLParserHandler<T = HTMLNode, P = HTMLNode>(
            html_parse_handler: HTMLHandler<T, P>,
            ...types: HTMLNodeType[]
        ) {
            log(`    Registering HTML Handler for ${types.map(g => HTMLNodeTypeLU[g]).join(" | ")}`);
            loadHTMLHandlerInternal(<any>html_parse_handler, ...types);
        },
    });
}

export function disableRegistrationFeatures() {
    Object.assign(build_system, unregistered_system);
}


let build_features_lock_count = 0;
export function enableBuildFeatures() {
    console.log({ build_features_lock_count });
    if (build_features_lock_count++ > 0) return;
    build_system.addBindingVariable = addBindingVariable;
    build_system.getStaticValue = getStaticValue;
    build_system.getElementAtIndex = getElementAtIndex;
    build_system.getComponentBinding = getComponentBinding;
    build_system.getExpressionStaticResolutionType = getExpressionStaticResolutionType;
}
export function disableBuildFeatures() {
    if (--build_features_lock_count > 0) return;
    //@ts-ignore
    build_system.getStaticValue = () => log("getStaticValue is disabled outside of build contexts");
    //@ts-ignore
    build_system.getElementAtIndex = () => log("getElementAtIndex is disabled outside of build contexts");
    //@ts-ignore
    build_system.getComponentBinding = () => log("getComponentBinding is disabled outside of build contexts");
    //@ts-ignore
    build_system.getComponentBinding = () => log("getExpressionStaticResolutionType is disabled outside of build contexts");
    //@ts-ignore
    build_system.addBindingVariable = () => log("addBindingVariable is disabled outside of parsing contexts");
}

export function enableParserFeatures() {
    build_system.importResource = importResource;
    build_system.addIndirectHook = addIndirectHook;
    build_system.addBindingVariable = addBindingVariable;
    build_system.processJSNode = processWickJS_AST;
    build_system.processHTMLNode = processWickHTML_AST;
    build_system.processBindingAsync = processBindingASTAsync;
}
export function disableParserFeatures() {
    //@ts-ignore
    build_system.importResource = () => log("importResource is disabled outside of parsing contexts");
    //@ts-ignore
    build_system.addIndirectHook = () => log("addIndirectHook is disabled outside of parsing contexts");
    //@ts-ignore
    build_system.addBindingVariable = () => log("addBindingVariable is disabled outside of parsing contexts");
    //@ts-ignore
    build_system.processJSNode = () => log("processJSNode is disabled outside of parsing contexts");
    //@ts-ignore
    build_system.processHTMLNode = () => log("processHTMLNode is disabled outside of parsing contexts");
    //@ts-ignore
    build_system.processBindingAsync = () => log("processBindingAsync is disabled outside of parsing contexts");
}

export function registerFeature(
    feature_name: string,
    registration_function: RegistrationFunction
) {
    //Ensure registry_function is a usable value
    if (typeof registration_function != "function") {
        throw new Error("[registration_function] parameter of registerFeature must be a function.");
    }
    //Ensure feature_name is a usable value
    if (typeof feature_name != "string") {
        throw new Error("[feature_name] parameter of registerFeature must be a string.");
    }

    pending_features.push({ name: feature_name, register: registration_function });
}

export async function loadFeatures() {
    enableInternalRegistrationFeatures();

    for (const { name, register } of pending_features) {
        console.log(`\nLoading feature [${name}]`);
        await register(<any>build_system);
    }

    disableRegistrationFeatures();

    pending_features.length = 0;
}