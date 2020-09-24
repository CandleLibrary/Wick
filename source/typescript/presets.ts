import URL from "@candlefw/url";

import { PresetOptions } from "./types/preset_options.js";
import { ExtendedComponentData } from "./types/extended_component.js";
import { ComponentClassStrings } from "./types/component_class_strings";
import { ComponentData } from "./types/component_data";
import { RuntimeComponent } from "./wick.js";
import { ComponentStyle } from "./types/component_style.js";

let CachedPresets = null;

/**
     * Default configuration options
     */
const DefaultPresets = <PresetOptions>{
    options: {
        USE_SHADOW: false,
        USE_SHADOWED_STYLE: false,
        CACHE_URL: false,
        GENERATE_SOURCE_MAPS: false,
        REMOVE_DEBUGGER_STATEMENTS: true,
        THROW_ON_ERRORS: true,
        INCLUDE_SOURCE_URI: false,
        url: {
            glow: "@candlefw/glow",
            wick: "@candlefw/wick",
            wickrt: "@candlefw/wick",
        }
    }
};

/**
 * Global store for build and runtime objects
 */
export default class Presets implements PresetOptions {

    options: PresetOptions["options"];
    document?: Document;

    window?: Window;

    /**
     * Store for ComponentData
     */
    components?: Map<string, ComponentData>;

    /**
     * Store for RuntimeComponent.
     */
    component_class: Map<string, typeof RuntimeComponent>;

    /**
     * Map of generated component class strings and optional source maps.
     */
    component_class_string: Map<string, ComponentClassStrings>;

    schemes?: {};

    models?: {};

    custom?: {};

    styles?: Map<string, ComponentStyle>;

    url: URL;

    api: any;

    wrapper: ExtendedComponentData;

    named_components: Map<string, ComponentData>;

    css_cache: any;

    static global = { get v() { return CachedPresets; }, set v(e) { } };

    /**
     * Constructs a Presets object that can be passed to the Wick compiler.
     * @param UserPresets - An object of optional configurations.
     */
    constructor(UserPresets: PresetOptions = <PresetOptions>{}) {

        UserPresets = Object.assign({}, DefaultPresets, UserPresets);

        UserPresets.options = Object.assign({}, DefaultPresets.options, UserPresets.options);

        UserPresets.options.url = Object.assign({}, DefaultPresets.options.url, (UserPresets.options || {}).url || {});

        this.options = UserPresets.options;

        this.window = typeof window != "undefined" ? window : <Window>{};

        this.document = typeof document != "undefined" ? document : <Document>{};

        this.api = Object.assign(URL.GLOBAL.getData(), { hash: URL.GLOBAL.hash }, UserPresets.api);

        this.wrapper = null;

        this.named_components = new Map;

        this.components = new Map;

        this.component_class = new Map;

        this.component_class_string = new Map;

        this.schemes = {};

        this.models = {};

        this.css_cache = {};

        this.styles = new Map();

        this.custom = Object.assign({}, UserPresets.custom);

        for (const cn in this.options)
            if (typeof this.options[cn] != typeof DefaultPresets.options[cn])
                throw new ReferenceError(`Unrecognized preset ${cn}`);

        let c = UserPresets.models;

        if (c)
            for (const cn in c)
                this.models[cn] = c[cn];

        c = UserPresets.schemes;

        if (c)
            for (const cn in c)
                this.schemes[cn] = c[cn];

        this.options.USE_SHADOWED_STYLE = ((UserPresets.options.USE_SHADOWED_STYLE) && (this.options.USE_SHADOW));

        this.url = new URL;

        // Object.freeze(this.options);
        Object.freeze(this.schemes);
        //Object.freeze(this.models);

        CachedPresets = this;
    }

    processLink(link) { }

    /**
        Copies values of the Presets object into a generic object. The new object is not frozen.
    */
    copy() {
        const obj = <Presets>{};

        for (let a in this) {
            if (a == "components")
                obj.components = this.components;
            else if (typeof (this[a]) == "object")
                //@ts-ignore
                obj[a] = Object.assign({}, this[a]);
            //@ts-ignore
            else if (typeof (this[a]) == "array")
                //@ts-ignore
                obj[a] = this[a].slice();
            else
                //@ts-ignore
                obj[a] = this[a];
        }

        const presets = new Presets(obj);

        presets.processLink = this.processLink.bind(this);

        return presets;
    }
}