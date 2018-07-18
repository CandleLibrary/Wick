import {
    Lexer
} from "../common/common"

import {
    Transitioner
} from "../animation/transition/transitioner"

import {
    SourceBase
} from "./base"

/**
    Pull index location of specially marked elements from an HTML string. 

    Uses a stack to push index of marked elements and their ancestors. 
    Uses info to extract HTMLelements from an HTMLElement whose innerHTML matches the
    the string provided to the constructor. 
*/
class Indexer {

    constructor(elementInnerHTML) {
        this.lexer = new Lexer(elementInnerHTML);
        this.stack = [];
        this.sp = 0;
    }

    get(index, parent_element, cache, REDO = false) {
        //Cache the assignment of the node, since parsing can be a slow process. 
        let lex = this.lexer;

        if (REDO) {
            lex.reset();
            this.stack.length = 0;
            this.sp = 0;
        }

        while (true) {

            if (lex.pos < 0 || lex.END) {
                if (REDO)
                    return null;
                else
                    return this.get(index, parent_element, cache, true);
            }

            switch (lex.text) {
                case "<":
                    if (lex.peek().text == "/") {
                        lex.sync( /* < */ ).n( /* / */ ).n( /* tagName */ ).n( /* > */ );
                        if (--this.sp < 0) return null;
                        this.stack.length = this.sp + 1;
                        this.stack[this.sp]++;
                    } else {
                        let ISCLOSING = false;
                        if (lex.sync().tx == "input") {

                            ISCLOSING = true;
                            while (lex.text !== ">" && lex.text !== "/") {
                                lex.n(); // attrib name
                                if (lex.text == "=")
                                    lex.n().n()
                            }

                            lex.a(">");

                            (this.stack.push(0), this.sp++)

                        } else {

                            lex.n(); // <
                            while (lex.text !== ">" && lex.text !== "/") {
                                lex.n(); // attrib name
                                if (lex.text == "=")
                                    lex.n().n()
                            }

                            if (lex.text == "/") {
                                lex.n( /* / */ ).n( /* > */ );
                                break;
                            }

                            lex.n(); // >

                            (this.stack.push(0), this.sp++)
                        }


                        if (lex.text == "#") {
                            lex.n();
                            if (lex.text == "#") {
                                lex.n();
                                if (lex.text == ":") {
                                    lex.n();
                                    if (lex.type == lex.types.num) {
                                        let number = parseInt(lex.text);
                                        if (number == index) {
                                            let out = this.getElement(parent_element, cache);
                                            if (ISCLOSING) {
                                                --this.sp;
                                                this.stack.length = this.sp + 1;
                                                this.stack[this.sp]++;
                                            }
                                            return out;
                                        }
                                    }
                                }
                            }
                        }

                        if (ISCLOSING) {
                            if (--this.sp < 0) return null;
                            this.stack.length = this.sp + 1;
                            this.stack[this.sp]++;
                        }
                    }
                    break;
                default:
                    lex.n();
            }
        }
    }

    getElement(element, cache) {
        let stack = this.stack,
            sp = this.sp;

        if (cache)
            if (cache.length > 0) {
                stack = cache;
                sp = cache.sp;
            } else {
                cache.sp = this.sp;
                for (let i = 0; i < this.sp; i++)
                    cache.push(stack[i]);
            }

        for (let i = 0; i < sp; i++)
            element = element.children[stack[i]];

        return element;
    }
}
/**   
    @class
    
    


*/
/**
 * Factory object for Creating Source trees.  Encapsulates construction information derived from the HTML AST.  
 * 
 * @param      {external:HTMLElement}  element      The element
 * @param      {Function}  constructor      The constructor for the object the Skeleton will create.
 * @param      {Object}  data  Data pulled from a tags attributes
 * @param      {Presets}  presets  The global Presets instance.
 * @memberof module:wick~internals.source
 * @alias Skeleton  
 */
export class Skeleton {
    /**
        Constructor of Skeleton
    */
    constructor(element, constructor, data, presets, index) {

        this.ele = element;

        this.eli = (element) ? element.innerHTML : "";

        if (element)

            this.ele.innerHTML = this.eli.replace(/\#\#\:\d*\s/g, "");
        //Strip index marks.

        this.Constructor = constructor;
        this.children = [];
        this.templates = [];
        this.filters = [];
        this.terms = [];
        this.caches = [];
        this.d = data;
        this.p = presets;
        this.i = index;
        this.trs = null;

        if (SourceBase.isPrototypeOf(constructor))
        /* Create the Transitioner here */
            this.trs = new Transitioner(data, presets.imported.css, presets.imported);
    }

    /**
        Constructs Source tree and returns that. 

        @param {ModelBase} Model - A Model object to assign to the new Source. 
    */
    flesh(Model = null) {

        let Source = this.____copy____(null, null, null);

        Source.load(Model);

        return Source;
    }

    /**

        Constructs a new object, attaching to elements hosted by a Source object. If the component to be constructed is a Source the 
        parent_element HTMLElement gets swapped out by a cloned HTMLElement that is hosted by the newly constructed Source.

        @param {external:HTMLElement} parent_element - HTML Element of the originating Source. 

        @protected
    */
    ____copy____(parent_element, parent, elements) {

        let element = null,
            CLAIMED_ELEMENT = false;

        if (this.i > 0) {

            element = elements[this.i - 1];

            //Remove index marker;
            CLAIMED_ELEMENT = true;
        }

        if (this.ele) {

            let indexer = new Indexer(this.eli);

            parent_element = this.ele.cloneNode(true);

            elements = [];

            if (this.caches.length > 0)
                for (let i = 0, l = this.caches.length; i < l; i++)
                    elements.push(indexer.getElement(parent_element, this.caches[i]));
            else {
                let cache = [],
                    ele = null,
                    i = 1;
                while (ele = indexer.get(i++, parent_element, cache)) {
                    elements.push(ele);
                    this.caches.push(cache);
                    cache = [];
                };
            }

            if (element && element.parentElement) {
                element.parentElement.replaceChild(parent_element, element);
            }

            element = parent_element;
            CLAIMED_ELEMENT = true;
        }

        let out_object;

        if (this.Constructor)
            out_object = new this.Constructor(parent, this.d, this.p, element);
        else if (!parent) {
            out_object = this.children[0].____copy____(parent_element, null, elements);
            out_object.ele = parent_element;
            return out_object;
        } else
            out_object = parent;


        if (this.children.length > 0)
            for (var i = 0, l = this.children.length; i < l; i++)
                this.children[i].____copy____(parent_element, out_object, elements);

        if (this.templates.length > 0) {

            if (this.terms.length > 0)
                for (var i = 0, l = this.terms.length; i < l; i++)
                    out_object.terms.push(this.terms[i].____copy____(parent_element, null, elements));

            if (this.filters.length > 0)
                for (var i = 0, l = this.filters.length; i < l; i++)
                    out_object.filters.push(this.filters[i].____copy____(parent_element, null, elements));

            for (var i = 0, l = this.templates.length; i < l; i++)
                out_object.templates.push(this.templates[i]);
        }

        return out_object;
    }
}