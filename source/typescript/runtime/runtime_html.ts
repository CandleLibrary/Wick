import { renderWithFormatting } from "@candlefw/conflagrate";

import { rt, WickRuntime } from "./runtime_global.js";
import Presets from "../presets";
import { DOMLiteral } from "../types/dom_literal.js";
import { renderers, format_rules } from "../format_rules.js";
import { Component } from "../types/types.js";
import { WickContainer } from "./runtime_container_class.js";
import { componentDataToClass } from "../component/component_data_to_class.js";
import parser from "../parser/parser.js";

function ie(ele) {

    if (ele.getAttribute("w-container")) {

        const
            name = ele.getAttribute("w-container"),
            comp_constructor = this.presets.component_class.get(name);

        const comp = new comp_constructor(this.presets, null, ele);

        takeParentAddChild(this, comp);

        return;
    }

    if (ele.getAttribute("w-component")) {

        const
            name = ele.getAttribute("w-component"),
            comp_constructor = this.presets.component_class.get(name);

        const comp = new comp_constructor(this.presets, null, ele);

        takeParentAddChild(this, comp);

        return;
    }

    for (const child of ele.nodes) {

    }

    this.elu.push(ele);

    return ele;
}
/**
* Make DOM Element tree from JS object
* literals. Return list of object ID's and the
* root element tree.
*/
function me(ele_obj: DOMLiteral, name_space = ""): HTMLElement {

    const {
        n: name_space_index,
        t: tag_name,
        i,
        a: attributes,
        c: children,
        d: data,
        ct,
        cp: component_name,
        sl: slot_name
    } = ele_obj;

    if (name_space_index) name_space = getNameSpace(name_space_index);

    let ele = null;

    if (ct) {

        const comp = this.presets.component_class.get(component_name);

        ele = <HTMLElement>createElementNameSpaced(tag_name, name_space, data);

        const ctr = new WickContainer(comp, ele, this);

        this.ct.push(ctr);

    } else if (component_name && rt.presets.component_class.has(component_name)) {

        const comp_constructor = this.presets.component_class.get(component_name);

        //Do fancy component linking

        const comp = new comp_constructor();

        //Perform linking, what not then set element to the components element. 
        takeParentAddChild(this, comp);

        ele = comp.ele;
    } else
        ele = <HTMLElement>createElementNameSpaced(tag_name, name_space, data);


    if (attributes)
        for (let i = 0; i < attributes.length; i += 2)
            ele.setAttributeNS(name_space, attributes[i], attributes[i + 1]);

    if (children)
        outer: for (const child of children) {
            if (child.sl) {
                for (const c of ele.children) {
                    if (c.getAttribute("slot") == child.sl) {
                        ele.replaceElement(this.me(child, name_space));
                        continue outer;
                    }
                }
            }

            ele.appendChild(this.me(child, name_space));
        }

    this.elu[i] = ele;

    return ele;
}

function createText(data) {
    return document.createTextNode(data);
}

function getNameSpace(name_space_lookup) {
    return namespaces[name_space_lookup] || "";
}

/**
 * Used for SVG, MATHML.
 * @param tag_name 
 * @param name_space 
 * 
 */
function createElementNameSpaced(tag_name, name_space, data = ""): HTMLElement | Text {

    if (!tag_name) /*TextNode*/ return createText(data);

    if (!name_space) return createElement(tag_name);

    return document.createElementNS(tag_name, name_space);
}

function createElement(tag_name) {
    return document.createElement(tag_name);
}