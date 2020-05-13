import URL from "@candlefw/url";

import parser from "./parser/parser.js";

import Presets from "./component/presets.js";

import makeComponent from "./component/component.js";

import CompiledWickAST from "./types/wick_ast_node_types.js";

import { WickComponentErrorStore } from "./types/errors.js";
import { renderCompressed, renderWithFormatting } from "@candlefw/conflagrate";
import { WickComponent } from "./runtime/component_class.js";
import { rt } from "./runtime/runtime_global.js";



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
 * Creates a Wick component.
 */
function wick(input: string | URL, presets?: Presets): WickComponent {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    if (!rt.prst)
        rt.prst = presets;

    const
        promise = makeComponent(input, presets),

        component = <WickComponent><unknown>{
            presets,
            pending: new Promise(res => promise.then(() => res(component))),
            mount: () => { throw "Component mount has not yet been implemented! source/wick.ts:44:9"; }
        };

    promise.then(res => {
        component.ast = res.AST;
        component.errors = res.errors;
        component.toString = res.toString;
        component.toClass = res.toClass;
    });

    Object.defineProperties(component, {
        /**
         * Create an instance of the component.
         */
        createInstance: {
            configurable: false,
            writable: false,
            value: function (): WickComponent {
                return <WickComponent>new (this.toClass());
            }
        },
        /** 
         * Return a JavaScript string object of the component class. 
         */
        render: {
            configurable: false,
            get: function () {
                return this.toString();
            }
        }
    });


    promise.catch(e => { });

    return component;
}

Object.defineProperty(wick, "Component", {
    value: WickComponent,
    writable: false,
});

Object.defineProperty(wick, "api", {
    value: {
        __internal_API_format__: {},
        getExpectedAPIJSON() {
            return JSON.stringify(wick.api.__internal_API_format__);
        }
    },
    writable: false
});

const global_object = (typeof global !== "undefined") ? global : window;

if (global_object) {
    //@ts-ignore
    if (typeof global_object.cfw == "undefined") {
        //@ts-ignore
        global_object.cfw = { wick };
        //@ts-ignore
    } else Object.assign(global_object.cfw, { wick });
}



export { wick, parser };