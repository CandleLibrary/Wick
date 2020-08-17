import URL from "@candlefw/url";
import { addModuleToCFW } from "@candlefw/cfw";
import { CSSNodeType, CSSNode, CSSNodeTypeLU } from "@candlefw/css";
import { JSNodeType, JSNode, JSNodeTypeLU } from "@candlefw/js";


import Presets from "./presets.js";
import makeComponent from "./component/component.js";
import parser from "./parser/parse.js";

import { rt, WickRuntime } from "./runtime/runtime_global.js";
import { WickRTComponent, class_strings } from "./runtime/runtime_component.js";
import { PresetOptions } from "./types/preset_options.js";
import {
    componentDataToJS,
    componentDataToJSCached,
    componentDataToJSStringCached,
    componentDataToClassString,
} from "./component/component_data_to_js.js";
import { componentDataToCSS } from "./component/component_data_to_css.js";
import { Component, VARIABLE_REFERENCE_TYPE, FunctionFrame, DATA_FLOW_FLAG } from "./types/types.js";
import { BindingVariable } from "./types/binding";
import { PendingBinding } from "./types/binding";
import { DOMLiteral } from "./types/dom_literal.js";
import { ExtendedComponent } from "./types/extended_component";
import { componentDataToHTML } from "./component/component_data_to_html.js";
import { HTMLNodeTypeLU, HTMLNodeClass, HTMLNode } from "./types/wick_ast_node_types.js";
import { ObservableModel, ObservableWatcher } from "./types/observable_model.js";
import { createNameHash } from "./component/component_create_hash_name.js";
import { css_selector_helpers } from "./component/component_css_selector_helpers.js";
import { renderWithFormatting } from "./render/render.js";
import { Observable } from "./runtime/observable/observable.js";
import { ObservableScheme } from "./runtime/observable/observable_prototyped.js";

/**
 * Creates a Wick component. test
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
            Object.assign(component, comp);
            componentDataToJSCached(component, presets, true, true);
            componentDataToJSStringCached(component, presets, true, true);
            res(component);
        }),

        component = <ExtendedComponent><unknown>{
            get class() { return componentDataToJSCached(component, presets, true, false); },
            get classWithIntegratedCSS() { return componentDataToJS(component, presets, true, true); },
            get class_string() { return componentDataToJSStringCached(component, presets, true, false); },
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

Object.assign(wick, rt);

Object.defineProperty(wick, "class_strings", {
    value: class_strings,
    writable: false
});

Object.defineProperty(wick, "componentToClass", {
    value: componentDataToJS,
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

        componentDataToJSCached(comp, rt.presets);
    }
});

//Allow a component to be replaced inline
Object.defineProperty(WickRTComponent.prototype, "replace", {
    value:
        /**
         * Replace this component with the one passed in. 
         * The new component inherits the old one's element and model.
         */
        function (component: Component) {

            const comp_class = componentDataToJS(component, this.presets);

            const comp = new comp_class(this.model, this.wrapper);

            this.ele.replaceWith(comp.ele);

            this.wrapper = null;

            this.destructor();

            return comp;
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

addModuleToCFW(wick, "wick");

interface wickOutput {
    parse: {
        parser: typeof parser;
        render: typeof renderWithFormatting;
    };
    Presets: typeof Presets;

    WickRTComponent: typeof WickRTComponent;

    componentDataToClassString: typeof componentDataToClassString,

    componentDataToClass: typeof componentDataToJS,

    Observable: typeof Observable;

    ObservableScheme: typeof ObservableScheme;

    types: {

        DOMLiteral: DOMLiteral,
        BindingVariable: BindingVariable,
        JSNode: JSNode,
        HTMLNode: HTMLNode,
        CSSNode: CSSNode,
        CSSNodeType: typeof CSSNodeType;
        JSNodeType: typeof JSNodeTypeLU;
        HTMLNodeType: typeof HTMLNodeTypeLU;
        HTMLNodeClass: typeof HTMLNodeClass;
        VARIABLE_REFERENCE_TYPE: typeof VARIABLE_REFERENCE_TYPE;
    };
}

Object.assign(wick, {
    parse: {
        css_selector_helpers: css_selector_helpers,
        createNameHash: createNameHash,
        parser,
        render: renderWithFormatting
    },

    css_selector_helpers,

    types: {
        CSSNodeType: CSSNodeTypeLU,
        JSNodeType: JSNodeTypeLU,
        HTMLNodeType: HTMLNodeTypeLU
    },

    Presets,
    WickRTComponent,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJSCached: componentDataToJSCached,
    componentDataToClass: componentDataToJS,
    componentDataToClassString,
    Observable,
    ObservableScheme

});


export default wick;

export * from "./render/render.js";
export * from "./render/rules.js";

export {
    //Functions
    wick,
    parser,
    createNameHash,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJS as componentDataToClass,
    componentDataToClassString,

    //Object Types
    Presets,
    WickRTComponent as RuntimeComponent,
    WickRTComponent,
    HTMLNodeTypeLU as HTMLNodeType,
    JSNodeTypeLU,
    CSSNodeType,

    //Pure Types
    ExtendedComponent,
    WickRuntime,
    wickOutput,
    Component,
    ObservableModel,
    ObservableWatcher,
    DOMLiteral,
    BindingVariable,
    JSNode,
    HTMLNode as HTMLNode,
    CSSNode,
    JSNodeType,
    HTMLNodeClass as HTMLNodeClass,
    FunctionFrame,
    PendingBinding,
    VARIABLE_REFERENCE_TYPE,
    DATA_FLOW_FLAG,

    //Observables
    Observable

};