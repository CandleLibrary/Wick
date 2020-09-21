import Presets from "./presets.js";
import { rt } from "./runtime/runtime_global.js";
import { addModuleToCFW } from "@candlefw/cfw";

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

export default wick;

addModuleToCFW(wick, "wick");

/**
 * Loads templates and hydrates page. Assumes hydratable component 
 * data has already been loaded.
 */
if (typeof window != undefined) {

    const isWICKComponentElement = (ele: HTMLElement) => (ele
        &&
        ele.hasAttribute("w:c")
        && (ele.id.match(/W[_\$a-zA-Z0-9]+/)
            ||
            ele.classList[0].match(/W[_\$a-zA-Z0-9]+/)));

    window.addEventListener("load", () => {
        //Assuming wick.rt.setPresets has been called already.

        /**
         * Looks through DOM and hydrates any element that has an 'w:c'
         * attribute. Such element also require that their first class 
         * name should be a WC############ component hash name.
         */
        const
            pending_elements_queue: HTMLElement[] = [window.document.body],

            pending_component_elements: HTMLElement[] = [];

        while (pending_elements_queue.length > 0)

            for (const element of (Array.from(pending_elements_queue.shift().children ?? [])))

                if (element.nodeType == Node.ELEMENT_NODE) {

                    if (element.tagName == "TEMPLATE" && isWICKComponentElement(<any>element)) {
                        rt.templates.set(element.id, <any>element);
                        continue;
                    }

                    const html_ref = element as HTMLElement;

                    if (isWICKComponentElement(html_ref))
                        pending_component_elements.push(html_ref);
                    else
                        pending_elements_queue.push(html_ref);
                }

        for (const hydrate_candidate of pending_component_elements) {

            const
                component_name = hydrate_candidate.classList[0],

                comp = rt.gC(component_name);

            if (comp)
                new (comp)(null, hydrate_candidate);
            else
                console.warn(`WickRT :: Could not find component data for ${component_name}`);
        }
    });
}

export { Presets };

