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
import { componentDataToTempAST } from "../compiler/ast-compile/html.js";
import { componentDataToCSS } from "../compiler/ast-render/css.js";
import { htmlTemplateToString } from "../compiler/ast-render/html.js";
import { ComponentDataClass } from "../compiler/common/component.js";
import Presets from "../compiler/common/presets.js";
import { WickRTComponent } from "../runtime/component.js";
import { rt } from "../runtime/global.js";
import { ComponentData } from "../types/component";



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

    WickRTComponent.prototype.sleep = async function (time: init = 10) {
        await spark.sleep(time);
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
    /**
     * Returns the components HTML string representation
     */
    ComponentDataClass.prototype.getHTMLString = async function (presets = rt.presets) {

        const html = await this.getHTMLTemplate(presets);

        return htmlTemplateToString(html);
    };

    /**
     * Returns the HTML template object 
     */
    ComponentDataClass.prototype.getHTMLTemplate = async function (presets = rt.presets) {

        const { html } = await componentDataToTempAST(this, presets);

        console.log({ html });

        return html[0];
    };

    /**
     * Returns the Templates template object 
     */
    ComponentDataClass.prototype.getHTMLTemplateMap = async function (presets = rt.presets) {

        const { template_map } = await componentDataToTempAST(this, presets);

        return template_map;
    };

    ComponentDataClass.prototype.getCSSString = async function (presets = rt.presets) {

        return componentDataToCSS(this);
    };
}





export { WickTest };
