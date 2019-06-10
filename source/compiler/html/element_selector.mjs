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

function processChildren(children, env, lex) {

    let PREVIOUS_NODE = null;
    let RETRY = false;
    let previous = null;
    if (children.length > 1){
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            //If meta is true, then a wickup node was created. Use the tag name to determine the next course of action. 
            const tag = node.tag;
            const meta = node.wickup;

            if (meta) {
                switch (tag) {
                    case "blockquote":
                        node.wickup = false;
                        RETRY = true;
                        if (PREVIOUS_NODE && PREVIOUS_NODE.tag == "blockquote") {
                            let level = 1,
                                ul = PREVIOUS_NODE;
                            while (level < meta) {
                                let ul_child = ul.children[ul.children.length - 1];
                                if (ul_child && ul_child.tag == "blockquote") {
                                    ul = ul_child;
                                } else {
                                    ul_child = es("blockquote", null, [], env, lex);
                                    ul.children.push(ul_child)
                                    ul = ul_child;
                                }

                                level++;
                            }
                            ul.children.push(...node.children);
                            children.splice(i, 1);
                            i--;
                            node = PREVIOUS_NODE;
                        }
                        break;
                }
            } else {

                //This will roll new nodes into the previous node as children of the previous node if the following conditions are met:
                // 1. The previous node is a wickup node of type either UL or Blockquote
                // 2. The new node is anything other than a text node containing only white space. 
                if (PREVIOUS_NODE) {
                    if (node.tag !== "text" || (!node.IS_WHITESPACE)) {

                        if (PREVIOUS_NODE.wickup)
                            switch (PREVIOUS_NODE.tag) {
                                case "blockquote":

                                    let bq = PREVIOUS_NODE;
                                    //Insert into last li. if the last 
                                    while (1) {
                                        let bq_child = bq.children[bq.children.length - 1];
                                        if (!bq_child) throw "Messing up!";
                                        if (bq_child.tag == "blockquote") {
                                            bq = bq_child;
                                            break;
                                        } else {
                                            bq = bq_child;
                                        }
                                    }
                                    bq.children.push(node);
                                    children.splice(i, 1);
                                    i--;
                                    node = PREVIOUS_NODE;
                                    break;
                                    //return null;
                            }
                    } else {
                        let node2 = children[i + 1];
                        if (node2) {
                            if (node2.tag !== "text" || node2.IS_WHITESPACE){
                                continue;
                            }
                        }
                    }
                }
            }

            PREVIOUS_NODE = node;
        }
        PREVIOUS_NODE= null;
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            //If meta is true, then a wickup node was created. Use the tag name to determine the next course of action. 
            const tag = node.tag;
            const meta = node.wickup;

            if (meta) {
                switch (tag) {
                    case "li":
                        if (PREVIOUS_NODE && PREVIOUS_NODE.tag == "ul") {
                            let level = 1,
                                ul = PREVIOUS_NODE;
                            while (level < meta) {
                                let ul_child = ul.children[ul.children.length - 1];
                                if (ul_child && ul_child.tag == "ul") {
                                    ul = ul_child;
                                } else {
                                    ul_child = es("ul", null, [], env, lex);
                                    ul.children.push(ul_child)
                                    ul = ul_child;
                                }

                                level++;
                            }
                            ul.children.push(node);
                            children.splice(i, 1);
                            i--;
                            node = PREVIOUS_NODE;
                        } else {
                            children[i] = es("ul", null, [node], env, lex, true);
                            node = children[i]
                        }
                        break;
                    }
            } else {

                //This will roll new nodes into the previous node as children of the previous node if the following conditions are met:
                // 1. The previous node is a wickup node of type either UL or Blockquote
                // 2. The new node is anything other than a text node containing only white space. 
                if (PREVIOUS_NODE) {
                    if (node.tag !== "text" || (!node.IS_WHITESPACE)) {

                        if (PREVIOUS_NODE.wickup)
                            switch (PREVIOUS_NODE.tag) {
                                case "ul":
                                    let ul = PREVIOUS_NODE;
                                    //Insert into last li. if the last 
                                    while (1) {
                                        let ul_child = ul.children[ul.children.length - 1];
                                        if (!ul_child) throw "Messing up!";
                                        if (ul_child.tag == "li") {
                                            ul = ul_child;
                                            break;
                                        } else {
                                            ul = ul_child;
                                        }
                                    }
                                    ul.children.push(node);

                                   const node2 = children[i + 1];

                                    if (node2) {
                                        if (node2.tag == "text" && node2.IS_WHITESPACE){
                                            children.splice(i+1, 1);
                                             //i--;
                                        }

                                    }

                                    children.splice(i, 1);
                                    i--;


                                    node = PREVIOUS_NODE;
                                    break;

                                    //return null;
                            }
                    } else {
                        let node2 = children[i + 1];
                        if (node2) {
                            if (node2.tag !== "text" || node2.IS_WHITESPACE){
                                console.log("node2:",node2)
                                //continue;
                            }
                        }
                    }
                }
            }
            PREVIOUS_NODE = node;
        }
    }
}

export default function es(tag, attribs, children, env, lex, meta = 0) {

    const
        FULL = !!children;
        attribs = attribs || [],
        children = (Array.isArray(children)) ? children : children ? [children] : [];


    if (children) processChildren(children, env, lex);

    const presets = env.presets;

    let node = null,
        cstr = null;
    console.log(tag)

    switch (tag) {
        case "text":
            break;
        case "filter":


        case "f":
            cstr = FilterNode;
            break;
        case "a":
            cstr = LinkNode;
            break;
            /** void elements **/
        case "template":
            cstr = VoidNode;
            break;
        case "css":
        case "style":
            cstr = StyleNode;
            break;
        case "script":
            cstr = ScriptNode;
            break;
        case "svg":
        case "path":
            cstr = SVGNode;
            break;
        case "container":
            cstr = ContainerNode;
            break;
        case "scope":
            cstr = ScopeNode;
            break;
        case "slot":
            cstr = SlotNode;
            break;
        case "import":
            cstr = ImportNode;
            break;
            //Elements that should not be parsed for binding points.
        case "pre":
            cstr = PreNode;
            break;
        case "code":
        default:
            cstr = ElementNode;
            break;
    }

    node = new cstr(env, tag, children, attribs, presets);

    node.wickup = meta || false;

    node.SINGLE = !FULL;


    return node;
}