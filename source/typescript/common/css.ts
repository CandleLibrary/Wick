import { SelectionHelpers } from "@candlelib/css";
import { DOMLiteral } from "../../wick.js";
export const css_selector_helpers: SelectionHelpers<DOMLiteral> = {
    getIndexFigures: (ele, tag) => ({ ele_index: 0, tag_index: 0 }),
    WQmatch: (ele, wq_selector) => wq_selector.val,
    getChildren: (ele) => (ele.children && ele.children.slice().map(e => Object.assign({}, e)).map(e => ((e.parent = ele), e))) || [],
    getParent: (ele) => ele.parent,
    hasAttribute: (ele, namespace, name, value, sym, modifier) => ele.attributes && ele.attributes
        .filter(([key]) => key == name)
        .filter(([, v]) => !value || v == value)
        .length > 0,
    hasClass: (ele, class_) => ele.attributes && ele.attributes
        .filter(([key]) => key == "class")
        .filter(([, v]) => v == class_)
        .length > 0,
    hasID: (ele, id) => ele.attributes && ele.attributes
        .filter(([key]) => key == "id")
        .filter(([, v]) => v == id)
        .length > 0,
    hasPseudoClass: (ele, id, val) => false,
    hasPseudoElement: (ele, id, val) => false,
    hasType: (ele, namespace, type) => ele.tag_name &&
        ele.tag_name.toUpperCase() == type.toUpperCase()
};
