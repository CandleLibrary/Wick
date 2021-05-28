
import { cfw } from "@candlelib/candle";
import Presets from "../compiler/common/presets.js";
import { PresetOptions, UserPresets } from "../types/presets";
import { WickRTComponent } from "./component.js";




export const global_object = (typeof global !== "undefined") ? global : window;

export interface WickRuntime {
    glow: any,

    /**
     * Register component CLASS
     * @param arg1 
     */
    rC(arg1: typeof WickRTComponent): void;

    /**
     * Retrieve component CLASS
     * @param name 
     */
    gC(name: string): typeof WickRTComponent,
    presets: PresetOptions;
    /**
     * Replace the current presets with a new set.
     * > Warning:  This will cause a lose of all currently
     * > compiled components.
     */
    setPresets: (preset_options?: UserPresets) => Presets,
    /**
     * Template elements mapped to component names
     */
    templates: Map<string, HTMLElement>;

    OVERRIDABLE_onComponentCreate(component_instance: WickRTComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: any): void;

    init: () => Promise<void>;
}

const rt: WickRuntime = (() => {

    return <WickRuntime>{

        get glow() { return cfw.glow; },

        get p() { return rt.presets; },

        /**
         * Runtime Component Class Constructor
         */
        get C() { return WickRTComponent; },

        presets: null,

        rC: component => (rt.presets.component_class.set(component.name, component), component),

        gC: component_name => rt.presets.component_class.get(component_name),

        templates: new Map,

        OVERRIDABLE_onComponentCreate(component_instance) { },

        OVERRIDABLE_onComponentMetaChange() { },


        setPresets: (preset_options: UserPresets) => {

            //create new component
            const presets = new Presets(preset_options);

            //if (!rt.presets)
            rt.presets = <Presets><any>presets;

            return presets;
        },

        init: null
    };
})();


export { rt };
