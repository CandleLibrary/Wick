import wick from "../source/wick.js";
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

        it("<h3></h3>", async function() {
            const { ele } = await createComponent(`<h3></h3>`);
            ele.fch.tag.should.equal("h3");
        });

        it("<h4></h4>", async function() {
            const { ele } = await createComponent(`<h4></h4>`);
            ele.fch.tag.should.equal("h4");
        });

        it("<h5></h5>", async function() {
            const { ele } = await createComponent(`<h5></h5>`);
            ele.fch.tag.should.equal("h5");
        });

        it("<h6></h6>", async function() {
            const { ele } = await createComponent(`<h6></h6>`);
            ele.fch.tag.should.equal("h6");
        });

        it("<pre></pre>", async function() {
            const { ele } = await createComponent(`<pre></pre>`);
            ele.fch.tag.should.equal("pre");
        });

        it("<div></div>", async function() {
            const { ele } = await createComponent(`<div></div>`);
            ele.fch.tag.should.equal("div");
        });

        it("<a></a>", async function() {
            const { ele } = await createComponent(`<a></a>`);
            ele.fch.tag.should.equal("a");
        });

        it("<pre></pre>", async function() {
            const { ele } = await createComponent(`<pre></pre>`);
            ele.fch.tag.should.equal("pre");
        });

        it("<pre></pre>", async function() {
            const { ele } = await createComponent(`<pre></pre>`);
            ele.fch.tag.should.equal("pre");
        });

        function AcceptRejectAssertion(string, ACCEPTED = false) {
            it(string, () =>
                wick(string).pending.should.eventually.be[ACCEPTED ? "fulfilled" : "rejected"]
            );
        }
        
        AcceptRejectAssertion(`<h2>(())</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( 2+2 ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( alpha ? douglas : "rainbow" ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( test && <a>rainbow</a> ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( [tree, dog, cat] ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( {pine:box, ["salamander"]: test}))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( id ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( 1 || 2 && 3 ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( 1 && 2 || 3 ))</h2>`, true);
        
        AcceptRejectAssertion(`<h2>(( return t;))</h2>`, false);

        AcceptRejectAssertion(`<div><style>;</style></div>`, false);

        AcceptRejectAssertion(`<div><style></style></div>`, true);

        AcceptRejectAssertion(`<div>
            <script>
        `, false);

        AcceptRejectAssertion(`<div>
            <script>;</script></div>
        `, true);

        AcceptRejectAssertion(`<div>
            <script></script></div>
        `, true);
        
        AcceptRejectAssertion(`<div><script>
            /* dfsf
            ****
            */ </script></div>`, true);
        AcceptRejectAssertion(`<div><script>
            //* dfsf
            ****
            */ </script></div>`, false);
    });
}
