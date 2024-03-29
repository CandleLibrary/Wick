import { WickRTComponent } from "./component.js";
import { WickContainer } from "./container.js";
import { rt } from "./global.js";

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



function createText(data) {
    return document.createTextNode(data);
}

function createElement(tag_name) {
    return document.createElement(tag_name);
}

export function getNameSpace(name_space_lookup) {
    return namespaces[name_space_lookup] || "";
}

/**
 * Used for SVG, MATHML.
 * @param tag_name 
 * @param name_space 
 * 
 */
export function createNamespacedElement(tag_name, name_space, data = ""): HTMLElement | Text {

    let ele: any = null;

    if (!tag_name) /*TextNode*/ return createText(data);

    if (tag_name == "binding") /*BindingTextNode*/ ele = createText("");

    else if (!name_space) ele = createElement(tag_name);

    else ele = document.createElementNS(name_space, tag_name);

    return ele;
}

export function* getComponentNames(ele: HTMLElement): Generator<string, void, void> {


    const len = ele.classList.length;


    for (let i = 0; i < len; i++)
        if (String_Is_Wick_Hash_ID(ele.classList[i]))
            yield ele.classList[i];
}

const comp_name_regex = /W[_\$a-zA-Z0-9]+/;
export function String_Is_Wick_Hash_ID(str): boolean {
    return !!str.match(comp_name_regex);
}

export function Element_Is_Wick_Component(ele: HTMLElement) {
    return (
        ele
        &&
        ele.hasAttribute("w:c")
        &&
        [...getComponentNames(ele)].length > 0
    );
}

export function Element_Is_Wick_Template(ele: HTMLElement) {
    return (
        ele
        &&
        ele.tagName == "TEMPLATE"
        &&
        ele.hasAttribute("w:c")
        &&
        String_Is_Wick_Hash_ID(ele.id + "")
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


export function hydrateComponentElement(hydrate_candidate: HTMLElement, parent_chain: WickRTComponent[] = [], existing_comp = null) {

    let names = getComponentNames(hydrate_candidate), affinity = 0;

    const u = undefined;

    let first_comp: WickRTComponent = null;

    for (const component_name of names) {

        const comp_class = rt.gC(component_name);

        if (comp_class) {

            if (!first_comp && existing_comp) {
                first_comp = existing_comp;
                parent_chain = parent_chain.concat(first_comp);
                affinity++;
            } else {

                let comp = new (comp_class)(hydrate_candidate, u, parent_chain, u, u, affinity++);

                comp.hydrate();

                parent_chain = parent_chain.concat(comp);

                if (!first_comp)
                    first_comp = comp;
            }
        }

        else
            console.warn(`WickRT :: Could not find component data for ${component_name}`);
    }

    return first_comp;
}

export function hydrateContainerElement(ele: HTMLElement, parent: WickRTComponent, null_elements: HTMLElement[] = []) {
    const
        comp_constructors = ele.getAttribute("w:ctr")
            .split(" ")
            .map(name => parent.context.component_class.get(name)),

        comp_attributes = (ele.getAttribute("w:ctr-atr") ?? "")
            .split(":")
            .map(e => e.split(";").map(e => <[string, string]>e.split("=")));

    if (comp_constructors.length < 1)
        throw new Error(`Could not find component class for ${name} in component ${parent.name}`);

    const ctr = new WickContainer(comp_constructors, comp_attributes, ele, parent, null_elements);

    parent.ctr.push(ctr);
}

