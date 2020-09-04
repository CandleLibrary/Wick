import URL from "@candlefw/url";
import { addModuleToCFW } from "@candlefw/cfw";
import { CSSNodeType, CSSNode, CSSNodeTypeLU } from "@candlefw/css";
import { JSNodeType, JSNode, JSNodeTypeLU } from "@candlefw/js";


import Presets from "./presets.js";
import makeComponent from "./component/component.js";
import parser from "./parser/parse.js";

import { rt, WickRuntime } from "./runtime/runtime_global.js";
import { WickRTComponent } from "./runtime/runtime_component.js";
import { PresetOptions } from "./types/preset_options.js";
import {
    componentDataToJS,
    componentDataToJSCached,
    componentDataToJSStringCached,
    componentDataToClassString,
} from "./component/component_data_to_js.js";
import { componentDataToCSS } from "./component/component_data_to_css.js";
import { VARIABLE_REFERENCE_TYPE } from "./types/variable_reference_types";
import { DATA_FLOW_FLAG } from "./types/data_flow_flags";
import { FunctionFrame } from "./types/function_frame";
import { ComponentData } from "./types/component_data";
import { BindingVariable } from "./types/binding";
import { PendingBinding } from "./types/binding";
import { DOMLiteral } from "./types/dom_literal.js";
import { ExtendedComponentData } from "./types/extended_component";
import { componentDataToHTML } from "./component/component_data_to_html.js";
import { HTMLNodeTypeLU, HTMLNodeClass, HTMLNode } from "./types/wick_ast_node_types.js";
import { ObservableModel, ObservableWatcher } from "./types/observable_model.js";
import { createNameHash } from "./component/component_create_hash_name.js";
import { css_selector_helpers } from "./component/component_css_selector_helpers.js";
import { renderWithFormatting } from "./render/render.js";
import { Observable } from "./runtime/observable/observable.js";
import { ObservableScheme } from "./runtime/observable/observable_prototyped.js";
import { WickServer, srv } from "./wick.server.js";
import { WickTestTools, WickTest as test } from "./test/wick.test.js";

/**
 * Exporting the wick compiler
 */
export interface WickCompiler {

    /**
     * Main runtime system. Accessible as a standalone module
     * wick_rt.
     */
    rt: WickRuntime,


    /**
     * Configure the global presets object with the given
     * preset options.
     */

    utils: {
        /**
         * Configures wick to run server side.
         */
        server: (root_dir?: string) => Promise<void>,

        /**
         * Wrapper is a special sudo element that allows interception,
         * injection, and modification of existing components by wrapping
         * it in another component that has full access to the original 
         * component. This can be used to create adhoc component editors.
         */
        setWrapper: (url: URL | string) => Promise<void>;

        /**
         * Converts component data to a class string that can
         * be parsed by a JavaScript parser as a RuntimeComponent
         * constructor function.
         */
        componentToClassString: typeof componentDataToClassString;
        createNameHash: typeof createNameHash;
        componentToClass: typeof componentDataToJS;
        /**
         * Renders a CSS stylesheet from the CSS data from a ComponentData
         * object.
         */
        componentDataToCSS: typeof componentDataToCSS;
        componentDataToClass: typeof componentDataToJS;
        componentDataToClassString: typeof componentDataToClassString;

        parse: {
            parser: typeof parser;
            render: typeof renderWithFormatting;
        };
    };

    objects: {

        /**
         * Main store of parsing and runtime objects and 
         * options.
         */
        Presets: typeof Presets;

        /**
         * Class type for runtime components
         */
        WickRTComponent: typeof WickRTComponent;

        Observable: typeof Observable;

        ObservableScheme: typeof ObservableScheme;
    };

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
        VARIABLE_REFERENCE_TYPE: VARIABLE_REFERENCE_TYPE;
        PresetOptions: PresetOptions;
    };
}


/**
 * ==================================================================================================
 * ==================================================================================================
 * Creates an ExtendedComponentData object from a string or from data imported from a URL.
 * 
 * @param input - String with Wick source text or a URL to a file containing source text.
 * 
 * @param presets - An optional Presets object. If this is left undefined then the global 
 * presets object will be used, or a new global presets object will be created if not defined. This
 * argument is Presets object and the global presets object has not yet been set, then global presets
 * will be set to the value of this argument.
 * 
 * @returns {ExtendedComponentData}
 */
function componentCreate(input: string | URL, presets: Presets = rt.presets): ExtendedComponentData {

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

        component = <ExtendedComponentData><unknown>{
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
            value: function (model = null): ExtendedComponentData {
                return <ExtendedComponentData>new this.class(model);
            }
        },
    });

    return component;
}

/**
 * Wick component parser and component library.
 */
type WickLibrary = typeof componentCreate & WickCompiler & WickRuntime & WickServer;

/** README:USAGE
 * 
 * #### HTML - Client Side Component Rendering
 * ```ts
 * import wick from "@candlefw/wick";
 *
 * // Calls to Wick return an object that can then be used to 
 * // render components. The pending attribute allows wick to 
 * // Operate asynchronously as it gathers the resources 
 * // necessary to compile the givin component.
 * 
 * const comp_constructor: ExtendedComponentData = await wick("./local_directory/my_component.wick").pending;
 * 
 * // Runtime components can be mounted to the DOM and
 * // can update DOM content reactively based on data submitted
 * // to the component.
 * const comp: RTComponent = new comp_constructor.class();
 * 
 * comp.appendToDOM(document.body)
 * ```
 */
const wick: WickLibrary = Object.assign(componentCreate,
    <WickServer>srv,
    <WickRuntime>rt,
    <WickCompiler>{

        css_selector_helpers,

        types: <WickCompiler["types"]><unknown>{
            CSSNodeType: CSSNodeTypeLU,
            JSNodeType: JSNodeTypeLU,
            HTMLNodeType: HTMLNodeTypeLU
        },

        rt: rt,

        get presets() { return rt.presets; },

        utils: {
            parse: {
                css_selector_helpers: css_selector_helpers,
                createNameHash: createNameHash,
                parser,
                render: renderWithFormatting
            },
            server: async function (root_dir: string = "") {
                await URL.server(root_dir);
            },

            setWrapper: async function (url) {
                //create new component

                if (!rt.presets)
                    rt.presets = new Presets();

                rt.presets.wrapper = wick(url);

                const comp = await rt.presets.wrapper.pending;

                componentDataToJSCached(comp, rt.presets);
            },

            componentToClass: componentDataToJS,

            componentToClassString: componentDataToClassString,


            componentDataToHTML,
            componentDataToCSS,
            componentDataToJSCached: componentDataToJSCached,
            componentDataToClass: componentDataToJS,
            componentDataToClassString,
            createNameHash,
        },

        objects: {
            WickRTComponent,
            Presets,
            Observable,
            ObservableScheme
        },

    });

addModuleToCFW(wick, "wick");

export default wick;

export * from "./render/render.js";

export * from "./render/rules.js";

export {
    //Functions
    parser,
    createNameHash,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJS as componentDataToClass,
    componentDataToClassString,

    //tools
    test,

    //Object Types
    Presets,
    WickRTComponent as RuntimeComponent,
    WickRTComponent,
    HTMLNodeTypeLU as HTMLNodeType,
    JSNodeTypeLU,
    CSSNodeType,

    //Pure Types
    WickLibrary,
    ExtendedComponentData as ExtendedComponent,
    WickRuntime,
    ComponentData as Component,
    ComponentData,
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

    /*Observables*/
    Observable

};