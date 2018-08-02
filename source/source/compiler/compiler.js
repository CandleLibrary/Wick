import { EL } from "../../common/short_names";
import { Lexer } from "../../common/string_parsing/lexer";
import { RootNode, CreateHTMLNode } from "./nodes/index";
import { Skeleton } from "../skeleton";



function complete(lex, SourcePackage, presets, ast) {

    if (ast.tag) { // Kludge to make sure ast actually has content
        let skeleton = new Skeleton(ast, presets);
        SourcePackage._skeletons_.push(skeleton);
    }

    lex.IWS = true;

    while (!lex.END && lex.ch != "<") { lex.n(); }
    if (!lex.END)
        return parseText(lex, SourcePackage, presets);

    SourcePackage._complete_();

    return SourcePackage;
}

export function parseText(lex, SourcePackage, presets) {
    let start = lex.off;
    while (!lex.END && lex.ch != "<") { lex.n(); }

    if (!lex.END) {

        if (lex.pk.ty != lex.types.id){
            console.log(lex.slice())
            throw new Error("Expecting an Identifier after `<` character");
        }
        
        let node = CreateHTMLNode(lex.p.tx);
        
        node.presets = presets;

        return node._parse_(lex).then((ast) => {
            if (ast.css) {

                let css = ast.css;

                return css._READY_().then((css) => {
                    ast._linkCSS_(css);
                    return complete(lex, SourcePackage, presets, ast);
                });
            }

            return complete(lex, SourcePackage, presets, ast);
        }).catch((e) => {
            SourcePackage._addError_(e);
            SourcePackage._complete_();
            console.warn(e);
            throw e;
        });
    }
    console.log(lex.slice());
    let err = `Unexpected end of input. ${lex.slice(start)}`;

    SourcePackage._addError_(err);
    debugger
    SourcePackage._complete_();
    console.warn(err);
}


/**
 * Compiles an object graph based input into a SourcePackage.
 * @param      {SourcePackage}  SourcePackage     The source package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {HTMLElement | Lexer | string}  element     The element
 * @memberof module:wick~internals.templateCompiler
 * @alias CompileSource
 */
function CompileSource(SourcePackage, presets, element) {
    let lex;
    if (element instanceof Lexer) {
        lex = element;
    } else if (typeof(element) == "string")
        lex = new Lexer(element);
    else if (element instanceof EL) {
        if (element.tagName == "TEMPLATE") {
            let temp = document.createElement("div");
            temp.appendChild(element.content);
            element = temp;
        }
        lex = new Lexer(element.outerHTML);
    } else {
        let e = new Error("Cannot compile component");
        SourcePackage._addError_(e);
        SourcePackage._complete_();
        throw e;
    }
    return parseText(lex, SourcePackage, presets);
}

export { CompileSource };