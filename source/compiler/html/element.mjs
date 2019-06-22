import { appendChild, createElement } from "../../short_names.mjs";
import Scope from "../component/runtime/scope.mjs";
import CompilerEnv from "../compiler_env.mjs";
import wick_compile from "../wick.mjs";

import URL from "@candlefw/url";
import whind from "@candlefw/whind";

export default class ElementNode {

    constructor(env, tag = "", children = [], attribs = [], presets) {

        if (children)
            for (const child of children)
                child.parent = this;

        this.SINGLE = false;
        this.MERGED = false;

        this.presets = presets;
        this.tag = tag;
        this.attribs = attribs || [];
        this.children = children || [];
        this.proxied = null;
        this.slots = null;

        this.component = this.getAttrib("component").value;

        if (this.component)
            presets.components[this.component] = this;

        this.url = this.getAttribute("url") ? URL.resolveRelative(this.getAttribute("url")) : null;
        this.id = this.getAttribute("id");
        this.class = this.getAttribute("id");
        this.name = this.getAttribute("name");
        this.slot = this.getAttribute("slot");
        this.pinned = (this.getAttribute("pin")) ? this.getAttribute("pin") + "$" : "";


        //Prepare attributes with data from this element
        for (const attrib of this.attribs)
            attrib.link(this);

        if (this.url)
            this.loadURL(env);

        return this;
    }

    // Traverse the contructed AST and apply any necessary transforms. 
    finalize(slots_in = {}) {


        if (this.slot) {

            if (!this.proxied_mount)
                this.proxied_mount = this.mount.bind(this);

            //if(!slots_in[this.slot])
            slots_in[this.slot] = this.proxied_mount;

            this.mount = () => {};
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            this.children[i] = child.finalize(slots_in);
        }

        const slots_out = Object.assign({}, slots_in);

        if (this.presets.components[this.tag])
            this.proxied = this.presets.components[this.tag].merge(this);

        if (this.proxied) {
            const ele = this.proxied.finalize(slots_out);
            ele.slots = slots_out;
            this.mount = ele.mount.bind(ele);
        }

        this.children.sort(function(a,b){
            if(a.tag == "script" && b.tag !== "script")
                return 1;
            if(a.tag !== "script" && b.tag == "script")
                return -1;
            return 0;
        });

        return this;
    }

    getAttribute(name) {
        return this.getAttrib(name).value;
    }

    getAttrib(name) {
        for (const attrib of this.attribs) {
            if (attrib.name === name)
                return attrib;
        }

        return { name: "", value: "" }
    }

    createElement() {
        return createElement(this.tag);
    }

    toString(off = 0) {

        let o = offset.repeat(off);

        let str = `${o}<${this.tag}`,
            atr = this.attribs,
            i = -1,
            l = atr.length;

        while (++i < l) {
            let attr = atr[i];

            if (attr.name)
                str += ` ${attr.name}="${attr.value}"`;
        }

        str += ">\n";

        if (this.SINGLE)
            return str;

        str += this.innerToString(off + 1);

        return str + `${o}</${this.tag}>\n`;
    }

    innerToString(off) {
        return this.children.map(e=>e.toString()).join("");
    }

    /****************************************** COMPONENTIZATION *****************************************/


    async loadURL(env) {

        try {
            const own_env = new CompilerEnv(env.presets, env);
            own_env.setParent(env);

            const txt_data = await this.url.fetchText();

            own_env.pending++;

            const ast = wick_compile(whind(txt_data), own_env);

            this.proxied = ast.merge(this);

            own_env.resolve();

        } catch (err) {
            console.error(err);
        }
    }

    merge(node, merged_node = new this.constructor(null, this.tag, null, null, this.presets)) {

        merged_node.line = this.line;
        merged_node.char = this.char;
        merged_node.offset = this.offset;
        merged_node.single = this.single;
        merged_node.url = this.url;
        merged_node.tag = this.tag;
        merged_node.children = (node.children || this.children) ? [...node.children, ...this.children] : [];
        merged_node.css = this.css;
        merged_node.HAS_TAPS = this.HAS_TAPS;
        merged_node.MERGED = true;
        merged_node._badge_name_ = node._badge_name_;
        merged_node.presets = this.presets;
        merged_node.par = node.par;
        merged_node.pinned = node.pinned || this.pinned;

        if (this.tap_list)
            merged_node.tap_list = this.tap_list.map(e => Object.assign({}, e));

        merged_node.attribs = merged_node.attribs.concat(this.attribs, node.attribs);

        merged_node.statics = node.statics;

        return merged_node;
    }

    /******************************************* BUILD ****************************************************/

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}) {

        if (this.slots)
            slots = Object.assign({}, slots, this.slots);

        const own_element = this.createElement(scope);

        if (element) appendChild(element, own_element);

        if(this.pinned){
            pinned[this.pinned] = own_element;
        }

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        if (!scope.ele) scope.ele = own_element;

        for (let i = 0, l = this.attribs.length; i < l; i++)
            this.attribs[i].bind(own_element, scope, pinned);

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i];
            node.mount(own_element, scope, presets, slots, pinned);
        }

        return scope;
    }
}

//Node that allows the combination of two sets of children from separate nodes that are merged together
export class MergerNode {
    constructor(...children_arrays) {
        this.c = [];

        for (let i = 0, l = children_arrays.length; i < l; i++)
            if (Array.isArray(children_arrays))
                this.c = this.c.concat(children_arrays[i]);
    }

    mount(element, scope, presets, statics, pinned) {
        for (let i = 0, l = this.c.length; i < l; i++) {
            if (this.c[i].SLOTED == true) continue;
            this.c[i].build(element, scope, presets, statics, pinned);
        }

        return scope;
    }

    linkCSS() {}

    toString(off = 0) {
        return `${("    ").repeat(off)}${this.binding}\n`;
    }
}
