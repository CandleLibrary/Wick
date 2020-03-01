import parser from "./parser/parser.js";
import URL from "@candlefw/url";
import Presets from "./component/presets.js";
import MakeComponent from "./component/component.js";
/**
 * Creates a raw Wick component.
 */
function wick(input, presets) {
    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();
    const promise = MakeComponent(input, presets, URL.G);
    const component = {
        presets,
        pending: new Promise(res => promise.then(() => res(component)))
    };
    promise.then(res => {
        component.ast = res.AST;
        component.errors = res.errors;
    });
    return component;
}
export { wick, parser };
