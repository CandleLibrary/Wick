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
import ImportNode from "./import.mjs";
//import Plugin from "../../../plugin.mjs";

export default function (sym, env, lex){ 
	const 
        FULL = sym.length > 5,
        tag = sym[1],
        attribs = sym[2],
        children = (FULL) ? sym[4] : [];

    const presets = env.presets;

    let node = null;

    switch (tag) {
        case "filter":
        case "f":
            node =  new FilterNode(attribs, presets); break;
        case "a":
            node =  new LinkNode(children, attribs, presets); break;
            /** void elements **/
        case "template":
            node =  new VoidNode(tag, children, attribs, presets); break;
        case "css":
        case "style":
            node =  new StyleNode(children, attribs, presets); break;
        case "script":
            node =  new ScriptNode(children, attribs, presets); break;
        case "svg":
        case "path":
            node =  new SVGNode(tag, children, attribs, presets); break;
        case "container":
            node =  new ContainerNode(children, attribs, presets); break;
        case "scope":
            node =  new ScopeNode(children, attribs, presets); break;
        case "slot":
            node =  new SlotNode(children, attribs, presets); break;
        case "import":
            node =  new ImportNode(attribs, presets); break;
            //Elements that should not be parsed for binding points.
        case "pre":
        case "code":
            node =  new PreNode(children, attribs, presets); break;
        default:
            node =  new ElementNode(tag, children, attribs, presets); break;
    }

    node.SINGLE = !FULL;

    return node;
}
