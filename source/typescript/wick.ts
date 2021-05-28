//External
import { addModuleToCFW } from "@candlelib/candle";
import { CSSNode, CSSNodeType, CSSNodeTypeLU } from "@candlelib/css";
import { JSNode, JSNodeType, JSNodeTypeLU } from "@candlelib/js";
import URL from "@candlelib/url";
//Internal
import { ComponentDataClass } from "./common/component.js";
import { css_selector_helpers } from "./common/css.js";
import { ComponentHash } from "./common/hash_name.js";
//Internal
import Presets from "./common/presets.js";
import { parseSource } from "./component/parse/source.js";
import { componentDataToCSS } from "./component/render/css.js";
import { componentDataToHTML } from "./component/render/html.js";
import {
    componentDataToJS,
    componentDataToJSCached,
    componentDataToJSStringCached
} from "./component/render/js.js";
import { createCompiledComponentClass } from "./component/compile/compile.js";
import { RenderPage } from "./component/render/webpage.js";
import { renderWithFormatting } from "./render/render.js";
import { Observable } from "./runtime/observable/observable.js";
import { ObservableScheme } from "./runtime/observable/observable_prototyped.js";
import { WickRTComponent } from "./runtime/component.js";
import { rt, WickRuntime } from "./runtime/global.js";
import { srv, WickServer } from "./server.js";
import parser from "./source_code/parse.js";
import { init, WickTest as test } from "./test/wick.test.js";
import { BindingVariable, BINDING_FLAG, BINDING_VARIABLE_TYPE } from "./types/binding";
import { IntermediateHook } from "./types/hook";
import { ComponentData, ExtendedComponentData } from "./types/component";
import { FunctionFrame } from "./types/function_frame";
import { DOMLiteral } from "./types/html";
import { ObservableModel, ObservableWatcher } from "./types/model.js";
import { PresetOptions } from "./types/presets.js";
import { HTMLNode, HTMLNodeClass, HTMLNodeTypeLU } from "./types/wick_ast.js";



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
        componentToClassString: typeof createCompiledComponentClass;
        createNameHash: typeof ComponentHash;
        componentToClass: typeof componentDataToJS;
        /**
         * Renders a CSS stylesheet from the CSS data from a ComponentData
         * object.
         */
        componentDataToCSS: typeof componentDataToCSS;
        componentDataToClass: typeof componentDataToJS;
        componentDataToClassString: typeof createCompiledComponentClass;

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
        VARIABLE_REFERENCE_TYPE: BINDING_VARIABLE_TYPE;
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

    let comp = null;

    const
        promise = new Promise<ExtendedComponentData>(async res => {
            comp = await parseSource(input, presets);
            Object.assign(component, comp);
            await componentDataToJSCached(component, presets, true, true);
            await componentDataToJSStringCached(component, presets, true, true);
            res(component);
        }),

        component = <ExtendedComponentData><unknown>{
            get class() {
                return presets.component_class.get(comp.name);
            },
            get class_with_integrated_css() {
                return presets.component_class.get(comp.name);
            },
            get class_string() {
                return presets.component_class_string.get(comp.name);
            },
            pending: promise,
            mount: async (model: any, ele: HTMLElement) => {

                await component.pending;

                const comp_inst = new component.class(model);

                comp_inst.appendToDOM(ele);

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
                createNameHash: ComponentHash,
                parser,
                render: renderWithFormatting,
            },
            server: async function (root_dir: string = "") {
                await URL.server(root_dir);
            },

            enableServer: async function (root_dir: string = "") {
                await URL.server(root_dir);
            },

            enableTest: init,

            setWrapper: async function (url) {
                //create new component

                if (!rt.presets)
                    rt.presets = new Presets();

                rt.presets.wrapper = wick(url);

                const comp = await rt.presets.wrapper.pending;

                componentDataToJSCached(comp, rt.presets);
            },

            componentToClass: componentDataToJS,

            componentToClassString: createCompiledComponentClass,


            componentDataToHTML,
            componentDataToCSS,
            componentDataToJSCached: componentDataToJSCached,
            componentDataToClass: componentDataToJS,
            componentDataToClassString: createCompiledComponentClass,
            createNameHash: ComponentHash,
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
    ComponentHash as createNameHash,
    componentDataToHTML,
    componentDataToCSS,
    componentDataToJS as componentDataToClass,
    createCompiledComponentClass as componentDataToClassString,

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
    IntermediateHook as IntermediateBinding,
    BINDING_VARIABLE_TYPE,
    BINDING_FLAG as DATA_FLOW_FLAG,

    /*Observables*/
    Observable,

};


