import { addModuleToCFW } from "@candlefw/cfw";
import Presets from "./presets.js";
import { rt } from "./runtime/runtime_global.js";
import { hydrateComponentElements, Is_Wick_Component_Element } from "./runtime/runtime_html.js";

const nop = _ => !0, wick = function () {

    console.warn("Wick.rt is incapable of compiling components. Use the full wick library instead." +
        " \n\t An inert component will be generated.");

    const d = {
        mount: nop,
        get pending() { return d; },
        class: function () {
            this.ele = document.createElement("div");
            this.ele.innerHTML = "Wick.rt is incapable of compiling components. An inert component has been generated.";
        },
        createInstance: nop,
    };

    return d;
};

Object.assign(wick, rt);

Object.defineProperty(wick, "rt", {
    value: rt
});

Object.defineProperty(wick, "setWrapper", {
    value: nop
});

Object.defineProperty(wick, "toString", {
    value: () =>
        `
       __          _    _ _____ _____  _   __     _   
      / _|        | |  | |_   _/  __ \| | / /    | |  
  ___| |___      _| |  | | | | | /  \/| |/ / _ __| |_ 
 / __|  _\ \ /\ / / |/\| | | | | |    |    \| '__| __|
| (__| |  \ V  V /\  /\  /_| |_| \__/\| |\  \ |  | |_ 
 \___|_|   \_/\_(_)\/  \/ \___/ \____/\_| \_/_|   \__|
 `

});


/**
 * Loads templates and hydrates page. Assumes hydratable component 
 * data has already been loaded.
 */
if (typeof window != undefined) {



    window.addEventListener("load", (): void => {
        //Assuming wick.rt.setPresets has been called already.

        /**
         * Looks through DOM and hydrates any element that has an 'w:c'
         * attribute. Such element also require that their first class 
         * name should be a WC############ component hash name.
         */

        const elements = gatherWickElements();

        hydrateComponentElements(elements);
    });
}

function gatherWickElements() {

    const
        pending_elements_queue: HTMLElement[] = [window.document.body],

        pending_component_elements: HTMLElement[] = [];

    while (pending_elements_queue.length > 0)

        for (const element of (Array.from(pending_elements_queue.shift().children ?? [])))

            if (element.nodeType == Node.ELEMENT_NODE) {

                if (element.tagName == "TEMPLATE" && Is_Wick_Component_Element(<any>element)) {
                    rt.templates.set(element.id, <any>element);
                    continue;
                }

                const html_ref = element as HTMLElement;

                if (Is_Wick_Component_Element(html_ref))
                    pending_component_elements.push(html_ref);
                else
                    pending_elements_queue.push(html_ref);
            }

    return pending_component_elements;
}

export { Presets };
export default wick;

addModuleToCFW(wick, "wick");