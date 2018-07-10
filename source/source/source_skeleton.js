import { Lex } from "../common/common"

class Indexer {

    constructor(ele) {

        this.lexer = new Lex(ele.innerHTML);
        this.ele = ele;
        this.stack = [];
        this.sp = 0;
    }

    get(index, REDO = false) {

        let lex = this.lexer;

        if (REDO) {
            lex.reset();
            this.stack.length = 0;
            this.sp = 0;
        }

        while (true) {
            
            if (!lex.text) {
                if (REDO)
                    return null;
                else
                    return this.get(index, true);
            }

            switch (lex.text) {
                case "<":
                    if (lex.peek().text == "/") {
                        lex.next(); // <
                        lex.next(); // /
                        lex.next(); // tagname
                        lex.next(); // >
                        if (--this.sp < 0) return null;
                        this.stack.length = this.sp + 1;
                        this.stack[this.sp]++;
                    } else {
                        lex.next(); // <
                        lex.next(); // tagname
                        while (lex.text !== ">" && lex.text !== "/") {
                            lex.next(); // attrib name
                            if (lex.text == "=")
                                (lex.next(), lex.next())
                        }
                        if (lex.text == "/") {
                            lex.next() // / 
                            lex.next() // >
                            break;
                        }
                        lex.next(); // >

                        (this.stack.push(0), this.sp++)

                        if (lex.text == "#") {
                            lex.next();
                            if (lex.text == "#") {
                                lex.next();
                                if (lex.text == ":") {
                                    lex.next();
                                    if (lex.type == "number") {
                                        let number = parseInt(lex.text);
                                        if (number == index) return this.getElement();
                                    }
                                }
                            }
                        }
                    }
                    break;
                default:
                    lex.next();
            }
        }
    }
    getElement() {
        let element = this.ele;
        for (let i = 0; i < this.sp; i++) {
            element = element.children[this.stack[i]];
        }
        return element;
    }
}

/*
    Source skeleton
        Model pointer OR schema pointer
            IF schema, then the skeleton will create a new Model when it is copied, UNLESS a model is given to the skeleton copy Constructor. 
            Other wise, the skeleton will automatically assign the Model to the case object. 

        The model will automatically copy it's element data into the copy, zipping the data down as the Constructor builds the Source's children.

*/
export class SourceSkeleton {

    constructor(element, constructor, data, presets, index) {
        this.ele = element;
        this.Constructor = constructor;
        this.children = [];
        this.templates = [];
        this.filters = [];
        this.terms = [];
        this.d = data;
        this.p = presets;
        this.i = index;
    }

    /**
    
    */
    flesh(Model = null) {
        let Source = this.____copy____(null, null, null);

        Source.load(Model);

        return Source;
    }

    /**
        Constructs a new object, attaching to elements hosted by a case. If the component to construct is a Source, then the 
        parent_element gets swapped out by a cloned element that is hosted by the newly constructed Source.
    */
    ____copy____(parent_element, parent, indexer) {

        let element, CLAIMED_ELEMENT = false;

        if (this.i > 0) {
            element = indexer.get(this.i);
            CLAIMED_ELEMENT = true;
        }

        if (this.ele) {
            parent_element = this.ele.cloneNode(true);

            if (parent_element.parentElement) {
                parent_element.parentElement.replaceNode(parent_element, element);
            }


            indexer = new Indexer(parent_element);
        }

        let out_object;
        if (this.Constructor) {
            out_object = new this.Constructor(parent, this.d, this.p, element);
            if (CLAIMED_ELEMENT)
                out_object.ele = element;
        } else if (!parent) {
            out_object = this.children[0].____copy____(parent_element, null, indexer);
            out_object.ele = parent_element;
            console.log(parent_element.innerHTML)
            return out_object;
        } else
            out_object = parent;


        if (this.children.length > 0)
            for (var i = 0, l = this.children.length; i < l; i++)
                this.children[i].____copy____(parent_element, out_object, indexer);

        if (this.templates.length > 0) {

            if (this.terms.length > 0)
                for (var i = 0, l = this.terms.length; i < l; i++)
                    out_object.terms.push(this.terms[i].____copy____(parent_element, null, indexer));

            if (this.filters.length > 0)
                for (var i = 0, l = this.filters.length; i < l; i++)
                    out_object.filters.push(this.filters[i].____copy____(parent_element, null, indexer));

            for (var i = 0, l = this.templates.length; i < l; i++)
                out_object.templates.push(this.templates[i]);
        }

        return out_object;
    }
}