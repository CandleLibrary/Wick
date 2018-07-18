/*
    Boring Source stuff
*/
import { Source } from "./source"

import { SourceTemplate } from "./template"

import { Skeleton } from "./skeleton"

import { Tap } from "./tap/tap"

import { Pipe } from "./pipe/pipe"

import { IO } from "./io/io"

/**
 * Class for root.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class Root {
    constructor() {
        this.html = "";
        this.children = [];
        this.tag_index = 1;
    };

    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    constructSkeleton(presets) {
        let element = document.createElement("div")
        element.innerHTML = this.html;
        let root_skeleton = new Skeleton(element);
        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].constructSkeleton(root_skeleton.children, presets);
        return root_skeleton;
    }

    getIndex() {
        return this.tag_index++;
    }

    toJSON() {
        return {
            children: this.children,
            html: this.html
        }
    }

    offset(increase = 0) {
        let out = this.tag_count;
        this.tag_count += increase;
        return out;
    }
}

/**
 * Class for GenericNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class GenericNode {

    constructor(tagname, attributes, parent, MiniParse, presets) {

        this.parent = null;
        this.tagname = tagname;
        this.attributes = attributes || {};
        this.element = null;
        this.IS_NULL = false;
        this.CONSUMES_TAG = true;
        this.CONSUMES_SAME = false;
        this.children = [];
        this.prop_name = "";
        this.attrib_name = "";
        this.html = "";
        this.index_tag = ""
        this.open_tag = "";
        this.close_tag = "";
        this.tag_index = 0;
        this.index = 0;
        this.SPLITABLE = false;

        if (parent)
            parent.addChild(this);

        if (MiniParse)
            this.treeParseAttributes(MiniParse, presets);
    };

    finalize(ctx) {

        ctx.html += this.open_tag + this.index_tag + this.html + this.close_tag;
    }

    replaceChild(child, new_child) {
        for (let i = 0; i < this.children.length; i++)

            if (this.children[i] == child) {
                this.children[i] = new_child;
                new_child.parent = this;
                child.parent = null;
                return
            }
    }

    removeChild(child) {

        for (let i = 0; i < this.children.length; i++)
            if (this.children[i] == child)
                return this.children.splice(i, 1);
    }

    addChild(child) {

        if (child instanceof IONode && (!(this instanceof PipeNode) && !(this instanceof TapNode)))
            return this.parent.addChild(child);

        if (child instanceof TapNode)
            return this.parent.addChild(child);

        child.parent = this;
        this.children.push(child);
    }

    setAttribProp(name) {

        if (!this.attrib_name) this.attrib_name = name;

        for (let i = 0; i < this.children.length; i++)
            this.children[i].setAttribProp(name);
    }

    /**
     *  Builds ASTs off of attributes. 
     *  
     *  TODO: Parse more generic attribute structures, such as style="border_color=[color]"
     *
     * @param      {Function}  MiniParse  The mini parse function
     * @param      {Object}    presets    The global presets object. 
     */
    treeParseAttributes(MiniParse, presets) {

        let i = -1;

        for (let n in this.attributes) {
            let attrib = this.attributes[n];
            //if (attrib[0] == "<") {
            let root = new SourceNode("", null, null);
            root.tag_index = (i < 0) ? (i = this.getIndex(), this.index_tag = `##:${i} `, this.index = i) : i;
            MiniParse(attrib, root, presets);
            if (root.children[0]) {
                root.children[0].setAttribProp(n);
                this.addChild(root.children[0]);
            }
            //}
        }
    }

    getMissingAttribute(name) {

        if (this.attributes[name])
            return this.attributes[name];
        if (this.parent && this.parent.getMissingAttribute)
            return this.parent.getMissingAttribute(name);
        return null;
    }

    parseAttributes() {

        let out = {};

        for (let name in this.attributes) {
            if (!this.attributes[name] && this.parent && this.parent.getMissingAttribute)
                out[name] = this.parent.getMissingAttribute(name);
            else
                out[name] = this.attributes[name];
        }

        out.prop = this.prop_name;
        out.attrib = this.attrib_name;

        return out;
    }

    addProp(lexer, prop_name, parseFunction, presets) {

        if (this.prop_name !== prop_name)
            this.split(new IONode(prop_name, this.attributes, null, this, this.getIndex()), prop_name);
        else
            new IONode(prop_name, this.attributes, this, this, this.getIndex());
    }

    toJSON() {

        return {
            children: this.children,
            tagname: this.tagname,
            tag_count: this.tag_count,
            tag: { open_tag: this.open_tag, close_tag: this.close_tag },
            html: this.html,
        }
    }

    split(node, prop_name) {

        if (node) {

            if (this.prop_name) {

                if (prop_name == this.prop_name)
                    this.addChild(node);
                else {
                    if (this.SPLITABLE) {
                        let r = new this.constructor(this.tagname, this.attributes, null);
                        r.CONSUMES_SAME = (r.CONSUMES_TAG) ? (!(r.CONSUMES_TAG = !1)) : !1;
                        r.prop_name = prop_name;
                        r.addChild(node);
                        return this.parent.split(node, prop_name);

                    }
                    return this.parent.split(node, prop_name);
                }
            } else {
                this.addChild(node);
                this.prop_name = prop_name;
                this.parent.removeChild(this);
                return this.parent.split(this, prop_name);
            }
        } else {

            if (this.prop_name) {

                if (prop_name == this.prop_name) { /* NO OP */ } else {

                    let r = new this.constructor(this.tagname, this.attributes, null);
                    r.prop_name = prop_name;
                    return this.parent.split(r, prop_name);
                }
            } else {

                this.parent.removeChild(this);
                return this.parent.split(this, prop_name);
            }
        }

        return -1;
    }



    getIndex() {

        if (this.tag_index > 0) return this.tag_index++;

        if (this.parent) this.index = this.parent.getIndex();

        return this.index;
    }

    constructSkeleton(receiving_array, presets) {

        let skeleton = this.createSkeletonConstructor(presets);

        receiving_array.push(skeleton)

        for (let i = 0; i < this.children.length; i++)
            this.children[i].constructSkeleton(skeleton.children, presets);

        return skeleton
    }

    createSkeletonConstructor(presets) {

        let skeleton = new Skeleton(this.getElement(), this.getConstructor(presets), this.parseAttributes(), presets, this.index);

        return skeleton;
    }

    getConstructor() {

        return null;
    }

    getElement() {

        return this.element;
    }
}

/**
 * Class for SourceNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class SourceNode extends GenericNode {

    constructor(tagname, attributes, parent) {

        super(tagname, attributes, parent);
    };

    finalize(ctx) {

        ctx.html += this.html;
    }

    addProp(lexer, prop_name, parseFunction, presets) {

        if (lexer.tx == "(") {

            lexer.n();

            let template = new TemplateNode("list", { prop: prop_name }, this, this);

            template.parse(lexer, parseFunction, presets);

            lexer.assert(")");

            let out = lexer.pos + 1;

            lexer.assert(")");

            return out;
        } else
            return super.addProp(lexer, prop_name, parseFunction, presets)
    }

    getConstructor() {

        return Source;
    }

    split(node, prop_name) {

        if (node) this.addChild(node);
    }

    addChild(node) {

        if (node instanceof IONode || node instanceof PipeNode) {

            let prop_name = node.prop_name;

            if (prop_name)
                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];
                    if (child instanceof TapNode && child.prop_name == prop_name)
                        return child.addChild(node);
                }

            let tap = new TapNode("", node.attributes, this);
            tap.prop_name = node.prop_name;
            tap.addChild(node);
            return;
        }

        if (node instanceof TapNode) {
            let prop_name = node.prop_name;

            if (prop_name)
                for (let i = 0, l = this.children.length; i < l; i++) {
                    let child = this.children[i];
                    if (child instanceof TapNode && child.prop_name == prop_name)
                        return child.merge(node);
                }
        }

        node.parent = this;
        this.children.push(node);
    }
}

/**
 * Class for TemplateNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class TemplateNode extends GenericNode {

    constructor(tagname, attributes, parent, ctx) {

        super(tagname, attributes, parent);

        this.prop_name = attributes.prop;

        this.index = this.getIndex();
        ctx.html += `<tmpl>##:${this.index} </tmpl>`
        this.filters = [];
        this.terms = [];
        this.templates = [];
    };

    addChild(child) {

        if (child instanceof FilterNode)
            this.filters.push(child);
        else if (child instanceof TermNode)
            this.terms.push(child);
        else if (child instanceof SourceNode) {

            if (this.templates.length > 0) throw new Error("Only one Source allowed in a Template.");

            this.templates.push(child);

            child.tag_index = 1;

            this.html = child.html;

        } else throw new Error("Templates only support Filter, Term or Source elements.")
    }

    constructSkeleton(receiving_array, presets) {

        let element = document.createElement("div");

        element.innerHTML = this.html;

        let skeleton = new Skeleton(this.getElement(), SourceTemplate, this.parseAttributes(), presets, this.index);

        skeleton.filters = this.filters.map((filter) => filter.createSkeletonConstructor(presets))

        skeleton.terms = this.terms.map((term) => term.createSkeletonConstructor(presets))


        for (let i = 0, l = this.templates.length; i < l; i++) {

            let template = this.templates[i];

            template.element = document.createElement("div");

            template.element.innerHTML = template.html;

            template.constructSkeleton(skeleton.templates, presets);
        }

        receiving_array.push(skeleton)
    }

    getElement() {

        let div = document.createElement("list");

        return div;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        //ctx.html += prop_name;
    }

    parse(lexer, parseFunction, presets) {

        let ctx = { html: "" };

        let root = new Root();

        while (lexer.text !== ")" && lexer.peek().text !== ")") {

            if (!lexer.text) throw new Error("Unexpected end of Output. Missing '))' ");

            let out = parseFunction(lexer, this, presets);

            if (out instanceof SourceNode)
                this.html = out.html;
        }
    }

    split(node, prop_name) {

        if (node)
            this.addChild(node);

        return this.tag_count;
    }
}


/**
 * Class for TapNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class TapNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {
        ctx.html += this.html;
    }

    getConstructor(presets) {
        let $class = this.attributes.w_class;

        if ($class) {
            let t = (presets.imported.tap[$class]);
            if (Tap.isPrototypeOf(t))
                return t;
        }

        return Tap;
    }

    split(node, prop_name) {

        if (this.attributes.w_class) {
            if (node) this.addChild(node);
        } else
            super.split(node, prop_name);
    }

    merge(other_tap) {
        this.children = this.children.concat(other_tap.children);
    }
}

/**
 * Class for FilterNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class FilterNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
        this.CONSUMES_TAG = false;
    };

    finalize(ctx) {}

    getConstructor(presets) {
        return Tap;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        this.attributes.prop = prop_name;
    }
}

/**
 * Class for TermNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class TermNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
        this.SPLITABLE = true;
    };

    finalize(ctx) {}

    getConstructor(presets) {
        return Tap;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        this.attributes.prop = prop_name;
    }
}


/**
 * Class for PipeNode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class PipeNode extends GenericNode {

    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
        this.SPLITABLE = true;
    };

    finalize(ctx, presets) {
        ctx.html += this.html;
    }

    getConstructor(presets, finalizing = false) {
        let constructor = Pipe;
        return constructor;
    }

    split(node, prop_name) {
        if (!(this.parent instanceof PipeNode) &&
            !(this.parent instanceof TapNode)
        ) {
            //Need a TapNode to complete the pipeline
            let tap = new TapNode("", {}, null)
            this.prop_name = this.prop_name;
            this.parent.replaceChild(this, tap);
            tap.addChild(this);
        }

        super.split(node, prop_name);
    }
}

/**
 * Class for IONode.
 *
 *@memberof module:wick~internals.templateCompiler
 */
class IONode extends GenericNode {
    constructor(prop_name, attributes, parent, ctx, index) {

        if (prop_name == "namess") debugger

        super("", null, parent);

        this.index = index;
        ctx.html += `<io prop="${prop_name}">##:${index} </io>`
        this.prop_name = prop_name;
        this.CONSUMES_TAG = true;
    };

    getConstructor(presets) {
        return IO;
    }
}

export {
    Root,
    GenericNode,
    SourceNode,
    TemplateNode,
    TapNode,
    FilterNode,
    TermNode,
    PipeNode,
    IONode
}