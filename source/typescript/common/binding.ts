import { traverse } from "@candlefw/conflagrate";
import { JSExpressionClass, JSIdentifier, JSNode, JSNodeClass, JSNodeType, renderCompressed, tools } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import { PluginStore } from "../plugin/plugin.js";
import { BindingVariable, BINDING_FLAG, BINDING_VARIABLE_TYPE, STATIC_BINDING_STATE } from "../types/binding";
import { ComponentData } from "../types/component";
import { FunctionFrame } from "../types/function_frame";
import { HOOK_SELECTOR, IntermediateHook } from "../types/hook";
import { PLUGIN_TYPE } from "../types/plugin.js";
import { PresetOptions as Presets } from "../types/presets";
import { WickBindingNode } from "../types/wick_ast";
import { getSetOfEnvironmentGlobalNames } from "./common.js";
import { convertObjectToJSNode } from "./js.js";

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

    for (const { node, meta: { parent: par } } of traverse(input_node, "nodes")
        .filter("type", JSNodeType.IdentifierReference, JSNodeType.IdentifierBinding)
    ) {

        // name is already declared within the function scope then
        // do not add to binding_ref_identifiers

        if (!Variable_Is_Declared_In_Closure((<JSIdentifier>node).value, frame)) {

            //@ts-ignore
            node.IS_BINDING_REF = true;

            if (!frame.binding_ref_identifiers.includes(node))
                frame.binding_ref_identifiers.push(<any>node);

            addBindingVariable(frame, (<JSIdentifier>node).value, node.pos);
        }

        return;
    }

    throw new Error(`Missing reference in express ${input_parent.pos.slice()}`);
}

export function getBindingRefCount(frame: FunctionFrame): Map<string, number> {

    const name_map = new Map();

    for (const { value } of frame.binding_ref_identifiers.filter(n => n.IS_BINDING_REF))
        name_map.set(value, (name_map.get(value) || 0) + 1);

    return name_map;
}
export function removeBindingReferences(name: string, frame: FunctionFrame) {
    for (const node of frame.binding_ref_identifiers)
        if (node.value == name)
            node.IS_BINDING_REF = false;
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

export function Variable_Is_Declared_Locally(var_name: string, frame: FunctionFrame): boolean {
    return frame.declared_variables.has(var_name);
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

export function addReadFlagToBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    //Return if this name has been assigned before being read.
    if (frame.output_names.has(var_name)) return;

    getNonTempFrame(frame).input_names.add(var_name);
}

export function Name_Is_A_Binding_Variable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    return getRootFrame(frame).binding_variables.has(var_name);
}

export function addDefaultValueToBindingVariable(frame: FunctionFrame, name: string, value: JSNode) {

    const root = getRootFrame(frame);

    if (root.binding_variables.has(name))
        root.binding_variables.get(name).default_val = value;
}

export function addBindingVariable(
    frame: FunctionFrame,
    internal_name: string,
    pos: any | Lexer,
    type: BINDING_VARIABLE_TYPE = BINDING_VARIABLE_TYPE.UNDEFINED,
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
        STATIC_STATE: STATIC_BINDING_STATE.UNCHECKED,
        default_val: null,
        ref_count: 0
    };

    const root = getRootFrame(frame);

    if (root.binding_variables.has(internal_name)) {

        let UPGRADED = false;

        const existing_binding = root.binding_variables.get(internal_name);

        if (
            existing_binding.type == BINDING_VARIABLE_TYPE.UNDEFINED
            &&
            type != BINDING_VARIABLE_TYPE.UNDEFINED
        ) {

            root.binding_variables.set(binding_var.internal_name, binding_var);

            binding_var.flags |= existing_binding.flags;

            binding_var.ref_count = existing_binding.ref_count;

            UPGRADED = true;
        }

        if (existing_binding.external_name == existing_binding.internal_name
            &&
            existing_binding.external_name != external_name) {

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
 * Return a binding variable object that matches `name` or null
 * @param name @string
 * @param component 
 * @returns 
 */
export function getComponentBinding(name: string, component: ComponentData): BindingVariable {

    if (!component.root_frame.binding_variables.has(name)) return null;

    return component.root_frame.binding_variables.get(name);
}

export function processUndefinedBindingVariables(component: ComponentData, presets: Presets) {

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        if (binding_variable.type == BINDING_VARIABLE_TYPE.UNDEFINED) {

            if (!getSetOfEnvironmentGlobalNames().has(binding_variable.external_name)) {

                binding_variable.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE;

                binding_variable.flags |= BINDING_FLAG.ALLOW_UPDATE_FROM_MODEL
                    //Assumes binding will inevitably be written to 
                    | BINDING_FLAG.WRITTEN;
            }
        }
    }
}

export function getCompiledBindingVariableName(name: string, component: ComponentData) {

    const comp_var = getComponentBinding(name, component);

    if (!comp_var || comp_var.type == BINDING_VARIABLE_TYPE.UNDEFINED) {
        const global_names = getSetOfEnvironmentGlobalNames();
        if (global_names.has(name)) {
            return name;
        }
    }

    if (comp_var)
        switch (comp_var.type) {

            case BINDING_VARIABLE_TYPE.MODULE_VARIABLE:
                return `this.presets.api.${comp_var.external_name}.default`;

            case BINDING_VARIABLE_TYPE.API_VARIABLE:
                return `this.presets.api.${comp_var.external_name}.default`;

            case BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE:
                return `this.presets.api.${comp_var.external_name}`;

            case BINDING_VARIABLE_TYPE.UNDEFINED:
                const global_names = getSetOfEnvironmentGlobalNames();
                if (global_names.has(comp_var.external_name))
                    return comp_var.external_name;

            //intentional

            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
                return `this.model.${comp_var.external_name}`;

            case BINDING_VARIABLE_TYPE.METHOD_VARIABLE:
                return "this." + name;

            case BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE:
                return `window.${comp_var.external_name}`;

            default:
                return `this[${comp_var.class_index}]`;
        }
    else
        return name;

}


/**
 * A Binding has a static if it contains no references or call expressions.
 * 
 * If it does contain references, it may still be considered static if the 
 * references are to other binding variables that have static states.
 * 
 * @param binding 
 * @param comp 
 * @returns 
 */
export function Binding_Variable_Has_Static_Default_Value(
    binding: BindingVariable,
    comp: ComponentData,
    presets: Presets,
    parent_comp: ComponentData[] = null
): boolean {

    let STATIC_STATE = binding.STATIC_STATE;

    if (STATIC_STATE == STATIC_BINDING_STATE.UNCHECKED) {

        STATIC_STATE = STATIC_BINDING_STATE.FALSE;

        if (binding.default_val)
            STATIC_STATE = Expression_Is_Static(binding.default_val, comp, presets)
                ? STATIC_BINDING_STATE.TRUE
                : STATIC_BINDING_STATE.FALSE;
        else if (
            binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE
            ||
            binding.type == BINDING_VARIABLE_TYPE.UNDEFINED
            ||
            // Assume parent binding variable is static.
            // This will be confirmed when the actual value is resolved
            binding.type == BINDING_VARIABLE_TYPE.PARENT_VARIABLE
        )
            STATIC_STATE = STATIC_BINDING_STATE.TRUE;

    }

    binding.STATIC_STATE = STATIC_STATE;

    return STATIC_STATE == STATIC_BINDING_STATE.TRUE;
}

function haveStaticPluginForRefName(name: string, presets: Presets) {
    return presets.plugins.hasPlugin(PLUGIN_TYPE.STATIC_DATA_FETCH, name);
}

export function Expression_Is_Static(
    ast: JSNode,
    comp: ComponentData,
    presets: Presets,
    parent_comp: ComponentData[] = null
): boolean {

    for (const { node, meta } of traverse(ast, "nodes").makeSkippable()
    ) {
        switch (node.type) {


            case JSNodeType.IdentifierName:
            case JSNodeType.IdentifierReference:

                const name = tools.getIdentifierName(node);

                let binding = getComponentBinding(name, comp);

                if (binding && Binding_Variable_Has_Static_Default_Value(binding, comp, presets, parent_comp))
                    continue;

                return false;

            case JSNodeType.CallExpression: {
                const [name_node] = node.nodes;
                if ((name_node.type & JSNodeClass.IDENTIFIER) > 0) {
                    if (haveStaticPluginForRefName(name_node.value, presets)) {
                        for (const n of node.nodes.slice(1))
                            if (!Expression_Is_Static(n, comp, presets, parent_comp))
                                return false;
                        meta.skip();
                        break;
                    }
                }
            }
            case JSNodeType.ArrowFunction:
            case JSNodeType.FunctionDeclaration:
                return false;

        }
    }

    return true;
}

export async function getDefaultBindingValue(
    name: string,
    comp: ComponentData,
    presets: Presets,
    model: Object,
    parent_comp: ComponentData[] = null
): JSExpressionClass {

    const binding = getComponentBinding(name, comp);

    if (binding) {

        if (binding.type == BINDING_VARIABLE_TYPE.PARENT_VARIABLE && parent_comp)

            for (const hook of parent_comp.hooks.filter(h => h.selector == HOOK_SELECTOR.EXPORT_TO_CHILD))

                if (hook.hook_value.extern == binding.external_name)

                    return await getDefaultBindingValue(hook.hook_value.local, parent_comp, presets, model);

        if ((binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE || binding.type == BINDING_VARIABLE_TYPE.UNDEFINED)) {

            if (model) return await convertObjectToJSNode(model[binding.external_name]);
            else return undefined;

        } else if (Binding_Variable_Has_Static_Default_Value(binding, comp, presets))

            return await getStaticValueAstFromSourceAST(binding.default_val, comp, presets, model, parent_comp);

    }

    return undefined;
}

/**
 * Returns a JSNode AST that represents the resolved value
 * of the node after taking into account BindingVariable references
 * and plugin return values. 
 * 
 * If ANY value cannot be resolved then undefined is returned instead 
 * of a JSNode
 */
export async function getStaticValueAstFromSourceAST(
    input_node: JSNode,
    comp: ComponentData,
    presets: Presets,
    model: Object,
    parent_comp: ComponentData[] = null
) {
    const receiver = { ast: null };

    for (
        const { node, meta } of traverse(input_node, "nodes")
            .filter(
                "type",
                JSNodeType.IdentifierReference,
                JSNodeType.IdentifierName,
                JSNodeType.CallExpression
            )
            .makeReplaceable()
            .extract(receiver)
    ) {

        if (node.type == JSNodeType.CallExpression) {

            const name = tools.getIdentifierName(node);

            if (haveStaticPluginForRefName(name, presets)) {
                const vals = [];

                for (const n of node.nodes.slice(1)) {

                    const val = await getStaticValueAstFromSourceAST(n, comp, presets, model, parent_comp);

                    if (val === undefined)
                        return undefined;

                    vals.push(val);
                }

                const val = await presets.plugins.getPlugin(
                    PLUGIN_TYPE.STATIC_DATA_FETCH,
                    name
                )
                    .serverHandler(presets, ...vals.map(v => eval(renderCompressed(v))));

                meta.replace(<JSNode>convertObjectToJSNode(val));
            }

        } else {

            const name = tools.getIdentifierName(node);

            /**
             * Only accept references whose value can be resolved through binding variable 
             * resolution.
             */

            if (comp.root_frame.binding_variables.has(name)) {

                const val = await <JSNode>getDefaultBindingValue(name, comp, presets, model, parent_comp);

                if (val === undefined)
                    return undefined;

                meta.replace(val);
            } else
                return undefined;
        }
    }
    return <JSExpressionClass>receiver.ast;
}

export function addHook(component: ComponentData, hook: IntermediateHook) {
    component.hooks.push(hook);
};

/**
 * Retrieves the real default value of the given binding, 
 * or  null
 */
export async function getStaticValue(
    binding: WickBindingNode,
    component: ComponentData,
    presets: Presets,
    model: any = null,
    parent_comp: ComponentData = null
) {

    const ast = await getStaticValueAstFromSourceAST(binding.primary_ast, component, presets, model, parent_comp);

    if (ast)
        return eval(renderCompressed(ast));
    return null;
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