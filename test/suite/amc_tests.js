function AMCTESTS()  {

    describe('wick.model.container.array', function() {
        //Load the ModelContainer test Suite
        ModelContainerTests(wick.model.container.array, true);
    });
}

if (typeof module !== "undefined") module.exports = AMCTESTS;