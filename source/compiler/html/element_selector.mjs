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
//import Plugin from "./../plugin.mjs";

export default function (sym, env, lex, st, stack, len){ 

	const 
        FULL = len > 5,
        tag = sym[1],
        attribs = (Array.isArray(sym[2]))  ? sym[2] : [],
        children = (FULL) ? (Array.isArray(sym[2])) ? sym[4] : sym[3] : [];

    const presets = env.presets;

    let node = null, cstr = null;
    
    switch (tag) {
        case "filter":
        case "f":
            cstr =  FilterNode; break;
        case "a":
            cstr =  LinkNode; break;
            /** void elements **/
        case "template":
            cstr =  VoidNode; break;
        case "css":
        case "style":
            cstr =  StyleNode; break;
        case "script":
            cstr =  ScriptNode; break;
        case "svg":
        case "path":
            cstr =  SVGNode; break;
        case "container":
            cstr =  ContainerNode; break;
        case "scope":
            cstr =  ScopeNode; break;
        case "slot":
            cstr =  SlotNode; break;
        case "import":
            cstr =  ImportNode; break;
            //Elements that should not be parsed for binding points.
        case "pre":
        case "code":
            cstr =  PreNode; break;
        default:
            cstr =  ElementNode; break;
    }

    node = new cstr(env, tag, children, attribs, presets);

    node.SINGLE = !FULL;

    return node;
}
