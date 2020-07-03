import Presets from "../presets.js";
import { Component } from "../types/types.js";
import { DOMLiteral } from "../types/dom_literal.js";

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
export function componentDataToHTML(comp: Component, presets: Presets, template_map = new Map, html = comp.HTML, root = true): { html: string, template_map: Map<string, string>; } {

    let str = "";

    if (html) {
        //Convert html to string 

        const {
            t: tag_name = "",
            a: attributes = [],
            c: children = [],
            d: data,
            i,
            ct,
            b: IS_BINDING,
            cp: component_name,
            sl: slot_name
        }: DOMLiteral = html;

        if (ct) {
            const
                comp = presets.components.get(component_name);

            if (!template_map.has(comp.name))
                template_map.set(comp.name, `<template id="${comp.name}">${componentDataToHTML(comp, presets, template_map)}</template>`);
            //create template for the component. 

            str += `<${tag_name.toLowerCase()} i=${i} ${attributes.map(([n, v]) => `"${n}"="${v}"`).join(" ")} w-container="${comp.name}">`;


        } else if (component_name && presets.components.has(component_name)) {

            const comp = presets.components.get(component_name);

            return componentDataToHTML(comp, presets, template_map, undefined, false);

        } else if (tag_name)
            str += `<${tag_name.toLowerCase()} i=${i} ${root ? "id=\"app\" " : ""}${attributes.map(([n, v]) => `${n}="${v}"`).join(" ")} ${comp.HTML == html ? `w-component="${comp.name}" class="${comp.name}"` : ""}>`;
        else if (IS_BINDING)
            str += `<w-b i=${i}>${data}</w-b>`;
        else
            str += data;

        for (const child of children)
            str += componentDataToHTML(comp, presets, template_map, child, false).html;

        if (tag_name)
            str += `</${tag_name.toLowerCase()}>`;
    }

    return { html: str, template_map };
}