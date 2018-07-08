function AMCTESTS()  {

    describe('wick.ArrayModelContainer', function() {
        //Load the ModelContainer test Suite
        ModelContainerTests(wick.ArrayModelContainer, true);

    });
}

if (typeof module !== "undefined") module.exports = AMCTESTS;