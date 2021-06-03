import { traverse } from "@candlelib/conflagrate";
import { exp, JSNode, JSNodeType, stmt } from "@candlelib/js";
import URL from "@candlelib/url";
import { BINDING_VARIABLE_TYPE, ComponentData, HOOK_SELECTOR, HTMLHandler, PresetOptions } from "../../types/all.js";
import {
    HTMLContainerNode, HTMLNode,
    HTMLNodeClass,
    HTMLNodeType,
    WickBindingNode, WICK_AST_NODE_TYPE_BASE, WICK_AST_NODE_TYPE_SIZE
} from "../../types/wick_ast.js";
import { addIndirectHook } from "../ast-build/hooks.js";
import * as CH from "../ast-build/hooks/container.js";
import * as DF from "../ast-build/hooks/data-flow.js";
import * as HT from "../ast-build/hooks/hook-types.js";
import * as IN from "../ast-build/hooks/input.js";
import { addBindingReference, addBindingVariable, addHook } from "../common/binding.js";
import { importResource } from "../common/common.js";
import { ComponentHash } from "../common/hash_name.js";
import { Is_Tag_From_HTML_Spec } from "../common/html.js";
import { processFunctionDeclaration, processNodeAsync, processNodeSync, processWickCSS_AST, processWickJS_AST } from "./parse.js";
import { parseComponentAST } from "./source.js";

const default_handler = {
    priority: -Infinity,
    prepareHTMLNode(node) { return node; }
};

export const html_handlers: Array<HTMLHandler[]> = Array(WICK_AST_NODE_TYPE_SIZE).fill(null).map(() => [default_handler]);

function loadHTMLHandlerInternal(handler: HTMLHandler, ...types: HTMLNodeType[]) {

    for (const type of types) {

        const handler_array = html_handlers[Math.max((type >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadHTMLHandler(handler: HTMLHandler, ...types: HTMLNodeType[]) {

    const modified_handler = Object.assign({}, handler);

    modified_handler.priority = Math.abs(modified_handler.priority);

    return loadHTMLHandler(modified_handler, ...types);
}

/*
 * Wick Binding Nodes
 */
function addWickBindingVariableName(node: WickBindingNode, component) {

    for (const { node: n } of traverse(node.primary_ast, "nodes"))

        if (n.type == JSNodeType.IdentifierReference)

            addBindingReference(n, node.primary_ast, component.root_frame);
}

function processBindingAST(node: any | WickBindingNode, component: ComponentData, presets: PresetOptions) {
    let ast = null;

    if (typeof node !== "object") {
        ast = exp(node + "");
    } else
        ast = node.primary_ast;

    return processNodeSync(ast, component.root_frame, component, presets);
}


loadHTMLHandlerInternal({

    priority: 1,

    prepareHTMLNode(node: WickBindingNode, _, _1, index, _2, component, presets) {

        const ast = processBindingAST(node, component, presets);

        addIndirectHook(component, HT.TextNodeHookType, ast, index + 1);

        addWickBindingVariableName(node, component);

        // Skip processing this node in the outer scope, 
        // it will be replaced with a CompiledBinding node.

        return <HTMLNode>{
            type: HTMLNodeType.HTML_BINDING_ELEMENT,
            IS_BINDING: true,
            value: "",
            pos: node.pos
        };
    }
}, HTMLNodeType.WickBinding);


/*[API] ##########################################################
* 
* HTML HEAD
* 
* Elements defined within HEAD tags get appended to the HTML_HEAD array
* of the component data element
*/
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, _, _2, _3, _4, component) {
            component.HTML_HEAD.push(...node.nodes);
            return null;
        }
    }, HTMLNodeType.HTML_HEAD
);


/** ##########################################################
 * BINDING ATTRIBUTE VALUE 
 * 
 */
loadHTMLHandlerInternal(
    {
        priority: -4,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            const attrib = <any>node;

            if (attrib.IS_BINDING) {

                await processBindingNode(attrib, component, presets, index);

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Data Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "data" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerDataHook, ast, index, true);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Filter Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "filter" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerFilterHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);


/** ###########################################################
 *  Container Scrub Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "scrub" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerScrubHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Sort Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "sort" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerSortHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Limit Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "limit" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerLimitHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Offset Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "offset" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerOffsetHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Container Shift Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -3,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "shift" && host_node.IS_CONTAINER) {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, CH.ContainerShiftHook, ast, index);

                // Remove the attribute from the container element

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ###########################################################
 *  Input Text Value Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -10,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "value" && host_node.tag == "INPUT") {

                if (host_node.attributes.some(val => val.value == "text")) {


                    // Process the primary expression for Binding Refs and static
                    // data
                    const ast = processBindingAST(node.value, component, presets);

                    // Create an indirect hook for container data attribute

                    addIndirectHook(component, IN.TextInputValueHook, ast, index);

                    // Remove the attribute from the container element

                    return null;
                }
            }

        }
    }, HTMLNodeType.HTMLAttribute
);



/** ##########################################################
 * ON* ATTRIBUTES
 */
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name.slice(0, 2) == "on") {

                // Process the primary expression for Binding Refs and static
                // data
                const ast = processBindingAST(node.value, component, presets);

                // Create an indirect hook for container data attribute

                addIndirectHook(component, HT.OnEventHook, { action: node.name, nodes: [ast] }, index);

                // Remove the attribute from the container element

                return null;

            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ##############################################################################
 * SLOT ATTRIBUTES
 * Adds slot property strings to host node for later evaluation during build phase
 */
loadHTMLHandlerInternal(
    {
        priority: -2,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {
            if (
                node.name == "slot"
                ||
                node.name == "name"
            ) {
                host_node.slot_name = <string>node.value;
                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ##########################################################
 * 
 * Container Element component & element attributes
 */
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (host_node.IS_CONTAINER) {


                if (node.name == "component") {

                    const component_name = <string>(<HTMLNode>node).value;

                    component.names.push(component_name);

                    // No need to save this wick specific attribute, return [undefined]. 
                    return null;
                }

                if (node.name == "element" || node.name == "ele") {

                    host_node.tag = node.value;

                    return;
                }

                return;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);


/** ##########################################################
 * 
 * Export and Import attributes on component elements
 */
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "import" && node.value) {
                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ foreign: v[1] || v[0], local: v[0] }));

                for (const { local, foreign } of obj)
                    addIndirectHook(component, DF.ImportFromChildAttributeHook, { local, foreign }, index);

                return null;

            } else if (node.name == "export" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ foreign: v[1] || v[0], local: v[0] }));

                for (const { local, foreign } of obj)
                    addIndirectHook(component, DF.ExportToChildAttributeHook, { local, foreign, child_id: host_node.child_id }, index);

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ##########################################################
 *  Style Elements
 */
loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (index == -1)
                await processWickCSS_AST(node, component, presets, host_node.id, node.pos.source);
            else
                await processWickCSS_AST(node, component, presets, host_node.id);


            return null;
        }
    }, HTMLNodeType.HTML_STYLE
);


loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {


            if (component.local_component_names.has(node.tag)) {

                const
                    name = component.local_component_names.get(node.tag),
                    comp = presets.components.get(name);

                node.child_id = component.children.push(1) - 1;

                node.component = comp;

                if (comp) {

                    node.component_name = node.component.name;

                    //@ts-ignore
                    node.attributes.push({
                        type: HTMLNodeType.HTMLAttribute,
                        name: "expat",
                        value: ComponentHash(index + comp.name + name)
                    });

                }
                node.tag = "div";

                return node;
            }
        }

    }, HTMLNodeType.HTML_Element
);

//#############################################################
//#############################################################
//#############################################################
//#############################################################
//#############################################################
//#############################################################
//                          OLD
//#############################################################
//#############################################################
//#############################################################
//#############################################################
//#############################################################
//#############################################################


/**
 * Container Attributes
 */


/*
 * HTML Elements lacking a WHATWG HTML tag.
 */
loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {


            if (component.local_component_names.has(node.tag)) {

                const
                    name = component.local_component_names.get(node.tag),
                    comp = presets.components.get(name);

                node.child_id = component.children.push(1) - 1;

                node.component = comp;

                if (comp) {

                    node.component_name = node.component.name;

                    //@ts-ignore
                    node.attributes.push({
                        type: HTMLNodeType.HTMLAttribute,
                        name: "expat",
                        value: ComponentHash(index + comp.name + name)
                    });

                }
                node.tag = "div";
            }

            switch (node.tag.toLowerCase()) {

                case "container":

                    //Turn children into components if they are not already so.   
                    let ch = null;

                    const ctr: HTMLContainerNode = Object.assign(<HTMLContainerNode>{

                        IS_CONTAINER: true,

                        container_id: component.container_count,

                        components: [],

                        component_names: [],

                        component_attributes: []

                    }, node);

                    for (const n of ctr.nodes) {

                        ch = n;

                        if (!(n.type & HTMLNodeClass.HTML_ELEMENT)) { continue; }

                        const inherited_attributes = [], core_attributes = [];

                        //Check for useif attribute
                        for (const { name, value } of (n.attributes || [])) {

                            if (name == "useif") {

                                //create a useif binding for this object
                                addHook(component, {
                                    selector: HOOK_SELECTOR.CONTAINER_USE_IF,
                                    //@ts-ignore
                                    hook_value: value,
                                    host_node: ctr,
                                    html_element_index: index
                                });
                            } else if (name == "use-empty") {
                                addHook(component, {
                                    selector: HOOK_SELECTOR.CONTAINER_USE_EMPTY,
                                    //@ts-ignore
                                    hook_value: value,
                                    host_node: ctr,
                                    html_element_index: index
                                });
                            } else if (typeof value == "object") { } else
                                inherited_attributes.push([name, value]);
                        }

                        ctr.component_attributes.push(inherited_attributes);

                        let comp;

                        if (!Is_Tag_From_HTML_Spec(ch.tag) && component.local_component_names.has(ch.tag))
                            comp = presets.components.get(component.local_component_names.get(ch.tag));
                        else
                            comp = await parseComponentAST(Object.assign({}, ch), ch.pos.slice(), new URL("auto_generated"), presets, []);

                        ch.child_id = component.children.push(1) - 1;

                        ctr.components.push(comp);

                        ctr.component_names.push(comp?.name);

                        component.local_component_names.set(comp?.name, comp?.name);

                    }

                    component.container_count++;

                    // Remove all child nodes from container after they have 
                    // been processed
                    ctr.nodes.length = 0;

                    skip();

                    return ctr;

                case "mathml":
                    node.name_space = 2;
                    break;

                default:
                    //TODO Plugin here for custom components.  
                    break;
            }


            return node;
        }

    }, HTMLNodeType.HTML_Element
);
/*
loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            node.name_space = 1;

            return node;
        }
    }, HTMLNodeType.HTML_SVG
);
*/

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {


            const
                id = getAttributeValue("id", node),
                [script] = <JSNode[]><unknown>(node.nodes),
                src = getAttributeValue("src", node);

            /**
             * If source is present, then leave this node as is
             * and do not attempt to process the contents.
             * 
             * Additionally, remove contents if present.
             */
            if (src) {
                node.nodes.length = 0;
                return node;
            }

            if (id) {
                const fn_ast = stmt(`function ${id}(){;};`);

                fn_ast.nodes[2].nodes = <any>script.nodes;

                addBindingVariable(component.root_frame, id, node.pos, BINDING_VARIABLE_TYPE.METHOD_VARIABLE);

                await processFunctionDeclaration(fn_ast, component, presets);
            } else
                await processWickJS_AST(script, component, presets);

            return null;
        }

    }, HTMLNodeType.HTML_SCRIPT
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {
            const url = getAttributeValue("url", node) || "",
                name = getAttributeValue("name", node) || "";

            await importResource(url, component, presets, node, name, [{ local: name, external: name }], component.root_frame);

            return null;
        }

    }, HTMLNodeType.HTML_IMPORT
);

async function processBindingNode(attrib: any, component: ComponentData, presets: PresetOptions, index: number) {
    if (attrib.value.primary_ast)
        attrib.value.primary_ast =
            await processNodeAsync(attrib.value.primary_ast, component.root_frame, component, presets);

    if (attrib.value.secondary_ast)
        attrib.value.secondary_ast =
            await processNodeAsync(attrib.value.secondary_ast, component.root_frame, component, presets);

    addHook(component, {
        selector: attrib.name,
        hook_value: attrib.value,
        host_node: attrib,
        html_element_index: index
    });
}

function getAttributeValue(name, node: HTMLNode) {
    for (const att of node.attributes) {
        if (att.name == name)
            return att.value;
    }
}
