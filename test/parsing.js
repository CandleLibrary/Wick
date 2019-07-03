export default function(createComponent){

	describe.skip("Parsing", function() {
		it("<h1></h1>", async function() {
	        const { ele } = await createComponent(`<h1></h1>`);
	        ele.children[0].children[0].tag.should.equal("h1");
	    });

	    it("<h2></h2>", async function() {
	        const { ele } = await createComponent(`<h2></h2>`);
	        ele.children[0].children[0].tag.should.equal("h2");
	    });

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            `<scope>
   # HEADER
	            </scope>`
	        );
	        ele.children[0].children[0].tag.should.equal("h1");
	    });

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            `<scope>
   + HEADER
   	+ HEADER
	            </scope>`
	        );
	    });

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            `<scope>
   > HEADER
   				</scope>`
	        );
	    });

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            ` <scope>
	            \`\`\`
   						test.com
   	
	            \`\`\`</scope>`
	        );
	   })

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            ` <scope>
------
	            </scope>`
	        );
	   })

	    it("Parses wickup™ grammer", async function() {
	        const { ele } = await createComponent(
	            ` <scope>
					{{test}}
	            </scope>`
	        );
	   })

	});
}
