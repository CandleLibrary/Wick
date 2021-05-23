
import { parseSource } from "../../build/library/component/parse/source.js";
import { createCompiledComponentClass } from "../../build/library/component/compile/compile.js";
import { componentDataToJSStringCached } from "../../build/library/component/render/js.js";
import Presets from "../../build/library/common/presets.js";

const source_string = `<div>
    var data = [{}];

    <container data=\${data} element=div limit=\${3}>
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
const comp = await createCompiledComponentClass(component, presets);
const str = await componentDataToJSStringCached(component, presets);


assert(comp.methods.length == 3);

