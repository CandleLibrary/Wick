import Presets from "../compiler/common/presets.js";
import { rt } from "../runtime/global.js";
import {
    Element_Is_Wick_Component,
    Element_Is_Wick_Template, hydrateComponentElements
} from "../runtime/html.js";
import { loadModules } from "../runtime/load_modules.js";
import { UserPresets } from '../types/presets.js';

let
    nop = _ => !0,
    wick_root = function () {

        console.warn("Wick.rt is incapable of compiling components. Use the full Wick library instead." +
            " \n\t A placeholder component will be generated instead.");

        const d = {
            mount: nop,
            get pending() { return d; },
            class: function () {
                this.ele = document.createElement("div");
                this.ele.innerHTML = "Wick.rt is incapable of compiling components, a dummy component has been generated instead.";
            },
            createInstance: nop,
        };

        return d;
    };

const wick = Object.assign(wick_root, {

    rt: rt,

    setWrapper: nop,

    init_module_promise: null,

    async appendPresets(presets_options: UserPresets) {


        wick.rt.setPresets(presets_options);

        // Load API modules
        wick.init_module_promise = loadModules(presets_options, wick.rt.presets);

        return wick.init_module_promise;
    },

    /**
     * Loads templates and hydrates page. Assumes hydratable component 
     * data has already been loaded.
     */
    async hydrate() {

        window.addEventListener("load", async () => {

            if (wick.init_module_promise)

                await wick.init_module_promise;

            // Assuming wick.rt.setPresets has been called already.

            /**
             * Looks through DOM and hydrates any element that has a 'w:c'
             * attribute. Such elements also require their first class 
             * name be a Wick component hash name.
             */

            const elements = gatherWickElements();

            for (const comp of hydrateComponentElements(elements)) {
                comp.initialize();
                comp.connect();
                rt.root_components.push(comp);
            }
        });
    },

    toString() {
        return;
        `
      __           _    _ _____ _____  _   __      _   
     / _|         | |  | |_   _/  __ \| | / /     | |  
  ___| |___      _| |  | | | | | /  \/| |/ / _ __| |_ 
 / __|  _\ \ /\ / / |/\| | | | | |    |    \| '__| __|
| (__| |  \ V  V /\  /\  /_| |_| \__/\| |\  \ |  | |_ 
 \___|_|   \_/\_(_)\/  \/ \___/ \____/\_| \_/_|   \__|
 `;
    }
});

//Register wick as a global variable
globalThis["wick"] = wick;

/**
 * Returns an array of Wick Components identifier from a traversal 
 * 
 * 
 * @param dom 
 * @returns 
 */
export function gatherWickElements(dom: HTMLElement = window.document.body) {

    const
        pending_elements_queue: HTMLElement[] = [dom],

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





export { Presets };

export default wick;
