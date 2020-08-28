import Presets from "../presets.js";
import { ComponentData } from "../types/types.js";
import { DOMLiteral } from "../types/dom_literal.js";
import { rt } from "../runtime/runtime_global.js";

const enum htmlState {
    IS_ROOT = 1,
    EXTERNAL_COMPONENT = 2,
    IS_COMPONENT = 4,
    IS_SLOT_REPLACEMENT = 8
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
export function componentDataToHTML(
    comp: ComponentData,
    presets: Presets = rt.presets,
    template_map = new Map,
    html: DOMLiteral = comp.HTML,
    state: htmlState = htmlState.IS_ROOT,
    extern_children: DOMLiteral[] = [],
    parent_component = null
): { html: string, template_map: Map<string, string>; } {

    let str = "";

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
            component_names,
            slot_name: slot_name
        }: DOMLiteral = html,
            // Unshare the children array
            children = c.slice();

        if (ct) {
            const comp = presets.components.get(component_names[0]);

            console.log(html);

            if (!template_map.has(comp.name))
                template_map.set(comp.name, `<template id="${comp.name}">${componentDataToHTML(comp, presets, template_map).html}</template>`);
            //create template for the component. 

            str += `<${tag_name.toLowerCase()}${attributes.map(([n, v]) => ` "${n}"="${v}"`).join("")} w-container="${comp.name}">`;


        } else if (component_name && presets.components.has(component_name)) {

            const c_comp = presets.components.get(component_name);

            return componentDataToHTML(c_comp, presets, template_map, c_comp.html, htmlState.IS_COMPONENT | state, children, comp);

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
                    return componentDataToHTML(parent_component, presets, template_map, child, htmlState.IS_SLOT_REPLACEMENT);
            }

            const IS_COMPONENT_ROOT_ELEMENT = comp.HTML == html;
            let HAVE_CLASS: boolean = false;

            str += `<${
                tag_name.toLowerCase()
                }${
                state & htmlState.EXTERNAL_COMPONENT ? ` w-o=${i}` : ""
                }${
                state & htmlState.IS_SLOT_REPLACEMENT ? ` w-r=${i}` : ""
                }${
                state & htmlState.IS_ROOT ? " id=\"app\" " : ""
                }${
                attributes.map(([n, v]) => (n.toLowerCase() == "class")
                    ? ` class="${IS_COMPONENT_ROOT_ELEMENT ? (HAVE_CLASS = true, comp.name + " ") : ""}${v}"`
                    : ` ${n}="${v}"`).join("")
                }${
                IS_COMPONENT_ROOT_ELEMENT ? ` w-s ${!HAVE_CLASS ? `class="${comp.name}"` : ""}` : ""
                }>`;

        } else if (IS_BINDING)
            str += `<w-b>${(data || "") + ""}</w-b>`;
        else
            str += data;

        for (const child of children)
            str += componentDataToHTML(comp, presets, template_map, child, 0, extern_children, parent_component).html;

        if (state & htmlState.IS_COMPONENT)
            for (const child of extern_children)
                str += componentDataToHTML(parent_component, presets, template_map, child, htmlState.EXTERNAL_COMPONENT).html;

        if (tag_name)
            str += `</${tag_name.toLowerCase()}>`;
    }

    return { html: str, template_map };
}