if(typeof require !== "undefined"){
	require("./scope_inject.js");
	var ModelContainerTests = require("./mc_tests.js")
}

describe('wick.BTreeModelContainer', function() {

	//Load the ModelContainer test Suite
	ModelContainerTests(wick.BTreeModelContainer);
	
});