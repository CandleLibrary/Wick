export default function(createComponent) {

    describe("Parsing", function() {
        
        it("<h1></h1>", async function() {
            const { ele } = await createComponent(`<h1></h1>`);
            ele.fch.tag.should.equal("h1");
        });

        it("<h2></h2>", async function() {
            const { ele } = await createComponent(`<h2></h2>`);
            ele.fch.tag.should.equal("h2");
        });

        it("<pre></pre>", async function() {
            const { ele } = await createComponent(`<pre></pre>`);
            ele.fch.tag.should.equal("pre");
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
            //(createComponent(`<h2>(( return t;))</h2>`)).should.eventually.throw;
        });
    });
}
