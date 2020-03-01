import parser from "./parser/parser.js";
import URL from "@candlefw/url";
import Presets from "./component/presets.js";
import MakeComponent from "./component/component.js";
import { WickASTNode } from "./types/wick_ast_node.js";
import { WickComponentErrorStore } from "./types/errors.js";

interface WickComponent {
    presets: Presets;
    ast: WickASTNode;

    errors: WickComponentErrorStore;

    pending: Promise<WickComponent>;
}

/**
 * Creates a raw Wick component.
 */
function wick(input: string | URL, presets?: Presets): WickComponent {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    const promise = MakeComponent(input, presets, URL.G);

    const component = <WickComponent>{
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