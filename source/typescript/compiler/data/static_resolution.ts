import { traverse } from "@candlelib/conflagrate";
import {
    exp,
    JSExpressionClass,
    JSIdentifier,
    JSNode,
    JSNodeClass,
    JSNodeType,
    renderCompressed,
    tools
} from "@candlelib/js";
import {
    BindingVariable, BINDING_VARIABLE_TYPE, ComponentData, PLUGIN_TYPE,
    PresetOptions, STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import {
    getBindingStaticResolutionType,
    getCompiledBindingVariableNameFromString,
    getComponentBinding,
    haveStaticPluginForRefName,
    Is_Statically_Resolvable_On_Server
} from '../common/binding.js';
import { convertObjectToJSNode } from "../common/js.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../common/js_hook_types.js";
import { ExportToChildAttributeHook } from '../features/module_features.js';

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
    g: Set<BindingVariable> = null
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

            case JSNodeType.ArrowFunction:

                for (const n of node.nodes)
                    type |= getExpressionStaticResolutionType(<any>n, comp, presets, m, g);

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

            case JSNodeType.FunctionDeclaration:
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

        } /*else*//*else*/ if ((binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE || binding.type == BINDING_VARIABLE_TYPE.UNDECLARED)) {

            if (model)
                return await convertObjectToJSNode(model[binding.internal_name]);

        } else if (binding.type == BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE) {

            if (globalThis[name])
                return <JSExpressionClass>exp(name);

        } else if (ASSUME_RUNTIME
            && (
                binding.type == BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE
                ||
                binding.type == BINDING_VARIABLE_TYPE.MODULE_VARIABLE
            )) {
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

    for (const { node, meta } of traverse(input_node, "nodes")
        .filter(
            "type",
            JSNodeType.PostExpression,
            JSNodeType.PreExpression,
            JSNodeType.CallExpression,
            BindingIdentifierBinding,
            BindingIdentifierReference
        )
        .makeReplaceable()
        .extract(receiver)) {

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

                if (val === undefined)
                    return undefined;

                if (val && val.type == JSNodeType.ObjectLiteral)
                    meta.replace({
                        type: JSNodeType.Parenthesized,
                        nodes: [val],
                        pos: val.pos
                    });

                else
                    meta.replace(val);
            }
            else
                return undefined;
        }
    }
    return <JSExpressionClass>receiver.ast;
}
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
