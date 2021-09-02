import { copy, traverse } from "@candlelib/conflagrate";
import { exp, JSExpressionClass, JSIdentifier, JSNode, JSNodeClass, JSNodeType, renderCompressed, tools } from "@candlelib/js";
import { Lexer } from "@candlelib/wind";
import { PluginStore } from "../../plugin/plugin.js";
import {
    BindingVariable,
    BINDING_FLAG,
    BINDING_VARIABLE_TYPE,
    CompiledComponentClass,
    ComponentData,
    FunctionFrame,
    IntermediateHook,
    PLUGIN_TYPE,
    PresetOptions, STATIC_BINDING_STATE, STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import { ExportToChildAttributeHook } from '../module_features.js';

import { getSetOfEnvironmentGlobalNames } from "./global_variables.js";
import { getOriginalTypeOfExtendedType } from "./extended_types.js";
import { convertObjectToJSNode } from "./js.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "./js_hook_types.js";

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
            node.type = getOriginalTypeOfExtendedType(node);
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


export function addDefaultValueToBindingVariable(frame: FunctionFrame, name: string, value: JSNode, hooks: IntermediateHook[] = []) {
    const root = getRootFrame(frame);

    if (root.binding_variables.has(name)) {
        const binding = root.binding_variables.get(name);
        binding.backup_default_val = copy(value);
        binding.default_val = value;
        binding.default_hooks = hooks;
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
    external_name: string = "", //"$$" + internal_name + "$$",
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
            existing_binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
            &&
            type != BINDING_VARIABLE_TYPE.UNDECLARED
        ) {

            root.binding_variables.set(binding_var.internal_name, binding_var);

            binding_var.flags |= existing_binding.flags;

            binding_var.ref_count = existing_binding.ref_count;

            UPGRADED = true;
        } else if (
            existing_binding.external_name == ""
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

export function processUndefinedBindingVariables(component: ComponentData, presets: PresetOptions) {

    for (const binding_variable of component.root_frame.binding_variables.values()) {

        if (binding_variable.type == BINDING_VARIABLE_TYPE.UNDECLARED) {

            if (!getSetOfEnvironmentGlobalNames().has(getExternalName(binding_variable))) {

                binding_variable.type = BINDING_VARIABLE_TYPE.UNDECLARED;

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
    comp_info?: CompiledComponentClass
) {

    const binding = getComponentBinding(name, component);

    return getCompiledBindingVariableName(binding, comp_info);
}

export function getCompiledBindingVariableName(
    binding: BindingVariable,
    comp_info?: CompiledComponentClass
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
                return `this.presets.api.${external_name}.default`;

            case BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE:
                console.log(binding);
                return `this.presets.api.${external_name}.module.${internal_name}`;

            case BINDING_VARIABLE_TYPE.UNDECLARED:
                const global_names = getSetOfEnvironmentGlobalNames();
                if (global_names.has(external_name))
                    return external_name;

            //intentional

            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
                return `this.model.${external_name}`;

            case BINDING_VARIABLE_TYPE.METHOD_VARIABLE:
                return "this." + binding.internal_name;

            case BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE:
                return `${external_name}`;

            default:
                return `this[${comp_info.binding_records.get(binding.internal_name)?.index ?? -1}]`;
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



function haveStaticPluginForRefName(name: string, presets: PresetOptions) {


    return presets.plugins.hasPlugin(PLUGIN_TYPE.STATIC_DATA_FETCH, name);
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
 * @param presets - A Presets object that can provide resolution on plugin module
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
    comp: ComponentData,
    presets: PresetOptions,
    modules: Set<BindingVariable> = null,
    globals: Set<BindingVariable> = null,
): STATIC_RESOLUTION_TYPE {

    if (!binding.static_resolution_type) {

        let type = 0;

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

            case BINDING_VARIABLE_TYPE.PARENT_VARIABLE:
                type = STATIC_RESOLUTION_TYPE.STATIC_WITH_PARENT;
                break;

            case BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE:
                type = STATIC_RESOLUTION_TYPE.CONSTANT_STATIC;
                break;

            default:
                type = STATIC_RESOLUTION_TYPE.INVALID;
                break;
        }

        if (binding.default_val) {
            const v = getExpressionStaticResolutionType(binding.default_val, comp, presets);
            type |= v;
        }

        binding.static_resolution_type = type;



    }

    return binding.static_resolution_type;
}

/**
 * Returns a STATIC_RESOLUTION_TYPE value representing the static resolution 
 * requirements of the expression. 
 * 
 * @param ast - A valid JSNode AST object
 * 
 * @param comp  - A ComponentData object that can resolutions on binding variables 
 *                that may be references in the ast. 
 * 
 * @param presets - A Presets object that can provide resolution on plugin module
 *                  references within the ast. 
 * 
 * @param m - An optional empty Set that will be used to record all module bindings that 
 *            are referenced in the ast.
 * 
 * @param g - An optional empty Set that will be used to record all global reference bindings
 *            that are referenced in the ast.
 * 
 * @returns {STATIC_RESOLUTION_TYPE}
 */
export function getExpressionStaticResolutionType(
    ast: JSNode,
    comp: ComponentData,
    presets: PresetOptions,
    m: Set<BindingVariable> = null,
    g: Set<BindingVariable> = null,
): STATIC_RESOLUTION_TYPE {


    let type: number = STATIC_RESOLUTION_TYPE.CONSTANT_STATIC;

    for (const { node, meta } of traverse(ast, "nodes").makeSkippable()) {

        if (type == STATIC_RESOLUTION_TYPE.INVALID)
            break;

        switch (node.type) {

            case BindingIdentifierBinding: case BindingIdentifierReference:


                const name = tools.getIdentifierName(node);


                let binding = getComponentBinding(name, comp);

                type |= getBindingStaticResolutionType(binding, comp, presets, m, g);


                break;

            case JSNodeType.CallExpression: {
                const [name_node] = <JSIdentifier[]>node.nodes;
                if ((name_node.type & JSNodeClass.IDENTIFIER) > 0) {
                    if (haveStaticPluginForRefName(<string>name_node.value, presets)) {
                        for (const n of node.nodes.slice(1)) {
                            type |= getExpressionStaticResolutionType(n, comp, presets, m, g);
                            meta.skip();
                        }
                    }
                }
            } break;

            case JSNodeType.ArrowFunction: case JSNodeType.FunctionDeclaration:
                type |= STATIC_RESOLUTION_TYPE.INVALID;
        }
    }


    return type;
}

export async function getDefaultBindingValueAST(
    name: string,
    comp: ComponentData,
    presets: PresetOptions,
    model: Object,
    parent_comp: ComponentData[] = null,
    ASSUME_RUNTIME: boolean = false
): Promise<JSExpressionClass> {


    const binding = getComponentBinding(name, comp);

    if (binding) {

        if (binding.type == BINDING_VARIABLE_TYPE.PARENT_VARIABLE && parent_comp) {
            for (const hook of (<ComponentData><any>parent_comp).indirect_hooks.filter(h => h.type == ExportToChildAttributeHook)) {

                if (hook.nodes[0].foreign == binding.external_name) {

                    return await getDefaultBindingValueAST(hook.nodes[0].local, parent_comp, presets, model, null, ASSUME_RUNTIME);
                }
            }

        } /*else*/ if ((binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE || binding.type == BINDING_VARIABLE_TYPE.UNDECLARED)) {

            if (model) return await convertObjectToJSNode(model[binding.internal_name]);

        } else if (binding.type == BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE) {

            if (globalThis[name]) return <JSExpressionClass>exp(name);

        } else if (
            ASSUME_RUNTIME
            && (
                binding.type == BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE
                ||
                binding.type == BINDING_VARIABLE_TYPE.MODULE_VARIABLE
            )
        ) {
            return <JSExpressionClass>exp(getCompiledBindingVariableNameFromString(binding.internal_name, comp));

        } else if (ASSUME_RUNTIME) {
            if (getBindingStaticResolutionType(binding, comp, presets) != STATIC_RESOLUTION_TYPE.INVALID)
                return await getStaticValueAstFromSourceAST(binding.default_val, comp, presets, model, parent_comp, ASSUME_RUNTIME);
        }
        else if (Is_Statically_Resolvable_On_Server(binding, comp, presets))
            return await getStaticValueAstFromSourceAST(binding.default_val, comp, presets, model, parent_comp);

    }

    return undefined;
}

/**
 * Runtime static can include ALL GLOBALS, AND NON LOCAL APIS
 * @param input_node 
 * @param comp 
 * @param presets 
 * @param model 
 * @param parent_comp 
 * @param ASSUME_RUNTIME 
 * @returns 
 */

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
    presets: PresetOptions,
    model: Object,
    parent_comp: ComponentData[] = null,
    ASSUME_RUNTIME: boolean = false
): Promise<JSExpressionClass> {



    const receiver = { ast: null };

    for (
        const { node, meta } of traverse(input_node, "nodes")
            .filter(
                "type",
                JSNodeType.PostExpression,
                JSNodeType.PreExpression,
                JSNodeType.CallExpression,
                BindingIdentifierBinding,
                BindingIdentifierReference
            )
            .makeReplaceable()
            .extract(receiver)
    ) {

        if (node.type == JSNodeType.PostExpression || node.type == JSNodeType.PreExpression) {
            const val = await getStaticValueAstFromSourceAST(node.nodes[0], comp, presets, model, parent_comp, ASSUME_RUNTIME);
            if (val === undefined)
                return undefined;
            meta.replace(val);
        } else if (node.type == JSNodeType.CallExpression) {

            const name = tools.getIdentifierName(node);

            if (haveStaticPluginForRefName(name, presets)) {
                const vals = [];

                for (const n of node.nodes.slice(1)) {

                    const val = await getStaticValueAstFromSourceAST(n, comp, presets, model, parent_comp, ASSUME_RUNTIME);

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


                const val = await <any>getDefaultBindingValueAST(name, comp, presets, model, parent_comp, ASSUME_RUNTIME);

                if (val === undefined) return undefined;

                if (val && val.type == JSNodeType.ObjectLiteral)
                    meta.replace({
                        type: JSNodeType.Parenthesized,
                        nodes: [val],
                        pos: val.pos
                    });
                else
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
 * or return null.
 */
export async function getStaticValue(
    input_ast: JSNode,
    component: ComponentData,
    presets: PresetOptions,
    model: any = null,
    parent_comp: ComponentData[] = null,
    ASSUME_RUNTIME: boolean = false
) {



    const ast = await getStaticValueAstFromSourceAST(
        input_ast, component, presets, model, parent_comp, ASSUME_RUNTIME
    );

    if (ast)
        try {
            return eval(renderCompressed(<any>ast));
        } catch (e) { }

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
        comp_var.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
        ||
        comp_var.type == BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE
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

function Is_Statically_Resolvable_On_Server(binding: BindingVariable, comp: ComponentData, presets: PresetOptions): boolean {
    const modules: Set<BindingVariable> = new Set();
    const globals: Set<BindingVariable> = new Set();
    const type = getBindingStaticResolutionType(binding, comp, presets, modules, globals);

    if (type == STATIC_RESOLUTION_TYPE.INVALID)

        for (const module of modules)
            if (!haveStaticPluginForRefName(module.internal_name, presets))
                return false;

    return true;
}