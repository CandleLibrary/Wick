
import Presets from "../presets.js";

import { Component } from "../types/types.js";
import { PresetOptions } from "../types/preset_options.js";
import { WickRTComponent } from "./runtime_component.js";

import { cfw } from "@candlefw/cfw";

export interface WickRuntime {
    glow: any,

    /**
     * Register component CLASS
     * @param arg1 
     */
    rC(arg1: Component): void;

    /**
     * Retrieve component CLASS
     * @param name 
     */
    gC(name: string): Component,
    presets: Presets;

    OVERRIDABLE_onComponentCreate(component_meta: any, component_instance: WickRTComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: any): void;

    api: any;//{ __internal_API_format__: () => void, };
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

        rC: component => void rt.presets.component_class.set(component.name, component),

        gC: component_name => rt.presets.component_class.get(component_name),

        OVERRIDABLE_onComponentCreate(component_meta, component_instance) { },

        OVERRIDABLE_onComponentMetaChange() { },

        setPresets: async (preset_options: PresetOptions) => {

            //create new component
            const presets = new Presets(preset_options);

            if (!rt.presets)
                rt.presets = presets;

            return presets;
        },

        api: {
            URL,
            __internal_API_format__: {},
            getExpectedAPIJSON() {
                return JSON.stringify(rt.api.__internal_API_format__);
            }
        }
    };
})();


export { rt };