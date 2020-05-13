import "./child.jsx";

var name = 2, test = 1, update = 0;

function balloon() { name = "charlie"; update += 1; }
function control(event) { test += 4; console.log("hello world" + test); }

setTimeout(() => test += 2, 100);

export { update };

export default <div id="2">

    <child bind="(({datum, out:out } ))" />

    <container sort="((sort_function))"><child></child></container>

    <h1 onclick="((balloon))" > T ((name)) ((out)) T</h1 >

    <a onclick="((control))" data="((update))" > Hello ((update)) World </a>

        a((2 + test + name))
</div >;