import {
    appendChild,
    createElement
} from "../../../short_names.mjs";

import Scope from "../../component/runtime/scope.mjs";

import URL from "@candlefw/url";
import whind from "@candlefw/whind";

export default class ElementNode{

    constructor(tag = "", children = [], attribs = []){
        
        if(children)
            for(const child of children)
                child.parent = this;

        this.SINGLE = false;
        this.tag = tag;
        this.attribs = attribs || [];
        this.children = children || [];

        this.component = this.getAttrib("component").value;

        this.url = this.getAttrib("url").value ? URL.resolveRelative(this.getAttrib("url").value) : null;
        this.id = this.getAttrib("id").value;
        this.class = this.getAttrib("id").value;
        this.name = this.getAttrib("name").value;

        if(this.url){
            this.url.fetchText().then(e=>{
                const lex = whind(e);
                //let nodes = env.compile(lex, env);
                //console.log(nodes)
                //this.children.push(nodes);
            })
        }

        //Prepare attributes with data from this element
        for(const attrib of this.attribs)
            attrib.link(this);
    }

    getAttribute(name){
        return this.getAttrib(name).value;
    }

    getAttrib(name){
        for(const attrib of this.attribs){
            if(attrib.name === name)
                return attrib;
        }

        return {name:"", value:""}
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
        let str = "";
        for (let node = this.fch; node;
            (node = this.getNextChild(node))) {
            str += node.toString(off);
        }
        return str;
    }

    mount(element, scope, statics, presets){
        let out_statics = statics;

        // /if (this.url || this.__statics__)
        // /    out_statics = Object.assign({}, statics, this.__statics__, { url: this.getURL(par_list.length - 1) });

        const own_element = this.createElement(scope);

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        if (this.HAS_TAPS)
            taps = scope.linkTaps(this.tap_list);

        if (own_element) {      

            if (!scope.ele) scope.ele = own_element;

            if (this._badge_name_)
                scope.badges[this._badge_name_] = own_element;

            if (element) appendChild(element, own_element);

            for (let i = 0, l = this.attribs.length; i < l; i++) {
                let attr = this.attribs[i];
                attr.bind(own_element, scope);
            }
        }

        const ele = own_element ? own_element : element

        //par_list.push(this);
        for(let i = 0; i < this.children.length; i++){
            //for (let node = this.fch; node; node = this.getNextChild(node))
            const node = this.children[i];
                node.mount(own_element, scope, out_statics, presets);
        }

        //par_list.pop();

        return scope;
    }
}