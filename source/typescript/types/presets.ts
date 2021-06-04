import URL from "@candlelib/url";
import { WickRTComponent } from "../runtime/component";
import { PluginStore } from "../plugin/plugin";
import { ComponentClassStrings, ComponentData, ComponentStyle } from "./component";
import { string } from "../runtime/observable/string";
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
         *  CandleFW src URLs used when rendering wick components to pages
         */
        url?: {
            wick?: string,
            wickrt?: string,
            glow?: string;
        };


    };

    /**
     * A collection of custom component constructors that implement
     * this ComponentConstructor interface.
     */
    custom_components?: {};

    /**
     * OLD - NEEDS UPDATE
     * 
     * Store of user defined classes that extend the Model or Model classes. `<w-scope>` tags in 
     * templates that have a value set for the  `schema` attribute, e.g. 
     * 
     * `<w-s schema="my_favorite_model_type">...</w-s>`, will be bound to a new instance of the 
     * class in presets.schema whose property name matches the "schema" attribute.
     *
     * Assign classes that extend Model or SchemedModel to preset_options.schemas to have them 
     * available to Wick.
     *
     * In JavaScript:
     * ```javascript
     * class MyFavoriteModelType extends Model {};
     * preset_options.custom_components = {
     *      my_favorite_model_type : MyFavoriteModelType
     * }
     * ```
     * note: presets.schema.any is always assigned to the Model class.
     * @instance
     * @readonly
     */
    schemes?: {};

    /**
     * OLD - NEEDS UPDATE
     * 
     * Store of user defined Model instances that serve as global models, which are available to the 
     * whole application. 
     * 
     * Multiple Scopes will be able to _bind_ to the Models. `<w-scope>` tags in templates that have 
     * a value set for the `model` attribute, e.g. `<w-s model="my_global_model">...</w-s>`, will be 
     * bound to the model in presets .model whose property name matches the "model" attribute.
     *
     * Assign instances of Model or Model or any class that extends these to preset_options.models 
     * to have them used by Wick.
     *
     * In JavaScript:
     * ```javascript
     *   const MyGlobalModel = new Model({global_data: "This is global!"});
     *   preset_options.custom_components = {
     *        my_global_model : MyGlobalModel
     *   }
     * ```
     *
     *
     * @instance
     * @readonly
     */
    models?: {};

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
}


export interface UserPresets {

    repo?: [[string, string]];

    api?: {
        [key: string]: any;
    };

    options?: PresetOptions["options"];

    schemes: any;

    models: any;
}