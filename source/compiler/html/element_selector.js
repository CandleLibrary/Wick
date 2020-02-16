import ElementNode from "./element.js";
import TextNode from "./text.js";
import ScriptNode from "./script.js";
import ScopeNode from "./scope.js";
import LinkNode from "./link.js";
import ContainerNode from "./container.js";
import StyleNode from "./style.js";
import VoidNode from "./void.js";
import SVGNode from "./svg.js";
import SlotNode from "./slot.js";
import NonBindingNode from "./non_binding.js";
import FilterNode from "./filter.js";
import ImportNode from "./import.js";
import plugin from "../../plugin/system.js";
import whind from "@candlefw/whind";
import compile from "../parser.js";

const node_constructors = {
    element: ElementNode,
    script: ScriptNode,
    scope: ScopeNode,
    link: LinkNode,
    container: ContainerNode,
    style: StyleNode,
    void: VoidNode,
    svg: SVGNode,
    slot: SlotNode,
    nonbinding: NonBindingNode,
    filter: FilterNode,
    import: ImportNode,
    text: TextNode,
    whind,
    compile
};

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
        case "wc":
        case "container":
            Constructor = ContainerNode;
            break;
        case "ws":
        case "scope":
            Constructor = ScopeNode;
            break;
        case "slot":
            Constructor = SlotNode;
            break;
        case "import":
            Constructor = ImportNode;
            break;
            //Elements that should not be parsed for binding points.
        case "pre":
        case "textarea":
            Constructor = NonBindingNode;
            break;
        case "img":
            USE_PENDING_LOAD = "src";
            /* intentional */
        case "code":
        default:
            Constructor = ElementNode;
            break;
    }

    node = new Constructor(env, presets, tag, children, attribs, USE_PENDING_LOAD);

    if (plugin_element[tag])
        node = plugin_element[tag].run(node, lex, env, node_constructors) || node;

    node.wickup = meta || false;

    node.SINGLE = !FULL;

    return node;
}