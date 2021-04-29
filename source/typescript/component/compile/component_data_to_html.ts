import { bidirectionalTraverse } from "@candlefw/conflagrate";
import Presets from "../../presets.js";
import { noop } from "../../render/noop.js";
import { rt } from "../../runtime/runtime_global.js";
import { ComponentData } from "../../types/component_data";
import { ContainerDomLiteral, DOMLiteral } from "../../types/dom_literal.js";

const enum htmlState {
    IS_ROOT = 1,
    EXTERNAL_COMPONENT = 2,
    IS_COMPONENT = 4,
    IS_SLOT_REPLACEMENT = 8
}

interface TempHTMLNode {
    tag: string,
    data: string,
    attributes: Map<string, string>;
    children: TempHTMLNode[];
    strings: string[];
}
/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 */
export function componentDataToHTML(
    comp: ComponentData,
    on_ele_hook: (arg: DOMLiteral) => DOMLiteral | null | undefined = noop,
    presets: Presets = rt.presets
): { html: string, template_map: Map<string, string>; } {

    const { html, template_map } = componentDataToTempAST(comp, on_ele_hook, presets);

    let string = "";

    for (const { node, meta: { depth, parent } } of bidirectionalTraverse(html, "children", true)) {

        string = "";

        if (node.tag) {
            string += `<${node.tag}`;

            for (const [key, val] of node.attributes.entries())
                if (val === "")
                    string += ` ${key}`;
                else
                    string += ` ${key}="${val}"`;

            if (node.children.length > 0) {
                string += ">\n";
                string += node.strings.join("\n");
                string += `</${node.tag}>`;
            } else
                string += "/>";

        } else {
            string += node.data;
        }

        if (parent)
            parent.strings.push(string);

    };

    return { html: string, template_map: template_map };
}


/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 * @param template_map 
 * @param html 
 * @param root 
 */
function componentDataToTempAST(
    comp: ComponentData,
    on_ele_hook: (arg: DOMLiteral) => DOMLiteral | null | undefined = noop,
    presets: Presets = rt.presets,
    template_map = new Map,
    depth = 0,
    html: DOMLiteral = comp.HTML,
    state: htmlState = htmlState.IS_ROOT,
    extern_children: DOMLiteral[] = [],
    parent_component = null,
    comp_data = [comp.name]
): { html: TempHTMLNode, template_map: Map<string, TempHTMLNode>; } {

    const node: TempHTMLNode = {
        attributes: new Map,
        children: [],
        strings: [],
        data: "",
        tag: ""
    };

    if (html)
        html = on_ele_hook(html);

    if (html) {
        //Convert html to string 
        const {
            tag_name: tag_name = "",
            attributes: attributes = [],
            children: c = [],
            data: data,
            lookup_index: i,
            is_container: ct,
            is_bindings: IS_BINDING,
            component_name: component_name,
            slot_name: slot_name
        }: DOMLiteral = html,
            children = c.slice();

        if (ct) {

            const {
                component_attribs,
                component_names
            } = <ContainerDomLiteral>html,
                w_ctr = component_names.join(" "),
                w_ctr_atr = component_attribs.map(s => s.map(a => a.join(("=").replace(/\"/g, ""))).join(";")).join(":");

            for (const name of component_names) {

                const comp = presets.components.get(name);

                if (!template_map.has(comp.name))
                    template_map.set(comp.name, {
                        tag: "template",
                        data: "",
                        strings: [],
                        attributes: new Map([["w:c", ""], ["id", comp.name]]),
                        children: [componentDataToTempAST(comp,
                            on_ele_hook, presets, template_map, depth).html]
                    });
            }

            node.tag = tag_name.toLowerCase();

            node.attributes.set("w:ctr", w_ctr);

            node.attributes.set("w:ctr-atr", w_ctr_atr);

            for (const [key, val] of attributes)
                node.attributes.set(key, val);

        } else if (component_name && presets.components.has(component_name)) {

            const c_comp = presets.components.get(component_name),
                { html } = componentDataToTempAST(
                    c_comp,
                    on_ele_hook,
                    presets,
                    template_map,
                    0,
                    c_comp.HTML,
                    htmlState.IS_COMPONENT | state,
                    children,
                    comp,
                    depth == 0 ? [...comp_data, c_comp.name] : [c_comp.name]
                );

            if (comp_data.length > 1)
                html.attributes.set("w:own", comp_data.indexOf(comp.name));

            return { html, template_map };

        } else if (tag_name) {

            if (tag_name == "SLOT" && extern_children.length > 0) {

                let child = null;

                for (let i = 0; i < extern_children.length; i++) {

                    const c = extern_children[i];

                    if (c.slot_name == slot_name) {
                        extern_children.splice(i, 1);
                        child = c;
                        break;
                    }
                }

                if (child)
                    return componentDataToTempAST(
                        parent_component,
                        on_ele_hook,
                        presets,
                        template_map,
                        depth + 1,
                        child,
                        htmlState.IS_SLOT_REPLACEMENT,
                    );
            }

            const IS_COMPONENT_ROOT_ELEMENT = comp.HTML == html;
            let HAVE_CLASS: boolean = false;

            node.tag = tag_name.toLocaleLowerCase();

            /**
             * str += "\n"
                + prepend
                + `<${tag_name.toLowerCase()
                }${state & htmlState.EXTERNAL_COMPONENT ? ` w:o=${i}` : ""
                }${state & htmlState.IS_SLOT_REPLACEMENT ? ` w:r=${i}` : ""
                }${(attributes.length > 0 && " " || "") + attributes.map(([n, v]) => (n.toLowerCase() == "class")
                    ? ` class="${IS_COMPONENT_ROOT_ELEMENT ? (HAVE_CLASS = true, comp.name + " ") : ""}${v}"`
                    : ` ${n}="${v}"`).join("")
                }${IS_COMPONENT_ROOT_ELEMENT ? ` w:c ${!HAVE_CLASS ? `class="${comp.name}"` : ""}` : ""
                }>`;
             */

            if (state & htmlState.IS_SLOT_REPLACEMENT)
                node.attributes.set("w:r", i + "");
            for (const [key, val] of attributes)
                if (key.toLocaleLowerCase() == "class") {
                    HAVE_CLASS = IS_COMPONENT_ROOT_ELEMENT || HAVE_CLASS;
                    node.attributes.set("class", (IS_COMPONENT_ROOT_ELEMENT ? comp_data.join(" ") : "") + ` ${val}`);
                }
                else
                    node.attributes.set(key, val);
            if (IS_COMPONENT_ROOT_ELEMENT) {
                node.attributes.set("w:c", "");
                if (!HAVE_CLASS)
                    node.attributes.set("class", (IS_COMPONENT_ROOT_ELEMENT ? comp_data.join(" ") : ""));
            }

            if (comp_data.length > 1)
                node.attributes.set("w:own", comp_data.indexOf(comp.name));

        } else if (IS_BINDING) {
            if (comp_data.length > 1)
                node.attributes.set("w:own", comp_data.indexOf(comp.name));
            node.tag = "w-b";
            node.data = data || "";
        }
        else {
            node.data = data;
        }

        for (const child of children)
            node.children.push(componentDataToTempAST(
                comp,
                on_ele_hook,
                presets,
                template_map,
                depth + 1,
                child,
                0,
                extern_children,
                parent_component,
                comp_data
            ).html);

        if (state & htmlState.IS_COMPONENT)
            for (const child of extern_children)
                node.children.push(componentDataToTempAST(
                    parent_component,
                    on_ele_hook,
                    presets,
                    template_map,
                    depth + 1,
                    child,
                    htmlState.EXTERNAL_COMPONENT,
                    undefined,
                    undefined,
                    comp_data
                ).html);
    }

    return { html: node, template_map };
}