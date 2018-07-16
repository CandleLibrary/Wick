function CSSTESTS()  {

    describe('wick.core.css', function() {
    	it("Parses well formed CSS and returns on Object graph of CSS rules", function(){
            let CSSParse = wick.core.css.parser

            let og = CSSParse("a{box-shadow: 2px 2px black, inset 2px 4px red; color:white; transition: color 2s ease-in, top 5s ease }");

            console.log(og)

            if(!og.rules.a || !og.rules.a.props.color)
                throw new Error("Failed to create CSS object graph.")
    	})
    });
}

if (typeof module !== "undefined") module.exports = CSSTESTS;