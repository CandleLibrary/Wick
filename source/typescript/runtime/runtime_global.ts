import { WickComponent } from "./component_class.js";
import Presets from "../component/presets.js";

export interface WickRuntime {
    registerComponent(arg1: string, arg2: WickComponent): void;

    prst: Presets;
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
        }
    };

})();


export { rt };