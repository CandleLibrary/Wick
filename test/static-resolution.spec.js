import HTML from "@candlelib/html";
import { assert } from "console";
import { componentDataToTempAST } from "../build/library/compiler/ast-build/html.js";
import { htmlTemplateToString } from "../build/library/compiler/ast-render/html.js";
import Presets from "../build/library/compiler/common/presets.js";
import wick_server from "../build/library/entry-point/wick-server.js";
import { assertTree } from "./test-tools/tools.js";
import { enableBuildFeatures } from "../build/library/compiler/build_system.js";

await HTML.server();
assert_group("Basic Container Static Resolution", sequence, () => {
    const source_string = `
const test = 55;

var data = [
    {header:"test1", entries:[{value:"test1", href:""}]},
    {header:"test2", entries:[{value:"test2", href:""},{value:"test3", href:"test4"}]}
]
export default <div>

    {test}

    <container data={data} element=div limit={3} element=ol>
        <div>
            <div class="header">{header}</div>
            <container data={entries} >
                <a href={href || "#"} >
                    {value}
                </a>    
            </container>

        </div>
        
    </container>
</div>`;

    const presets = new Presets();

    const component = await wick_server(source_string, presets);

    enableBuildFeatures();

    const { html } = await componentDataToTempAST(component, presets);

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

assert_group("Imported Container With Export Static Resolution", sequence, () => {
    const source_string = `
import temp_comp from "./test/render/data/temp_prefill.wick"

var datas = [
    {header:"test1"},
    {header:"test2"}
];
export default <div> 
    <temp_comp export={ datas as data}></temp_comp>
</div>`;

    const presets = new Presets();

    const component = await wick_server(source_string, presets);

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


assert_group("Binding expressions with static objects", sequence, () => {
    const source_string = `
import temp_comp from "./test/render/data/temp_prefill.wick"

var data = {
    headerA:"test1",
    headerB:"test2"
}
export default <div> 
    <h1>{data.headerA}</h1>
    <h2>{data.headerB + "-123"}</h2>
</div>`;

    const presets = new Presets();

    const component = await wick_server(source_string, presets);

    const { html } = await componentDataToTempAST(component, presets);

    const html_string = htmlTemplateToString(html[0]);

    assertTree({
        t: "div",
        c: [
            {
                t: "h1", c: [
                    { t: "w-b", c: [{ d: "test1" }] }]
            }, {
                t: "h2", c: [
                    { t: "w-b", c: [{ d: "test2-123" }] }]
            }
        ]
    }, html[0]);


});