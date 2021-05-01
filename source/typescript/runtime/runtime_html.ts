import { rt } from "./runtime_global.js";
import { DOMLiteral, ContainerDomLiteral } from "../types/dom_literal.js";
import { WickContainer } from "./runtime_container.js";
import { takeParentAddChild } from "./runtime_common.js";
import { WickRTComponent } from "./runtime_component.js";
import Presets from "../presets.js";

//
// https://www.w3.org/TR/2011/WD-html5-20110525/namespaces.html
//
const namespaces = [
    "www.w3.org/1999/xhtml",            // Default HTML - 0
    "http://www.w3.org/2000/svg",              // SVG - 1
    "www.w3.org/1998/Math/MathML",      // MATHML - 2
    "www.w3.org/1999/xlink",            // XLINK - 3
    "www.w3.org/XML/1998/namespace",    // XML - 4
    "www.w3.org/2000/xmlns/",           // XMLNS - 5
];

const comp_name_regex = /W[_\$a-zA-Z0-9]+_/;

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
function createElementNameSpaced(tag_name, name_space, data = "", ele_list: Array<Text | HTMLElement>): HTMLElement | Text {

    let ele: any = null;

    if (!tag_name) /*TextNode*/ return createText(data);

    if (tag_name == "binding") /*BindingTextNode*/ ele = createText("");

    else if (!name_space) ele = createElement(tag_name);

    else ele = document.createElementNS(name_space, tag_name);

    ele_list.push(ele);

    return ele;
}

function createElement(tag_name) {
    return document.createElement(tag_name);
}

export function* getComponentNames(ele: HTMLElement): Generator<string, void, void> {
    const len = ele.classList.length;

    for (let i = 0; i < len; i++)
        if (ele.classList[i].match(comp_name_regex))
            yield ele.classList[i];
}


export function Is_Wick_Component_Element(ele: HTMLElement) {
    return (ele
        &&
        ele.hasAttribute("w:c")
        && [...getComponentNames(ele)].length > 0
    );
}


export function hydrateComponentElements(pending_component_elements: HTMLElement[]): WickRTComponent[] {
    const components = [];

    for (const hydrate_candidate of pending_component_elements) {

        /**
         * Some components are interleaved, forcing the use of the w:own attribute
         * to untangle interleaved elements. Whether a component is interleaved or not 
         * can be determined by the number of Wick class names present within the 
         * elements class list. If there is more than one matching class name, then 
         * there are interleaved components.
         */
        components.push(hydrateComponentElement(hydrate_candidate));
    }

    return components;
}


export function hydrateComponentElement(hydrate_candidate: HTMLElement, parent_chain: WickRTComponent[] = []) {

    let names = getComponentNames(hydrate_candidate), affinity = 0;

    const u = undefined;

    let first_comp: WickRTComponent = null;

    for (const component_name of names) {

        const comp_class = rt.gC(component_name);

        if (comp_class) {

            let comp = new (comp_class)(null, hydrate_candidate, u, parent_chain, u, u, affinity++);

            parent_chain = parent_chain.concat(comp);

            if (!first_comp)
                first_comp = comp;
        }

        else
            console.warn(`WickRT :: Could not find component data for ${component_name}`);
    }

    return first_comp;
}

export function hydrateContainerElement(ele: HTMLElement, parent: WickRTComponent) {
    const
        comp_constructors = ele
            .getAttribute("w:ctr")
            .split(" ")
            .map(name => this.presets.component_class.get(name)),
        comp_attributes = (ele
            .getAttribute("w:ctr-atr") ?? "")
            .split(":")
            .map(e => e.split(";").map(e => <[string, string]>e.split("=")));

    if (comp_constructors.length < 1)
        throw new Error(`Could not find component class for ${name} in component ${parent.name}`);

    const ctr = new WickContainer(comp_constructors, comp_attributes, ele, parent);

    this.ct.push(ctr);
}

/**
* Make DOM Element tree from JS object
* literals. Return list of object ID's and the
* root element tree.
*/
export function makeElement(ele_obj: DOMLiteral, name_space = ""): HTMLElement {

    const {
        namespace_id: name_space_index,
        tag_name: tag_name,
        lookup_index: i,
        attributes: attributes,
        children: children,
        data: data,
        is_container: ct,
        component_name: component_name
    } = ele_obj;

    if (name_space_index) name_space = getNameSpace(name_space_index);

    let ele = null;

    if (ct) {

        const
            { component_attribs, component_names } = <ContainerDomLiteral>ele_obj,

            comp_constructors = component_names.map(name => (<Presets>this.presets).component_class.get(name));

        if (comp_constructors.length < 1)
            throw new Error(`Could not find component class for ${component_name} in component ${this.name}`);

        ele = <HTMLElement>createElementNameSpaced(tag_name, name_space, data, this.elu);

        const ctr = new WickContainer(comp_constructors, component_attribs, ele, this);

        this.ct.push(ctr);

    } else if (component_name && this.presets.component_class.has(component_name)) {

        const comp_constructor = this.presets.component_class.get(component_name);

        if (!comp_constructor)
            throw new Error(`Could not find component class for ${component_name} in component ${this.name}`);

        //Do fancy component linking

        const comp = new comp_constructor(undefined, undefined, undefined, undefined, undefined, this.presets);

        //Perform linking, what not then set element to the components element. 
        takeParentAddChild(this, comp);

        ele = comp.ele;

        this.elu.push(ele);
    } else
        ele = <HTMLElement>createElementNameSpaced(tag_name, name_space, data, this.elu);


    if (attributes)
        for (const [name, value] of attributes)
            ele.setAttribute(name, value);

    if (children)
        outer: for (const child of children) {
            if (child.slot_name) {
                for (const c of ele.children) {
                    if (c.getAttribute("slot") == child.slot_name) {
                        ele.replaceElement(this.me(child, name_space));
                        continue outer;
                    }
                }
            }

            ele.appendChild(this.me(child, name_space));
        }

    return ele;
}