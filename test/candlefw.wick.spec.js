import { wick, parser } from "../build/library/wick.js";
import HTML from "@candlefw/html";

//await HTML.polyfill();

"@candlefw/wick test spec";
"PARSER"; "#";
{

    "TODO: Test wick"; "#";
    (((await wick("export default <div>((2 + test))</div>").pending).render == 2));

}
{
    "Parent {-} Child data flow"; "#";

    const
        inc_html_shim = HTML,
        child_data_jsx = "./test/data/parent_child_data_flow/child.jsx",
        data_jsx = "./test/data/parent_child_data_flow/parent.jsx",
        data_html = "./test/data/parent_child_data_flow/parent.html";

    const childJSXcompFactory = await wick(child_data_jsx).pending;
    const JSXcompFactory = await wick(data_jsx).pending;
    const HTMLcompFactory = await wick(data_html).pending;


    s((JSXcompFactory.toString() == ""));
    ((childJSXcompFactory.toString() == ""));

    const html_comp = HTMLcompFactory.createInstance;
    const jsx_comp = JSXcompFactory.createInstance();

    "Parent data to child interface";
    // s((jsx_comp.ele.children[0] == "DIV"));
}

{
    "TODO: Test parser"; "#";

    const data1 = `./test/child.jsx`;



    "TODO: Test parser2"; "#";
    (((await wick(data1).pending).render == 2));
}

{
    "TODO: Test parser"; "#"; (((await wick("setTimeout(()=>test+=2,100); export default <div>((2 + test + name))</div>").pending).ast == 2));

    const data1 = `./test/root.jsx`;

    "TODO: Test parser"; "#";
    (((await wick(data1).pending).render == 2));
}