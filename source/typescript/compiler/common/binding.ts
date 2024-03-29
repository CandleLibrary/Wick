import { traverse } from "@candlelib/conflagrate";
import { JSIdentifier, JSNode, JSNodeType } from "@candlelib/js";
import { Lexer } from "@candlelib/wind";
import { PluginStore } from "../../plugin/plugin.js";
import {
    BindingVariable,
    BINDING_FLAG,
    BINDING_VARIABLE_TYPE,
    CompiledComponentClass,
    FunctionFrame, PLUGIN_TYPE,
    STATIC_BINDING_STATE, STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import { getOriginalTypeOfExtendedType } from "./extended_types.js";
import { getExpressionStaticResolutionType, StaticDataPack } from '../data/static_resolution.js';
import { getSetOfEnvironmentGlobalNames } from "./global_variables.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "./js_hook_types.js";
import { Context } from './context.js';
import { ComponentData } from './component.js';
import URI from "@candlelib/uri";
import { AttributeHook, getAttribute } from './html.js';


function getNonTempFrame(frame: FunctionFrame) {
    while (frame && frame.IS_TEMP_CLOSURE)
        frame = frame.prev;
    return frame;
}

export function getRootFrame(frame: FunctionFrame) {
    while (!frame.IS_ROOT)
        frame = frame.prev;
    return frame;
}

/**
 * Adds JS AST node to list of identifiers that will need to be transformed 
 * to map to a binding variable.
 * @param node 
 * @param parent 
 * @param frame 
 * @returns 
 */
export function addBindingReference(input_node: JSNode, input_parent: JSNode, frame: FunctionFrame) {


    for (const { node } of traverse(input_node, "nodes")
        .filter("type",
            JSNodeType.IdentifierReference, JSNodeType.IdentifierBinding
        )
    ) {

        // name is already declared within the function scope then
        // do not add to binding_ref_identifiers

        if (!Variable_Is_Declared_In_Closure((<JSIdentifier>node).value, frame)) {

            if (node.type == JSNodeType.IdentifierReference)
                node.type = BindingIdentifierReference;
            else
                node.type = BindingIdentifierBinding;

            //@ts-ignore

            if (!frame.binding_ref_identifiers.includes(<any>node))
                frame.binding_ref_identifiers.push(<any>node);

            addBindingVariable(frame, (<JSIdentifier>node).value, node.pos);
        }

        return;
    }

    console.log(input_node);

    throw new Error(`Missing reference in expression`);
}

export function getBindingRefCount(frame: FunctionFrame): Map<string, number> {

    const name_map = new Map();

    for (const { value } of frame.binding_ref_identifiers.filter(
        n => n.type == BindingIdentifierBinding || n.type == BindingIdentifierReference)
    )
        name_map.set(value, (name_map.get(value) || 0) + 1);

    return name_map;
}
export function removeBindingReferences(name: string, frame: FunctionFrame) {

    for (const node of frame.binding_ref_identifiers)
        if (node.value == name)
            node.type = getOriginalTypeOfExtendedType<typeof node["type"]>(node.type);
}

/**
 * Add var_name to declared variables. var_name should be declared within a function's arguments list, 
 * or within a let, var, const declaration list. Any binding reference that matches the variable name
 * will be unset.
 * 
 * @param var_name 
 * @param frame 
 */
export function addNameToDeclaredVariables(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    removeBindingReferences(var_name, frame);

    frame.declared_variables.add(var_name);
}

export function addWriteFlagToBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    const root = getRootFrame(frame);

    if (root.binding_variables.has(var_name))
        root.binding_variables.get(var_name).flags |= BINDING_FLAG.WRITTEN;

    getNonTempFrame(frame).output_names.add(var_name);
}

export function addSourceLocationToBindingVariable(var_name: string, uri: URI, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    const root = getRootFrame(frame);

    if (root.binding_variables.has(var_name))
        root.binding_variables.get(var_name).source_location = uri;
}


export function addReadFlagToBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    //Return if this name has been assigned before being read.
    if (frame.output_names.has(var_name)) return;

    getNonTempFrame(frame).input_names.add(var_name);
}


export function addDefaultValueToBindingVariable(frame: FunctionFrame, name: string, value: JSNode) {

    const root = getRootFrame(frame);

    if (root.binding_variables.has(name)) {
        const binding = root.binding_variables.get(name);
        binding.default_val = value;
    }
}
/**
 * TODO: 
 * @param frame 
 * @param internal_name 
 * @param pos 
 * @param type 
 * @param external_name 
 * @param flags 
 * @returns 
 */
export function addBindingVariable(
    frame: FunctionFrame,
    internal_name: string,
    pos: any | Lexer,
    type: BINDING_VARIABLE_TYPE = BINDING_VARIABLE_TYPE.UNDECLARED,
    external_name: string = internal_name,
    flags: BINDING_FLAG = 0,
): boolean {


    const binding_var: BindingVariable = {
        class_index: -1,
        flags,
        external_name,
        internal_name,
        pos,
        type,
        static_resolution_type: STATIC_RESOLUTION_TYPE.UNDEFINED,
        STATIC_STATE: STATIC_BINDING_STATE.UNCHECKED,
        default_val: null,
        ref_count: 0
    };

    const root = getRootFrame(frame);

    if (root.binding_variables.has(internal_name)) {


        let UPGRADED = false;

        const existing_binding = root.binding_variables.get(internal_name);

        if (
            existing_binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
            &&
            type != BINDING_VARIABLE_TYPE.UNDECLARED
        ) {

            root.binding_variables.set(binding_var.internal_name, binding_var);

            binding_var.flags |= existing_binding.flags;

            binding_var.ref_count = existing_binding.ref_count;

            UPGRADED = true;
        } else if (
            existing_binding.external_name == internal_name
            &&
            existing_binding.external_name != external_name
        ) {

            existing_binding.external_name = external_name;

            UPGRADED = true;
        }

        return UPGRADED;
    }

    root.binding_variables.set(binding_var.internal_name, binding_var);

    return true;

}

/**
 * Add a Data flow flag to the binding type and return true. If the binding type has not been defined, return false.
 * @param binding_var_name 
 * @param flag 
 * @param frame 
 */
export function addBindingVariableFlag(binding_var_name: string, flag: BINDING_FLAG, frame: FunctionFrame): boolean {

    if (typeof binding_var_name !== "string") throw new Error("[binding_var_name] must be a string.");

    const root = getRootFrame(frame);

    if (root.binding_variables.has(binding_var_name)) {
        root.binding_variables.get(binding_var_name).flags != flag;
        return true;
    }
    return false;
};

/**
 * Return a binding variable object whose external name matches `name`,  or return null
 * @param name @string
 * @param component 
 * @returns 
 */

export function getBindingFromExternalName(external_name: string, component: ComponentData) {
    return [...component.root_frame.binding_variables.values()].filter(v => getExternalName(v) == external_name)[0] ?? null;
}

/**
 * Return a binding variable object whose internal name matches `name`,  or return null
 * @param internal_name @string
 * @param component 
 * @returns 
 */
export function getComponentBinding(internal_name: string, component: ComponentData): BindingVariable {

    if (!component.root_frame.binding_variables.has(internal_name)) return null;

    return component.root_frame.binding_variables.get(internal_name);
}

export function processUndefinedBindingVariables(component: ComponentData, context: Context) {

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        if (binding_variable.type == BINDING_VARIABLE_TYPE.UNDECLARED) {

            if (!getSetOfEnvironmentGlobalNames().has(getExternalName(binding_variable))) {
                
                binding_variable.type = BINDING_VARIABLE_TYPE.MODEL_VARIABLE;

                binding_variable.flags |= BINDING_FLAG.ALLOW_UPDATE_FROM_MODEL
                    //Assumes binding will inevitably be written to 
                    | BINDING_FLAG.WRITTEN;
            } else {
                binding_variable.type = BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE;
            }
        }
    }
}

export function getCompiledBindingVariableNameFromString(
    name: string,
    component: ComponentData,
    comp_info?: CompiledComponentClass,
    comp_name: string = "this"
) {

    const binding = getComponentBinding(name, component);

    return getCompiledBindingVariableName(binding, comp_info, comp_name);
}

export function getCompiledBindingVariableName(
    binding: BindingVariable,
    comp_info?: CompiledComponentClass,
    comp_name: string = "this"
) {
    const external_name = getExternalName(binding);
    const internal_name = getInternalName(binding);

    if (!binding || binding.type == BINDING_VARIABLE_TYPE.UNDECLARED) {
        const global_names = getSetOfEnvironmentGlobalNames();
        if (global_names.has(external_name)) {
            return external_name;
        }
    }

    if (binding)
        switch (binding.type) {

            case BINDING_VARIABLE_TYPE.MODULE_VARIABLE:
                return `${comp_name}.context.api.${external_name}.default`;

            case BINDING_VARIABLE_TYPE.MODULE_NAMESPACE_VARIABLE:
                return `${comp_name}.context.api.${external_name}.module`;

            case BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE:
                return `${comp_name}.context.api.${external_name}.module.${internal_name}`;

            case BINDING_VARIABLE_TYPE.UNDECLARED:
                const global_names = getSetOfEnvironmentGlobalNames();
                if (global_names.has(external_name))
                    return external_name;
                return `${comp_name}.model.${external_name}`;

            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
                return `${comp_name}.model.${external_name}`;

            case BINDING_VARIABLE_TYPE.MODEL_DIRECT:
                return `${comp_name}.model`;

            case BINDING_VARIABLE_TYPE.METHOD_VARIABLE:
                return `${comp_name}.${binding.internal_name}`;

            case BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE:
                return `${external_name}`;

            case BINDING_VARIABLE_TYPE.TEMPLATE_INITIALIZER:
            case BINDING_VARIABLE_TYPE.TEMPLATE_CONSTANT:
            case BINDING_VARIABLE_TYPE.CONFIG_GLOBAL:
            case BINDING_VARIABLE_TYPE.CURE_TEST:
            case BINDING_VARIABLE_TYPE.CONSTANT_DATA_SOURCE:
                return "'---INVALID US OF STATIC BINDING---'";

            default:
                return `${comp_name}[${comp_info.binding_records.get(binding.internal_name)?.index ?? -1}]`;
        }
    else
        return name;
}

export function getExternalName(binding: BindingVariable) {
    return binding.external_name == "" ? binding.internal_name : binding.external_name;
}

export function getInternalName(binding: BindingVariable) {
    return binding.internal_name;
}


// ############################################################
// Static Compilation



export function haveStaticPluginForRefName(name: string, context: Context) {


    return context.plugins.hasPlugin(PLUGIN_TYPE.STATIC_DATA_FETCH, name);
}

/**
 * Returns a STATIC_RESOLUTION_TYPE value representing the static resolution 
 * requirements of the binding. 
 * 
 * @param ast - A valid JSNode AST object
 * 
 * @param comp  - A ComponentData object that can resolutions on binding variables 
 *                that may be references in the ast. 
 * 
 * @param context - A Presets object that can provide resolution on plugin module
 *                  references within the ast. 
 * 
 * @param modules - An optional empty Set that will be used to record all module bindings that 
 *            are referenced in the ast.
 * 
 * @param globals - An optional empty Set that will be used to record all global reference bindings
 *            that are referenced in the ast.
 * 
 * @returns {STATIC_RESOLUTION_TYPE}
 */
export function getBindingStaticResolutionType(
    binding: BindingVariable,
    static_data_pack: StaticDataPack,
    modules: Set<BindingVariable> = null,
    globals: Set<BindingVariable> = null,
): STATIC_RESOLUTION_TYPE {

    if (!binding.static_resolution_type) {

        let type = STATIC_RESOLUTION_TYPE.INVALID;

        switch (binding.type) {
            case BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE:
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_VARIABLE;
                break;
            case BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE:
                if (globals)
                    globals.add(binding);
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_GLOBAL;
                break;

            case BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE:
            case BINDING_VARIABLE_TYPE.MODULE_VARIABLE:
                if (modules)
                    modules.add(binding);
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_MODULE;
                break;

            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
            case BINDING_VARIABLE_TYPE.UNDECLARED:
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_MODEL;
                break;

            case BINDING_VARIABLE_TYPE.ATTRIBUTE_VARIABLE:
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_PARENT;
                break;

            case BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE:
            case BINDING_VARIABLE_TYPE.TEMPLATE_CONSTANT:
            case BINDING_VARIABLE_TYPE.CONFIG_GLOBAL:
            case BINDING_VARIABLE_TYPE.CONSTANT_DATA_SOURCE:
                type = STATIC_RESOLUTION_TYPE.CONSTANT_STATIC;
                break;

            default:
                type = STATIC_RESOLUTION_TYPE.INVALID;
                break;
        }

        if (binding.default_val) {
            const v = getExpressionStaticResolutionType(binding.default_val, static_data_pack);

            type |= v;
        }

        binding.static_resolution_type = type;
    }

    return binding.static_resolution_type;
}

/**
 * Static Data Fetch Plugin
 */
PluginStore.addSpec({
    type: PLUGIN_TYPE.STATIC_DATA_FETCH,
    requires: ["serverHandler"],
    async defaultRecover(data) {
        return null;
    },
    validateSpecifier: (str: string) => (str.match(/^[a-zA-Z\_][\w\_\d]*$/) || []).length > 0
});



//###################################################################3
// BOOLEAN FUNCTIONS



export function Binding_Var_Is_Directly_Accessed(binding_var: BindingVariable) {
    return (binding_var.type & (BINDING_VARIABLE_TYPE.DIRECT_ACCESS)) > 0;
}

export function Variable_Is_Declared_Locally(var_name: string, frame: FunctionFrame): boolean {
    return frame.declared_variables.has(var_name);
}

export function Name_Is_A_Binding_Variable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    return getRootFrame(frame).binding_variables.has(var_name);
}

export function Binding_Var_Is_Internal_Variable(comp_var: BindingVariable) {
    return (
        comp_var.type == BINDING_VARIABLE_TYPE.ATTRIBUTE_VARIABLE
        ||
        comp_var.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
        ||
        comp_var.type == BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE
        ||
        comp_var.type == BINDING_VARIABLE_TYPE.TEMPLATE_CONSTANT
        ||
        comp_var.type == BINDING_VARIABLE_TYPE.TEMPLATE_INITIALIZER
    );
}

/**
 *  Returns true if var_name has been declared within the frame closure
 */
export function Variable_Is_Declared_In_Closure(var_name: string, frame: FunctionFrame): boolean {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    if (frame.declared_variables.has(var_name))
        return true;
    else if (frame.prev)
        return Variable_Is_Declared_In_Closure(var_name, frame.prev);
    else
        return false;
}

export function Is_Statically_Resolvable_On_Server(
    binding: BindingVariable,
    static_data_pack: StaticDataPack
): boolean {
    const modules: Set<BindingVariable> = new Set();
    const globals: Set<BindingVariable> = new Set();
    const type = getBindingStaticResolutionType(binding, static_data_pack, modules, globals);

    if (type == STATIC_RESOLUTION_TYPE.INVALID)

        for (const module of modules)
            if (!haveStaticPluginForRefName(module.internal_name, static_data_pack.context))
                return false;

    return true;
}
export function Node_Is_Binding_Identifier(node: JSNode) {
    return node.type == BindingIdentifierBinding || node.type == BindingIdentifierReference;
}