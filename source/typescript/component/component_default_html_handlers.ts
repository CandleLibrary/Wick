import { WickASTNodeType, WICK_AST_NODE_TYPE_SIZE, WICK_AST_NODE_TYPE_BASE, WickASTNode, WickASTNodeClass } from "../types/wick_ast_node_types.js";
import { HTMLHandler } from "../types/html_handler.js";
import { processWickCSS_AST } from "./component_css.js";
import { compileComponent } from "./component.js";
import { processFunctionDeclaration, processWickJS_AST } from "./component_js.js";
import { MinTreeNode, stmt } from "@candlefw/js";
import { setComponentVariable, VARIABLE_REFERENCE_TYPE } from "./component_set_component_variable.js";
import { importResource } from "./component_common.js";

const default_handler = {
    priority: -Infinity,
    prepareHTMLNode(node) { return node; }
};

export const html_handlers: Array<HTMLHandler[]> = Array(WICK_AST_NODE_TYPE_SIZE).fill(null).map(() => [default_handler]);

function loadHTMLHandlerInternal(handler: HTMLHandler, ...types: WickASTNodeType[]) {

    for (const type of types) {

        const handler_array = html_handlers[Math.max((type >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadHTMLHandler(handler: HTMLHandler, ...types: WickASTNodeType[]) {

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

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            component.addBinding({
                attribute_name: "",
                binding_node: node,
                host_node: host_node,
                html_element_index: index + 1
            });

            // Skip processing this node in the outer scope, 
            // it will be replaced with a CompiledBinding node.

            return <WickASTNode>{
                type: WickASTNodeType.HTML_BINDING_ELEMENT,
                IS_BINDING: true,
                value: "",
                pos: node.pos
            };
        }
    }, WickASTNodeType.WickBinding
);

/*
 * HTML Attribute nodes
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
                    break;

                case "name":
                    host_node.slot_name = <string>node.value;
                    return null;
                    break;

                case "value":
                    if (node.value.type == WickASTNodeType.WickBinding) {

                        component.addBinding({
                            attribute_name: "input_value",
                            binding_node: node.value,
                            host_node: node,
                            html_element_index: index
                        });

                        return null;
                    }
                    break;
            }

            return;
        }
    }, WickASTNodeType.HTMLAttribute
);





loadHTMLHandlerInternal(
    {
        priority: 10,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            if (node.name == "component") {

                const component_name = <string>(<WickASTNode>node).value;

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
    }, WickASTNodeType.HTMLAttribute
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
                        attribute_name: "import_from_child",
                        binding_node: {
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
    }, WickASTNodeType.HTMLAttribute
);

loadHTMLHandlerInternal(
    {
        priority: -4,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            if (node.name == "export" && node.value) {

                const
                    obj = node.value.split(",").map(v => v.split(":").map(s => s.trim())).map(v => ({ local: v[0], extern: v[1] || v[0] }));


                for (const { local, extern } of obj) {
                    component.addBinding({
                        attribute_name: "export_to_child",
                        binding_node: {
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
    }, WickASTNodeType.HTMLAttribute
);


loadHTMLHandlerInternal(
    {
        priority: -4,

        prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            const attrib = <any>node;

            if (attrib.IS_BINDING) {

                component.addBinding({
                    attribute_name: attrib.name,
                    binding_node: attrib.value,
                    host_node: attrib,
                    html_element_index: index
                });

                return null;
            }
        }
    }, WickASTNodeType.HTMLAttribute
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

            switch (node.tag.toLowerCase()) {
                case "container":
                    //Turn child into script.   
                    let ch = null;

                    for (const n of node.nodes)
                        if ((n.type & WickASTNodeClass.HTML_ELEMENT)) { ch = n; break; }

                    if (ch) {

                        if (ch && component.local_component_names.has(ch.tag)) {

                            const
                                name = component.local_component_names.get(ch.tag),
                                comp = presets.components.get(name);

                            //Make sure the component is compiled into a class.
                            // componentDataToClass(comp, presets);

                            ch.child_id = component.children.push(1) - 1;

                            node.component = comp;

                            node.component_name = comp.name;

                        } else {

                            const comp = await compileComponent(Object.assign({}, ch, { attributes: [] }), ch.tag, "auto_generated", presets);

                            node.component = comp;

                            node.component_name = comp.name;

                            component.local_component_names.set(comp.name, comp.name);

                        }
                    } else return;

                    node.is_container = true;

                    node.container_id = component.container_count++;

                    node.nodes.length = 0;

                    skip();

                    break;
                case "svg":
                    node.name_space = 1;
                    break;
                case "mathml":
                    node.name_space = 2;
                    break;
                default:
                    //TODO Plugin here for custom components.  
                    break;
            }


            return node;
        }

    }, WickASTNodeType.HTML_Element
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            await processWickCSS_AST(node, component, presets);

            return null;
        }
    }, WickASTNodeType.HTML_STYLE
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {

            const id = getAttributeValue("id", node),
                [script] = <MinTreeNode[]><unknown>(node.nodes);

            if (id) {
                const fn_ast = stmt(`function ${id}(){;};`);
                fn_ast.nodes[2].nodes = script.nodes;
                setComponentVariable(VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE, id, component, "", 0, node);
                await processFunctionDeclaration(fn_ast, component, presets);
            } else {
                await processWickJS_AST(script, component, presets);
            }

            return null;
        }

    }, WickASTNodeType.HTML_SCRIPT
);

loadHTMLHandlerInternal(
    {
        priority: -99999,

        async prepareHTMLNode(node, host_node, host_element, index, skip, replace, component, presets) {
            const url = getAttributeValue("url", node) || "",
                name = getAttributeValue("name", node) || "";

            await importResource(url, component, presets, node, name);

            return null;
        }

    }, WickASTNodeType.HTML_IMPORT
);

function getAttributeValue(name, node: WickASTNode) {
    for (const att of node.attributes) {
        if (att.name == name)
            return att.value;
    }
}
