import { WickComponent } from "./component_class.js";
import Presets from "../component/presets.js";

export interface WickRuntime {
    registerComponent(arg1: string, arg2: WickComponent): void;

    prst: Presets;

    OVERRIDABLE_onComponentCreate(component_meta: WickComponentMeta, component_instance: WickComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: WickComponentMeta): void;
}

const rt: WickRuntime = (() => {

    const components: Map<string, WickComponent> = new Map();

    return {

        presets: {},

        registerComponent(component_name, component) {
            components.set(component_name, component);
        },

        getComponent(component_name): WickComponent {
            return components.get(component_name);
        },

        OVERRIDABLE_onComponentCreate(component_meta, component_instance) { },

        OVERRIDABLE_onComponentMetaChange() { }
    };

})();


export { rt };