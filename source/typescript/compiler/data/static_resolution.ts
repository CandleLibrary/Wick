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
    BindingVariable, BINDING_VARIABLE_TYPE, HTMLNodeClass, Node, PLUGIN_TYPE,
    STATIC_RESOLUTION_TYPE
} from "../../types/all.js";
import {
    getBindingStaticResolutionType,
    getCompiledBindingVariableNameFromString,
    getComponentBinding,
    haveStaticPluginForRefName,
    Is_Statically_Resolvable_On_Server
} from '../common/binding.js';
import { ComponentData } from '../common/component.js';
import { getExtendTypeVal } from '../common/extended_types.js';
import { convertObjectToJSNode } from "../common/js.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../common/js_hook_types.js";
import { Context } from '../common/context.js';
import { parse_js_exp } from '../source-code-parse/parse.js';
import { AsyncFunction } from './AsyncFunction.js';
const DataCache = new WeakMap();

export const ExportToChildAttributeHook = getExtendTypeVal("data-export-to-child-through-attribute-hook", JSNodeType.StringLiteral);
export async function getStaticAST(
    input_ast: JSNode & { cache_data: any; },
    component: ComponentData,
    context: Context,
    model: any = null,
    parent_comp: ComponentData = null,
    ASSUME_RUNTIME: boolean = false,
    ref: any = null
) {

    const input_args = new Map;

    return await getStaticValueAstFromSourceAST(
        input_ast, component, context, model, parent_comp, ASSUME_RUNTIME, input_args
    );
}

/**
 * Retrieves the real default value of the given binding,
 * or returns null.
 */
export async function getStaticValue(
    input_ast: Node & { cache_data: any; },
    component: ComponentData,
    context: Context,
    model: any = null,
    parent_comp: ComponentData = null,
    ASSUME_RUNTIME: boolean = false,
    ref: any = null
): Promise<{ html: any, value: null; }> {

    const input_args = new Map;

    const ast = await getStaticValueAstFromSourceAST(
        input_ast, component, context, model, parent_comp, ASSUME_RUNTIME, input_args
    );

    let html = null, value = null;

    if (ast) {
        if (ast.type & HTMLNodeClass.HTML_ELEMENT) {
            html = ast;
        } else {

            try {

                const data_string = renderCompressed(<any>ast);

                if (data_string)
                    if (ast.type == JSNodeType.ArrowFunction) {

                        const { ASYNC } = ast;

                        let fn = ASYNC
                            ? AsyncFunction(`return (${data_string})(...arguments)`)
                            : Function(`return (${data_string})(...arguments)`);

                        const data = await fn({
                            parseDir: () => []
                        });

                        value = data;
                    } else {
                        value = Function(...input_args.keys(), `return (${data_string})`)(...input_args.values());
                    }

                if (typeof value == "object"
                    && "type" in value
                    && (value.type & HTMLNodeClass.HTML_ELEMENT)
                ) {
                    html = value; value = null;
                }

            } catch (e) {
                console.error(e);
            }
        }
    }

    return { value, html };
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
 * @param context - A Presets object that can provide resolution on plugin module
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
    context: Context,
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

                type |= getBindingStaticResolutionType(binding, comp, context, m, g);

                break;

            case JSNodeType.ArrowFunction:


                for (const n of node.nodes)
                    type |= getExpressionStaticResolutionType(<any>n, comp, context, m, g);

                break;

            case JSNodeType.CallExpression: {

                const [name_node] = <JSIdentifier[]>node.nodes;

                if ((name_node.type & JSNodeClass.IDENTIFIER) > 0) {
                    if (haveStaticPluginForRefName(<string>name_node.value, context)) {
                        for (const n of node.nodes.slice(1)) {
                            type |= getExpressionStaticResolutionType(n, comp, context, m, g);
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
    context: Context,
    model: Object = {},
    parent_comp: ComponentData = null,
    ASSUME_RUNTIME: boolean = false,
    node_lookups: Map<string, Node>
): Promise<JSExpressionClass> {


    const binding = getComponentBinding(name, comp);

    if (binding) {

        if (binding.type == BINDING_VARIABLE_TYPE.CONSTANT_DATA_SOURCE) {

            if (binding.source_location.ext == "json") {

                const value = await context.getDataSource(binding.source_location);

                return <any>convertObjectToJSNode(value?.[binding.external_name]);

            }

        } else if (binding.type == BINDING_VARIABLE_TYPE.CONFIG_GLOBAL) {
            if (context.globals)
                return await <any>convertObjectToJSNode(context.globals[binding.external_name]);

        } else if (binding.type == BINDING_VARIABLE_TYPE.TEMPLATE_CONSTANT) {

            if (context.active_template_data)
                return await <any>convertObjectToJSNode(context.active_template_data[binding.external_name]);

        } else if (binding.type == BINDING_VARIABLE_TYPE.PROPERTY_VARIABLE && parent_comp) {

            for (const hook of (<ComponentData><any>parent_comp).indirect_hooks.filter(h => h.type == ExportToChildAttributeHook)) {

                if (hook.value[0].foreign == binding.external_name) {



                    return await getDefaultBindingValueAST(
                        hook.value[0].local,
                        <any>parent_comp,
                        context,
                        model,
                        null,
                        ASSUME_RUNTIME,
                        node_lookups
                    );
                }
            }

        }

        if ((binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE || binding.type == BINDING_VARIABLE_TYPE.UNDECLARED)) {

            if (model)
                return await <any>convertObjectToJSNode(model[binding.external_name]);

        } else if (binding.type == BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE) {

            if (globalThis[name])
                return <JSExpressionClass>exp(name);

        } else if (ASSUME_RUNTIME
            && (
                binding.type == BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE
                ||
                binding.type == BINDING_VARIABLE_TYPE.MODULE_VARIABLE
            )) {
            return <JSExpressionClass>exp(getCompiledBindingVariableNameFromString(binding.external_name, comp));

        } else if (ASSUME_RUNTIME) {
            if (getBindingStaticResolutionType(binding, comp, context) != STATIC_RESOLUTION_TYPE.INVALID)
                return <any>await getStaticValueAstFromSourceAST(
                    <any>binding.default_val,
                    comp,
                    context,
                    model,
                    parent_comp,
                    ASSUME_RUNTIME,
                    node_lookups
                );
        }
        else if (Is_Statically_Resolvable_On_Server(binding, comp, context))
            return await <any>getStaticValueAstFromSourceAST(
                <any>binding.default_val,
                comp,
                context,
                model,
                parent_comp,
                false,
                node_lookups
            );

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
    input_node: Node,
    comp: ComponentData,
    context: Context,
    model: Object,
    parent_comp: ComponentData = null,
    ASSUME_RUNTIME: boolean = false,
    node_lookups: Map<string, Node>
): Promise<Node> {

    const receiver = { ast: null };

    for (const { node, meta } of traverse(input_node, "nodes")
        .makeSkippable()
        .makeReplaceable()
        .extract(receiver)) {

        if (node.type & HTMLNodeClass.HTML_ELEMENT) {

            const name = "$" + node_lookups.size;

            node_lookups.set(name, node);

            meta.replace(<any>parse_js_exp(name));

            meta.skip();

        } else if (node.type == JSNodeType.PostExpression || node.type == JSNodeType.PreExpression) {

            const val = await getStaticValueAstFromSourceAST(
                <any>node.nodes[0],
                comp,
                context,
                model,
                parent_comp,
                ASSUME_RUNTIME,
                node_lookups
            );

            if (val === undefined)
                return undefined;

            meta.replace(val);

        } else if (node.type == JSNodeType.CallExpression) {

            const name = tools.getIdentifierName(node);

            if (haveStaticPluginForRefName(name, context)) {
                const vals = [];

                for (const n of node.nodes.slice(1)) {

                    const val = await getStaticValueAstFromSourceAST(
                        n,
                        comp,
                        context,
                        model,
                        parent_comp,
                        ASSUME_RUNTIME,
                        node_lookups
                    );

                    if (val === undefined)
                        return undefined;

                    vals.push(val);
                }

                const val = await context.plugins.getPlugin(
                    PLUGIN_TYPE.STATIC_DATA_FETCH,
                    name
                )
                    .serverHandler(context, ...vals.map(v => eval(renderCompressed(v))));

                meta.replace(<JSNode>convertObjectToJSNode(val));
            }

        } else if (node.type == BindingIdentifierBinding
            || node.type == BindingIdentifierReference) {



            const name = tools.getIdentifierName(<any>node);

            /**
             * Only accept references whose value can be resolved through binding variable
             * resolution.
             */
            if (comp.root_frame.binding_variables.has(name)) {

                const val = <any>await getDefaultBindingValueAST(
                    name,
                    comp,
                    context,
                    model,
                    parent_comp,
                    ASSUME_RUNTIME,
                    node_lookups
                );

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
            else {
                return undefined;
            }
        }
    }

    return <any>receiver.ast;
}


export function ExpressionIsConstantStatic(node: JSNode, comp: ComponentData, context: Context) {

    const resolution_type = getExpressionStaticResolutionType(node, comp, context);

    return (resolution_type ^ STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) == 0;
}