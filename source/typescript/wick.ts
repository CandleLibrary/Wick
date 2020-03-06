import parser from "./parser/parser.js";
import URL from "@candlefw/url";
import Presets from "./component/presets.js";
import MakeComponent from "./component/component.js";
import CompiledWickAST, { WickASTNode } from "./types/wick_ast_node.js";
import { WickComponentErrorStore } from "./types/errors.js";

/**
 * A handle to a component that is actively mounted to a DOM.
 */
interface WickComponentHandle {

}

/**
 * A compiled component that can be mounted to a DOM node.
 */
interface WickComponent {
    presets: Presets;

    ast: CompiledWickAST;

    errors: WickComponentErrorStore;

    pending: Promise<WickComponent>;

    mount: (ele: HTMLElement, data: object) => WickComponentHandle;
}

/**
 * Creates a raw Wick component.
 */
function wick(input: string | URL, presets?: Presets): WickComponent {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    const promise = MakeComponent(input, presets, URL.GLOBAL);

    const component = <WickComponent><unknown>{
        presets,
        pending: new Promise(res => promise.then(() => res(component))),
        mount: () => { throw "Component mount has not yet been implemented! source/wick.ts:44:9"; }
    };

    promise.then(res => {
        component.ast = res.AST;
        component.errors = res.errors;
    });

    return component;
}


export { wick, parser };