import Scope from "../component/runtime/scope.js.js.js.js";
import Container from "../component/runtime/container.js.js.js.js";
import proto from "../component_prototype.js.js.js.js";

import ElementNode from "./element.js.js.js.js";
import Filter from "./filter.js.js.js.js";
import TextNode from "./text.js.js.js.js";

import {
    appendChild,
    createElement
} from "../../short_names.js";

function BaseComponent(ast, presets) {
    this.ast = ast;
    this.READY = true;
    this.presets = presets;
    //Reference to the component name. Used with the Web Component API
    this.name = "";
}

Object.assign(BaseComponent.prototype,proto.prototype);
BaseComponent.prototype.mount = proto.prototype.nonAsyncMount;
BaseComponent.prototype.stamp = proto.prototype.nonAsyncStamp;

export default class ctr extends ElementNode {
    
    constructor(env, presets, tag, children, attribs) {

        super(env, presets, tag, children, attribs);
        //Warn about any children that are css / script
        if(children)
        for(const child of children)
            if(child.tag && (child.tag == "script" || child.tag == "style"))
                console.warn(`Element of type <${child.tag}> will have no effect inside a <container> element`);

        this.filters = null;
        this.property_bind = null;
        this.scope_children = null;

        //Tag name of HTMLElement the container will create;
        this.element = this.getAttribute("element") || "ul";

        //Used to refence message sent from instances of this container.
        this.name = this.getAttribute("name") || "container";
        
        this.nodes = null;
        this.binds = null;
    }

    finalize(slots = {}){
        super.finalize(slots);

        const children = this.children;

        this.filters = children.reduce((r, c) => { if (c instanceof Filter) r.push(c); return r }, []);
        this.nodes = children.reduce((r, c) => { if (c instanceof ElementNode && !(c instanceof Filter)) r.push(c); return r }, []);
        this.binds = children.reduce((r, c) => { if (c instanceof TextNode && c.IS_BINDING) r.push(c); return r }, []);

        //Keep in mind slots!;
        this.component_constructor = (this.nodes.length > 0) ? new BaseComponent(this.nodes[0], this.presets) : null;

        return this;
    }

    merge(...d) {
        const merged_node = super.merge(...d);
        merged_node.filters = this.filters;
        merged_node.nodes = this.filters;
        merged_node.binds = this.binds;
        merged_node.MERGED = true;
        return merged_node;
    }

    mount(element, scope, presets, slots, pinned) {
        
        scope = scope || new Scope(null, presets, element, this);

        //Only create a container if it is able to generate components. 
       // if(!this.component_constructor)
       //     return scope;

        const
            ele = createElement(this.element),
            container = new Container(scope, presets, ele);

        container.name = this.name;

        appendChild(element, ele);

        this.class.split(" ").map(c => c ? ele.classList.add(c) : {});           

        for (const fltr of this.filters)
            fltr.mount(scope, container);
        
        for (const attr of this.attribs.values())
            attr.bind(ele, scope, pinned);

        if (this.component_constructor && this.binds.length > 0) {
            
            container.component = this.component_constructor;

            for (const bind of this.binds)
                bind.mount(null, scope, presets, slots, pinned, container);
        }else{ 
            //If there is no binding, then there is no potential to have generated components built from array entries.
            //Instead, load any existing children as component entries for the container element. 
            for (const node of this.nodes)
                container.scopes.push(node.mount(null, null, presets, slots));

            container.filterUpdate();
            container.render();
        }

        return scope;
    }
}