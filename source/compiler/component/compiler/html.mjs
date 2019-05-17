import whind from "@candlefw/whind";
import URL from "@candlefw/url";

import { EL } from "../../short_names";
import { CreateHTMLNode } from "./nodes/index";



async function complete(lex, ScopePackage, presets, ast, url, win) {


    //Record URL if present for proper error messaging. 
    if (url && !ast.url)
        ast.url = url;

    /*
     * Only accept certain nodes for mounting to the DOM. 
     * The custom element `import` is simply used to import extra HTML data from network for use with template system. It should not exist otherwise.
     */
    if (ast.tag) {
        if ((ast.tag == "import" || ast.tag == "link")) {
            //add tags to package itself.
            ScopePackage.links.push(ast);
        } else if (ast.tag !== "template") {
            ScopePackage.asts.push(ast);
        }
    }

    lex.IWS = true;

    while (!lex.END && lex.ch != "<") { lex.n; }

    if (!lex.END)
        return await parseText(lex, ScopePackage, presets, url, win);

    ScopePackage.complete();

    return ScopePackage;
}

async function buildCSS(lex, ScopePackage, presets, ast, css_list, index, url, win) {
    await css_list[index].READY();

    if (++index < css_list.length) return await buildCSS(lex, ScopePackage, presets, ast, css_list, index, url, win);

    ast.linkCSS(null, win);

    return await complete(lex, ScopePackage, presets, ast, url, win);
}

export async function parseText(lex, ScopePackage, presets, url, win) {
    let start = lex.off;

    while (!lex.END && lex.ch != "<") { lex.n; }

    if (!lex.END) {

        if (lex.pk.ty != lex.types.id)
            lex.throw(`Expecting an Identifier after '<' character, ${lex.str}`);

        let node = await CreateHTMLNode(lex.p.tx);

        node.presets = presets;

        try {
            const ast = await node.parse(lex, url)

            if (ast.css && ast.css.length > 0)
                return await buildCSS(lex, ScopePackage, presets, ast, ast.css, 0, url, win);

            return await complete(lex, ScopePackage, presets, ast, url, win);
        } catch (e) {
            ScopePackage.addError(e);
            ScopePackage.complete();

            return ScopePackage;
        }
    }
    
    ScopePackage.addError(new Error(`Unexpected end of input. ${lex.slice(start)}, ${lex.str}`));
    ScopePackage.complete();
}


/**
 * Compiles an object graph based input into a ScopePackage.
 * @param      {ScopePackage}  ScopePackage     The scope package
 * @param      {Presets}  presets           The global Presets instance
 * @param      {HTMLElement | Lexer | string}  element     The element
 * @memberof module:wick~internals.templateCompiler
 * @alias CompileScope
 */
function HTMLCompiler(ScopePackage, presets, element, url, win = window) {
    
    if(!url)
        url = URL.G;

    let lex;
    if (element instanceof whind.constructor) {
        lex = element;
    } else if (typeof(element) == "string")
        lex = whind(element);
    else if (element instanceof EL) {
        if (element.tagName == "TEMPLATE") {
            let temp = document.createElement("div");
            temp.appendChild(element.content);
            element = temp;
        }
        lex = whind(element.innerHTML);
    } else {
        let e = new Error("Cannot compile component");
        ScopePackage.addError(e);
        ScopePackage.complete();
    }
    return parseText(lex, ScopePackage, presets, url, win);
}

export { HTMLCompiler };
