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

import { ComponentData } from "../types/component";
import { rt } from "../runtime/global.js";
import { componentDataToCSS } from "../component/render/css.js";
import Presets from "../common/presets.js";



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