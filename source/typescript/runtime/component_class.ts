import { renderWithFormatting } from "@candlefw/conflagrate";

import { rt, WickRuntime } from "./runtime_global.js";
import Presets from "../component/presets";
import { DOMLiteral } from "../types/dom_literal.js";
import { renderers, format_rules } from "../format_rules.js";
import { Component } from "../types/types.js";
import { WickContainer } from "./container_class.js";
import { componentDataToClass } from "../component/component_data_to_class.js";

type BindingUpdateFunction = () => void;


//
// https://www.w3.org/TR/2011/WD-html5-20110525/namespaces.html
//
const namespaces = [
    "www.w3.org/1999/xhtml",            // Default HTML - 0
    "www.w3.org/1998/Math/MathML",      // MATHML - 1
    "www.w3.org/2000/svg",              // SVG - 2
    "www.w3.org/1999/xlink",            // XLINK - 3
    "www.w3.org/XML/1998/namespace",    // XML - 4
    "www.w3.org/2000/xmlns/",           // XMLNS - 5
];
/**
 * Store for all known component configurations.
 */
export const cache = {};
export const class_strings = {};
export const enum DATA_FLOW_FLAG {
    FROM_PARENT = 1,

    FROM_PRESETS = 2,

    FROM_OUTSIDE = 4,

    EXPORT_TO_CHILD = 8,

    EXPORT_TO_PARENT = 16,

    ALLOW_FROM_CHILD = 32,

    FROM_CHILD = 64,

    FROM_MODEL = 128
}


export class WickComponent {

    ele: HTMLElement;

    protected elu: HTMLElement[];

    protected me: (arg1: DOMLiteral, arg2: string, arg3?: number[]) => HTMLElement;

    protected ce: () => HTMLElement;

    /**
     * Register elements.
     */
    protected re: () => void;

    protected getID: () => string;

    protected presets: Presets;

    protected rt: WickRuntime;

    protected nlu: object;

    protected nluf: BindingUpdateFunction[];

    protected u: (data: object) => void;

    //Children
    protected ch: WickComponent[];

    //Parent Component
    protected par: WickComponent;

    protected ct: WickContainer[];

    protected model: any;

    /**
     * Data flow map 
     * 
     * Maps child+parent inputs and outputs
     */
    protected dfm: any[];

    //protected ct: WickContainer[];
    update: (data: object) => void;
    constructor(comp_data, presets, model = null, wrapper = null) {

        this.class = comp_data.name;
        this.name = comp_data.name;

        this.nlu = {};

        this.ch = [];
        this.elu = [];
        this.ct = [];
        this.nluf = [];
        this.pui = [];
        this.nui = [];
        this.model = null;

        this.me = makeElement;
        this.update = this.u = updateV2;
        this.up = updateParent;
        this.uc = updateChildren;
        this.spm = syncParentMethod;
        this.pup = updateFromChild;
        this.ufp = updateFromParent;
        this.setModel = registerModel;

        this.polling_id = -1;
        this.presets = rt.presets;

        this.ele = this.ce();
        this.re();


        if (wrapper) {
            this.wrapper = wrapper;
            this.ele.appendChild(this.wrapper.ele);
            this.wrapper.setModel({ comp: this, meta: comp_data });
        } else if (presets.wrapper && comp_data.name !== presets.wrapper.name) {
            this.wrapper = new (presets.component_class.get(presets.wrapper.name))({ comp: this, meta: comp_data });
            this.ele.appendChild(this.wrapper.ele);
        }

        if (model) this.setModel(model);

        try {
            this.c();
        } catch (e) {
            console.error(e);
        }

        this.onLoad();

        rt.OVERRIDABLE_onComponentCreate(comp_data, this);
    }

    destructor() {

        if (this.polling_id > -1)
            clearInterval(this.polling_id);

        if (this.model) {
            if (this.model.unsubscribe)
                this.model.unsubscribe(this);
            this.model = null;
        }

        if (this.wrapper)
            this.wrapper.destructor();
    }

    get id() { return "0000-0000-0000-0000"; }

    ce() { this.ele = document.createElement("span"); }

    setCSS(style_string) {
        rt.__loadCSS__(this, style_string);
        this.ele.classList.add(this.class);
    }

    appendToDOM(ele) {
        ele.appendChild(this.ele);
    }

    /* Abstract Functions */
    c() { }
    onLoad() { }
    onMounted() { }
    transitionOut() { }
    transitionIn() { }

    /**
     * Replace this component with the on passed in. 
     * The new component inherits the old one's element and model.
     */
    replace(component: Component) {

        const comp_class = componentDataToClass(component, this.presets);

        const comp = new comp_class(this.model, this.wrapper);

        this.ele.replaceWith(comp.ele);

        this.wrapper = null;

        this.destructor();

        return comp;
    }
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


function takeParentAddChild(parent: WickComponent, child: WickComponent) {
    //@ts-ignore
    parent.ch.push(child);
    //@ts-ignore
    child.par = parent;
};

/**
 * Make DOM Element tree from JS object
 * literals. Return list of object ID's and the
 * root element tree.
 */
function makeElement(ele_obj, name_space = "", lookup = this.elu, parent = this): HTMLElement {

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
    }: DOMLiteral = ele_obj;

    if (name_space_index) name_space = getNameSpace(name_space_index);

    let ele = null;

    if (ct) {

        const comp = parent.presets.component_class.get(component_name);

        ele = <HTMLElement>createElementNameSpaced(tag_name, name_space, data);

        const ctr = new WickContainer(comp, ele, parent);

        parent.ct.push(ctr);

    } else if (component_name && rt.presets.components.has(component_name)) {

        //Do fancy component linking

        const comp = parent.presets.component_class.get(component_name);

        //Perform linking, what not then set element to the components element. 
        takeParentAddChild(parent, comp);

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
                        ele.replaceElement(makeElement(child, name_space, lookup, parent));
                        continue outer;
                    }
                }
            }

            ele.appendChild(makeElement(child, name_space, lookup, parent));
        }

    lookup[i] = ele;

    return ele;

}

const enum DATA_DIRECTION {
    DOWN = 1,
    UP = 2
}

//Incoming updates
function updateV2(data, flags) {

    const update_indices: Set<number> = new Set;

    for (const name in data) {

        if (typeof data[name] !== "undefined") {

            const val = this.nlu[name];

            const index = val & 0xFFFFFF;

            if (((val >> 24) & flags)) {

                const index = val & 0xFFFFFF;

                this[index] = data[name];

                update_indices.add(index);

                let i = 0;
            }
        }
    }

    for (const index of update_indices.values())
        this.nluf[index].call(this, this[index], DATA_DIRECTION.DOWN);

    //    updateChildren(data, flags | DATA_FLOW_FLAG.FROM_PARENT);
}

function updateChildren(data, flags) {

    for (const name in data) {

        if (typeof data[name] == "undefined") {

            let i = 0;

            for (const chup of this.chups) {

                if (chup[name])
                    this.ch[i].update({ [chup[name]]: data[name] }, flags | DATA_FLOW_FLAG.FROM_PARENT);
                i++;
            }
        }
    }
}

function updateParent(data) {
    if (this.par)
        updateFromChild.call(this.par, data);
}

function updateFromParent(local_index, v, flags) {

    if (flags >> 24 == this.ci + 1)
        return;

    this["u" + local_index](v, DATA_FLOW_FLAG.FROM_PARENT | flags);
}

function syncParentMethod(this_index, parent_method_index, child_index) {

    this.ci = child_index;
    this.pui[this_index] = this.par["u" + parent_method_index];
}


function updateFromChild(local_index, val, flags) {

    const method = this.pui[local_index];

    if (typeof method == "function")
        method.call(this.par, val, flags | DATA_FLOW_FLAG.FROM_CHILD | ((this.ci + 1) << 24));

};

function updateModel() {
    // Go through the model's props and test whether they are different then the 
    // currently cached variables
    const model = this.model;

    for (const name in this.nlu) {

        if ((this.nlu[name] >>> 24) & DATA_FLOW_FLAG.FROM_MODEL) {
            const index = this.nlu[name] & 0xFFFFFF;
            const v = this[index];

            if (model[name] && model[name] !== v)
                this.update({ [name]: model[name] }, DATA_FLOW_FLAG.FROM_MODEL);
        }
    }
}

function registerModel(model) {

    if (this.model) {
        if (this.polling_id > 0) {
            clearInterval(this.polling_id);
            this.polling_id = 0;
        } else {
            this.model.unsubscribe(this);
        }
    }

    this.model = model;

    if (model.subscribe)
        model.subscribe(data => {
            this.update(data);
        });

    else {
        //Create a polling monitor
        if (this.polling_id <= 0)
            this.polling_id = setInterval(updateModel.bind(this), 10);

        updateModel.call(this);
    }
}