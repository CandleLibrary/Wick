function HTMLTESTS(config) {

    describe('wick.core.html', function() {

        describe("Parsing", function() {

            it("Parses HTML and returns an AST graph of HTML elements", () =>
                wick.core.html(
                    `<html type="truetype">
                    <head screen="true">
                        <!-- test -->
                        <style>
                            a{color:red}
                        </style>
                    </head>
                    <script>sthis</script>
                    <body>
                        thisis some of my text
                        <app>sdfsaf 
                            <template>
                                this is my inner template.
                            </template>
                        </app>
                    </body>
                </html>`
                ).then((og) => {
                    og.tag.should.equal("html");
                    og.children.should.have.lengthOf(3);
                    og.children[0].tag.should.equal("head");
                    og.children[1].tag.should.equal("script");
                    og.children[1].children.should.have.lengthOf(1);
                    og.children[1].children[0].txt.should.equal("sthis");
                    og.children[2].tag.should.equal("body");
                })
            );


            it("Pulls in templating info from network", () =>
                wick.core.html(`
                <app>
                    <some_template url="/test/data/template.html"></some_template>
                </app>
                `).then((og) => {
                    og.tag.should.equal("app");
                    og.children.should.have.lengthOf(1);
                    og.children[0].tag.should.equal("some_template");
                    og.children[0].children.should.have.lengthOf(1);
                    og.children[0].children[0].children.should.have.lengthOf(3);
                    og.children[0].children[0].children[0].children.should.have.lengthOf(3);
                    og.children[0].children[0].children[0].children[0].tag.should.equal("h2");
                    og.children[0].children[0].children[0].children[1].tag.should.equal("button");
                    og.children[0].children[0].children[0].children[2].tag.should.equal("script");
                })
            );

            it("Prevents network resource recursion.", () =>
                wick.core.html(`<some_template url="/test/data/template3.html"></some_template>`)
            );

            it("Creates well formated HTML strings", () =>
                wick.core.html(`<!DOCTYPE html><html type="truetype">
                    <head screen="true">
                        <!-- test -->
                        <style>
                            a{color:red}
                        </style>
                    </head>
                    <script> sthis </script>
                    <body>
                        thisis some of my text
                        <app> sdfsaf 
                            <template>
                                this is my inner template.
                            </template>
                        </app>
                    </body>
                </html>
                `).then((og) => {
                    og.toString().should.equal(`<html type="truetype">\n    <head screen="true">\n        <style>\n             \n                            a{color:red}\n                        \n        </style>\n    </head>\n    <script>\n          sthis \n    </script>\n    <body>\n         thisis some of my text\n        <app>\n             sdfsaf\n            <template>\n                 this is my inner template.\n            </template>\n        </app>\n    </body>\n</html>\n`);
                })
            );

            it("Creates a tree of HTMLElements", () =>
                wick.core.html(`<!DOCTYPE html><div type="truetype">
                    <head screen="true">
                        <!-- test -->
                        <style>
                            a{color:red}
                        </style>
                    </head>
                    <script> sthis </script>
                    <body class="tree">
                        thisis some of my text
                        <app> sdfsaf 
                            <template>
                                this is my inner template.
                            </template>
                        </app>
                    </body>
                </div>
                `).then((og) => {
                    let element = og._build_();
                    element.tagName.should.equal("DIV");
                    element.firstChild.tagName.should.equal("HEAD");
                    let head = element.firstChild;
                    head.children.should.have.lengthOf(1);
                    element.lastChild.tagName.should.equal("BODY");
                }));

            it("Properly handles unmatched non-void tags", ()=>
                wick.core.html(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <link>
                    <body>
                    </html>
                `).then((tree)=>{
                    tree.toString().should.equal(
`<html>
    <head>
        <link>
            <body>
                                     
            </body>
        </link>
    </head>
</html>
`) 
                })


            )
        });


        describe("Traversing", function() {

            const HTML_DATA =
                `
                <html type="truetype">
                    <head screen="true">
                        <!-- test -->
                        <style>
                            a{color:red}
                        </style>
                    </head>
                    <script>sthis</script>
                    <body class="mango">
                        thisis some of my text
                        <app>sdfsaf 
                            <template id="my_id">
                                this is my inner template.
                            </template>
                            <template id="this" class="mango dog hippo"></template>
                        </app>
                        <body>
                        </body>
                    </body>
                    <layer id="my_id">
                    </layer>
                </html>
                `;
            let dom;

            before(() => wick.core.html(HTML_DATA).then((d) => {
                dom = d;
                return this;
            }));

            it("Can look through child elements for id", function() {
                let temp1 = dom.getID("my_id");
                temp1.tag.should.equal("layer");
                temp1.id.should.equal("my_id");
            });

            it("Can look through descendant elements for id", function() {
                let temp1 = dom.getID("my_id", true);
                temp1.tag.should.equal("template");
                temp1.id.should.equal("my_id");
            });

            it("Can lookup child elements by class", function() {
                let temp1 = dom.getClass("mango");
                temp1.should.have.lengthOf(1);
                temp1[0].tag.should.equal("body");
            });

            it("Can lookup descendant elements by class", function() {
                let temp1 = dom.getClass("mango", true);
                temp1.should.have.lengthOf(2);
                temp1[0].tag.should.equal("body");
                temp1[1].tag.should.equal("template");
            });

            it("Can lookup child elements by tag", function() {
                let temp1 = dom.getTag("body");
                temp1.should.have.lengthOf(1);
                temp1[0].tag.should.equal("body");
            });

            it("Can lookup descendant elements by tag", function() {
                let temp1 = dom.getTag("template", true);
                temp1.should.have.lengthOf(2);
                temp1[0].tag.should.equal("template");
                temp1[1].tag.should.equal("template");
            });
        });

        describe.skip("Handles appropriate ill-formed HTML", function() {

            function test(description, expected_error_message, HTML_text) {
                it(description)
            }

            test("Unexpected end of output. Input = <w>", "Unexpected end of output. Tag <w> at pos 0 has not been closed.", `<template><div error="<w>"></template>`);
            test("Unexpected closing tag. Input = <w></w-el></w>", "Unexpected closing Tag. Expected </w>  but got </w-el>.", `<template><div error="<w></w-el></w>"></template>`);
            test("Unexpected attribute value. Input = <w attribute=\"this></w>", "Unexpected end of input. Expecting value for attribute \"attribute\"", `<template><div error="<w attribute=this></w>"></template>`);
            test("Unexpected attribute value. Input = <w attribute'this\"></w>", "Expected an identifier. Got Symbol:'", `<template><div error="<w attribute'this"></w>"></template>`);
        });
    })


    if (config.PERFORMANCE) {

        describe("HTML Performance Test Suite", function() {
            this.timeout(500000);
            this.slow(100000000)
            let DOM = null;
            const HTML_DATA =
                `<!DOCTYPE html><div type="truetype">
                    <head screen="true">
                        <!-- test -->
                        <style>
                            a{color:red}
                        </style>
                    </head>
                    <script> sthis </script>
                    <body class="tree">
                        thisis some of my text
                        <app> sdfsaf 
                            <template>
                                this is my inner template.
                            </template>
                        </app>
                    </body>
                </div>
                `
            const suite = new benchmark.Suite;

            before(() => wick.core.html(HTML_DATA).then((d) => {
                DOM = d;
                return this;
            }).catch(e => e))

            it("Compares String Building VS Direct", function(done) {



                suite.add("String to innerHTML", function() {
                    let d = DOM.toString();
                    let s = document.createElement("div");
                    s.innerHTML = d;
                }).add("Direct creation of HTMLElements", function() {
                    let element = DOM._build_();
                }).on("cycle", function(event) {
                    if (config.BROWSER) {
                        let li = document.createElement("li");
                        li.innerHTML = `<ul><li class="test" style="text-align:right"><h2>${(event.target)}</h2></li></ul>`
                        document.getElementById("mocha-report").appendChild(li)
                    } else
                        console.log(event.target + "")
                }).on(`complete`, function() {
                    done();
                }).run({
                    'async': false
                });

            })
        })
    }

}

if (typeof module !== "undefined") module.exports = HTMLTESTS;