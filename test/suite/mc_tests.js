/**
	This is a genereric test suite for objects the at inherit from ModelContainer
*/

function ModelContainerTests(MCConstructor){
	it('Is a constructor', function() {
		if (!MCConstructor instanceof Function)
			throw new Error("Container is not a constructor")
	});

	let Container = new MCConstructor();

	it('Is instance of ModelContainer', function() {
		if (!Container instanceof wick.ModelContainer)
			throw new Error("Container is not an instance of ModelContainer")
	});

}

module.exports = ModelContainerTests;