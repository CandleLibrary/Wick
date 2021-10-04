import URL from "@candlelib/uri";
import { PluginStore } from "../plugin/plugin";
import { WickRTComponent } from "../runtime/component";
import { ComponentClassStrings, ComponentData, ComponentStyle } from "./component";
/**
 * A collection of configuration options to customize the wick compiler.
 */
export interface PresetOptions {
    /**
     *  Object of options that can be passed to the Wick compiler.
     */
    options?: {

        /**
         * If `true` Wick will throw on any errors encountered when
         * parsing a template file.
         *
         * Errors can be caught using a try catch statement on the
         * wick object to using the Promise~catch method on the wick object.
         */
        THROW_ON_ERRORS?: boolean;

        /**
         * If `true` URL fetches will be cached with JS, regardless of browser or 
         * HTTP cache configurations.
         */
        CACHE_URL?: boolean;

        /**
         * Configured by `preset_options.USE_SHADOW`. If set to `true`, and if the browser supports it, 
         * compiled and rendered template elements will be bound to a `<component>` shadow DOM, instead 
         * being appended as a child node.
         * @instance
         * @readonly
         */
        USE_SHADOW?: boolean;

        /**
         * 
         */
        USE_SHADOWED_STYLE?: boolean;

        /**
         * Debugger statements are removed from final output of a component class if `true`.
         */
        REMOVE_DEBUGGER_STATEMENTS?: boolean,

        /**
         * Class string builder generates source maps if `true`.
         */
        GENERATE_SOURCE_MAPS?: boolean;


        /**
         * Append URI string comment to source data when rendering - Default is false
         */
        INCLUDE_SOURCE_URI?: boolean;

        /**
         *  CandleLibrary src URLs used when rendering wick components to pages
         */
        url?: {
            wick?: string,
            wickrt?: string,
            glow?: string;
        };



    };

    /**
     * URL of the initiating script.
     */
    url?: URL;

    /**
     * Any objects or functions that should be accessible to all components
     * through the `"@api"` import path.
     */
    api?: {
        [key: string]: {
            /**
             * The API object or default export of a module
             */
            default: any;
            [key: string]: any;
        };
    };
    /**
     * A list of external resource paths that should be loaded before the first
     * component is instantiated.
     */
    repo: Map<string, {
        /**
         * The specifier path of the import statement
         */
        url: string,
        /**
         * The hash name of the specifier
         */
        hash: string,
        /**
         * the imported module object
         */
        module: any;
    }>;

    plugins: PluginStore;

    /**
     * Store for WickRTComponents.
     */
    component_class: Map<string, typeof WickRTComponent>;

    /**
     * Store for ComponentData
     */
    components?: Map<string, ComponentData>;

    css_cache?: any;

    document?: Document;

    window?: Window;
    /**
     *  Prevent infinite recursion
     */
    wrapper?: typeof WickRTComponent;

    processLink?: any;

    named_components: Map<string, ComponentData>;

    component_class_string: Map<string, ComponentClassStrings>;

    styles?: Map<string, ComponentStyle>;

    /**
     * The @candlelib/glow module if it has been imported
     */
    glow?: any;

    template_data: WeakMap<ComponentData, any[]>;

    active_template_data?: any;
}

enum ModuleType {
    "local"
}
export interface UserPresets {

    repo?: [[string, string, ModuleType]];

    api?: {
        [key: string]: any;
    };

    options?: PresetOptions["options"];

    schemes: any;

    models: any;
}