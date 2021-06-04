import { addModuleToCFW } from "@candlelib/candle";
import Presets from "../compiler/common/presets.js";
import { rt } from "../runtime/global.js";
import {
    Element_Is_Wick_Component,
    Element_Is_Wick_Template, hydrateComponentElements
} from "../runtime/html.js";
import { loadModules } from "../runtime/load_modules.js";

const
    nop = _ => !0,
    wick = function () {

        console.warn("Wick.rt is incapable of compiling components. Use the full Wick library instead." +
            " \n\t A dummy component will be generated.");

        const d = {
            mount: nop,
            get pending() { return d; },
            class: function () {
                this.ele = document.createElement("div");
                this.ele.innerHTML = "Wick.rt is incapable of compiling component, a dummy component has been generated instead.";
            },
            createInstance: nop,
        };

        return d;
    };

Object.assign(wick, rt);

Object.defineProperty(wick, "rt", { value: rt });

Object.defineProperty(wick, "setWrapper", { value: nop });

Object.defineProperty(wick, "toString", {
    value: () =>
        `
        __           _    _ _____ _____  _   __      _   
       / _|         | |  | |_   _/  __ \| | / /     | |  
   ___| |___      _| |  | | | | | /  \/| |/ / _ __| |_ 
 / __|  _\ \ /\ / / |/\| | | | | |    |    \| '__| __|
| (__| |  \ V  V /\  /\  /_| |_| \__/\| |\  \ |  | |_ 
\___|_|   \_/\_(_)\/  \/ \___/ \____/\_| \_/_|   \__|
 `

});


function gatherWickElements() {

    const
        pending_elements_queue: HTMLElement[] = [window.document.body],

        pending_component_elements: HTMLElement[] = [];

    while (pending_elements_queue.length > 0)

        for (const element of (Array.from(pending_elements_queue.shift().children ?? [])))

            if (element.nodeType == Node.ELEMENT_NODE)

                if (Element_Is_Wick_Template(<any>element))
                    rt.templates.set(element.id, <any>element);
                else if (Element_Is_Wick_Component(<any>element))
                    pending_component_elements.push(<any>element);
                else
                    pending_elements_queue.push(<any>element);

    return pending_component_elements;
}


/**
 * Loads templates and hydrates page. Assumes hydratable component 
 * data has already been loaded.
 */

wick.rt.init = async function () {

    // Assuming wick.rt.setPresets has been called already.

    // Load API modules
    await loadModules(rt.presets);

    /**
     * Looks through DOM and hydrates any element that has a 'w:c'
     * attribute. Such elements also require their first class 
     * name be a Wick component hash name.
     */

    const elements = gatherWickElements();

    for (const comp of hydrateComponentElements(elements)) {
        comp.connect();
    }
};

export { Presets };

export default wick;

addModuleToCFW(wick, "wick");