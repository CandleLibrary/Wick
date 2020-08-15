import { traverse } from "@candlefw/conflagrate";
import { JSNode, stmt, JSNodeType } from "@candlefw/js";

import {
    WICK_AST_NODE_TYPE_SIZE,
    WICK_AST_NODE_TYPE_BASE,
    HTMLNode,
    HTMLNodeClass,
    HTMLContainerNode,
    HTMLNodeType,
    WickBindingNode
} from "../types/wick_ast_node_types.js";
import { HTMLHandler } from "../types/html_handler.js";
import { processWickCSS_AST } from "./component_css.js";
import { compileComponent } from "./component.js";
import { processFunctionDeclaration, processWickJS_AST } from "./component_js.js";
import { importResource } from "./component_common.js";
import { addBindingVariable, addWrittenBindingVariableName } from "./component_binding_common.js";
import { VARIABLE_REFERENCE_TYPE, DATA_FLOW_FLAG } from "../types/types.js";
import { global_object } from "../runtime/runtime_global.js";
import { BINDING_SELECTOR } from "../types/binding.js";

const default_handler = {
    priority: -Infinity,
    prepareHTMLNode(node) { return node; }
};

const standard_tag_set = new Set([
    "A", "ABBR", "ACRONYM", "ADDRESS", "AREA",
    "B", "BASE", "BDO", "BIG", "BLOCKQUOTE", "BODY", "BR", "BUTTON",
    "CAPTION", "CITE", "CODE", "COL", "COLGROUP",
    "DD", "DEL", "DFN", "DIV", "DL", "DT",
    "EM",
    "FIELDSET", "FORM",
    "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HR", "HTML",
    "I", "IMG", "IMPORT", "INPUT", "INS",
    "KBD",
    "LABEL", "LEGEND", "LI", "LINK",
    "MAP", "META",
    "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION",
    "P", "PARAM", "PRE",
    "Q",
    "SAMP", "SCRIPT", "SELECT", "SMALL", "SPAN", "STRONG", "STYLE", "SUP", "SVG",
    "TABLE", "TBODY", "TD", "TEXT", "TEXTAREA", "TFOOT", "TH", "THEAD", "TITLE", "TR", "TT",
    "UL",
    "VAR",
]);

function isPredefinedTag(val: string): boolean { return standard_tag_set.has(val.toUpperCase()); }

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

loadHTMLHandlerInternal(
    {
        priority: 1,

        prepareHTMLNode(node: WickBindingNode, host_node, host_element, index, skip, replace, component, presets) {

            component.addBinding({
                binding_selector: "",
                binding_val: node,
                host_node: host_node,
                html_element_index: index + 1,
                pos: node.pos
            });

            for (const { node: n } of traverse(node.primary_ast, "nodes")) {
                if (n.type == JSNodeType.IdentifierReference) {

                    const { value: name } = n;

                    if (global_object[name]) continue;

                    addBindingVariable({
                        pos: n.pos,
                        internal_name: <string>name,
                        external_name: <string>name,
                        class_index: -1,
                        type: VARIABLE_REFERENCE_TYPE.MODEL_VARIABLE,
                        flags: DATA_FLOW_FLAG.FROM_MODEL
                    }, component.root_frame);

                    addWrittenBindingVariableName(<string>name, component.root_frame);
                }
            }

            // Skip processing this node in the outer scope, 
            // it will be replaced with a CompiledBinding node.

            return <HTMLNode>{
                type: HTMLNodeType.HTML_BINDING_ELEMENT,
                IS_BINDING: true,
                value: "",
                pos: node.pos
            };
        }
    }, HTMLNodeType.WickBinding
);

/*
 *  █████  ████████ ████████ ██████  ██ ██████  ██    ██ ████████ ███████ ███████ 
 * ██   ██    ██       ██    ██   ██ ██ ██   ██ ██    ██    ██    ██      ██      
 * ███████    ██       ██    ██████  ██ ██████  ██    ██    ██    █████   ███████ 
 * ██   ██    ██       ██    ██   ██ ██ ██   ██ ██    ██    ██    ██           ██ 
 * ██   ██    ██       ██    ██   ██ ██ ██████   ██████     ██    ███████ ███████ 
 */
//Slot Name
loadHTMLHandlerInternal(
    {
        priority: -2,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {
            switch (node.name) {


                case "id":
                    break;

                case "slot":
                    host_node.slot_name = <string>node.value;
                    return null;

                case "name":
                    host_node.slot_name = <string>node.value;
                    return null;

                case "value":

                    if (<HTMLNode><unknown>node.IS_BINDING) {
                        component.addBinding({
                            binding_selector: BINDING_SELECTOR.IMPORT_VALUE,
                            //@ts-ignore
                            binding_val: node.value,
                            host_node: node,
                            html_element_index: index,
                            pos: node.pos
                        });

                        return null;
                    }
                    break;
            }

            return;
        }
    }, HTMLNodeType.HTMLAttribute
);





loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

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

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            if (node.name == "import" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ extern: v[0], local: v[1] || v[0] }));


                for (const { local, extern } of obj) {
                    component.addBinding({
                        binding_selector: BINDING_SELECTOR.IMPORT_FROM_CHILD,
                        binding_val: {
                            local,
                            extern,
                        },
                        host_node,
                        html_element_index: index + 1,
                        pos: node.pos
                    });
                }

                return null;
            } else if (node.name == "export" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ local: v[0], extern: v[1] || v[0] }));


                for (const { local, extern } of obj) {
                    component.addBinding({
                        binding_selector: BINDING_SELECTOR.EXPORT_TO_CHILD,
                        binding_val: {
                            local,
                            extern,
                        },
                        host_node,
                        html_element_index: index + 1,
                        pos: node.pos
                    });
                }

                return null;
            }
        }
    }, HTMLNodeType.HTMLAttribute
);

loadHTMLHandlerInternal(
    {
        priority: -4,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            const attrib = <any>node;

            if (attrib.IS_BINDING) {

                component.addBinding({
                    binding_selector: attrib.name,
                    binding_val: attrib.value,
                    host_node: attrib,
                    html_element_index: index,
                    pos: node.pos
                });

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

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {


            if (component.local_component_names.has(node.tag)) {

                const
                    name = component.local_component_names.get(node.tag),
                    comp = presets.components.get(name);

                node.child_id = component.children.push(1) - 1;

                node.component = comp;

                node.component_name = node.component.name;

                node.tag = "div";
            }

            /*********************************************
             *  ██████  ██████  ███    ██ ████████  █████  ██ ███    ██ ███████ ██████  
             * ██      ██    ██ ████   ██    ██    ██   ██ ██ ████   ██ ██      ██   ██ 
             * ██      ██    ██ ██ ██  ██    ██    ███████ ██ ██ ██  ██ █████   ██████  
             * ██      ██    ██ ██  ██ ██    ██    ██   ██ ██ ██  ██ ██ ██      ██   ██ 
             *  ██████  ██████  ██   ████    ██    ██   ██ ██ ██   ████ ███████ ██   ██ 
             */


            switch (node.tag.toLowerCase()) {
                case "container":
                    //Turn children into components if they are not already so.   
                    let ch = null;

                    const ctr: HTMLContainerNode = <HTMLContainerNode>Object.assign({

                        components: [],

                        component_names: [],

                        component_attributes: []

                    }, node);


                    let i = 0;

                    for (const n of ctr.nodes) {

                        ch = n;

                        if (!(n.type & HTMLNodeClass.HTML_ELEMENT)) { continue; }

                        const other_attributes = [];

                        //Check for useif attribute
                        for (const { name, value } of (n.attributes || [])) {

                            if (name == "useif") {
                                //create a useif binding for this object
                                component.addBinding({
                                    binding_selector: BINDING_SELECTOR.CONTAINER_USE_IF,
                                    //@ts-ignore
                                    binding_val: value,
                                    host_node: ctr,
                                    html_element_index: index,
                                    pos: node.pos
                                });
                            } else
                                other_attributes.push([name, value]);
                        }

                        ctr.component_attributes.push(other_attributes);

                        if (!isPredefinedTag(ch.tag) && component.local_component_names.has(ch.tag)) {

                            const
                                name = component.local_component_names.get(ch.tag),
                                comp = presets.components.get(name);

                            //Make sure the component is compiled into a class.
                            // componentDataToClass(comp, presets);

                            ch.child_id = component.children.push(1) - 1;

                            ctr.components.push(comp);

                            ctr.component_names.push(comp.name);

                        } else {
                            const comp = await compileComponent(Object.assign({}, ch, { attributes: [] }), ch.pos.slice(), "auto_generated", presets, []);

                            ctr.components.push(comp);

                            ctr.component_names.push(comp.name);

                            component.local_component_names.set(comp.name, comp.name);

                        }
                    }

                    ctr.is_container = true;

                    ctr.container_id = component.container_count++;

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

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            node.name_space = 1;

            return node;
        }
    }, HTMLNodeType.HTML_SVG
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            await processWickCSS_AST(node, component, presets);

            return null;
        }
    }, HTMLNodeType.HTML_STYLE
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {


            const id = getAttributeValue("id", node),
                [script] = <JSNode[]><unknown>(node.nodes);

            if (id) {
                const fn_ast = stmt(`function ${id}(){;};`);
                fn_ast.nodes[2].nodes = script.nodes;

                addBindingVariable({
                    pos: node.pos,
                    class_index: -1,
                    external_name: id,
                    internal_name: id,
                    flags: 0,
                    type: VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE
                }, component.root_frame);

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

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {
            const url = getAttributeValue("url", node) || "",
                name = getAttributeValue("name", node) || "";

            await importResource(url, component, presets, node, name, [{ local: name, external: name }], component.root_frame);

            return null;
        }

    }, HTMLNodeType.HTML_IMPORT
);

function getAttributeValue(name, node: HTMLNode) {
    for (const att of node.attributes) {
        if (att.name == name)
            return att.value;
    }
}
