import { Lexer } from "../common/common"

import * as AST from "./ast"

/*
    This function's role is to construct a case skeleton given a template, a list of presets, and 
    and optionally a working DOM. This will return Source Skeleton that can be cloned into a new Source object. 

    @param {HTMLElement} Template
    @param {Presets} presets 
    @param {DOMElement} WORKING_DOM - Should include any other templates that need to be rolled in. 
*/
export function SourceConstructor(Template, Presets) {

    let skeleton;

    if (!Template)
        return null;

    if (Template.skeleton)
        return Template.skeleton;

    let element = document.importNode(Template, true);

    skeleton = ComponentConstructor(element, Presets);

    if (!skeleton)
        return null;

    Template.skeleton = ((skeleton) => (model) => skeleton.flesh(model))(skeleton);

    return Template.skeleton;
}


function ComponentConstructor(element, presets) {

    let attributes = [];
    let props = [];

    if (element.tagName === "TEMPLATE") {
        let component_name = element.id;
        let input = element.innerHTML;

        input = input.replace(/\&lt;/g, "<")
        input = input.replace(/\&gt;/g, ">")
        let lexer = new Lexer(input);

        //Make sure we are starting with a case object. 

        if (lexer.text == "<") {
            //off to a good start
            let root = new AST.Root();
            ParseTag(lexer, root, presets);
            return root.constructSkeleton(presets);
        }
    }
    return null;
}

function MiniParse(string, root, presets) {
    const lexer = Lex(string);
    if (lexer.text == "<") {
        ParseTag(lexer, root, presets);
    }
}


/**
    Handles the selection of AST nodes based on tagname;
    
    @param {Lexer} lexer - The lexical parser 
    @param {String} tagname - The elements tagname
    @param {Object} attributes - 
    @param {Object} ctx
    @param {CCAstNode} parent
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
            let lexer = Lex(element.innerHTML);

            while (lexer.text)
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

    lexer.assert("<")

    let tagname = lexer.text;

    if (lexer.type == lexer.types.id) {
        lexer.next();
        GetAttributes(lexer, attributes);
    } else throw new Error(`Expected tag-name identifier, got ${lexer.text}, lex: ${lexer.type}`);

    let ele = Dispatch(lexer, tagname, attributes, parent, presets);

    ele.open_tag += lexer.slice(begin);

    let start = lexer.pos;

    if (start < 0) throw new Error(`Unexpected end of output. Tag <${tagname}> at pos ${begin} has not been closed.`);

    while (true) {

        if (!lexer.text)
            throw new Error(`Unexpected end of output. Tag <${tagname}> at pos ${begin} has not been closed.`);

        switch (lexer.text) {
            case "<":
                if (lexer.peek().text == "/") {

                    ele.html += lexer.slice(start);

                    let begin = start;

                    start = lexer.pos;


                    //Should be closing it's own tag.
                    lexer.sync();
                    lexer.a("/");

                    if (lexer.text !== tagname)
                        throw new Error(`Unexpected closing Tag. Expected </${tagname}>  but got </${lexer.text}>.`);

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