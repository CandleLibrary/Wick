function BTMCTESTS() {
	
    describe('wick.BTreeModelContainer', function() {

        //Load the ModelContainer test Suite
        ModelContainerTests(wick.BTreeModelContainer, false);

        let BTreeMC = wick.BTreeModelContainer;

        it("Rejects non-numerical schemas", function() {
            let Constructor = class extends BTreeMC {};

            Constructor.schema = {
                model: wick.AnyModel,
                parser: wick.schema.String,
                identifier: "birthday"
            }

            try {
                new Contructor();
            } catch (e) {
                //Error Thrown, Good Job
            }
        })


        //Btree Functional tests

    });
}

if (typeof module !== "undefined") module.exports = BTMCTESTS;