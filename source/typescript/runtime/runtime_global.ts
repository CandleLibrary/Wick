
import Presets from "../presets.js";

import { ComponentData } from "../types/types.js";
import { PresetOptions } from "../types/preset_options.js";
import { WickRTComponent } from "./runtime_component.js";



import { cfw } from "@candlefw/cfw";
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
    presets: Presets;

    setPresets: (preset_options?: PresetOptions) => Presets,

    OVERRIDABLE_onComponentCreate(component_instance: WickRTComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: any): void;
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

        OVERRIDABLE_onComponentCreate(component_instance) { },

        OVERRIDABLE_onComponentMetaChange() { },

        setPresets: (preset_options: PresetOptions) => {

            //create new component
            const presets = new Presets(preset_options);

            if (!rt.presets)
                rt.presets = presets;

            return presets;
        },
    };
})();


export { rt };