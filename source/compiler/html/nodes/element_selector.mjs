import ElementNode from "./element.mjs";
import ScriptNode from "./script.mjs";
import ScopeNode from "./scope.mjs";
import LinkNode from "./link.mjs";
import ContainerNode from "./container.mjs";
import StyleNode from "./style.mjs";
import VoidNode from "./void.mjs";
import SVGNode from "./svg.mjs";
import SlotNode from "./slot.mjs";
import PreNode from "./pre.mjs";
import FilterNode from "./filter.mjs";
//import Plugin from "../../../plugin.mjs";

export default function (sym, env, lex){ 
	const 
        FULL = sym.length > 5,
        tag = sym[1],
        attribs = sym[2],
        children = (FULL) ? sym[4] : [];

    let node = null;

    switch (tag) {
        case "filter":
        case "f":
            node =  new FilterNode(attribs); break;
        case "a":
            node =  new LinkNode(children, attribs); break;
            /** void elements **/
        case "template":
            node =  new VoidNode(tag, children, attribs); break;
        case "css":
        case "style":
            node =  new StyleNode(children, attribs); break;
        case "script":
            node =  new ScriptNode(children, attribs); break;
        case "svg":
        case "path":
            node =  new SVGNode(tag, children, attribs); break;
        case "container":
            node =  new ContainerNode(children, attribs); break;
        case "scope":
            node =  new ScopeNode(children, attribs); break;
        case "slot":
            node =  new SlotNode(children, attribs); break;
            //Elements that should not be parsed for binding points.
        case "pre":
        case "code":
            node =  new PreNode(children, attribs); break;
        default:
            node =  new ElementNode(tag, children, attribs); break;
    }

    node.SINGLE = !FULL;

    return node;
}