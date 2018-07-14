function CSSTESTS()  {

    describe('wick.core.css', function() {
    	it("Parses well formed CSS and returns on Object graph of CSS rules", function(){
            let CSSParse = wick.core.css.parser

            let og = CSSParse("a{color:white}");

            console.log(og)

            if(!og.rules.a || !og.rules.a.props.color)
                throw new Error("Failed to create CSS object graph.")
    	})
    });
}

if (typeof module !== "undefined") module.exports = CSSTESTS;