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
    IS_SLOT_REPLACEMENT = 8,
    IS_INTERLEAVED = 16
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
    html: DOMLiteral = comp.HTML,
    state: htmlState = htmlState.IS_ROOT | htmlState.IS_COMPONENT,
    extern_children: [number, DOMLiteral][] = [],
    parent_component = null,
    comp_data = [comp.name]
): { html: TempHTMLNode, template_map: Map<string, TempHTMLNode>; } {

    let node: TempHTMLNode = {
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
                        children: [componentDataToTempAST(comp, on_ele_hook, presets, template_map).html]
                    });
            }

            node.tag = tag_name.toLowerCase();

            node.attributes.set("w:ctr", w_ctr);

            node.attributes.set("w:ctr-atr", w_ctr_atr);

            for (const [key, val] of attributes)
                node.attributes.set(key, val);

        } else if (component_name && presets.components.has(component_name)) {

            const c_comp = presets.components.get(component_name);

            ({ html: node } = componentDataToTempAST(
                c_comp,
                on_ele_hook,
                presets,
                template_map,
                c_comp.HTML,
                htmlState.IS_COMPONENT | (((state & htmlState.IS_COMPONENT) > 0) ? htmlState.IS_INTERLEAVED : 0),
                extern_children.concat(children.map(c => [comp_data.length - 1, c])),
                comp,
                [...comp_data, c_comp.name]
            ));

            if ((state & htmlState.IS_INTERLEAVED) > 0)
                node.attributes.set("w:own", comp_data.indexOf(comp.name));



        } else if (tag_name) {

            if (tag_name == "SLOT" && extern_children.length > 0) {

                let child = null;

                for (let i = 0; i < extern_children.length; i++) {

                    const [j, c] = extern_children[i];

                    if (c.slot_name == slot_name && !c.USED) {
                        c.USED = true;
                        c.UU = j;
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
                        child,
                        htmlState.IS_SLOT_REPLACEMENT,
                    );
            }

            const IS_COMPONENT_ROOT_ELEMENT = comp.HTML == html;
            let HAVE_CLASS: boolean = false;

            node.tag = tag_name.toLocaleLowerCase();

            if (state & htmlState.IS_SLOT_REPLACEMENT)
                node.attributes.set("w:r", html.UU * 50 + html.lookup_index);

            for (const [key, val] of attributes)
                if (key.toLocaleLowerCase() == "class") {
                    HAVE_CLASS = IS_COMPONENT_ROOT_ELEMENT || HAVE_CLASS;
                    const class_names = (IS_COMPONENT_ROOT_ELEMENT
                        ? ((state & htmlState.IS_INTERLEAVED) > 0)
                            ? comp_data.join(" ")
                            : comp_data[comp_data.length - 1]
                        : "");
                    node.attributes.set("class", class_names + ` ${val}`);
                } else
                    node.attributes.set(key, val);

            if (IS_COMPONENT_ROOT_ELEMENT) {
                node.attributes.set("w:c", "");
                if (!HAVE_CLASS) {
                    const class_names = (IS_COMPONENT_ROOT_ELEMENT
                        ? ((state & htmlState.IS_INTERLEAVED) > 0)
                            ? comp_data.join(" ")
                            : comp_data[comp_data.length - 1]
                        : "");
                    node.attributes.set("class", class_names);
                }
            }

            if ((state & htmlState.IS_INTERLEAVED) > 0)
                node.attributes.set("w:own", comp_data.indexOf(comp.name));

        } else if (IS_BINDING) {
            if ((state & htmlState.IS_INTERLEAVED) > 0)
                node.attributes.set("w:own", comp_data.indexOf(comp.name));
            node.tag = "w-b";
            node.data = data || "";
        } else {
            node.data = data;
        }

        console.log({ children });


        //console.log("" + state, (state & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT)) == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT));

        for (const child of children.filter(n => !n.USED))
            node.children.push(componentDataToTempAST(
                comp,
                on_ele_hook,
                presets,
                template_map,
                child,
                (((state) & (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT)) == (htmlState.IS_INTERLEAVED | htmlState.IS_COMPONENT)) ? htmlState.IS_INTERLEAVED : 0,
                extern_children,
                parent_component,
                comp_data
            ).html);
    }

    return { html: node, template_map };
}