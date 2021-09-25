import { traverse } from '@candlelib/conflagrate';
import { ext, JSExpressionStatement, JSIdentifier, JSNode, JSNodeType, renderCompressed, stmt } from '@candlelib/js';
import URI from '@candlelib/uri';
import {
    BINDING_VARIABLE_TYPE,
    ComponentData,
    ContainerDomLiteral,
    HOOK_SELECTOR,
    HTMLAttribute,
    HTMLContainerNode,
    HTMLNodeClass,
    HTMLNodeType,
    IndirectHook,
    STATIC_RESOLUTION_TYPE
} from "../types/all.js";
import { registerFeature } from './build_system.js';
import { getExpressionStaticResolutionType, getStaticValue } from "./common/binding.js";
import { getExtendTypeVal, getOriginalTypeOfExtendedType } from "./common/extended_types.js";
import { getElementAtIndex, Is_Tag_From_HTML_Spec } from "./common/html.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "./common/js_hook_types.js";


export const ContainerDataHook = getExtendTypeVal("container-data-hook", HTMLNodeType.HTMLAttribute);
export const ContainerFilterHook = getExtendTypeVal("container-filter-hook", HTMLNodeType.HTMLAttribute);
export const ContainerSortHook = getExtendTypeVal("container-sort-hook", HTMLNodeType.HTMLAttribute);
export const ContainerLimitHook = getExtendTypeVal("container-limit-hook", HTMLNodeType.HTMLAttribute);
export const ContainerOffsetHook = getExtendTypeVal("container-offset-hook", HTMLNodeType.HTMLAttribute);
export const ContainerShiftHook = getExtendTypeVal("container-shift-hook", HTMLNodeType.HTMLAttribute);
export const ContainerScrubHook = getExtendTypeVal("container-scrub-hook", HTMLNodeType.HTMLAttribute);
export const ContainerUseIfHook = getExtendTypeVal("container-use-if", HTMLNodeType.HTMLAttribute);
export const ContainerUseIfEmptyHook = getExtendTypeVal("container-use-if-empty", HTMLNodeType.HTMLAttribute);

registerFeature(

    "CandleLibrary WICK: HTML Containers",
    (build_system) => {

        /** ##########################################################
         *  Container Elements
         */
        build_system.registerHTMLParserHandler(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.tag.toLowerCase() == "container") {

                        //Turn children into components if they are not already so.   
                        let ch = null;

                        const container_id = component.container_count;

                        const ctr: HTMLContainerNode = Object.assign(<HTMLContainerNode>{

                            IS_CONTAINER: true,

                            container_id,

                            components: [],

                            component_names: [],

                            component_attributes: []

                        }, node);

                        for (const n of ctr.nodes) {

                            ch = n;

                            if (!(n.type & HTMLNodeClass.HTML_ELEMENT)) { continue; }

                            let comp, comp_index = ctr.components.length;

                            const inherited_attributes = [], core_attributes = [];

                            const IS_GENERATED_COMPONENT = !(component.local_component_names.has(ch.tag));


                            {
                                const new_attribs = [];
                                //Check for use-if attribute
                                for (const attrib of (n.attributes || [])) {
                                    const { name, value } = attrib;
                                    if (typeof value != "string")
                                        if (name == "use-if") {

                                            build_system.addIndirectHook(component, ContainerUseIfHook, {
                                                expression: await build_system.processBindingAsync(value, component, presets),
                                                comp_index: comp_index,
                                                container_id
                                            }, index);

                                        } else if (name == "use-if-empty") {

                                            build_system.addIndirectHook(component, ContainerUseIfEmptyHook, {
                                                hook_value: value.primary_ast,
                                                component: comp.name,
                                                container_id
                                            }, index);
                                        } else
                                            IS_GENERATED_COMPONENT
                                                ? new_attribs.push(attrib)
                                                : inherited_attributes.push([name, value]);


                                }

                                n.attributes = new_attribs;
                            }

                            ctr.component_attributes.push(inherited_attributes);


                            if (ch.tag.toLowerCase() == "self") {
                                comp = component;
                            } else {


                                if (!IS_GENERATED_COMPONENT)

                                    comp = presets.components.get(component.local_component_names.get(ch.tag));

                                else
                                    ({ comp } = await build_system.parseComponentAST(
                                        Object.assign({}, ch),
                                        build_system.componentNodeSource(component, ch),
                                        new URI("auto_generated"),
                                        presets,
                                        component
                                    ));

                                component.local_component_names.set(comp?.name, comp?.name);

                                ch.child_id = component.children.push(1) - 1;
                            }

                            ctr.components.push(comp);

                            ctr.component_names.push(comp?.name);
                        }

                        component.container_count++;

                        // Remove all child nodes from container after they have 
                        // been processed
                        ctr.nodes.length = 0;

                        skip();

                        return ctr;
                    }
                }

            }, HTMLNodeType.HTML_Element
        );

        /**
         * Container use-if attribute
         */

        build_system.registerHookHandler<IndirectHook<{
            expression: JSNode,
            comp_index: number,
            container_id: number,
        }>, void | JSNode>({

            name: "Container Use-If",

            types: [ContainerUseIfHook],

            verify: () => true,

            buildHTML: _ => null,

            buildJS: (node, comp, presets, index, write, init, _2) => {

                const {
                    expression,
                    comp_index,
                    container_id,
                } = node.nodes[0];

                let arrow_argument_match = new Array(1).fill(null);

                if (getListOfUnboundArgs(expression, comp, arrow_argument_match, build_system)) {

                    const arrow_expression_stmt = stmt(`$$ctr${container_id}.addEvaluator(${arrow_argument_match[0].value} => 1, ${comp_index})`);

                    arrow_expression_stmt.nodes[0].nodes[1].nodes[0].nodes[1] = expression;

                    init(arrow_expression_stmt);
                }

                return null;

            }
        });

        /** ###########################################################
         *  Container Data Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(attr, host_node, host_element, index, skip, component, presets) {

                    if (attr.name == "data" && host_node.IS_CONTAINER) {


                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(attr.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerDataHook, ast, index, true);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<IndirectHook<JSNode>, void | JSNode>({
            name: "Container Data Attribute",

            types: [ContainerDataHook],

            verify: () => true,

            buildJS: (node, comp, presets, element_index, on_write, init) => {


                const
                    ele = getElementAtIndex(comp, element_index),

                    st = <JSExpressionStatement>stmt(`$$ctr${ele.container_id}.sd(0)`);

                st.nodes[0].nodes[1].nodes = node.nodes;

                const resolution_type = getExpressionStaticResolutionType(<JSNode>node.nodes[0], comp, presets);
                if (
                    resolution_type == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC
                    ||
                    resolution_type == STATIC_RESOLUTION_TYPE.STATIC_WITH_GLOBAL
                )
                    init(st);

                on_write(st);

                return node;
            },

            buildHTML: async (hook, comp, presets, model, parents) => {
                const ast = hook.nodes[0];
                const container_ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

                if (
                    getExpressionStaticResolutionType(<JSNode>hook.nodes[0], comp, presets)
                    !==
                    STATIC_RESOLUTION_TYPE.INVALID
                    &&
                    container_ele.component_names.length > 0
                ) {
                    return await getStaticValue(hook.nodes[0], comp, presets, model, parents);
                }

                return [];
            }
        });

        /** ###########################################################
         *  Container Filter Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "filter" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerFilterHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({
            description: ``,

            name: "Container Filter Hook",

            types: [ContainerFilterHook],

            verify: () => true,

            buildJS: createContainerDynamicArrowCall(1, "setFilter"),

            buildHTML: createContainerStaticArrowFunction(1)
        });


        /** ###########################################################
         *  Container Scrub Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "scrub" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerScrubHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({

            description: ``,

            name: "Container Scrub Hook",

            types: [ContainerScrubHook],

            verify: () => true,

            buildJS: createContainerDynamicValue("updateScrub"),
            // Scrub has no meaning in a static context, as it requires variable input from 
            // user actions to work. 
            buildHTML: () => null
        });

        /** ###########################################################
         *  Container Sort Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "sort" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerSortHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({
            description: ``,

            name: "Container Sort Hook",

            types: [ContainerSortHook],

            verify: () => true,

            buildJS: createContainerDynamicArrowCall(2, "setSort"),

            buildHTML: createContainerStaticArrowFunction(2)
        });

        /** ###########################################################
         *  Container Limit Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "limit" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerLimitHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({
            description: ``,

            name: "Container limit Hook",

            types: [ContainerLimitHook],

            verify: () => true,

            buildJS: createContainerDynamicValue("updateLimit"),

            buildHTML: createContainerStaticValue
        });

        /** ###########################################################
         *  Container Offset Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "offset" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerOffsetHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({

            description: ``,

            name: "Container Offset Hook",

            types: [ContainerOffsetHook],

            verify: () => true,

            buildJS: createContainerDynamicValue("updateOffset"),

            buildHTML: createContainerStaticValue
        });

        /** ###########################################################
         *  Container Shift Attribute
         */
        build_system.registerHTMLParserHandler<HTMLAttribute>(
            {
                priority: 99999999999,

                async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

                    if (node.name == "shift" && host_node.IS_CONTAINER) {

                        // Process the primary expression for Binding Refs and static
                        // data
                        const ast = await build_system.processBindingAsync(node.value, component, presets);

                        // Create an indirect hook for container data attribute

                        build_system.addIndirectHook(component, ContainerShiftHook, ast, index);

                        // Remove the attribute from the container element

                        return null;
                    }
                }
            }, HTMLNodeType.HTMLAttribute
        );

        build_system.registerHookHandler<JSNode | JSIdentifier | any, void>({

            description: ``,

            name: "Container Shift Hook",

            types: [ContainerShiftHook],

            verify: () => true,

            buildJS: createContainerDynamicValue("updateShift"),

            buildHTML: createContainerStaticValue
        });

        function createContainerDynamicValue(container_method_name: string) {

            return function (node, comp, presets, index, write, _1, _2) {

                const container_id = build_system.getElementAtIndex(comp, index).container_id;

                const arrow_expression_stmt = stmt(`$$ctr${container_id}.${container_method_name}()`);

                arrow_expression_stmt.nodes[0].nodes[1].nodes[0] = node.nodes[0];

                write(arrow_expression_stmt);
            };
        }

        async function createContainerStaticValue(hook: IndirectHook<JSNode>, comp, presets, model, parents) {


            if (build_system.getExpressionStaticResolutionType(hook.nodes[0], comp, presets) == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) {


                const ast = await build_system.getStaticValueAstFromSourceAST(hook.nodes[0], comp, presets, model, parents, false);

                try {
                    return eval(renderCompressed(<JSNode>ast));
                } catch (e) { }
            }
        };

        function createContainerDynamicArrowCall(argument_size: number, container_method_name: string) {
            return function (node, comp, presets, index, write, _1, _2) {

                const container_id = build_system.getElementAtIndex(comp, index).container_id;

                let arrow_argument_match = new Array(argument_size).fill(null);

                if (getListOfUnboundArgs(node, comp, arrow_argument_match, build_system)) {

                    const arrow_expression_stmt = stmt(`$$ctr${container_id}.${container_method_name}((${arrow_argument_match.map(i => i.value).join(",")}) => 1)`);

                    arrow_expression_stmt.nodes[0].nodes[1].nodes[0].nodes[1] = node.nodes[0];

                    write(arrow_expression_stmt);
                }
            };
        }

        function createContainerStaticArrowFunction(argument_size: number = 1) {

            return async function (hook: IndirectHook<JSNode>, comp, presets, model, parents) {

                let arrow_argument_match = new Array(argument_size).fill(null);

                let ast = hook.nodes[0];

                //Expects just an expression statement, but the expression statement in an arrow function will work as well.
                if (ast.type == JSNodeType.ArrowFunction)
                    ast = ast.nodes[1];

                if (getListOfUnboundArgs(ast, comp, arrow_argument_match, build_system)) {


                    if (build_system.getExpressionStaticResolutionType(ast, comp, presets) == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) {

                        const arrow_expression_stmt = build_system.js.expr(`(${arrow_argument_match.map(v => v.value)}) => 1`);

                        arrow_expression_stmt.nodes[1] =
                            await build_system.getStaticValueAstFromSourceAST(ast, comp, presets, model, parents, false);;
                        try {
                            return eval(renderCompressed(arrow_expression_stmt));
                        } catch (e) { }
                    }
                }

                return null;
            };
        }



    }
);

/**
        * Searches for N Undeclared binding references, where N is the number of entries in list arg.
        * Upon finding matches, converts the types of reference nodes back to their original values.
        * Found nodes are assigned to the list at an index respective of the order the node was found
        * in. If the number of found nodes is less then the number of entries in list, then false
        * is returned; true otherwise.
        *
        * @param node
        * @param comp
        * @param list
        * @returns
        */
export function getListOfUnboundArgs(
    node: JSNode,
    comp: ComponentData,
    list: JSNode[],
    build_sys: any
): boolean {

    let index = 0;

    let active_names = new Set();

    for (const { node: n } of traverse(node, "nodes")
        .filter("type", BindingIdentifierBinding, BindingIdentifierReference, JSNodeType.IdentifierBinding, JSNodeType.IdentifierReference)) {

        const name = n.value;

        if (n.type == BindingIdentifierBinding || n.type == BindingIdentifierReference) {

            const binding = build_sys.getComponentBinding(name, comp);

            if (binding.type == BINDING_VARIABLE_TYPE.UNDECLARED) {

                n.type = getOriginalTypeOfExtendedType(n.type);

                if (!active_names.has(name)) {
                    active_names.add(name);
                    list[index] = n;
                    if (++index == list.length)
                        return true;
                }
            }
        } else {
            if (!active_names.has(name)) {
                active_names.add(name);
                list[index] = n;
                if (++index == list.length)
                    return true;
            }
        }
    }

    return false;
}