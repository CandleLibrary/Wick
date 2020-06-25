import URL from "@candlefw/url";
import Presets from "./presets.js";
import makeComponent from "./component/component.js";
import CompiledWickAST from "./types/wick_ast_node_types.js";
import { WickComponentErrorStore } from "./types/errors.js";
import { WickRTComponent, class_strings } from "./runtime/runtime_component_class.js";
import { rt } from "./runtime/runtime_global.js";
import { PresetOptions } from "./types/preset_options.js";
import { componentDataToClass, componentDataToClassCached, componentDataToClassStringCached, componentDataToClassString } from "./component/component_data_to_class.js";
import { Component } from "./types/types.js";
import { DOMLiteral } from "./types/dom_literal.js";


/**
 * A compiled component that can be mounted to a DOM node.
 */
interface Extension {

    errors: WickComponentErrorStore;

    pending: Promise<Extension & Component>;

    mount: (data?: object, ele?: HTMLElement) => Promise<WickRTComponent>;
}

type ExtendedComponent = (Component & Extension);

/**
 * Creates a Wick component.
 */
function wick(input: string | URL, presets: Presets = rt.presets): ExtendedComponent {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    if (!rt.presets)
        rt.presets = presets;

    const
        promise = new Promise(async res => {
            const comp = await makeComponent(input, presets);
            console.log(comp.name);
            Object.assign(component, comp);
            componentDataToClassCached(component, presets, true);
            componentDataToClassStringCached(component, presets, true);
            res(component);
        }),

        component = <ExtendedComponent><unknown>{
            get class() { return componentDataToClassCached(component, presets, true); },
            get class_string() { return componentDataToClassStringCached(component, presets, true); },
            pending: promise,
            mount: async (model: any, ele: HTMLElement) => {

                await this.pending;

                const comp_inst = new this.class(model);

                ele.appendChild(comp_inst.ele);

                return comp_inst;
            }
        };

    Object.defineProperties(component, {
        /**
         * Create an instance of the component.
         */
        createInstance: {
            configurable: false,
            writable: false,
            value: function (model = null): ExtendedComponent {
                return <ExtendedComponent>new this.class(model);
            }
        },
    });

    return component;
}

wick.URL = URL;

Object.defineProperty(wick, "Component", {
    value: WickRTComponent,
    writable: false
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

Object.defineProperty(wick, "class_strings", {
    value: class_strings,
    writable: false
});

Object.defineProperty(wick, "componentToClass", {
    value: componentDataToClass,
    writable: false
});

Object.defineProperty(wick, "componentToClassString", {
    value: componentDataToClassString,
    writable: false
});


/**
 * Wrapper is a special sudo element that allows interception,
 * injection, and modification of existing components by wrapping
 * it in another component that has full access to the original 
 * component. This can be used to create adhoc component editors.
 */
Object.defineProperty(wick, "setWrapper", {
    value: async function (url) {
        //create new component

        if (!rt.presets)
            rt.presets = new Presets();

        rt.presets.wrapper = wick(url);

        const comp = await rt.presets.wrapper.pending;

        componentDataToClassCached(comp, rt.presets);
    }
});


/**
 * Sets the presets object.
 */
Object.defineProperty(wick, "setPresets", {
    value: async function (preset_options: PresetOptions) {

        //create new component
        const presets = new Presets(preset_options);

        if (!rt.presets)
            rt.presets = presets;

        return presets;

    }
});

/**
 * Configure wick to run server side.
 */
Object.defineProperty(wick, "server", {
    value: async function (preset_options: PresetOptions) {
        await URL.polyfill();
    }
});

/**
 * Sets the presets object.
 */
Object.defineProperty(wick, "rt", {
    value: rt,
    writable: false,
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
export default wick;

export { Component, Presets, DOMLiteral, componentDataToClass, componentDataToClassString };