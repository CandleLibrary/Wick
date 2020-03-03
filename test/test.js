import chai from "chai";

import { parser } from "../build/library/wick.js";
import { traverse } from "../build/library/tools/traverse.js";
import { filter } from "../build/library/tools/filter.js";
import { make_replaceable } from "../build/library/tools/replaceable.js";
import { extract } from "../build/library/tools/extract_root_node.js";
import { wick } from "../build/library/wick.js";

chai.should();

describe("Parser", function () {
    it("<div></div>", function () {
        const ast = parser(`<div></div>`);
        ast.tag.should.equal("DIV");
    });

    it("<h1></h1>", async function () {
        const ast = parser(`<h1></h1>`);
        ast.tag.should.equal("H1");
    });

    it("<h2></h2>", async function () {
        const ast = parser(`<h2></h2>`);
        ast.tag.should.equal("H2");
    });

    it("<h3></h3>", async function () {
        const ast = parser(`<h3></h3>`);
        ast.tag.should.equal("H3");
    });

    it("<h4></h4>", async function () {
        const ast = parser(`<h4></h4>`);
        ast.tag.should.equal("H4");
    });

    it("<h5></h5>", async function () {
        const ast = parser(`<h5></h5>`);
        ast.tag.should.equal("H5");
    });

    it("<h6></h6>", async function () {
        const ast = parser(`<h6></h6>`);
        ast.tag.should.equal("H6");
    });

    it("<pre></pre>", async function () {
        const ast = parser(`<pre></pre>`);
        ast.tag.should.equal("PRE");
    });

    it("<div></div>", async function () {
        const ast = parser(`<div></div>`);
        ast.tag.should.equal("DIV");
    });

    it("<a></a>", async function () {
        const ast = parser(`<a></a>`);
        ast.tag.should.equal("A");
    });

    it("<div><script> var t = 0; </script></div>", function () {
        const ast = parser(`<div><script> var t = 0; </script></div>`);
        ast.children[0].type.should.equal("SCRIPT");
        ast.children[0].tag.should.equal("JS");
    });

    it("<div onload=((test = 1))></div>", function () {
        const ast = parser(`<div onload=((test = 1))></div>`);
        ast.attributes[0].IS_BINDING.should.equal(true);
        ast.attributes[0].name.should.equal("onload");
        ast.attributes[0].value.type.should.equal("BINDING");
        ast.attributes[0].value.primary_ast.type.should.equal("AssignmentExpression");
        ast.attributes[0].value.should.have.property("secondary_ast", null);   //value.primary_ast.type.should.equal("Expressio");
    });

    it("<div onload=((test = 1)(0))></div>", function () {
        const ast = parser(`<div onload=((test = 1)(0))></div>`);
        ast.attributes[0].IS_BINDING.should.equal(true);
        ast.attributes[0].name.should.equal("onload");
        ast.attributes[0].value.type.should.equal("BINDING");
        ast.attributes[0].value.primary_ast.type.should.equal("AssignmentExpression");
        ast.attributes[0].value.secondary_ast.type.should.equal("NumericLiteral");   //value.primary_ast.type.should.equal("Expressio");
    });

    it("<div onload=((test = 1)(thomas))></div>", function () {
        const ast = parser(`<div onload=((test = 1)(thomas))></div>`);
        ast.attributes[0].IS_BINDING.should.equal(true);
        ast.attributes[0].name.should.equal("onload");
        ast.attributes[0].value.type.should.equal("BINDING");
        ast.attributes[0].value.primary_ast.type.should.equal("AssignmentExpression");
        ast.attributes[0].value.secondary_ast.type.should.equal("Identifier");   //value.primary_ast.type.should.equal("Expressio");
        ast.attributes[0].value.secondary_ast.val.should.equal("thomas");
    });

    it("<div>((expression))</div>", function () {
        const ast = parser(`<div>((expression))</div>`);
        ast.children[0].type.should.equal("TEXT");
        ast.children[0].IS_BINDING.should.equal(true);
    });

    it("<div><style>d:{color:red}</style></div>", function () {
        const ast = parser(`<div><style>d{color:red}</style></div>`);
    });

    it(`<div attr1="Rainbows are cool!" attr2=1 attr3 = "Platonic Corpus"></div>`, function () {
        const ast = parser(`<div attr1="Rainbows are cool!" attr2=1 attr3 = "Platonic Corpus"></div>`);
        ast.attributes[0].value.should.equal("Rainbows are cool!");
        ast.attributes[1].value.should.equal("1");
        ast.attributes[2].value.should.equal("Platonic Corpus");
    });


    it(v1, function () {
        const ast = parser(v1);
        ast.children.should.have.lengthOf(5);
        ast.children[0].type.should.equal("TEXT");
        ast.children[1].type.should.equal("SCRIPT");
        ast.children[2].type.should.equal("TEXT");
        ast.children[3].type.should.equal("TEXT");
        ast.children[3].IS_BINDING.should.equal(true);
        ast.children[3].data.primary_ast.type.should.equal("Identifier");
        ast.children[3].data.primary_ast.val.should.equal("item_value");
        ast.children[4].type.should.equal("TEXT");
    });

    const v1 = `<div>
    <script>
        var t = 22
        t = <div> MangoTree ((test)) </div>;
        item_value = 9001
    </script>
    The value of this item is ((item_value))!
</div>`;
    const v2 = `<div>
    <script>
        //var t = 22;
    </script>
    The value of this item is ((item_value))!
</div>`;

    it(v2, function () {
        const ast = parser(v2);
        ast.children.should.have.lengthOf(5);
        ast.children[0].type.should.equal("TEXT");
        ast.children[1].type.should.equal("SCRIPT");
        ast.children[2].type.should.equal("TEXT");
        ast.children[3].type.should.equal("TEXT");
        ast.children[3].IS_BINDING.should.equal(true);
        ast.children[3].data.primary_ast.type.should.equal("Identifier");
        ast.children[3].data.primary_ast.val.should.equal("item_value");
        ast.children[4].type.should.equal("TEXT");
    });

    it("<!DOCTYPE html><div>test</div>", function () {
        const ast = parser("<!DOCTYPE html><div>test</div>");
        ast.DTD.should.have.lengthOf(1);
        ast.DTD[0].tag.should.equal("DOCTYPE");
        ast.DTD[0].value.should.equal(" html");
    });

    it("<div><!-- This is an inline comment --><a href=\"https://abc.xyz\">test</a>test</div>", function () {
        const ast = parser("<div><!-- This is an inline comment --><a href=\"https://abc.xyz\">test</a>test</div>");
        ast.children.should.have.lengthOf(3);
        ast.children[0].type.should.equal("DTD");
        ast.children[1].type.should.equal("HTML");
        ast.children[1].tag.should.equal("A");
        ast.children[1].attributes[0].name.should.equal("href");
        ast.children[1].attributes[0].value.should.equal("https://abc.xyz");
        ast.children[2].type.should.equal("TEXT");
    });

    it("<import url=\"https://grazing.dfg/\"/><div><div></div></div>", function () {
        const ast = parser("<import url=\"https://grazing.dfg/\"/><div><div></div></div>");
        ast.should.have.property("import_list");
        ast.import_list.should.have.lengthOf(1);
        ast.import_list[0].type.should.equal("HTML");
        ast.import_list[0].tag.should.equal("IMPORT");
    });

    it("<import url=\"https://grazing.dfg/\"/><import url=\"https://grazing.jki/\"/><div><div></div></div>", function () {
        const ast = parser("<import url=\"https://grazing.dfg/\"/><import url=\"https://grazing.jki/\"/><div><div></div></div>");
        ast.should.have.property("import_list");
        ast.import_list.should.have.lengthOf(2);
        ast.import_list[0].type.should.equal("HTML");
        ast.import_list[0].tag.should.equal("IMPORT");
        ast.import_list[0].attributes[0].name.should.equal("url");
        ast.import_list[0].attributes[0].value.should.equal("https://grazing.dfg/");
        ast.import_list[1].type.should.equal("HTML");
        ast.import_list[1].tag.should.equal("IMPORT");
        ast.import_list[1].attributes[0].name.should.equal("url");
        ast.import_list[1].attributes[0].value.should.equal("https://grazing.jki/");
    });
});


describe("Traversing", function () {
    it("filters AST nodes", function () {
        const ast = parser(`<div>
                                <script>
                                    var t = 22
                                    t = <div> MangoTree ((test)) </div>;
                                    item_value = 9001
                                </script><div>T</div>
                                The value of this item is ((item_value))!
                            </div>`);

        for (const node of traverse(ast, "children").then(filter("type", "SCRIPT")))
            node.type.should.equal("SCRIPT");


        for (const node of traverse(ast, "children").then(filter("type", "TEXT")))
            node.type.should.equal("TEXT");

    });

    it("Limits depth", function () {
        const ast = parser(`<div>
                                <script>
                                    var t = 22
                                    t = <div> MangoTree ((test)) </div>;
                                    item_value = 9001
                                </script><div>T</div>
                                The value of this item is ((item_value))!
                            </div>`);

        const filtered = Array.from(traverse(ast, "children", 2).then(filter("type", "TEXT")));

        filtered.should.have.lengthOf(4);
    });

    it("Creates transformed AST while keeping original intact", function () {
        const ast = parser(`<div>
                                <script>
                                    var t = 22
                                    t = <div> MangoTree ((test)) </div>;
                                    item_value = 9001
                                </script><div>T</div>
                                The value of this item is ((item_value))!
                            </div>`);

        const goal = {};

        for (const node of traverse(ast, "children").then(filter("type", "TEXT")).then(make_replaceable).then(extract(goal)))
            node.replace({ type: "REPLACED_NODE" });

        goal.should.have.property("ast");
        goal.ast.should.not.equal(ast);
        Array.from(traverse(goal.ast, "children").then(filter("type", "REPLACED_NODE"))).should.have.lengthOf(5);
        Array.from(traverse(ast, "children").then(filter("type", "TEXT"))).should.have.lengthOf(5);
        Array.from(traverse(ast, "children").then(filter("type", "REPLACED_NODE"))).should.have.lengthOf(0);
    });
});

describe("Componentization", function () {
    /**
     * Wick is unopinionated regarding whether components are defined
     * using HTML or JavasScript (TypeScript eventually)
     */
    it("Use JS Module to define a component", function(){
        const comp = await wick(`
            the_best_color = "green";

            export default const scope = 
                <scope>
                    The best color is (( the_best_color )).
                </scope>        
        `).pending;

        const ele = comp.mount();
        
        ele.innerHTML.trim().should.equal("The best color is green");
    })

    it("Use HTML syntax to define a component", function(){
        const comp = await wick(`
            <scope>
                <script>
                    the_best_color = "green";
                </script>
                The best color is (( the_best_color )).
            </scope>      
        `).pending;

        const ele = comp.mount();
        
        ele.innerHTML.trim().should.equal("The best color is green");
    })


    it("Import component into another (HTML)", function(){
        const comp = await wick(`
            <import url="./data/import_test_1.html"/>
            <scope>
                <import-test/>
            </scope>      
        `).pending;

        const ele = comp.mount();
        
        ele.children.should.have.lengthOf(1);
        ele.children[0].innerHTML.trim().should.equal("All the world's a stage.");
    })

    it("Import component into another (JSX)", function(){
        const comp = await wick(`
            import { import_test } from "./data/import_test_1.html";

            export default const = 
            <scope>
                <import_test/>
            </scope>      
        `).pending;

        const ele = comp.mount();
        
        ele.children.should.have.lengthOf(1);
        ele.children[0].innerHTML.trim().should.equal("All the world's a stage.");
    })

    it("Import HTML data with URL (HTML - same idea with JSX)", function(){
        const comp = await wick(`
            <scope>
                <div url="./data/import_test_1.html">
            </scope>       
        `).pending;

        const ele = comp.mount();
        
        ele.children.should.have.lengthOf(1);
        ele.children[0].innerHTML.trim().should.equal("All the world's a stage.");
    })

    //Data flow

    it("Retrieve and set model data.", function(){
        const comp = await wick(`
            <scope>
                <script>
                    import { name } from "$model";
                    name = "douglas";
                </script>
                ((name))
            </scope>       
        `).pending;

        const 
            data = {name: "hubert"},
            ele = comp.mount(data);

        data.name.should.equal("douglas");
        ele.children.should.have.lengthOf(1);
        ele.children[0].innerHTML.trim().should.equal("douglas");
    })

    it("Send data to parent scope", function(){
        const comp = await wick(`
            <scope>
                <scope bind=((name))>
                    <script>
                        name = "douglas";
                        export { name };
                    </script>
                </scope>
                <div>((name))</div>
            </scope>       
        `).pending;

        const ele = comp.mount();
        ele.children.should.have.lengthOf(2);
        ele.children[1].innerHTML.trim().should.equal("douglas");
    })

    it("receive data from parent scope", function(){
        const comp = await wick(`
            <scope>
                
                <script>
                    name = "philip";
                </script>

                <scope>
                    <script> import "$parent"; </script>
                    <div>((name))</div>
                </scope>
            </scope>       
        `).pending;

        const ele = comp.mount();
        ele.children.should.have.lengthOf(2);
        ele.children[1].innerHTML.trim().should.equal("douglas");
    })

    /**
     * Containerization is perfomed by using the bindings (( [] )( <ele/> )) or the bindings 
     * (( containerize() )( <ele/> )). Wick will recognize these expressions and fill out an
     * array of elements using the "<ele/>" as a template for each entry.
     * 
     * If the <ele/> is a 
     */
    it("Create a container using the \"containerize\" function", function(){
        const comp = await wick(`
            <div>
                <script>
                    container = [{name:"George Washington"}, {name:"Martin Luther"}]
                </script>

                Famouse People:
                <ul>
                (( containerize(container) )( 
                    <li>((name))</li>
                ))
                </ul>
            </div>
        `).pending;

        const ele = comp.mount();

        ele.children[0].children[0].children.should.have.lengthOf(2);
        ele.children[0].children[0].children[0].innerHTML.should.equal("George Washington")
        ele.children[0].children[0].children[1].innerHTML.should.equal("Martin Luther")
    })


    it("Create a container using an Array Literal", function(){
        const comp = await wick(`
            <div>
                <script>
                    container = [{name:"George Washington"}, {name:"Martin Luther"}]
                </script>

                Famouse People:
                <ul>
                (( [container] )( 
                    <li>((name))</li>
                ))
                </ul>
            </div>
        `).pending;

        const ele = comp.mount();

        ele.children[0].children[0].children.should.have.lengthOf(2);
        ele.children[0].children[0].children[0].innerHTML.should.equal("George Washington")
        ele.children[0].children[0].children[1].innerHTML.should.equal("Martin Luther")
    })

    it("Use JSX syntax to define a component", function(){
        const comp = await wick(`
            the_best_color = "green";

            export default const scope = 
                <scope>
                    The best color is (( the_best_color )).
                </scope>        
        `).pending;

        const ele = comp.mount();
        
        ele.innerHTML.trim().should.equal("The best color is green");
    })
});