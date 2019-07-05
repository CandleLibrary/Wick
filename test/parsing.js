export default function(createComponent) {

    describe("Parsing", function() {
        
        it("<h1></h1>", async function() {
            const { ele } = await createComponent(`<h1></h1>`);
            ele.children[0].children[0].tag.should.equal("h1");
        });

        it("<h2></h2>", async function() {
            const { ele } = await createComponent(`<h2></h2>`);
            ele.children[0].children[0].tag.should.equal("h2");
        });

        it("<pre></pre>", async function() {
            const { ele } = await createComponent(`<pre></pre>`);
            ele.children[0].children[0].tag.should.equal("pre");
        });

        it("<script></script>", async function() {
            const { ele } = await createComponent(`<script></script>`);
            ele.children[0].children[0].tag.should.equal("script");
        });

        it("<style></style>", async function() {
            const { ele } = await createComponent(`<style></style>`);
            ele.children[0].children[0].tag.should.equal("style");
        });

        it("<slot></slot>", async function() {
            const { ele } = await createComponent(`<slot></slot>`);
            ele.children[0].children[0].tag.should.equal("slot");
        });

        it("<f></f>", async function() {
            const { ele } = await createComponent(`<f></f>`);
            ele.children[0].children[0].tag.should.equal("f");
        });

        it("<filter></filter>", async function() {
            const { ele } = await createComponent(`<filter></filter>`);
            ele.children[0].children[0].tag.should.equal("filter");
        });

        it("JS Expressions", async function() {
            (createComponent(`<h2>(())</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( 2+2 ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( alpha ? douglas : "rainbow" ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( test && <a>rainbow</a> ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( [tree, dog, cat] ))</h2>` )).should.eventually.not.throw;
            (createComponent(`<h2>(( {pine:box, ["salamander"]: test}))</h2>` )).should.eventually.not.throw;
            (createComponent(`<h2>(( id ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( 1 || 2 && 3 ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( 1 && 2 || 3 ))</h2>`)).should.eventually.not.throw;
            (createComponent(`<h2>(( return t;))</h2>`)).should.eventually.throw;
        });


        describe.skip("Parses wickup™ grammer", function() {
            it("Header:  # HEADER", async function() {
                const { ele } = await createComponent(
                    `<scope>
 # HEADER
	            </scope>`
                );
                ele.children[0].children[0].tag.should.equal("h1");
            });

            it("List Item: + HEADER", async function() {
                const { ele } = await createComponent(
                    `<scope>
+ HEADER
+ HEADER
	            </scope>`
                );
                
                console.log(ele +"")
                ele.children[0].children[0].tag.should.equal("ul");
                ele.children[0].children[0].children[0].tag.should.equal("li");
                ele.children[0].children[0].children[1].tag.should.equal("li");
            });

            it("Block Quote: > HEADER", async function() {
                const { ele } = await createComponent(
                    `<scope>
> Header
   				</scope>`
                );
                ele.children[0].children[0].tag.should.equal("blockquote");
            });

            it("Code Block: > HEADER", async function() {
                const { ele } = await createComponent(
                    ` <scope>
	            \`\`\`
   						test.com
   	
	            \`\`\`</scope>`
                );
            })

            it("Horizontal Rule: -------", async function() {
                const { ele } = await createComponent(
                    ` <scope>
------
	            </scope>`
                );
                console.log(ele +"")
                ele.children[0].children[0].tag.should.equal("hr");
            })

            it("Bold: {{test}}", async function() {
                const { ele } = await createComponent(
                    ` <scope>
					{{test}}
	            </scope>`
                );
            })

        });
    })
}
