import { parseSource } from "../../../build/library/component/parse/source_parser.js";
import { componentDataToClassString } from "../../../build/library/component/compile/component_data_to_js.js";
import { RenderPage } from "../../../build/library/component/compile/compile_web_page.js";
import Presets from "../../../build/library/presets.js";
import URL from "@candlefw/url";

const presets = new Presets();
const comp = await parseSource(new URL("./test/compile/component_building/test-components/template/host.wick"), presets);

console.log(componentDataToClassString(comp, presets));
console.log(RenderPage(comp, presets));

assert(i, comp.errors == true);
