if(typeof window === 'undefined' && require){

	let JSDOM  = require("jsdom").JSDOM;

	/** Poly Fills **/

	global.DOM  = new JSDOM(`
		<!DOCTPE html>
		
		<head>
		
		</head>
		
		<body>
			<app>
			</app>
		</body>
	`);

	global.window  = DOM.window;

	global.document = window.document;

	performance = {
		now(){
			return Date.now();
		}
	}

	window.performance = performance

	function raf(f){
		return setTimeout(f, 1);
	}

	requestAnimationFrame = raf

	window.requestAnimationFrame = raf;

	global.Element = window.Element

	global.wick = require("../../build/wick.node.js");

}