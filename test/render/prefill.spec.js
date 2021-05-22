
import HTML from "@candlefw/html";
import Presets from "../../build/library/common/presets.js";
import { componentDataToTempAST } from "../../build/library/component/compile/html.js";
import { parseSource } from "../../build/library/component/parse/source.js";
import { htmlTemplateToString } from "../../build/library/component/render/html.js";
import { assertTree } from "../test-tools/tools.js";

await HTML.server();
assert_group("Basic Container Prefill", sequence, () => {
    const source_string = `
const test = 55;

var data = [
    {header:"test1", entries:[{value:"test1"}]},
    {header:"test2", entries:[{value:"test2"},{value:"test3", href:"test4"}]}
]
export default <div>

    
    \${test}

    <container data=\${data} element=div limit=\${3} element=ol>
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

    const { html } = await componentDataToTempAST(component, presets);

    const html_string = htmlTemplateToString(html[0]);


    assertTree({
        t: "div",
        c: [{
            t: "w-b",
            c: [{ d: "55" }]
        }, {
            t: "ol",
            c: [
                {
                    t: "div", c: [{
                        t: "div", c: [
                            { t: "w-b", c: [{ d: "test1" }] }]
                    }]
                },
                {
                    t: "div", c: [
                        {
                            t: "div", c: [
                                { t: "w-b", c: [{ d: "test2" }] }]
                        },
                        {
                            t: "div",
                            c: [
                                { t: "a", a: [["href", "#"]], c: [{ t: "w-b", c: [{ d: "test2" }] }] },
                                { t: "a", a: [["href", "test4"]], c: [{ t: "w-b", c: [{ d: "test3" }] }] }
                            ]
                        }
                    ]
                },
            ]
        }]
    }, html[0]);

});

assert_group("Imported Container With Export Prefill", sequence, () => {
    const source_string = `
import temp_comp from "./test/render/data/temp_prefill.wick"

var datas = [
    {header:"test1"},
    {header:"test2"}
]
export default <div> 
    <temp_comp export="datas:data"></temp_comp>
</div>`;

    const presets = new Presets();

    const component = await parseSource(source_string, presets);

    const { html } = await componentDataToTempAST(component, presets);

    const html_string = htmlTemplateToString(html[0]);

    //*
    assertTree({
        t: "div",
        c: [{
            t: "div",
            c: [
                {
                    t: "div", c: [{
                        t: "div", c: [
                            { t: "w-b", c: [{ d: "test1" }] }]
                    }, {
                        t: "div", c: [
                            { t: "w-b", c: [{ d: "test2" }] }]
                    }]
                },
            ]
        }]
    }, html[0]);
    //*/

});
