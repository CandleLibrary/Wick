//import { CustomComponent } from "../page/component"
import { DOC } from "./short_names"
import { ModelBase } from "../model/base"
import { AnyModel } from "../model/any"

/**
 * There are a number of configurable options and global objects that can be passed to wick to be used throughout the PWA. The instances of the Presets class are objects that hosts all these global properties. 
 * 
 * Presets are designed to be created once, upfront, and not changed once defined. This reinforces a holistic design for a PWA should have in terms of the types of Schemas, global Models, and overall form the PWA takes, e.g whether to use the ShadowDOM or not.
 * 
 * Note: *This object is made immutable once created.*
 * 
 * @param      {Object | Presets}  preset_options  An Object containing configuration data to be used by Wick.
 * @memberof module:wick
 * @alias Presets
 */
class Presets {
    constructor(preset_options = {}) {

        //Declaring the properties upfront to give the VM a chance to build an appropriate virtual class.
        this.components = {};

        /** 
         * Container of user defined CustomSourcePackage factories that can be used in place of the components built by the Wick templating system. Accepts any class extending the CustomComponent class. Adds these classes from preset_options.custom_sources or preset_options.components. 
         * 
         * In routing mode, a HTML `<component>` tag whose first classname matches a property name of a member of presets.custom_sources will be assigned to an instance of that member.
         * 
         * ### Example
         * In HTML:
         * ```html
         * <component class="my_source class_style">
         * 
         * ```
         * In JavaScript:
         * ```javascript
         * let MySource = CustomSourcePackage( ele =>{
         *      ele.append
         * }, {});
         * 
         * preset_options.custom_componets = {
         *      my_source : MySource
         * }
         * ```
         * @instance
         * @readonly
         */
        this.custom_sources = {};

        /**
         * { Object } Container of user defined classes that extend the Model or AnyModel classes. `<w-source>` tags in templates that have a value set for the  `schema` attribute, e.g. `<w-s schema="my_favorite_model_type">...</w-s>`, will be bound to a new instance of the class in presets.schema whose property name matches the "schema" attribute.
         * 
         * Assign classes that extend Model or AnyModel to preset_options.schemas to have them available to Wick.
         * 
         * In JavaScript:
         * ```javascript
         * class MyFavoriteModelType extends Model {};
         * preset_options.custom_componets = {
         *      my_favorite_model_type : MyFavoriteModelType
         * }
         * ```
         * note: presets.schema.any is always assigned to the AnyModel class.
         * @instance
         * @readonly
         */
        this.schemas = { any: AnyModel };

        /**
         * { Object } Container of user defined Model instances that serve as global models, which are available to the whole application. Multiple Sources will be able to _bind_ to the Models. `<w-source>` tags in templates that have a value set for the  `model` attribute, e.g. `<w-s model="my_global_model">...</w-s>`, will be bound to the model in presets._m whose property name matches the "model" attribute.
         * 
         * Assign instances of Model or AnyModel or any class that extends these to preset_options.models to have them used by Wick.
         * 
         * In JavaScript:
         * ```javascript
         * const MyGlobalModel = new AnyModel({global_data: "This is global!"});
         * preset_options.custom_componets = {
         *      my_global_model : MyGlobalModel
         * }
         * ```
         * @instance
         * @readonly
         */
        this.models = {};

        /**
         * Configured by `preset_options.USE_SHADOW`. If set to true, and if the browser supports it, compiled and rendered template elements will be bound to a `<component>` shadow DOM, instead being appended as a child node.
         * @instance
         * @readonly
         */
        this.USE_SHADOW = false;

        /**
         * { Object } Contains all user defined HTMLElement templates 
         */
        this.templates = {};

        let c = preset_options.components;
        if (c)
            for (let cn in c)
                this.components[cn] = c[cn];

        c = preset_options.custom_sources;
        if (c)
            for (let cn in c)
                if (cn instanceof CustomComponent)
                    this.custom_sources[cn] = c[cn];

        c = preset_options.components;
        if (c)
            for (let cn in c)
                if (CustomComponent.isPrototypeOf(c[cn]))
                    this.custom_sources[cn] = c[cn];

        c = preset_options.models;
        if (c)
            for (let cn in c)
                if (c[cn] instanceof ModelBase)
                    this.models[cn] = c[cn];

        c = preset_options.schemas;
        if (c)
            for (let cn in c)
                if (ModelBase.isPrototypeOf(c[cn]))
                    this.schemas[cn] = c[cn];

        this.USE_SHADOW = (preset_options.USE_SHADOW) ? (DOC.head.createShadowRoot || DOC.head.attachShadow) : false;

        Object.freeze(this.custom_sources);
        Object.freeze(this.schemas);
        Object.freeze(this.models);
        Object.freeze(this.USE_SHADOW);


        //Object.freeze(this);
    }
}

export { Presets };