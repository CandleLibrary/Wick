import { WickComponentErrorStore } from "./errors.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import { ComponentData } from "./component_data";
import { RuntimeComponent } from "../wick.js";
/**
 * A compiled component that can be mounted to a DOM node.
 */

interface Extension {
    errors: WickComponentErrorStore;
    pending: Promise<Extension & ComponentData>;
    mount: (data?: object, ele?: HTMLElement) => Promise<WickRTComponent>;
    class: typeof RuntimeComponent;
    class_with_integrated_css: typeof RuntimeComponent;
    class_string: string;
}
/**
 * @type {ExtendedComponentData}
 */
export type ExtendedComponentData = (ComponentData & Extension);
