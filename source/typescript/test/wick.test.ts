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

import { ComponentData } from "../types/component_data.js";
import { rt } from "../runtime/runtime_global.js";
import { componentDataToCSS } from "../component/compile/component_data_to_css.js";
import Presets from "../presets.js";



export interface WickTestTools {

}

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

export { WickTest };