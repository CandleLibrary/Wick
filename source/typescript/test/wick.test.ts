//@ts-nocheck
/**[API]:module-intro
 * 
 * ## Testing Instrumentation
 * 
 * This module provides testing instrumentation for use
 * in unit and e2e testing of wick. It provides functionality 
 * for:
 * - Inspecting Component Data Objects
 * - Inspecting Runtime Components
 */

import spark from "@candlelib/spark";
import { rt } from "../runtime/global.js";
import { componentDataToCSS } from "../component/render/css.js";
import Presets from "../common/presets.js";
import { WickRTComponent } from "../runtime/component.js";
import spark from "@candlefw/spark";


export interface WickTestTools {

}


let ENABLED = false;
const WickTest: WickTestTools = <WickTestTools>{
    reset() { rt.presets = new Presets(); },
    getCompiledCSSString(comp: ComponentData, name = comp.name) {
        const restore_name = comp.name;
        comp.name = name;
        const out_data = componentDataToCSS(comp);
        comp.name = restore_name;
        return out_data;
    }
};

export function init() {

    if (ENABLED) return;

    ENABLED = true;
    // Hook in testing functions into the runtime component

    /**
     * Sends a click event to an Element w
     * 
     * The button can be specified with a CSS selector, or 
     * it will send the event to the first button present 
     * within the component
     */
    WickRTComponent.prototype.dispatchEvent = async function (selector_string: string, event_name: string = "", event_data: Object = undefined) {

        const ele = this.getFirstMatch(selector_string);

        if (ele) {

            await spark.sleep(10);

            const event = new (getEventType(event_name))(event_name, event_data);

            ele.dispatchEvent(event, ele);

            await spark.sleep(10);

            return true;
        }

        return false;
    };

    WickRTComponent.prototype.getNumberOfMatches = function (selector_string: string) {
        return (this.ele.querySelectorAll(selector_string) || []).length;
    };

    WickRTComponent.prototype.getFirstMatch = function (selector_string: string = "") {
        if (selector_string == "root") return this.ele;
        return this.ele.querySelector(selector_string);
    };

    WickRTComponent.prototype.getAllMatches = function (selector_string: string) {
        return this.ele.querySelectorAll(selector_string);
    };

    function getEventType(event_name: string) {
        return {
            "input": InputEvent,
            "change": Event,
            "cancel": Event,
            "close": Event,
            "toggle": Event,
            "abort": ProgressEvent,
            "error": ProgressEvent,
            "loadend": ProgressEvent,
            "loadstart": ProgressEvent,
            "load": ProgressEvent,
            "progress": ProgressEvent,
            "transitioncancel": TransitionEvent,
            "transitionend": TransitionEvent,
            "transitionrun": TransitionEvent,
            "transitionstart": TransitionEvent,
            "animationcancel": AnimationEvent,
            "animationend": AnimationEvent,
            "animationiteration": AnimationEvent,
            "animationstart": AnimationEvent,
            "pointerover": PointerEvent,
            "pointerenter": PointerEvent,
            "pointerdown": PointerEvent,
            "pointerup": PointerEvent,
            "pointerout": PointerEvent,
            "pointerleave": PointerEvent,
            "pointermove": PointerEvent,
            "pointercancel": PointerEvent,
            "gotpointercapture": PointerEvent,
            "lostpointercapture": PointerEvent,
        }[event_name.toString().toLowerCase().replace(/^on/, "")] ?? Event;
    }
}





export { WickTest };