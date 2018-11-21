import whind from "whind";
import { WURL } from "../../network/wurl";
import { LinkedList } from "../../common/extends/ll";

/** NODE TYPE IDENTIFIERS **/
const HTML = 0;
const TEXT = 1;
const offset = "    ";


/**
 * An AST node for text data.
 * @param  {string}  str     The text value of the node.
 * @memberof module:wick~internals.html
 * @alias TextNode
 */
class TextNode {

    constructor(str = "") {
        /**
         * The text value
         */
        this.txt = str;
    }

    /**
     * Returns the type of `1` (`TEXT`)
     */
    get type() {
        return TEXT;
    }

    /**
     * Returns a string representation of the object.
     * @param      {string}  str     Optional string passed down from calling method.
     * @return     {string}  String representation of the object.
     */
    toString(off = 0) {
        return `${offset.repeat(off)} ${this.txt}\n`;
    }

    /**
     * Builds a real DOM HTMLTextNode node. 
     * @param      {HTMLElement}  parent  The real html element.
     */
    _build_(parent) {
        parent.appendChild(document.createTextNode(this.txt));
    }

}



/**
 * TextNode implements some of LinkedList
 * @extends LinkedList
 * @memberof  module:wick~internals.html.TextNode
 */
Object.assign(TextNode.prototype, LinkedList.props.defaults, LinkedList.props.parent, LinkedList.methods.defaults);



/**
 * An AST node for HTML data. 
 * Handles the parsing of HTML strings.
 * @memberof module:wick~internals.html
 * @alias HTMLNode
 */
class HTMLNode {

    constructor() {

        /**
         * Element _attributes_
         * @public
         */
        this._attributes_ = [];

        /**
         * Any Comment Lines found within.
         * @private
         */
        //this.dtd_nodes = [];

        /**
         * The tag name of the object.
         * @public
         */
        this.tag = "";

        /**
         * A WURL instance when set.
         * @private
         */
        this.url = null;

        /**
         * Whether the node is a DTD, such as a comment.
         * @private
         */
        this.DTD = false;

        /**
         * True if the element is a single tag element. 
         */
        this.single = false;

    }



    /******************************************* ATTRIBUTE AND ELEMENT ACCESS ******************************************************************************************************************/



    /**
     * Returns the type of `0` (`HTML`)
     * @public
     */
    get type() {
        return HTML;
    }

    get tagName() {
        return this.tag.toUpperCase();
    }

    get classList() {
        let classes = this.getAttrib("class");
        if (typeof classes.value == "string")
            return classes.split(" ");
        return [];
    }

    getAttribute(name) {
        let attrib = this.getAttrib(name);
        return (attrib) ? attrib.value : void 0;
    }

    get parentElement() {
        return this.par;
    }

    get previousElementSibling() {
        if (this.par) {
            let guard = this.par.fch;

            if (this == guard) return null;

            let node = this.pre;

            while (node && node != gaurd) {
                if (node.type == HTML)
                    return node;
                node = node.pre;
            }

            if (node.type == HTML)
                return node;
        }
        return null;
    }

    get nextElementSibling() {
        if (this.par) {
            let guard = this.par.fch;

            let node = this.nxt;

            while (node && node != guard) {
                if (node.type == HTML)
                    return node;
                node = node.nxt;
            }
        }
        return null;
    }



    /**
     * Gets an attribute.
     * @param      {string}  prop    The attribute name to lookup;
     * @public
     */
    getAttrib(prop) {
        for (let i = -1, l = this._attributes_.length; ++i < l;) {
            let attrib = this._attributes_[i];
            if (attrib.name == prop) return attrib;
        }
        return null;
    }



    /**
     * Get Elements by the tag name.
     * @param      {string}   tag                  A string to match with the element's tag value.
     * @param      {boolean}  [INCLUDE_DESCENDANTS=false]  When `true` searching will recurse depth first into child elements.
     * @param      {Array}    array                Internal element store that is returned. 
     * @return     {Array}    An array of matched elements.
     * @public
     */
    getTag(tag, INCLUDE_DESCENDANTS = false, array = []) {
        for (let node = this.fch; node;
            (node = this.getN(node))) {
            if (node.type == HTML) {
                if (node.tag == tag) array.push(node);
                if (INCLUDE_DESCENDANTS) node.getTag(tag, INCLUDE_DESCENDANTS, array);
            }
        }
        return array;
    }



    /**
     * Get Elements by the tag name.
     * @param      {string}   _class               A string to find with the element's class value.
     * @param      {boolean}  [INCLUDE_DESCENDANTS=false]  When `true` searching will recurse depth first into child elements.
     * @param      {Array}    array                Internal element store that is returned. 
     * @return     {Array}    An array of matched elements.
     * @public
     */
    getClass(_class, INCLUDE_DESCENDANTS = false, array = []) {
        for (let node = this.fch; node;
            (node = this.getN(node))) {
            if (node.type == HTML) {
                if (node.class.includes(_class)) array.push(node);
                if (INCLUDE_DESCENDANTS) node.getClass(_class, INCLUDE_DESCENDANTS, array);
            }
        }
        return array;
    }



    /**
     * Get first element with matching id.
     * @param      {string}   id                   The identifier value to find.
     * @param      {boolean}  [INCLUDE_DESCENDANTS=false]  When `true` searching will recurse depth first into child elements.
     * @return     {HTMLNode}   The first element whose id matches.
     * @public
     */
    getID(id, INCLUDE_DESCENDANTS = false) {
        for (let node = this.fch, ch; node;
            (node = this.getN(node))) {
            if (node.type == HTML) {
                if (node.id == id) return node;
                if (INCLUDE_DESCENDANTS && (ch = node.getID(id, INCLUDE_DESCENDANTS))) return ch;
            }
        }
        return null;
    }



    /**
     * The id attribute value.
     * @public
     */
    get id() {
        let id_attrib = this.getAttrib("id");
        return (id_attrib) ? id_attrib.value : "";
    }



    /**
     * The class attribute value.
     * @public
     */
    get class() {
        let id_attrib = this.getAttrib("class");
        return (id_attrib) ? id_attrib.value : "";
    }



    /**
     * Returns a string representation of the object.
     * @return     {string}  String representation of the object.
     * @public
     */
    toString(off = 0) {
        let o = offset.repeat(off);

        let str = `${o}<${this.tag}`,
            atr = this._attributes_,
            i = -1,
            l = atr.length;

        while (++i < l) {
            let attr = atr[i];
            str += ` ${attr.name}="${attr.value}"`;
        }

        str += ">\n";
        
        if(this.single)
            return str;

        for (let node = this.fch; node;
            (node = this.getN(node))) {
            str += node.toString(off+1);
        }

        return str + `${o}</${this.tag}>\n`;
    }



    /******************************************* PARSING ******************************************************************************************************************/



    /**
     * Creates a text node. 
     *
     * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}
     * @param      {start}  start   The starting point of the data slice
     * @private
     */
    _createTextNode_(lex, start, end) {
        if (end) {
            let other_lex = lex.copy();
            other_lex.IWS = true;
            other_lex.off = start - 1;
            other_lex.tl = 1;
            other_lex.sl = end;
            other_lex.n();
            let text_node = this._processTextNodeHook_(other_lex, true);
            if (text_node) this.addC(text_node);
        } else if (start < lex.off) {
            let other_lex = lex.copy();
            other_lex.off = start;
            other_lex.END = false;
            other_lex.tl = 0;
            other_lex.fence(lex);
            other_lex.IWS = false;
            other_lex.n();
            other_lex.IWS = true;

            if ((other_lex.sl - other_lex.off) < 2)
                debugger;

            let text_node = this._processTextNodeHook_(other_lex, false);
            if (text_node) this.addC(text_node);
        }
    }



    /**
     * Parses an HTML open tag.
     * @param {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}  
     * @param {Object} attribs - An object which will receive the attribute keys and values. 
     * @private
     */
    _parseOpenTag_(lex, DTD, old_wurl) {
        let HAS_URL = false;

        while (!lex.END && lex.text !== ">" && lex.text !== "/") {

            if (DTD && lex.ch == "-" && lex.pk.ch == "-") {
                //_parse_ comment

                let pk = lex.pk;
                if (!lex.text) throw Error("Unexpected end of input.");
                let a = pk.n().ch,
                    b = pk.n().ch;
                while (!pk.END && (b !== "-" || a !== "-")) {
                    a = b;
                    b = pk.n().tx;
                }
                lex.sync().n();
                continue;
            }

            lex.IWS = false;
            
            let pk = lex.pk;
            
            while (!pk.END && !(pk.ty & (pk.types.ws | pk.types.str | pk.types.nl)) && pk.ch !== "=" && pk.ch !== ">") { pk.n(); }
            
            let attrib_name = pk.slice(lex);
            
            lex.sync(); 
            
            lex.IWS = true;

            let out_lex = lex.copy();
            
            out_lex.sl = lex.off;

            if (lex.ch == "=") {
                let pk = lex.pk;

                let start = pk.off;

                pk.IWS = true;
                while (!(pk.ty & (pk.types.ws | pk.types.str | pk.types.nl)) && pk.ch !== ">") { pk.n(); }
                pk.IWS = false;

                if (pk.off > start) {
                    out_lex = lex.n().copy();
                    out_lex.fence(pk);
                    lex.sync();
                } else {
                    //Have simple value
                    lex.sync(pk);
                    out_lex = lex.copy();
                    if (lex.pos < 0)
                        lex.throw(`Unexpected end of input. Expecting value for attribute "${attrib_name}"`);
                    else if (lex.type == lex.types.str) {
                        out_lex.tl = 1;
                        out_lex.n();
                        out_lex.sl = lex.pos + lex.tl - 1;
                        lex.n();
                    } else {
                        lex.next();
                        out_lex.fence(lex);
                    }
                }
            }

            if (attrib_name == "url") {
                this.url = WURL.resolveRelative(old_wurl, out_lex.slice());
                HAS_URL = true;
            }

            let attrib = this._processAttributeHook_(attrib_name, out_lex);

            if (attrib)
                this._attributes_.push(attrib);
        }

        if (lex.text == "/") // Void Nodes
            lex.assert("/");

        return HAS_URL;
    }

    _parseRunner_(lex = null, OPENED = false, IGNORE_TEXT_TILL_CLOSE_TAG = false, parent = null, old_wurl = null) {
        let start = lex.pos;
        let end = lex.pos;
        let HAS_INNER_TEXT = false;
        main_loop:
        while (!lex.END) {

            switch (lex.ch) {
                case "/":
                    if (lex.pk.ch == "<") { //ignore the white space.
                        lex.sync();
                        break;
                    }
                    break;

                case "<":
                    if (!IGNORE_TEXT_TILL_CLOSE_TAG) lex.IWS = true;

                    let pk = lex.pk;

                    if (pk.ch == "/") {
                        if (pk.pk.tx !== this.tag){
                             break main_loop;   
                        }

                        if (HAS_INNER_TEXT) {
                            if (IGNORE_TEXT_TILL_CLOSE_TAG)
                                this._createTextNode_(lex, start);
                            else if ((end - start) > 0)
                                this._createTextNode_(lex, start, end);
                        }

                        //Close tag
                        let name = lex.sync().n().tx;

                        //Close tag is not the one we are looking for. We'll create a new dummy node and close the tag with it. 
                        if (name !== this.tag) {
                            //Create new node with the open tag 
                            let insert = new HTMLNode();
                            insert.tag = name;
                            this.addC(insert);
                        }

                        lex.n();
                        lex.IWS = false;
                        lex.a(">");

                        this._endOfElementHook_(lex, parent);

                        return this;
                    }

                    if (pk.ch == "!") {
                        /* DTD - Doctype and Comment tags*/
                        //This type of tag is dropped
                        while (!lex.END && lex.n().ch !== ">") {};
                        lex.a(">");
                        continue;
                    }

                    if (!IGNORE_TEXT_TILL_CLOSE_TAG) {
                        //Open tag
                        if (!OPENED) {
                            let URL = false;
                            this.DTD = false;
                            this._attributes_.length = 0;

                            //Expect tag name 
                            this.tag = lex.n().tx.toLowerCase();


                            URL = this._parseOpenTag_(lex.n(), false, old_wurl);
                            start = lex.pos + 1;
                            lex.IWS = false;
                            if (lex.ch == "/") lex.n();
                            lex.a(">");


                            OPENED = true;

                            HAS_INNER_TEXT = IGNORE_TEXT_TILL_CLOSE_TAG = this._ignoreTillHook_(this.tag);

                            if (URL) {

                                //Need to block against ill advised URL fetches. 

                                //Hook to pull in data from remote resource
                                let prom = this._processFetchHook_(lex, true, IGNORE_TEXT_TILL_CLOSE_TAG, parent);

                                if (prom instanceof Promise) {
                                    return prom.then(() => {
                                        if (this._selfClosingTagHook_(this.tag)) {
                                            return this;
                                        } // Tags without matching end tags.
                                        return this._parseRunner_(lex, true, IGNORE_TEXT_TILL_CLOSE_TAG, this, old_wurl);
                                    });
                                }
                            }

                            if (this._selfClosingTagHook_(this.tag)){
                                 // Tags without matching end tags.
                                this.single = true;
                                return this;
                            }

                            continue;
                        } else {
                            lex.IWS = false;
                            //Create text node;
                            if (HAS_INNER_TEXT) {
                                if (IGNORE_TEXT_TILL_CLOSE_TAG)
                                    this._createTextNode_(lex, start);
                                else if ((end - start) > 0) {
                                    this._createTextNode_(lex, start, end);
                                }
                            }

                            //New Child node found
                            let node = this.createHTMLNodeHook(lex.pk.tx, lex.off);

                            this.addC(node);

                            return node._parse_(lex, false, false, this, this.url || old_wurl).then(child => {
                                if (child.DTD) node.remC(child);
                                return this._parseRunner_(lex, OPENED, false, this, old_wurl);
                            });
                        }
                        //}
                    }
                    lex.IWS = false;
                    break;
            }

            if (!IGNORE_TEXT_TILL_CLOSE_TAG) {
                if (lex.ty == 8 && !HAS_INNER_TEXT) {
                    start = lex.pos;
                } else if (lex.ty == 256) {} else {
                    HAS_INNER_TEXT = true;
                    end = lex.off + lex.tl;
                }
            }

            lex.n();
        }

        if (OPENED && start < lex.off) {
            //console.log("OPEND TEXT IMPORT", lex.slice(start));
            //Got here from an network import, need produce a text node;
            this._createTextNode_(lex, start);
        }

        return this;
    }

    /**
     * Parses HTML string. Appends new nodes, or consumes first node if tag is an empty string.
     * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}
     * @param      {boolean}  OPENED       The opened
     * @param      {boolean}  IGNORE_TEXT_TILL_CLOSE_TAG  If `true`, parser will ignore all HTML syntax until the closing tag is found.
     * @return     {Promise}  
     * @private
     */
    _parse_(lex = null, OPENED = false, IGNORE_TEXT_TILL_CLOSE_TAG = false, parent = null, url = new WURL(0, !!1)) {
        lex.IWS = false;
        return new Promise((res, rej) => {
            res(this._parseRunner_(lex, OPENED, IGNORE_TEXT_TILL_CLOSE_TAG, parent, url));
        });
    }

    /******************************************* HOOKS ******************************************************************************************************************/

    /**
     * Override this to act on the finished node, right before the parse function completes and returns.
     */
    _endOfElementHook_() {}



    /**
     * Override this method to tell the parser that `tag` is self closing and to not look for a matching close tag by returning `true`.
     * @param      {string}  tag     The HTML tag
     */
    _selfClosingTagHook_(tag) {
        switch (tag) {
            case "input":
            case "br":
            case "img":
            //svg
            case "rect":
                return true;
        }

        return false;
    }



    /**
     * Override this method to tell the parser to not to parse innerHTML by returning `true`
     * @param      {string}   tag     The HTML tag
     * @return     {boolean}  If `true` is returned, parser will not react to any more HTML markup until the closing tag for this node is found.
     * @public
     */
    _ignoreTillHook_(tag) {
        if (tag == "script" || tag == "style") // Special character escaping tags.
            return true;
        return false;
    }



    /**
     * Override this method to create a different node type for the given `tag` string.
     * > If overridden, returned node should support:
     * > - All properties and methods in {@link LinkedList}
     * > - All properties and methods in {@link HTMLNode}
     * @param      {string}    tag     The name of the tag to create. 
     * @param      {number} start Marks the offset position of the `<` character of the open tag. Can be used to walk the Lexer back and parse the open tag characters again.
     * @return     {HTMLNode}  returns a new HTMLNode.
     * @public
     */
    
createHTMLNodeHook(tag, start) { return new HTMLNode(tag); }



    /**
     * Override this method to process how a url based resource is fetched.
     * > If overridden:  
     * > - Should return null or a Promise that resumes html parsing by calling this._parse_(`lexer`, `OPENED`, `IGNORE_TEXT_TILL_CLOSE_TAG`, `parent`).
     * > - Please make sure a call to `this._parse_` includes `lexer`, `OPENED`, `IGNORE_TEXT_TILL_CLOSE_TAG`, and `parent`.
     * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}. It contains the HTML string being _parse_d.
     * @param      {boolean}  OPENED       Always set to `true`.
     * @param      {boolean}  IGNORE_TEXT_TILL_CLOSE_TAG  If `true`, parser will ignore all HTML syntax until the closing tag is found. 
     * @param      {HTMLNode|object}  parent       The parent node.
     * @return     {boolean | Promise}  If additional processing must be done asynchronously, return a `Promise` which will call this._parse_ when it is resolved.
     * @public
     */
    _processFetchHook_(lexer, OPENED, IGNORE_TEXT_TILL_CLOSE_TAG, parent, url) {
        let path = this.url.path,
            CAN_FETCH = true;

        //make sure URL is not already called by a parent.
        while (parent) {
            if (parent.url && parent.url.path == path) {
                console.warn(`Preventing recursion on resource ${this.url.path}`);
                CAN_FETCH = false;
                break;
            }
            parent = parent.par;
        }

        if (CAN_FETCH) {
            return this.url.fetchText().then((text) => {
                let lexer = whind(text);
                return this._parseRunner_(lexer, true, IGNORE_TEXT_TILL_CLOSE_TAG, this, this.url);
            }).catch((e) => {
                console.log(e);
            });
        }
        return null;
    }



    /**
     * Override this method to _parse_ attribute data. 
     * @param      {string}  name   The attribute name
     * @param      {string}  value  The attribute value
     * @return     {Object}  An attribute object to store in the `this._attributes_` array.
     * @public
     */
    _processAttributeHook_(name, lex) { return { name, value: lex.slice() }; }



    /**
     * Override this to process new TextNode data as it is encountered.
     * @param      {string}  text_node  The text node
     * @return     {TextNode}  TextNode to add to children list. Return null instead to prevent the node from being entered.
     * @public
     */
    _processTextNodeHook_(lex, IS_INNER_HTML) {
        if (!IS_INNER_HTML)
            return new TextNode(lex.slice());
        let txt = "";

        lex.IWS = true;

        while (!lex.END) {
            if (lex.ty == 8) {
                txt += " ";
            } else if (lex.ty == 256) {} else {
                txt += lex.tx;
            }
            lex.IWS = false;
            lex.n();
        }

        if (txt.length > 0) {
            return new TextNode(txt.trim());
        }

        return null;
    }



    /**
     * Constructs a new HTMLElement and appends to the parent element.
     * Iterates through children nodes, calling their `_build_` method, passing in it's own HTMLElement as the argument for parent. 
     * @param {HTMLElement}  parent  The parent HTMLElement to append sub elements to.
     */
    _build_(parent) {
        let ele = document.createElement(this.tag);

        for (let i = 0, l = this._attributes_.length; i < l; i++) {
            let attr = this._attributes_[i];
            ele.setAttribute(attr.name, attr.value);
        }
        //let passing_element = ele;
        let passing_element = (this.tag == "template") ? ele.content : ele;

        for (let node = this.fch; node;
            (node = this.getN(node))) {
            node._build_(passing_element);
        }

        if (parent) parent.appendChild(ele);

        return ele;
    }
}



/**
 * HTMLNode implements all of LinkedList
 * @extends LinkedList
 * @memberof  module:wick~internals.html.HTMLNode
 * @private
 */
Object.assign(HTMLNode.prototype, LinkedList.props.defaults, LinkedList.props.children, LinkedList.props.parent, LinkedList.methods.defaults, LinkedList.methods.parent_child);
LinkedList.setGettersAndSetters(HTMLNode.prototype);




/**
 * Builds an HTML AST. 
 * @function
 * @param {string} html_string - A string containing HTML data.
 * @param {string} css_string - An existing CSSRootNode to merge with new `selectors` and `rules`.
 * @return {Promise} Returns a `Promise` that will return a new or existing CSSRootNode.
 * @memberof module:wick.core
 * @alias html
 */
const HTMLParser = (html_string, root = null, url) => (root = (!root || !(root instanceof HTMLNode)) ? new HTMLNode() : root, root._parse_(whind(html_string.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">"), true, false, null, url)));

export { HTMLNode, HTMLParser, TextNode };