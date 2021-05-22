
import { assert } from "console";
import Presets from "../../build/library/common/presets.js";
import { createCompiledComponentClass, createClassInfoObject, processMethods } from "../../build/library/component/compile/compile.js";
import { parseSource } from "../../build/library/component/parse/source.js";
import { componentDataToJSStringCached } from "../../build/library/component/render/js.js";

assert_group("Async Methods", sequence, () => {

    const source_string = `
    import URL from "/@cl/url"

    var data;

    function onload(){
        data = (await (new URL("/data/include_names/")).fetchJSON()).map(d=>({name:d}))
    }

    export default <div>
        <container data=\${data}>
            <li>
                {name}
            </li>
        </container>
    </div>`;

    const presets = new Presets();
    const class_info = createClassInfoObject();
    const component = await parseSource(source_string, presets);
    processMethods(component, class_info);

    assert("Detects when function should be made async", component.frames[1].IS_ASYNC == true);
    assert("Creates an asynchronous method when compiled", class_info.methods[2].ASYNC == true);
});

