describe("Wick test suite.", function() {
    let window;
    let DOM;
    let wick;

    beforeEach(function() {

        /* 
        	Forcefully delete the node.js require cache. 
        	This is a lazy way to ensure all source files will load correctly when changed.
        */

        delete require.cache;

        let JSDOM = require("jsdom").JSDOM;

        /** Poly Fills **/

        DOM = new JSDOM(`
		<!DOCTPE html>
		
		<head>
		
		</head>
		
		<body>
			<app>
			</app>
		</body>
	`);

        window = DOM.window;

        global.window = window;

        global.document = window.document;

        global.HTMLElement = window.HTMLElement;

        performance = {
            now() {
                return Date.now();
            }
        }

        window.performance = performance

        function raf(f) {
            return setTimeout(f, 1);
        }

        requestAnimationFrame = raf

        window.requestAnimationFrame = raf;

        global.Element = window.Element;

        wick = require("../build/wick.node.js");

        global.wick = wick;
    })

    it("tests", function() {
        require("./suite/css_tests.js")()
    	require("./suite/source_constructor_tests.js")()
        //require("./suite/schema_tests.js")()
        //require("./suite/model_tests.js")()
        //describe("Model Container Tests", function() {
        //    require("./suite/mc_tests.js")()
        //    require("./suite/amc_tests.js")()
        //    require("./suite/btmc_tests.js")()
        //})
    })
})