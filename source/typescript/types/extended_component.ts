import { WickComponentErrorStore } from "./errors.js";
import { WickRTComponent } from "../runtime/runtime_component.js";
import { Component } from "./types.js";
import { RuntimeComponent } from "../wick.js";
/**
 * A compiled component that can be mounted to a DOM node.
 */
interface Extension {
    errors: WickComponentErrorStore;
    pending: Promise<Extension & Component>;
    mount: (data?: object, ele?: HTMLElement) => Promise<WickRTComponent>;
    class: typeof RuntimeComponent;
    classWithIntegratedCSS: typeof RuntimeComponent;
    class_string: string;
}

export type ExtendedComponent = (Component & Extension);
