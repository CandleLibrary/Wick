import { DOC } from "";
import URL from "@candlefw/url";
let CachedPresets = null;
export default class Presets {
    /**
     * Constructs a Presets object that can be passed to the Wick compiler.
     * @param preset_options - An object of optional configurations.
     */
    constructor(preset_options = {}) {
        this.options = {
            THROW_ON_ERRORS: false,
            cache_url: true
        };
        this.components = {};
        this.custom_components = {};
        this.schemes = {};
        this.models = {};
        this.custom = Object.assign({}, preset_options.custom, P.default_custom);
        let c = preset_options.options;
        if (c)
            for (const cn in c) {
                if (typeof c[cn] == typeof this.options[cn])
                    this.options[cn] = c[cn];
                else
                    console.log(`Unexpected option [${cn}]`);
            }
        // const d = preset_options.components;
        // if (d)
        //     for (const cn in d)
        //         this.components[cn] = c[cn];
        // const e = preset_options.custom_scopes;
        // if (e)
        //     for (const cn in e)
        //         if (cn instanceof CustomComponent)
        //             this.custom_scopes[cn] = c[cn];
        c = preset_options.custom_components;
        if (c)
            for (const cn in c)
                this.custom_components[cn] = c[cn];
        c = preset_options.models;
        if (c)
            for (const cn in c)
                this.models[cn] = c[cn];
        c = preset_options.schemes;
        if (c)
            for (const cn in c)
                this.schemes[cn] = c[cn];
        this.options.USE_SHADOW = (preset_options.options.USE_SHADOW)
            ? (DOC.head.createShadowRoot
                || DOC.head.attachShadow) : false;
        this.options.USE_SHADOWED_STYLE = ((preset_options.options.USE_SHADOWED_STYLE) && (this.options.USE_SHADOW));
        this.url = new URL;
        Object.freeze(this.options);
        //Object.freeze(this.custom_scopes);
        Object.freeze(this.schemes);
        Object.freeze(this.models);
        CachedPresets = this;
    }
    processLink(link) { }
    /**
        Copies values of the Presets object into a generic object. The new object is not frozen.
    */
    copy() {
        const obj = {};
        for (let a in this) {
            if (a == "components")
                obj.components = this.components;
            else if (typeof (this[a]) == "object")
                obj[a] = Object.assign({}, this[a]);
            else if (typeof (this[a]) == "array")
                obj[a] = this[a].slice();
            else
                obj[a] = this[a];
        }
        const presets = new P(obj);
        presets.processLink = this.processLink.bind(this);
        return presets;
    }
}
Presets.global = { get v() { return CachedPresets; }, set v(e) { } };
//Presets.global = {get v(){return CachedPresets}, set v(e){}};
