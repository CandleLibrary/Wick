require("./scope_inject.js");

let ModelContainerTests = require("./mc_tests.js")

describe('wick.BTreeModelContainer', function() {

	//Load the ModelContainer test Suite
	ModelContainerTests(wick.BTreeModelContainer);
	
});