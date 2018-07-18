import {
    EL,
    STR,
    cE,
    OB,
    cN,
    aC,
    gETN
} from "../common/short_names"

import {
    Lexer
} from "../common/string_parsing/lexer"

import {
    CSSParser
} from "../common/css/parser/parser"

import {
    CSSRootNode
} from "../common/css/parser/tree/root"

import * as AST from "./ast"

import {
    Tap
} from "./tap/tap"

import {
    IO
} from "./io/io"

import {
    fetchLocalText
} from "../network/getter"

OB.freeze(Tap);
OB.freeze(IO);

const import_constructors = {
    Tap,
    IO
}

OB.freeze(import_constructors);

function MiniParse(string, root, presets) {
    const lexer = new Lexer(string);
    ParseTag(lexer, root, presets);
}

/** @lends module:wick~internals.templateCompiler */

/**
 * Handles the selection of AST nodes based on tagname;
 * @param      {Lexer}  lexer       The lexical parser
 * @param      {external:String}  tagname     The elements tagname
 * @param      {Object}  attributes  An object of attributes pulled from the tag.
 * @param      {CCAstNode}  parent      The parent
 * @param      {Object}  presets     The global Presets instance
 * @memberof module:wick~internals.templateCompiler
 * @return     {CCAstNode}     
 */
function Dispatch(lexer, tagname, attributes, parent, presets) {
    let ast;
    switch (tagname) {
        /* Taps */
        case "w":
        case "w-a":
        case "w_a":
            ast = new AST.TapNode(tagname, attributes, parent);
            break
        case "w-filter":
            ast = new AST.FilterNode(tagname, attributes, parent);
            break
        case "w-term":
            ast = new AST.TermNode(tagname, attributes, parent);
            break
        case "w-s":
        case "w-src":
        case "w-source":
        case "w_s":
        case "w_src":
        case "w_source":
            ast = new AST.SourceNode(tagname, attributes, parent);
            break
        default:
            if (tagname[0] == "w")
                ast = new AST.PipeNode(tagname, attributes, parent);
            else
                ast = new AST.GenericNode(tagname, attributes, parent, MiniParse, presets);
            break;
    }

    return ast;
}

/**
 * Imports HTML string data from other `<template>` tags.
 * @param      {external:HTMLElement} node The AstNode element.
 * @param      {Presets}  presets  The global Presets instance
 * @memberof module:wick~internals.templateCompiler
 * @todo Networking setup here if element is undefined but the tag has a URL link. 
 */
function HandleTemplateImport(node, presets) {

    let tagname = node.tagname;


    let template = presets.templates[tagname] || presets.imported.templates[tagname];

    if (template) {
        let lexer = new Lexer(template);
        while (lexer.tx && !lexer.END)
            ParseTag(lexer, node, presets);
    }
}


/**
 * Returns all attributes in an element as a key-value object.
 * @param {Lexer} lexer - The lexical parser  
 * @param {Object} attribs - An object which will receive the attribute keys and values. 
 * @memberof module:wick~internals.templateCompiler
 */
function GetAttributes(lexer, attribs) {
    while (lexer.text !== ">" && lexer.text !== "/") {
        if (!lexer.text) throw Error("Unexpected end of input.");

        if (lexer.type !== lexer.types.id)
            throw new Error(`Expected an identifier. Got ${lexer.type}:${lexer.text}`)

        let attrib_name = lexer.text;
        let attrib_val = null;

        lexer.next();

        if (lexer.text == "=") {
            lexer.next();

            if (lexer.pos < 0)
                throw Error(`Unexpected end of input. Expecting value for attribute "${attrib_name}"`);
            else if (lexer.type == lexer.types.str) {
                attrib_val = lexer.text.slice(1, -1);
                lexer.next();
            } else if (lexer.type == lexer.types.num) {
                attrib_val = parseFloat(lexer.text);
                lexer.next();
            } else if (lexer.type == lexer.types.sym) {
                attrib_val = lexer.text;
                lexer.next();
            } else
                throw new Error("Expecting attribute definition.");

        }
        attribs[attrib_name] = attrib_val;
    }

    if (lexer.text == "/") // Void Nodes
        lexer.assert("/");
    lexer.assert(">");
}

/**
 * Handles the parsing of HTML tags and their content.
 * @param {Lexer} lexer
 * @param {Object} parent
 * @param {Presets} presets
 * @memberof module:wick~internals.templateCompiler
 */
function ParseTag(lexer, parent, presets) {

    let ele = null,
        tagname = "",
        start = 0;

    while (!lexer.END) {

        if (!lexer.tx) lexer.throw(`Unexpected end of output. Tag <${tagname}> at pos ${begin} has not been closed.`);

        switch (lexer.tx) {
            case "<":
                if (lexer.pk.tx == "/") {

                    if (!ele) lexer.throw(`Unexpected closing Tag.`);

                    ele.html += lexer.slice(start);

                    let begin = start;

                    start = lexer.pos;

                    //Should be closing it's own tag
                    let out = lexer.sync().a("/").a(tagname).pos + 1;

                    ele.close_tag = lexer.a(">").slice(start);

                    if (start - begin < 1)
                        HandleTemplateImport(ele, presets)

                    ele.finalize(parent || {
                        html: ""
                    }, presets);

                    return out;
                } else if (ele) {
                    start = ParseTag(lexer, ele, presets);
                } else {
                    let begin = lexer.pos;

                    let attributes = {};

                    lexer.a("<")

                    tagname = lexer.tx;

                    if (lexer.ty == lexer.types.id) {
                        lexer.next();
                        GetAttributes(lexer, attributes);
                    } else lexer.throw(`Expected tag-name identifier, got ${lexer.tx}, lex: ${lexer.ty}`);

                    ele = Dispatch(lexer, tagname, attributes, parent, presets);

                    ele.open_tag += lexer.slice(begin);

                    start = lexer.pos;

                    if (tagname == "input") {
                        //debugger

                        ele.finalize(parent || {
                            html: ""
                        }, presets);

                        return start;
                    }
                }
                break;
            case "(":
                if (lexer.pk.tx == "(") {

                    if (!ele) ele = parent;

                    ele.html += lexer.slice(start);
                    let prop_name = lexer.sync().n().tx;
                    start = lexer.n().pos + 2;
                    lexer.a(")");
                    let a = ele.addProp(lexer, prop_name, ParseTag, presets);
                    if (a) start = a;
                    else lexer.a(")");
                } else
                    lexer.n();
                break;
            default:
                lexer.n();
        }
    }
}

/**
 * @param      {SourcePackage}  SourcePackage  The source package
 * @param      {external:String}  Error_Message  The error message
 * @memberof module:wick~internals.templateCompiler
 */
function completePackage(SourcePackage, Error_Message) {
    if (Error_Message)
        SourcePackage._rj_(Error_Message);
    else
        SourcePackage._cp_();
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {Object}  imported_presets  The imported presets
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @param      {Number}  index             The index
 * @param      {Array}  elements          The elements
 * @memberof module:wick~internals.templateCompiler
 */
function parseHTML(SourcePackage, presets, imported_presets, element, WORKING_DOM, index = 0, elements) {

    // HTML
    let import_parser = imported_presets.hooks.htmlParser;

    presets.imported = imported_presets;


    let templates = gETN(WORKING_DOM, 'template');
    for (let i = 0, l = templates.length, t; i < l; i++) {
        let span = cE("span");
        aC(span, cN(templates[i].content, true))
        imported_presets.templates[templates[i].id] = (typeof(import_parser) == "function") ? import_parser(span.innerHTML) : span.innerHTML;
    }

    let HAS_OUTPUT = false;

    element.innerHTML = (typeof(import_parser) == "function") ? import_parser(element.innerHTML) : element.innerHTML;

    let sources = element.children;

    for (let i = 0, l = sources.length; i < l; i++) {
        let child = sources[i];

        switch (child.tagName) {
            case "W-S":
            case "W_S":
            case "W-SOURCE":
                try {
                    let input = child.outerHTML;
                    /* Turn escaped symbols back into their original form. */
                    input = input.replace(/\&lt;/g, "<")
                    input = input.replace(/\&gt;/g, ">")
                    let lexer = new Lexer(input);
                    let root = new AST.Root();
                    ParseTag(lexer, root, presets, WORKING_DOM);
                    SourcePackage.skeletons.push(root.constructSkeleton(presets));
                    HAS_OUTPUT = true;
                } catch (e) {
                    console.error(e);
                }

        }
        //break

    }

    if (HAS_OUTPUT) completePackage(SourcePackage);
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @param      {Presets}  presets           The global Presets instance
 * @param      {Object}  imported_presets  The imported presets
 * @memberof module:wick~internals.templateCompiler
 */
function LoadCSS(SourcePackage, element, txt, imported_presets) {
    if (!txt) return false;
    SourcePackage.styles.push(element);
    CSSParser(txt, imported_presets.css);

    return true;
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {Object}  imported_presets  The imported presets
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @param      {Number}  index             The index
 * @param      {Array}  elements          The elements
 * @memberof module:wick~internals.templateCompiler
 */
function LoadCSSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index = 0, elements) {
    if (!elements) elements = gETN(element, "style");

    let l = elements.length;

    while (index < l) {
        let ele = elements[index++];
        let url = "";
        if (!LoadCSS(SourcePackage, ele, ele.innerHTML, imported_presets)) {
            if ((url = ele.getAttribute("src")))
                return fetchLocalText(url).then((str) => {
                    if (!LoadCSS(SourcePackage, ele, str, imported_presets)) SourcePackage._aE_(`Failed to load <style>: ${url}`);
                    return LoadCSSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements);
                }).catch((e) => LoadCSSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements))
        }
        return LoadCSSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements);
    }
    return parseHTML(SourcePackage, presets, imported_presets, element, WORKING_DOM);
}

function LoadJavascript(SourcePackag, element, txt, imported_presets) {
    if (!txt) return false;

    let $function = new Function("wick", "presets", txt);

    $function(import_constructors, imported_presets);

    SourcePackag.scripts.push(element);

    return true;
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {Object}  imported_presets  The imported presets
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @param      {Number}  index             The index
 * @param      {Array}  elements          The elements
 * @memberof module:wick~internals.templateCompiler
 */
function LoadJSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index = 0, elements) {

    if (!elements) elements = gETN(element, "script");

    let l = elements.length;

    while (index < l) {
        let ele = elements[index++];
        let url = "";
        if (!LoadJavascript(SourcePackage, ele, ele.innerHTML, imported_presets)) {
            if ((url = ele.getAttribute("src"))) {

                return fetchLocalText(url).then((str) => {
                    if (!LoadJavascript(SourcePackage, element, str, imported_presets)) SourcePackage._aE_(`Failed to load <script>: ${url}`);
                    return LoadJSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements);
                }).catch((e) => {
                    LoadJSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements)
                })
            }
        }
        return LoadJSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM, index, elements);
    }
    return LoadCSSEle(SourcePackage, presets, imported_presets, element, WORKING_DOM);
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @memberof module:wick~internals.templateCompiler
 */
function TemplateConstructor(SourcePackage, presets, element, WORKING_DOM) {

    let ele = cE("span");

    aC(ele, element.content);

    let CSS_OM = new CSSRootNode;
    // Functions in the template do not have access to the full wick library, but rather, a subset of necessary objects that they can 
    // extend.
    const imported_presets = {
        hooks: {
            htmlParser: null, // HTML parsing hook. 
            modelLoaded: null,
            mounted: null,
            unmounted: null,
        },
        css: null,
        trs: {},
        templates: {},
        tap: {},
        pipe: {},
        io: {}
    };

    imported_presets.css = CSS_OM;

   // OB.seal(imported_presets);

    return LoadJSEle(SourcePackage, presets, imported_presets, ele, WORKING_DOM);
}

/**
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {external:HTMLElement}  element           The element
 * @param      {external:HTMLElement}  WORKING_DOM       The working dom
 * @memberof module:wick~internals.templateCompiler
 * @alias CompileSource
 */
function CompileSource(SourcePackage, presets, element, WORKING_DOM) {

    //Only start compiling if element is actually a DOM element.
    if ((!element instanceof EL)) return;

    //Need to compile with a <template> element. If the element is not a template, one must be found.
    let template = element;

    if (template.tagName !== "TEMPLATE") {
        //The element may contain a <template>. See if it does. If, to KISS it, select just the first element.
        let temp = gETN(element, "template")[0];

        let HAVE_TEMPLATE = false;

        if (temp)
            template = temp, HAVE_TEMPLATE = true;

        if (!HAVE_TEMPLATE) {
            //Still no luck. Search the WORKING_DOM for a template whose id matches the element first class name.
            let class_id = element.classList[0];

            if (class_id instanceof STR) {

                let temps = gETN(WORKING_DOM, "template");

                for (let i = 0, l = temps.length; i < l; i++)
                    if (temps[i].id === class_id) {
                        template = temps[i];
                        HAVE_TEMPLATE = true;
                        break;
                    };
            }
        }

        if (!HAVE_TEMPLATE) {
            //Last resort, try loading from network. 
            let url = "";

            if ((url = element.getAttribute("src"))) {

                fetchLocalText(url).then(str => {
                    let element = cE("div");
                    element.innerHTML = str;
                    let template = gETN(element, "template")[0];
                    if (template)
                        //Since this is a network resource template package, it should be self contained, thus it won't incorporate the local WORKING_DOM
                        TemplateConstructor(SourcePackage, presets, template, element);
                    else
                        SourcePackage._rj_("Failed to load component");
                })
            }
            //No matter what, this function must return. template is either not found or we must wait for an asynch fetch of the template. 
            return;
        }
    }

    TemplateConstructor(SourcePackage, presets, template, WORKING_DOM);
}

export {CompileSource}