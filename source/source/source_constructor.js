import { Lex } from "../common/common"

import * as AST from "./source_constructor_ast"

/*
    This function's role is to construct a case skeleton given a template, a list of presets, and 
    and optionally a working DOM. This will return Source Skeleton that can be cloned into a new Source object. 

    @param {HTMLElement} Template
    @param {Presets} presets 
    @param {DOMElement} WORKING_DOM - Should include any other templates that need to be rolled in. 
*/
export function SourceConstructor(Template, Presets, WORKING_DOM) {

    let skeleton;

    if (!Template)
        return null;

    if (Template.skeleton)
        return Template.skeleton;


    //TEmplate Filtration handled here.
    //Import the 
    let element = document.importNode(Template, true);

    skeleton = ComponentConstructor(element, Presets, WORKING_DOM);

    if (!skeleton)
        return null;

    Template.skeleton = ((skeleton) => (model) => skeleton.flesh(model))(skeleton);

    return Template.skeleton;
}


function ComponentConstructor(element, presets, WORKING_DOM) {

    let attributes = [];
    let props = [];

    if (element.tagName === "TEMPLATE") {
        let component_name = element.id;
        let input = element.innerHTML;
        let lexer = Lex(input);

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

function MiniParse(string, root, presets){
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
        case "w-c":
        case "w_c":
        case "w-case":
        case "w_case":
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

/**
    Handles the parsing of HTML tags and content
    @param {String} tagname
    @param {Object} ctx
    @param {CCAstNode} parent
*/
function ParseTag(lexer, parent, presets) {
    let start = lexer.pos;
    let attributes = {};

    lexer.assert("<")

    let tagname = lexer.text;

    if (lexer.type == "identifier") {
        lexer.next();
        GetAttributes(lexer, attributes);
    } else throw new Error(`Expected tag-name identifier, got ${lexer.text}`);

    let ele = Dispatch(lexer, tagname, attributes, parent, presets);

    ele.open_tag += lexer.slice(start);

    start = lexer.token.pos;

    while (true) {

        if (!lexer.text)
            throw ("Unexpected end of output");

        switch (lexer.text) {
            case "<":
                if (lexer.peek().text == "/") {

                    ele.html += lexer.slice(start);

                    start = lexer.pos;

                    //Should be closing it's own tag.
                    lexer.assert("<");
                    lexer.assert("/");
                    lexer.assert(tagname);

                    let out = lexer.pos + 1;

                    lexer.assert(">");

                    ele.close_tag = lexer.slice(start);

                    ele.finalize(parent || { html: "" }, presets);

                    return out;
                } else
                    start = ParseTag(lexer, ele);
                break;
            case "[":
                ele.html += lexer.slice(start);
                lexer.next()
                let prop_name = lexer.text;
                lexer.next()
                start = lexer.pos + 1;
                lexer.assert("]");
                start = ele.addProp(lexer, prop_name, ParseTag, presets) || start;
                break;
            default:
                lexer.next();
                break;
        }
    }
}

/**
    Returns all attributes in an element as a key-value object.

    @param {Lexer} lexer - The lexical parser  
    @param {Object} attibs - An object which will receive the attribute keys and values. 
*/
function GetAttributes(lexer, attribs) {
    while (lexer.text !== ">" && lexer.text !== "/") {
        if (!lexer.text) throw Error("Unexpected end of input.");
        let attrib_name = lexer.text;
        let attrib_val = null;
        lexer.next();
        if (lexer.text == "=") {
            lexer.next();
            if (lexer.token.type == "string") {
                attrib_val = lexer.text.slice(1, -1);
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