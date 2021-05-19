
import HTML from "@candlefw/html";
import Presets from "../../build/library/common/presets.js";
import { componentDataToTempAST } from "../../build/library/component/compile/html.js";
import { parseSource } from "../../build/library/component/parse/source.js";
import { htmlTemplateToString } from "../../build/library/component/render/html.js";
import { addPlugin } from "../../build/library/plugin/plugin.js";
import { assertTree } from "../test-tools/tools.js";

await HTML.server();

assert_group("Basic data fetch plugin", sequence, () => {
    const source_string = `
var test = api("test") + "-success";

export default <div> \${test} </div>`;

    const presets = new Presets();

    addPlugin(presets, {
        type: "static-data-fetch",
        specifier: "api",
        async serverHandler(presets, data) {

            if (data == "test")
                return "api-data-ftw-" + data;

            throw new Error("help");
        }
    });

    const component = await parseSource(source_string, presets);
    const { html } = await componentDataToTempAST(component, presets);
    const html_string = htmlTemplateToString(html[0]);

    assertTree({
        t: "div",
        c: [{
            t: "w-b",
            c: [{ d: "api-data-ftw-test-success" }]
        }]
    }, html[0]);

});