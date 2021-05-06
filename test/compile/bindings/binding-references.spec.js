import buildComponent from "../../../build/library/component/component.js";
import { componentDataToClassString } from "../../../build/library/component/component_data_to_js.js";
import Presets from "../../../build/library/presets.js";


//assert_group(() => {

const presets = new Presets();

const comp = await buildComponent(
    ` var updateA = true; var updateB = false; function onclick(){updateA += true + ++updateA} function onpointerup(){ updateB = true } export default <div>\${update}</div> `, presets
);

console.log(componentDataToClassString(comp, presets));

assert(i, comp.errors == true);
//});