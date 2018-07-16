import { Lexer } from "../common/string_parsing/lexer"

import { SourcePackage } from "./package"

import { CSSParser } from "../common/css/parser/parser"

import { CSSRootNode } from "../common/css/parser/tree/root"

import * as AST from "./ast"

/**
 * This function's role is to construct a SourcePackage given a template, the global presets, and, optionally, a working HTMLElement to serve as a source of. 
 * This will return SourcePackage can be used to bind an HTMLElement and an optional Model to a set of new Sources. 
 *    
 * @param      {HTMLElement} Template  The template
 * @param      {Presets} presets   The presets
 * @param      {DOMElement} WORKING_DOM - Should include any other templates that need to be rolled in. 
 * @return     {SourcePackage}  SourcePackage can be used to bind an HTMLElement and an optional Model to a generated of Sources.
 */
export function SourceConstructor(Template, Presets) {

    let $package;

    if (!Template)
        return null;

    if (Template.package)
        return Template.package;

    let element = document.importNode(Template, true);

    $package = TemplateConstructor(element, Presets);


    if (!$package)
        return null;

    $package.frz();

    Template.package = $package;

    return $package;
}



function TemplateConstructor(element, presets) {

    let attributes = [];
    let props = [];

    if (element.tagName === "TEMPLATE") {
        let HAS_OUTPUT = false;
        let $package = new SourcePackage();
        let CSS_OM = new CSSRootNode;
        let component_name = element.id;

        let ele = document.createElement("span")
        ele.appendChild(element.content);

        const imported_presets = {css:null, trs:{}};

        imported_presets.css = CSS_OM;

        presets.imported = imported_presets;


        // CSS
        let children = ele.getElementsByTagName("style");
        for (let i = 0, l = children.length; i < l; i++) {
            let child = children[i];
            $package.styles.push(child);
            CSSParser(child.innerHTML, CSS_OM);
        }

        // Javascript
        children = ele.getElementsByTagName("script");
        for (let i = 0, l = children.length; i < l; i++) {
            let child = children[i];
            let $function = new Function("wick", "presets", child.innerHTML);
            $function(wick, imported_presets);
            $package.scripts.push(child);
        }

        // HTML
        children = ele.getElementsByTagName("w-s");
        for (let i = 0, l = children.length; i < l; i++) {
            let child = children[i];
            try {
                let input = child.outerHTML;
                /* Turn escaped symbols back into their original form. */
                input = input.replace(/\&lt;/g, "<")
                input = input.replace(/\&gt;/g, ">")
                let lexer = new Lexer(input);
                let root = new AST.Root();
                ParseTag(lexer, root, presets);
                $package.skeletons.push(root.constructSkeleton(presets));
                HAS_OUTPUT = true;
            } catch (e) {
                console.error(e);
            }
            break;
        }

        if (HAS_OUTPUT)
            return $package;
    }
    return null;
}

function MiniParse(string, root, presets) {
    const lexer = new Lexer(string);
    if (lexer.tx == "<") {
        ParseTag(lexer, root, presets);
    }
}

/**
 * Handles the selection of AST nodes based on tagname;
 *
 * @class      Dispatch (name)
 * @param      {Lexer}  lexer       The lexical parser
 * @param      {String}  tagname     The elements tagname
 * @param      {Object}  attributes  The attributes
 * @param      {CCAstNode}  parent      The parent
 * @param      {Object}  presets     The presets
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
            return ast;
        case "w-filter":
            ast = new AST.FilterNode(tagname, attributes, parent);
            return ast;
        case "w-term":
            ast = new AST.TermNode(tagname, attributes, parent);
            return ast;
        case "w-s":
        case "w-src":
        case "w-source":
        case "w_s":
        case "w_src":
        case "w_source":
            ast = new AST.SourceNode(tagname, attributes, parent);
            return ast;
        default:
            if (tagname[0] == "w") {
                ast = new AST.PipeNode(tagname, attributes, parent);
                return ast;
            }
            break;
    }
    ast = new AST.GenericNode(tagname, attributes, parent, MiniParse, presets);
    return ast;
}


function HandleTemplateImport(ele, presets) {

    let tagname = ele.tagname;

    if (presets.templates[tagname]) {

        let template = presets.templates[tagname];

        if (template) {

            let element = document.importNode(template, true);

            let lexer = new Lexer(element.innerHTML);

            while (lexer.tx && !lexer.END)
                ParseTag(lexer, ele, presets);

        } else {

            //Networking setup here if element is undefined but the Node has network calls. 
        }
    }
}

/**
    Handles the parsing of HTML tags and content
    @param {String} tagname
    @param {Object} ctx
    @param {CCAstNode} parent
*/
function ParseTag(lexer, parent, presets) {
    let begin = lexer.pos;
    let attributes = {};

    lexer.a("<")

    let tagname = lexer.tx;

    if (lexer.ty == lexer.types.id) {
        lexer.next();
        GetAttributes(lexer, attributes);
    } else throw new Error(`Expected tag-name identifier, got ${lexer.tx}, lex: ${lexer.ty}`);

    let ele = Dispatch(lexer, tagname, attributes, parent, presets);

    ele.open_tag += lexer.slice(begin);

    let start = lexer.pos;

    if (start < 0) throw new Error(`Unexpected end of output. Tag <${tagname}> at pos ${begin} has not been closed.`);

    while (true) {

        if (!lexer.tx || lexer.END)
            throw new Error(`Unexpected end of output. Tag <${tagname}> at pos ${begin} has not been closed.`);

        switch (lexer.tx) {
            case "<":
                if (lexer.pk.tx == "/") {

                    ele.html += lexer.slice(start);

                    let begin = start;

                    start = lexer.pos;


                    //Should be closing it's own tag.
                    lexer.sync();
                    lexer.a("/");

                    if (lexer.tx !== tagname)
                        throw new Error(`Unexpected closing Tag. Expected </${tagname}>  but got </${lexer.tx}>.`);

                    lexer.n();

                    let out = lexer.pos + 1;

                    lexer.a(">");

                    ele.close_tag = lexer.slice(start);

                    if (start - begin < 1)
                        HandleTemplateImport(ele, presets)


                    ele.finalize(parent || {
                        html: ""
                    }, presets);

                    return out;
                } else
                    start = ParseTag(lexer, ele, presets);
                break;
            case "[":
                ele.html += lexer.slice(start);
                lexer.n()
                let prop_name = lexer.text;
                lexer.n()
                start = lexer.pos + 1;
                lexer.a("]");
                start = ele.addProp(lexer, prop_name, ParseTag, presets) || start;
                break;
            default:
                lexer.n();
        }
    }
}

/**
    Returns all attributes in an element as a key-value object.

    @param {Lexer} lexer - The lexical parser  
    @param {Object} attribs - An object which will receive the attribute keys and values. 
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