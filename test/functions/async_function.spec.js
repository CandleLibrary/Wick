
import { assert } from "console";
import { createCompiledComponentClass } from "../../build/library/compiler/ast-build/build.js";
import { parseSource } from "../../build/library/compiler/ast-parse/source.js";
import Presets from "../../build/library/compiler/common/presets.js";

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
    const component = await parseSource(source_string, presets);

    const class_info = await createCompiledComponentClass(component, presets);

    assert("Detects when function should be made async", component.frames[1].IS_ASYNC == true);
    assert("Creates an asynchronous method when compiled", class_info.methods[0].ASYNC == true);
});

