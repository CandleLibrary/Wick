import { appendChild, createElement } from "../../short_names.js";
import Scope from "../component/runtime/scope.js.js.js.js";
import ComponentEnvironment from "../component_environment.js.js.js.js";
import parseWickSyntax from "../parser.js.js.js.js";
import error from "../../../old/stamp/utils/error.js.js.js";
import URL from "@candlefw/url";
import whind from "@candlefw/whind";

const offset = "    ";

export default class ElementNode {

    constructor(env,  presets, tag = "", children = [], attribs = [],  USE_PENDING_LOAD_ATTRIB = true) {

        if (children)
            for (const child of children)
                child.parent = this;

        this.SINGLE = false;
        this.MERGED = false;

        this.presets = presets;
        this.tag = tag;
        this.children = children || [];
        this.proxied = null;
        this.slots = null;
        this.origin_url = env.url;
        this.env = env;
        this.attribs = new Map((attribs || []).map(a => (a.link(this), [a.name, a])));

        if (this.attribs.has(""))
            this.attribs.delete("");

        this.pending_load_attrib = USE_PENDING_LOAD_ATTRIB;

        this.component = this.getAttribObject("component").value;

        if (this.component)
            presets.components[this.component] = this;

        this.url = this.getAttribute("url") ? URL.resolveRelative(this.getAttribute("url"), env.url) : null;

        this.id     = this.getAttribute("id");
        this.class  = this.getAttribute("id");
        this.name   = this.getAttribute("name");
        this.slot   = this.getAttribute("slot");
        this.pinned = "";

        const pin = this.getAttribObject("pin");

        if (pin.value) {
            pin.RENDER = false;
            this.pinned = pin.value + "$";
        }

        if (this.url)
            this.loadAndParseUrl(env);

        return this;
    }

    // Applies any necessary transformations to the node in preparaton of rendering the final AST. 
    // Transforms include mappings slots, linking imported components and sorting child nodes. 
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


        if (this.presets.components[this.tag]) {
            return this.presets.components[this.tag].merge(this).finalize(slots_out);
        }

        if (this.proxied) {
            //*
            const e =  this.proxied.merge(this).finalize(slots_out);
            return e;
            /*
            ele.slots = slots_out;
            this.mount = ele.mount.bind(ele);
            //*/
            //return ele//this.proxied.merge(this);
        }

        this.children.sort(function(a, b) {
            if ((a.tag == "script" && b.tag !== "script") || (a.tag == "style" && b.tag !== "style"))
                return 1;
            return 0;
        });

        return this;
    }

    getAttribute(name) {
        return this.getAttribObject(name).value;
    }

    getAttribObject(name) {
        return this.attribs.get(name) || { name: "", value: "" };
    }

    createElement() {
        return createElement(this.tag);
    }

    toString(data = null, off = 0) {

        var o = offset.repeat(off),
            str = `\n${o}<${this.tag}`;

        for (const attr of this.attribs.values()) {
            if (attr.name)
                str += ` ${attr.name}=${typeof attr.value == "object" ? attr.value + "" : `"${attr.value}"`}`;
        }

        if (this.SINGLE && this.children.length < 1)
            return str + "/>";


        str += ">\n";

        str += this.innerToString(data, off + 1);

        return str + `\n${o}</${this.tag}>`;
    }

    innerToString(data, off) {
        return this.children.map(e => e.toString(data, off)).join("");
    }

    /****************************************** COMPONENTIZATION *****************************************/

    loadAST(ast) {
        if (ast instanceof ElementNode)
            this.proxied = ast; //.merge();
    }

    async loadAndParseUrl(env) {

        var ast = null,
            text_data = "",
            own_env = new ComponentEnvironment(env.presets, env, this.url);

        try {
            own_env.incrementPendingLoads();
            text_data = await this.url.fetchText();
        } catch (e) {
            error(error.RESOURCE_FETCHED_FROM_NODE_FAILURE, e, this);
        }

        if (text_data) {
            const lex = whind(text_data);

            try {
                ast = parseWickSyntax(lex, own_env);
            } catch (e) {
                const data = {ast, lex};
                error(error.ELEMENT_PARSE_FAILURE, data, this);
            }
        }

        this.loadAST(ast);

        own_env.resolve();

        return;
    }

    merge(node, merged_node = new this.constructor({}, this.presets, this.tag, null, null)) {

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
        merged_node.origin_url = node.url;

        if (this.tap_list)
            merged_node.tap_list = this.tap_list.map(e => Object.assign({}, e));

        merged_node.attribs = new Map(function*(...a) { for (const e of a) yield* e; }(this.attribs, node.attribs));

        merged_node.statics = node.statics;

        return merged_node;
    }

    /******************************************* BUILD ****************************************************/

    mount(element, scope, presets = this.presets, slots = {}, pinned = {}, RETURN_ELEMENT = false) {

        const own_element = this.createElement(scope);

        appendChild(element, own_element);

        if (this.slots)
            slots = Object.assign({}, slots, this.slots);

        if (this.pinned)
            pinned[this.pinned] = own_element;

        if (!scope)
            scope = new Scope(null, presets || this.presets, own_element, this);

        if (!scope.ele) scope.ele = own_element;

        for (const attr of this.attribs.values())
            attr.bind(own_element, scope, pinned);

        for (const child of this.children)
            child.mount(own_element, scope, presets, slots, pinned);

        /* 
            If there is an attribute that will cause the browser to fetch a resource that is 
            is subsequently loaded in to the element, then create a listener that will 
            update the scopes PENDING_LOADS property when the resource is requested and then 
            received.

            example elemnts = img, svg
        */
        if (this.pending_load_attrib && this.getAttribObject(this.pending_load_attrib).value) {
            const fn = e => {
                scope.loadAcknowledged();
                own_element.removeEventListener("load", fn);
            };
            own_element.addEventListener("load", fn);
            scope.PENDING_LOADS++;
        }


        return (RETURN_ELEMENT) ? own_element : scope;
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