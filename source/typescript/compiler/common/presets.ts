import URL from "@candlelib/url";
import { PluginStore } from "../../plugin/plugin.js";
import { WickRTComponent } from "../../runtime/component.js";
import { ComponentClassStrings, ComponentData, ComponentStyle } from "../../types/component";
import { ExtendedComponentData } from "../../types/component.js";
import { PresetOptions, UserPresets } from "../../types/presets.js";

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
            glow: "@candlelib/glow",
            wick: "@candlelib/wick",
            wickrt: "@candlelib/wick",
        }
    }
};

/**
 * Global store for build and runtime objects
 */
export default class Presets implements PresetOptions {


    options: PresetOptions["options"];

    plugins: PresetOptions["plugins"];

    document?: PresetOptions["document"];

    window?: PresetOptions["window"];

    /**
     * Store for ComponentData
     */
    components?: PresetOptions["components"];

    /**
     * Store for WickRTComponents.
     */
    component_class: PresetOptions["component_class"];

    /**
     * Map of generated component class strings and optional source maps.
     */
    component_class_string: PresetOptions["component_class_string"];

    schemes?: PresetOptions["schemes"];

    models?: PresetOptions["models"];

    styles?: PresetOptions["styles"];

    url: PresetOptions["url"];

    api: PresetOptions["api"];

    wrapper: PresetOptions["wrapper"];

    named_components: PresetOptions["named_components"];

    css_cache: PresetOptions["css_cache"];

    repo: PresetOptions["repo"];

    static global = { get v() { return CachedPresets; }, set v(e) { } };

    /**
     * Constructs a Presets object that can be passed to the Wick compiler.
     * @param user_presets - An object of optional configurations.
     */
    constructor(user_presets: UserPresets | PresetOptions = <UserPresets>{}) {

        user_presets = Object.assign({}, DefaultPresets, user_presets);

        user_presets.options = Object.assign({}, DefaultPresets.options, user_presets.options);

        user_presets.options.url = Object.assign({}, DefaultPresets.options.url, (user_presets.options || {}).url || {});

        this.verifyOptions();

        this.url = new URL;

        this.options = user_presets.options;

        this.document = typeof document != "undefined" ? document : <Document>{};

        this.window = typeof window != "undefined" ? window : <Window>{};

        this.wrapper = null;

        this.api = {};

        this.css_cache = {};

        this.models = {};

        this.schemes = {};

        this.component_class = new Map;

        this.component_class_string = new Map;

        this.components = new Map;

        this.named_components = new Map;

        this.repo = new Map;

        this.styles = new Map;

        this.plugins = new PluginStore;

        this.addRepoData(<UserPresets>user_presets);

        this.loadModelData(<UserPresets>user_presets);

        this.loadSchemeData(<UserPresets>user_presets);

        this.loadAPIObjects(<UserPresets>user_presets);

        this.options.USE_SHADOWED_STYLE = ((user_presets.options.USE_SHADOWED_STYLE) && (this.options.USE_SHADOW));

        // Object.freeze(this.options);
        Object.freeze(this.schemes);
        //Object.freeze(this.models);

        CachedPresets = this;
    }

    private loadAPIObjects(user_presets: UserPresets) {
        if (user_presets.api) {
            for (const name in user_presets.api)
                this.addAPIObject(name, user_presets.api[name]);
        }
    }

    private verifyOptions() {
        for (const cn in this.options)
            if (typeof this.options[cn] != typeof DefaultPresets.options[cn])
                throw new ReferenceError(`Unrecognized preset ${cn}`);
    }

    private loadSchemeData(user_presets: UserPresets) {
        const d = user_presets.schemes;

        if (d)
            for (const cn in d)
                this.schemes[cn] = d[cn];
    }

    private loadModelData(user_presets: UserPresets) {
        let c = user_presets.models;

        if (c)
            for (const cn in c)
                this.models[cn] = c[cn];
    }

    private addRepoData(user_presets: UserPresets) {
        for (const [hash, url] of user_presets.repo || [])
            this.repo.set(url, {
                hash,
                url,
                module: null
            });
    }

    addAPIObject(name: string, obj: any) {
        if (name in this.api)
            return;

        this.api[name] = {
            hash: name,
            default: obj,
        };
    }

    processLink(link) { }

    /**
        Copies values of the Presets object into a generic object. The new object is not frozen.
    */
    copy(): PresetOptions {
        const obj = <PresetOptions>{};

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