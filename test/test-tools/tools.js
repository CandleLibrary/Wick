import { componentDataToTempAST, componentDataToHTML } from "../../build/library/component/compile/component_data_to_html.js";

export function getInstanceHTML(comp, presets) {
    return componentDataToTempAST(comp, presets).html[0];
}

export function getRenderedHTML(comp, presets) {
    return componentDataToHTML(comp, presets).html;
}