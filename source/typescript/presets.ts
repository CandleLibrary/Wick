import URL from "@candlefw/url";

import { PresetOptions } from "./types/preset_options.js";
import { ExtendedComponent } from "./types/extended_component.js";
import { Component } from "./types/types.js";
import { RuntimeComponent } from "./wick.js";

let CachedPresets = null;

/**
     * Default configuration options
     */
const P = <PresetOptions>{
    options: {
        USE_SHADOW: false
    }
};

export default class Presets implements PresetOptions {

    options: {
        THROW_ON_ERRORS?: boolean,
        cache_url?: boolean,
        USE_SHADOW?: boolean,
        USE_SHADOWED_STYLE?: boolean,
    };



    document?: Document;

    window?: Window;


    /**
     * Store for compiled components.
     * @private
     */
    components?: Map<string, any>;

    component_class: Map<string, typeof RuntimeComponent>;

    component_class_string: Map<string, string>;

    schemes?: {};

    models?: {};

    custom?: {};

    url: URL;

    api: any;

    wrapper: ExtendedComponent;

    named_components: Map<string, Component>;

    static global = { get v() { return CachedPresets; }, set v(e) { } };

    /**
     * Constructs a Presets object that can be passed to the Wick compiler.
     * @param preset_options - An object of optional configurations.
     */
    constructor(preset_options: PresetOptions = <PresetOptions>{}) {

        preset_options = Object.assign({}, P, preset_options);
        preset_options.options = Object.assign({}, P.options, preset_options.options);

        this.options = <PresetOptions["options"]>{
            THROW_ON_ERRORS: false,
            cache_url: true
        };

        this.window = typeof window != "undefined" ? window : <Window>{};

        this.document = this.window.document;

        this.api = preset_options.api;

        this.wrapper = null;

        this.named_components = new Map;

        this.components = new Map;

        this.component_class = new Map;

        this.component_class_string = new Map;

        this.schemes = {};

        this.models = {};

        this.custom = Object.assign({}, preset_options.custom);

        let c = preset_options.options;

        if (c)
            for (const cn in c) {
                if (typeof c[cn] == typeof this.options[cn])
                    this.options[cn] = c[cn];
                //else
                //    console.log(`Unexpected option [${cn}]`);
            }

        c = preset_options.models;

        if (c)
            for (const cn in c)
                this.models[cn] = c[cn];

        c = preset_options.schemes;

        if (c)
            for (const cn in c)
                this.schemes[cn] = c[cn];

        this.options.USE_SHADOWED_STYLE = ((preset_options.options.USE_SHADOWED_STYLE) && (this.options.USE_SHADOW));

        this.url = new URL;

        Object.freeze(this.options);
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

//Presets.global = {get v(){return CachedPresets}, set v(e){}};
