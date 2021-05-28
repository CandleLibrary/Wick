
import { parseSource } from "../../../build/library/compiler/ast-parse/source.js";
import { createCompiledComponentClass } from "../../../build/library/compiler/ast-build/build.js";
import { componentDataToJSStringCached } from "../../../build/library/compiler/ast-render/js.js";
import Presets from "../../../build/library/compiler/common/presets.js";
import { loadModules } from "../../../build/library/runtime/load_modules.js";
import { ModuleHash } from "../../../build/library/compiler/common/hash_name.js";
import { RenderPage } from "../../../build/library/compiler/ast-render/webpage.js";

assert_group("Module Import", sequence, () => {

    const source_string = `
    import URL from "@candlelib/url"

    const d = new URL("temp");

    export default <div>
    var data;
    
    <container data=\${await d.fetch()} element=div limit=${3}>
    </container>
    </div>`;

    const presets = new Presets();
    const component = await parseSource(source_string, presets);
    const comp = await createCompiledComponentClass(component, presets);
    const str = await componentDataToJSStringCached(component, presets);

    await loadModules(presets);
    const name = "@candlelib/url";
    const hash_name = ModuleHash(name);
    assert(presets.repo.size > 0);
    assert(presets.repo.has(name) == true);
    assert(presets.api[hash_name] != null);
    assert(presets.api[hash_name].default != null);
    assert(new presets.api[hash_name].default("/home/test.x").ext == "x");
    const str2 = (await RenderPage(component, presets)).page;
});


assert_group("Module Import Within Binding", sequence, () => {

    const source_string = `
    import wind from "@candlelib/wind" 
    export default <div>   
    <container data=\${await (new wind("temp")).fetch()} element=div limit=${3}>
    </container>
    </div>`;

    const presets = new Presets();
    const component = await parseSource(source_string, presets);
    const comp = await createCompiledComponentClass(component, presets);
    const str = await componentDataToJSStringCached(component, presets);

    await loadModules(presets);
    const name = "@candlelib/wind";
    const hash_name = ModuleHash(name);
    assert(presets.repo.size > 0);
    assert(presets.repo.has(name) == true);
    assert(presets.api[hash_name] != null);
    assert(presets.api[hash_name].default != null);
    assert(new presets.api[hash_name].default("test").tx == "test");
    const str2 = (await RenderPage(component, presets)).page;
});

