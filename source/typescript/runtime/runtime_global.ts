
import Presets from "../presets.js";

import { Component } from "../types/types.js";
import { PresetOptions } from "../types/preset_options.js";
import { WickRTComponent } from "./runtime_component.js";

import { cfw } from "@candlefw/cfw";

export interface WickRuntime {
    glow: any,

    registerComponent(arg1: string, arg2: Component): void;
    presets: Presets;

    OVERRIDABLE_onComponentCreate(component_meta: WickComponentMeta, component_instance: Component): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: WickComponentMeta): void;

    api: { __internal_API_format__: () => void, };
}

const rt: WickRuntime = (() => {

    return <WickRuntime>{

        get glow() { return cfw.glow; }

        Component: WickRTComponent,

        presets: null,

        registerComponent: (component_name, component) => void rt.presets.component_class.set(component_name, component),

        getComponent: (component_name): Component => rt.presets.component_class.get(component_name),

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