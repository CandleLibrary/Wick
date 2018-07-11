function SOURCECONSTRUCTTESTS() {
    let element = document.createElement("div")
    element.innerHTML =
`<template id="user_lookup">
    <w-s schema="any">
        <w import><div id="test_core">[date][time]sd[page_count]Z[value]</div><w-red><div id="class" class="<w>[class]</w>">  [time][date][time][date][page_count]</div> Locovl [page_count]</w-red> of [page_count]</w>
        
        <div id="style" style="<w>[style]</w>" name="<w>[name]</w>">
            <w-input type="text" name="note">[page_number]</w-input>
        </div>

        <my-input></my-input>
        
        <div>
            <w-s id="user_list" schema="any"> Doogy
                [user_list]((

                    <w-filter class="limit" value="2" import>[page_number]</w-filter>
                    <w-term>[start]/[256]</w-term>
                    <w-term>[end]</w-term>

                    <w-s trs model="any">
                        <a href="<w>[age]</w>">
                            <my-input></my-input>
                        </a>
                            Date: <w><w_datetime>[name]<w_reverse><w_color r="233">[time][date]</w_color><w_blue>date</w_blue></w_reverse>[time]</w_datetime><w>
                    </w-s>
                ))
            </w-s>
        </div>
    </w-s>
</template>

<template id="my-input">
    <div style="<w>[style]</w>"><w>[name] This is my input</w></div>
    <w-input type="text" export>[page]</w-input>
    <w-input type="text" export><w_date>[page]<w_date></w-input>
    <div id="importtest1">
    <my-other-input></my-other-input>
    </div>
</template>

<template id="my-other-input">

    <div id="importtest2">Thisis my other input</div>
</template>
`



    describe('wick.core.source.SourceConstructor', function() {

        describe("Construction of Sources", function() {


            let Source;

            let Any = wick.any({
                page_count: 34500,
                page_number: 0,
                value: "Toco Mako!!",
                time: "8pm",
                date: "Jun 19 998",
                style: "color:red",
                name: "schmoolie",
                user_list : [
                    {name:"doug", age:18},
                    {name:"carly", age: 256}
                ]
            });

            console.log(Any)

            it('Constructs an AST on properly formatted HTML', function() {
                let constructucting_template = element.getElementsByTagName('template')[0];

                let templates = element.getElementsByTagName('template');

                let presets = {
                    templates: {}
                };

                for (let i = 0, l = templates.length, t; i < l; i++)
                    (t = templates[i], presets.templates[t.id] = t);

                for (let i = 0; i < 10; i++) {

                    let skeleton = wick.core.source.SourceConstructor(constructucting_template, presets, element);

                    Source = skeleton(Any);

                    document.body.appendChild(Source.ele);
                }
            })

            it('Incorporates other templates based on tagname', function() {
                let element1 = document.getElementById("importtest1");
                let element2 = document.getElementById("importtest2");


                if (!element1 || !element2)
                    throw new Error("Failed to import templates.")
            })

            it('Loads templates from network.', function() {
                let element1 = document.getElementById("importtest3");
                let element2 = document.getElementById("importtest4");

                if (!element1 || !element2)
                    throw new Error("Failed to import templates.")
            })

            it('Update the DOM when Model is changed.', function(done) {

                let date_element = document.getElementById("test_core").childNodes[0];
                let date = date_element.data;

                Any.date = date + "bc";

                setTimeout(() => {

                    let date2 = date_element.data;

                    if (Any.date !== date2) throw new Error(`Expecting element to have "${Any.date}". Got "${date2}"`);

                    done()
                }, 15)
            })

            it('Updates element attributes when Model is changed.', function(done) {
                this.timeout(0);

                let style_element = document.getElementById("style");
                let class_element = document.getElementById("class");

                Any.add({
                    style: Any.style + ";border:1px solid black",
                    class: "china",
                    name: "schmoolie2"
                })

                setTimeout(function(){

                    let style = style_element.attributes.getNamedItem("style").value;
                    let name = style_element.attributes.getNamedItem("name").value;
                    let class_ = class_element.attributes.getNamedItem("class").value;

                    if (Any.style !== style) throw new Error(`Expecting element#style to have its style set to "${Any.style}". Got "${style}"`);
                    if (Any.name !== name) throw new Error(`Expecting element#style to have its name set to "${Any.name}". Got "${name}"`);
                    if (Any.class !== class_) throw new Error(`Expecting element#class to have its class set to "${Any.class}". Got "${class_}"`);

                    done()
                }, 50)
            })
        })

        describe("Throws appropriate errors for various ill formatted HTML", function() {

            function test(description, expected_error_message, HTML_text) {
                it(description, function() {
                    let element = document.createElement("div")
                    element.innerHTML = HTML_text;
                    element = element.getElementsByTagName('template')[0]

                    try {
                        let t = wick.core.source.SourceConstructor(element, {}, element)
                    } catch (e) {
                        if (e.message !== expected_error_message)
                            throw new Error(`Received incorrect error message "${e.message}". Expecting: "${expected_error_message}"`);
                        else return;
                    }

                    throw new Error(`No error thrown. Expecting error: ${expected_error_message}`)
                })
            }

            test("Unexpected end of output. Input = <w>", "Unexpected end of output. Tag <w> at pos 0 has not been closed.", `<template><div error="<w>"></template>`);
            test("Unexpected closing tag. Input = <w></w-el></w>", "Unexpected closing Tag. Expected </w>  but got </w-el>.", `<template><div error="<w></w-el></w>"></template>`);
            test("Unexpected attribute value. Input = <w attribute=\"this></w>", "Unexpected end of input. Expecting value for attribute \"attribute\"", `<template><div error="<w attribute=this></w>"></template>`);
            test("Unexpected attribute value. Input = <w attribute'this\"></w>", "Expected an identifier. Got Symbol:'", `<template><div error="<w attribute'this"></w>"></template>`);
        });
    })
}

if (typeof module !== "undefined") module.exports = SOURCECONSTRUCTTESTS;