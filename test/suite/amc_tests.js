if(typeof require !== "undefined"){
	require("./scope_inject.js");
	var ModelContainerTests = require("./mc_tests.js")
}

describe('wick.ArrayModelContainer', function() {

	//Load the ModelContainer test Suite
	ModelContainerTests(wick.ArrayModelContainer);
	
});