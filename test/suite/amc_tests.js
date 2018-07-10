function AMCTESTS()  {

    describe('wick.core.model.ArrayModelContainer', function() {
        //Load the ModelContainer test Suite
        ModelContainerTests(wick.core.model.ArrayModelContainer, true);
    });
}

if (typeof module !== "undefined") module.exports = AMCTESTS;