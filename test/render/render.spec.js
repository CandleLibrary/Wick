
import { parseSource } from "../../build/library/component/parse/source_parser.js";
import { createCompiledComponentClass } from "../../build/library/component/compile/compile.js";
import { componentDataToJSStringCached } from "../../build/library/component/render/js.js";
import Presets from "../../build/library/common/presets.js";

const source_string = `<div>
    <container data=\${data} element=div limit=${3}>
        <div>
            <div class="header">\${header}</div>

            <container data=\${entries} >
                <a href=\${href || "#"} >
                    \${value}
                </a>    
            </container>

        </div>
        
    </container>
</div>`;

const presets = new Presets();

const component = await parseSource(source_string, presets);

const comp = createCompiledComponentClass(component, presets);
console.log(0, 3, { component, comp });
const str = componentDataToJSStringCached(component, presets);


assert(i, comp.methods.length == 4);
assert(i, str == 2);

