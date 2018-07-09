/*
    Boring Case stuff
*/
import {
    Case,
} from "./case"

import {
    CaseTemplate
} from "./case_template"
import {
    CaseSkeleton
} from "./case_skeleton"
/* 
    Cassettes
*/
import {
    FilterLimit
} from "./cassette/filter_limit"
import {
    Cassette,
    CloseCassette
} from "./cassette/cassette"
import {
    Form
} from "./cassette/form"
import {
    Input
} from "./cassette/input"
import {
    Filter
} from "./cassette/filter"
import {
    Term
} from "./cassette/term"
import {
    Exporter
} from "./cassette/exporter"
import {
    ImportQuery
} from "./cassette/import_query"
import {
    DataEdit
} from "./cassette/data_edit"
import {
    Exists,
    NotExists
} from "./cassette/exists"
import {
    EpochDay,
    EpochTime,
    EpochDate,
    EpochMonth,
    EpochYear,
    EpochToDateTime
} from "./cassette/epoch"

let PresetCassettes = {
    raw: Cassette,
    cassette: Cassette,
    form: Form,
    input: Input,
    export: Exporter,
    iquery: ImportQuery,
    edt: EpochToDateTime,
    etime: EpochTime,
    eday: EpochDay,
    edate: EpochDate,
    eyear: EpochYear,
    emonth: EpochMonth,
    exists: Exists,
    not_exists: NotExists,
    data_edit: DataEdit,
    term: Term,
    limit: FilterLimit
}

import { Tap } from "./taps/tap"
import { Pipe } from "./pipes/pipe"
import { IO } from "./io/io"

export class Root {
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
        let root_skeleton = new CaseSkeleton(element);
        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].constructSkeleton(root_skeleton, presets);
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

export class GenericNode {

    constructor(tagname, attributes, parent) {
        this.parent = null;
        this.tagname = tagname;
        this.attributes = attributes || {};
        this.IS_NULL = false;
        this.CONSUMES_TAG = true;
        this.CONSUMES_SAME = false;
        this.children = [];
        this.prop_name = null;
        this.html = "";
        this.open_tag = "";
        this.close_tag = "";
        this.tag_index = 0;
        this.index = 0;
        if (parent)
            parent.addChild(this);
    };



    finalize(ctx) {
        ctx.html += this.open_tag + this.html + this.close_tag;
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

        if (child instanceof TapNode && !(this instanceof CaseNode)) {
            return this.parent.addChild(child);
        }

        child.parent = this;
        this.children.push(child);
    }

    parseAttributes() {
        let out = {};
        out.prop = this.prop_name;
        this.attributes;
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
                if (prop_name == this.prop_name) {
                    this.addChild(node);
                } else {
                    let r = new this.constructor(this.tagname, this.attributes, null);
                    r.CONSUMES_SAME = (r.CONSUMES_TAG) ? (!(r.CONSUMES_TAG = !1)) : !1;
                    r.prop_name = prop_name;
                    r.addChild(node);
                    return this.parent.split(r, prop_name);
                }
            } else {
                this.addChild(node);
                this.prop_name = prop_name;
                this.parent.removeChild(this);
                return this.parent.split(this, prop_name);
            }
        } else {
            debugger
            if (this.prop_name) {
                if (prop_name == this.prop_name) {} else {
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
        if(this.tag_index > 0) return this.tag_index++;
        if (this.parent) return this.parent.getIndex();
    }

    constructSkeleton(parent_skeleton, presets) {

        let skeleton = this.createSkeletonConstructor(presets);

        parent_skeleton.children.push(skeleton)

        for (let i = 0; i < this.children.length; i++)
            this.children[i].constructSkeleton(skeleton, presets);
    }

    createSkeletonConstructor(presets) {
        let skeleton = new CaseSkeleton(this.getElement(), this.getConstructor(presets), this.parseAttributes(), presets, this.index);
        return skeleton;
    }

    getConstructor() {
        return null;
    }

    getElement() {
        return null;
    }
}

export class CaseNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {
        ctx.html += this.html;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        if (lexer.text == "(" && lexer.peek().text == "(") {
            lexer.assert("(");
            lexer.assert("(");
            let template = new TemplateNode("list", this.attributes, this, this);
            template.parse(lexer, parseFunction, presets);
            lexer.assert(")");
            let out = lexer.pos + 1;
            lexer.assert(")");
            return out;
        }
    }

    getConstructor() {
        return Case;
    }

    split(node, prop_name) {
        if (node) this.addChild(node);
    }
}

export class TemplateNode extends GenericNode {
    constructor(tagname, attributes, parent, ctx) {
        super(tagname, attributes, parent);
        this.index = this.getIndex();
        ctx.html += `<list>##:${this.index}</list>`
        this.filters = [];
        this.terms = [];
        this.templates = [];
    };

    addChild(child) {
        if (child instanceof FilterNode)
            this.filters.push(child);
        else if (child instanceof TermNode)
            this.terms.push(child);
        else if (child instanceof CaseNode) {
            if (this.templates.length > 0) throw new Error("Only one Case allowed in a Template.");
            this.templates.push(child);
            child.tag_index = 1;
            this.html = child.html;
        } else throw new Error("Templates only support Filter, Term or Case elements.")
    }

    constructSkeleton(parent_skeleton, presets) {
        let element = document.createElement("div");
        element.innerHTML = this.html;
        let skeleton = new CaseSkeleton(this.getElement(), CaseTemplate, this.parseAttributes(), presets, this.index);
        skeleton.filters = this.filters.map((filter) => filter.createSkeletonConstructor(presets))
        skeleton.terms = this.terms.map((term) => term.createSkeletonConstructor(presets))
        skeleton.templates = this.templates.map((template) => {
            let skl = template.createSkeletonConstructor(presets);
            skl.element = element;
            return skl;
        })
        parent_skeleton.children.push(skeleton)
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
            if (out instanceof CaseNode)
                this.html = out.html;
        }
    }

    split(node, prop_name) {

        if (node)
            this.addChild(node);

        return this.tag_count;
    }
}

export class TapNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {
        ctx.html += this.html;
    }

    getConstructor(presets) {
        return Tap;
    }
}


export class FilterNode extends GenericNode {
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


export class TermNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
    };

    finalize(ctx) {}

    getConstructor(presets) {
        return Tap;
    }

    addProp(lexer, prop_name, parseFunction, presets) {
        this.attributes.prop = prop_name;
    }
}



export class PipeNode extends GenericNode {
    constructor(tagname, attributes, parent) {
        super(tagname, attributes, parent);
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

export class IONode extends GenericNode {
    constructor(prop_name, attributes, parent, ctx, index) {
        super("", null, parent);
        this.index = index;
        ctx.html += `<io prop="${prop_name}">##:${index}</io>`
        this.prop_name = prop_name;
        this.CONSUMES_TAG = true;
    };

    getConstructor(presets) {
        return IO;
    }
}