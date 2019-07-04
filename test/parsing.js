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


        describe.only("Parses wickup™ grammer", function() {
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
