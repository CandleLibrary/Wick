function CSSTESTS()  {

const test_data = 
`
.panel-success > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #d6e9c6;
}
`
    describe('wick.core.css', function() {
    	it("Parses well formed CSS and returns on Object graph of CSS rules", function(){

            let CSSParse = wick.core.css.parser
            let t = performance.now();
            let og = CSSParse(test_data);
            let e = performance.now();
            console.log(e-t)
            console.log(og)
            t = performance.now();
            og = CSSParse(test_data);
            e = performance.now();
            console.log(e-t)

            t = performance.now();
            og = CSSParse(test_data);
            e = performance.now();
            console.log(e-t)

            t = performance.now();
            og = CSSParse(test_data);
            e = performance.now();
            console.log(e-t)

            console.log(og.getRule("a"))

            if(!og.getRule("a") || !og.getRule("a a .master"))
                throw new Error("Failed to create CSS object graph.")
    	})

    	it("Matches rules against elements", function(){
    		let CSSParse = wick.core.css.parser

    		let og = CSSParse("a+div.bar #roo span.class{font-size:2px; color:green}");

    		let ele = document.createElement("div");

    		ele.innerHTML = `<a><a></a>
    			<div id="roo" class="bar">
                    <span class="class"></span>
    			</div>
    		</a>`

    		let span = ele.getElementsByTagName("span")[0];
    		let rules = og.getApplicableRules(span);

    		try{
                console.log(rules, rules.color)
    			if(rules.font_size === 2)
    				throw ""
    		}catch(e){
    			throw new Error("Failed to get rules for element")
    		}
    	})
    });
}

if (typeof module !== "undefined") module.exports = CSSTESTS;