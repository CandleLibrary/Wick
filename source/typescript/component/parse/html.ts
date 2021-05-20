import { traverse } from "@candlefw/conflagrate";
import { JSNode, JSNodeType, stmt } from "@candlefw/js";
import URL from "@candlefw/url";
import { ComponentData, Presets } from "source/typescript/wick.js";
import { addBindingReference, addBindingVariable, addHook } from "../../common/binding.js";
import { importResource } from "../../common/common.js";
import { Is_Tag_From_HTML_Spec } from "../../common/html.js";
import { BINDING_VARIABLE_TYPE } from "../../types/binding.js";
import { HOOK_SELECTOR } from "../../types/hook";
import { HTMLHandler } from "../../types/html";
import {
    HTMLContainerNode, HTMLNode,
    HTMLNodeClass,
    HTMLNodeType,
    WickBindingNode, WICK_AST_NODE_TYPE_BASE, WICK_AST_NODE_TYPE_SIZE
} from "../../types/wick_ast.js";
import { processFunctionDeclaration, processNodeAsync, processWickCSS_AST, processWickJS_AST } from "./parse.js";
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

const process_wick_binding = {
    priority: 1,

    prepareHTMLNode(node: WickBindingNode, host_node, host_element, index, skip, component, presets) {

        addHook(component, {
            selector: "",
            hook_value: node,
            host_node: host_node,
            html_element_index: index + 1
        });

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
};

loadHTMLHandlerInternal(process_wick_binding, HTMLNodeType.WickBinding);

// HEAD ELEMENT CONTENTS GET APPENDED TO THE HEAD SLOT ON A COMPONENT

/*[API] ##########################################################
 * 
 * HTMLAttribute Handler
 * 
 * One of six default handlers that parses tag attributes. 
 */
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {
            component.HTML_HEAD.push(...node.nodes);
            return null;
        }
    }, HTMLNodeType.HTML_HEAD
);


/** ##########################################################
 * ATTRIBUTE BINDING
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

/** ##############################################################################
 * Input Value Attribute
 */
loadHTMLHandlerInternal(
    {
        priority: -2,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {
            if (
                node.name == "value"
                &&
                <HTMLNode><unknown>node.IS_BINDING
                &&
                host_node.type == HTMLNodeType.HTML_INPUT
            ) {
                const l = component.hooks.length;
                await processBindingNode(node, component, presets, index);
                component.hooks.length = l;

                addHook(component, {
                    selector: HOOK_SELECTOR.INPUT_VALUE,
                    //@ts-ignore
                    hook_value: node.value,
                    host_node: node,
                    html_element_index: index
                });

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

/** ##############################################################################
 * Slot Attributes
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

/**[API] ##########################################################
 * 
 * HTMLAttribute Handler
 * 
 * One of six default handlers that parses tag attributes. 
 */
loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "component") {

                const component_name = <string>(<HTMLNode>node).value;

                component.names.push(component_name);

                // No need to save this wick specific attribute, return [undefined]. 
                return null;
            }

            if (node.name == "element") {

                host_node.tag = node.value;

                return;
            }

            if (host_node.tag.toLowerCase() == "container") {
                if (node.name == "data"
                    || node.name == "filter"
                    || node.name == "sort"
                    || node.name == "shift"
                    || node.name == "offset"
                    || node.name == "limit"
                    || node.name == "scrub"
                ) {

                    node.container_id = host_node.container_id;

                    return;
                }
            }

            return;
        }
    }, HTMLNodeType.HTMLAttribute
);


loadHTMLHandlerInternal(
    {
        priority: -4,

        prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (node.name == "import" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ extern: v[0], local: v[1] || v[0] }));


                for (const { local, extern } of obj) {
                    addHook(component, {
                        selector: HOOK_SELECTOR.IMPORT_FROM_CHILD,
                        hook_value: {
                            local,
                            extern,
                        },
                        host_node,
                        html_element_index: index + 1
                    });
                }

                return null;
            } else if (node.name == "export" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ local: v[0], extern: v[1] || v[0] }));


                for (const { local, extern } of obj) {
                    addHook(component, {
                        selector: HOOK_SELECTOR.EXPORT_TO_CHILD,
                        hook_value: {
                            local,
                            extern,
                        },
                        host_node,
                        html_element_index: index + 1
                    });
                }

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);
/*
 * HTML Elements lacking a spec tag.
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

                if (comp)

                    node.component_name = node.component.name;

                node.tag = "div";
            }

            switch (node.tag.toLowerCase()) {

                /*  ******  ******  ***    ** ********  *****  ** ***    ** ******* ******
                 *  ██████  ██████  ███    ██ ████████  █████  ██ ███    ██ ███████ ██████  
                 * ██      ██    ██ ████   ██    ██    ██   ██ ██ ████   ██ ██      ██   ██ 
                 * ██      ██    ██ ██ ██  ██    ██    ███████ ██ ██ ██  ██ █████   ██████  
                 * ██      ██    ██ ██  ██ ██    ██    ██   ██ ██ ██  ██ ██ ██      ██   ██ 
                 *  ██████  ██████  ██   ████    ██    ██   ██ ██ ██   ████ ███████ ██   ██
                 *  ******  ******  **   ****    **    **   ** ** **   **** ******* **   **
                 */

                case "container":

                    //Turn children into components if they are not already so.   
                    let ch = null;

                    const ctr: HTMLContainerNode = <HTMLContainerNode>Object.assign({

                        is_container: true,

                        mango: "as",

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

                            if (name == "use-if") {
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

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            node.name_space = 1;

            return node;
        }
    }, HTMLNodeType.HTML_SVG
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, component, presets) {

            if (index == -1)
                await processWickCSS_AST(node, component, presets, node.pos.source);
            else
                await processWickCSS_AST(node, component, presets);


            return null;
        }
    }, HTMLNodeType.HTML_STYLE
);

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

                fn_ast.nodes[2].nodes = script.nodes;

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

async function processBindingNode(attrib: any, component: ComponentData, presets: Presets, index: number) {
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
