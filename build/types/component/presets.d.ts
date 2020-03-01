import URL from "@candlefw/url";
import { PresetOptions } from "../types/preset_options.js";
export default class Presets implements PresetOptions {
    options: {
        THROW_ON_ERRORS?: boolean;
        cache_url?: boolean;
        USE_SHADOW?: boolean;
        USE_SHADOWED_STYLE?: boolean;
    };
    /**
     * Store for compiled components.
     * @private
     */
    components?: {};
    custom_components?: {};
    schemes?: {};
    models?: {};
    custom?: {};
    url: URL;
    static global: {
        v: any;
    };
    /**
     * Constructs a Presets object that can be passed to the Wick compiler.
     * @param preset_options - An object of optional configurations.
     */
    constructor(preset_options?: PresetOptions);
    processLink(link: any): void;
    /**
        Copies values of the Presets object into a generic object. The new object is not frozen.
    */
    copy(): any;
}
