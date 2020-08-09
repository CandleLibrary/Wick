import wick from "../build/library/wick.js";
import HTML from "@candlefw/html";

//await HTML.polyfill();



{
    await wick.setPresets({});

    const data = `var t = ("@#video").currentTime;


    export default <div>
        <div>(( t ))</div>
        <video ontimeupdate="(( t = ('@#video').currentTime ))" id="video" src="180813_erev_shabbat.mp4" autoplay>Hello World</video>
    </div >;`;

    s(((await wick(data).pending).class_string == 2));

}

"@candlefw/wick test spec";
"PARSER"; "#";
{
    "TODO: Test wick"; "#";
    (((await wick("export default <div>((2 + test))</div>").pending).render == 2));
}


//Loads URLS from 
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


    ((JSXcompFactory.toString() == ""));
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