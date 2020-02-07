import ElementNode from "./element.js";
import ScriptNode from "./script.js";
import ScopeNode from "./scope.js";
import LinkNode from "./link.js";
import ContainerNode from "./container.js";
import StyleNode from "./style.js";
import VoidNode from "./void.js";
import SVGNode from "./svg.js";
import SlotNode from "./slot.js";
import PreNode from "./pre.js";
import FilterNode from "./filter.js";
import ImportNode from "./import.js";
import plugin from "../../plugin/system.js";

const plugin_element = plugin.register("element");

export default function es(tag, attribs, children, env, lex, meta = 0) {    

    const
        FULL = !!children;

    attribs = attribs || [];
    children = (Array.isArray(children)) ? children : children ? [children] : [];

    const presets = env.presets;

    let node = null,
        Constructor = null,
        USE_PENDING_LOAD = "";

    switch (tag) {
        case "filter":
        case "f":
            Constructor = FilterNode;
            break;
        case "a":
            Constructor = LinkNode;
            break;
            /** void elements **/
        case "template":
            Constructor = VoidNode;
            break;
        case "css":
        case "style":
            Constructor = StyleNode;
            break;
        case "script":
        case "js":
            Constructor = ScriptNode;
            break;
        case "svg":
        case "path":
            Constructor = SVGNode;
            break;
        case "container":
            Constructor = ContainerNode;
            break;
        case "scope":
            Constructor = ScopeNode;
            break;
        case "slot":
            Constructor = SlotNode;
            break;
        case "link":
        case "import":
            Constructor = ImportNode;
            break;
            //Elements that should not be parsed for binding points.
        case "pre":
            Constructor = PreNode;
            break;
        case "img":
            USE_PENDING_LOAD = "src";
            /* intentional */
        case "code":
        default:
            Constructor = ElementNode;
            break;
    }

    node = new Constructor(env, tag, children, attribs, presets, USE_PENDING_LOAD);

    if(plugin_element[tag])
        node = plugin_element[tag].run(node, lex, env) || node;

    node.wickup = meta || false;

    node.SINGLE = !FULL;

    return node;
}
