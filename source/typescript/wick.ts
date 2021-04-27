//External
import { addModuleToCFW } from "@candlefw/cfw";
import { CSSNode, CSSNodeType, CSSNodeTypeLU } from "@candlefw/css";
import { JSNode, JSNodeType, JSNodeTypeLU } from "@candlefw/js";
import URL from "@candlefw/url";

import { RenderPage } from "./component/compile/compile_web_page.js";
import { componentDataToCSS } from "./component/compile/component_data_to_css.js";
import { componentDataToHTML } from "./component/compile/component_data_to_html.js";
import {
    componentDataToClassString, componentDataToJS,
    componentDataToJSCached,
    componentDataToJSStringCached
} from "./component/compile/component_data_to_js.js";
import { parseSource } from "./component/parse/source_parser.js";
import { createNameHash } from "./component/utils/create_hash_name.js";
import { css_selector_helpers } from "./component/utils/css_selector_helpers.js";
import parser from "./parser/parse.js";
//Internal
import Presets from "./presets.js";
import { renderWithFormatting } from "./render/render.js";
import { Observable } from "./runtime/observable/observable.js";
import { ObservableScheme } from "./runtime/observable/observable_prototyped.js";
import { WickRTComponent } from "./runtime/runtime_component.js";
import { rt, WickRuntime } from "./runtime/runtime_global.js";
import { WickTest as test } from "./test/wick.test.js";
import { BindingVariable, PendingBinding } from "./types/binding";
import { ComponentData } from "./types/component_data";
import { DATA_FLOW_FLAG } from "./types/data_flow_flags";
import { DOMLiteral } from "./types/dom_literal.js";
import { ExtendedComponentData } from "./types/extended_component";
import { FunctionFrame } from "./types/function_frame";
import { ObservableModel, ObservableWatcher } from "./types/observable_model.js";
import { PresetOptions } from "./types/preset_options.js";
import { VARIABLE_REFERENCE_TYPE } from "./types/variable_reference_types";
import { HTMLNode, HTMLNodeClass, HTMLNodeTypeLU } from "./types/wick_ast_node_types.js";
import { srv, WickServer } from "./wick.server.js";


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
        /**[API]
         * Builds a single page from a wick component, with the
         * designated component serving as the root element of the
         * DOM tree. Can be used to build a hydratable page.
         *
         * Optionally hydrates with data from an object serving as a virtual preset.
         *
         * Returns HTML markup and an auxillary script strings that
         * stores and registers hydration information.
         */
        RenderPage: typeof RenderPage;
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
async function componentCreate(input: string | URL, presets: Presets = rt.presets): Promise<ExtendedComponentData> {

    // Ensure there is a presets object attached to this component.
    if (!presets)
        presets = new Presets();

    if (!rt.presets)
        rt.presets = presets;

    const
        promise = new Promise<ExtendedComponentData>(async res => {
            const comp = await parseSource(input, presets);
            Object.assign(component, comp);
            componentDataToJSCached(component, presets, true, true);
            componentDataToJSStringCached(component, presets, true, true);
            res(component);
        }),

        component = <ExtendedComponentData><unknown>{
            get class() { return componentDataToJSCached(component, presets, true, false); },
            get class_with_integrated_css() { return componentDataToJS(component, presets, true, true); },
            get class_string() { return componentDataToJSStringCached(component, presets, true, false); },
            pending: promise,
            mount: async (model: any, ele: HTMLElement) => {

                await component.pending;

                const comp_inst = new component.class(model);

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

    return promise;
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
                render: renderWithFormatting,
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
            RenderPage
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
    Observable,

};


