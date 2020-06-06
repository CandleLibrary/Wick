import { WickComponent } from "./component_class.js";
import Presets from "../component/presets.js";

export interface WickRuntime {
    registerComponent(arg1: string, arg2: WickComponent): void;

    prst: Presets;

    OVERRIDABLE_onComponentCreate(component_meta: WickComponentMeta, component_instance: WickComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: WickComponentMeta): void;
}

const style_strings = [];

let css_element = null;

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

        OVERRIDABLE_onComponentMetaChange() { },

        //Private
        __loadCSS__(comp, style_string) {

            const { constructor } = comp;

            if (!constructor.css)
                constructor.css = css_element;
            else return;

            style_strings.push(style_string);

            if (!css_element) {
                css_element = document.createElement("style");=
                document.head.appendChild(css_element);
            }

            css_element.innerHTML = style_strings.join("\n");

            console.log(css_element.innerHTML);
        }
    };

})();


export { rt };