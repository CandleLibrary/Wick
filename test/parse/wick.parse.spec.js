import env from "../build/library/compiler/source-code-parse/env.js";
import loader from "../build/library/compiler/source-code-parser/wick_parser.js";
const parser = await loader;
function parseAndRender(str) {
    return (parser(str, env).result[0]);
}

assert_group("Basic HTML Template style parse", () => {

    assert("Basic Tag", parseAndRender("<div></div>"));

    assert("Basic Void Tag without slash", parseAndRender("<link href=test>"));

    assert("Basic Void Tag with slash", parseAndRender("<link href=test />"));

    assert("Basic Tag with basic expression body", parseAndRender("<div>{ test }</div>"));

    assert("Basic Tag with basic expression attribute", parseAndRender("<div id={test}></div>"));

    assert("Basic Tag with leading import", parseAndRender("<import url='test' /><div id={test}></div>"));

    assert("Basic HTML Comment", parseAndRender("<div id={test}><!-- Test --> </div>"));
});

assert_group("Basic JSX style parse", () => {

    assert("Basic Tag", parseAndRender("export default <div></div>"));

    assert("Basic Void Tag without slash", parseAndRender("export default <link href=test>"));

    assert("Basic Void Tag with slash", parseAndRender("export default <link href=test />"));

    assert("Basic Tag with basic expression body", parseAndRender("export default <div>{ test }</div>"));

    assert("Basic Tag with basic expression attribute", parseAndRender("export default <div id={test}></div>"));

    assert("Basic Tag with map value expression", parseAndRender("export default <div id={ test.map(<div>{name}</div>) }></div>"));

    assert("Basic Tag with map arrow expression", parseAndRender("export default <div id={ test.map(a=><div>{a}</div>) }></div>"));

    assert("Basic Tag with ternary expression ", parseAndRender("export default <div id={ test.map(a=><div>{ a ? <div>{b}</div> : <div>{c}</div> }</div>) }></div>"));
});

assert_group("Basic CSS Parser", () => {

    assert("Basic CSS component", parseAndRender("<style> body { color:red } </style>"));

    assert("CSS With Custom name", parseAndRender("<style> body--body { color:red } </style>") == "");
});