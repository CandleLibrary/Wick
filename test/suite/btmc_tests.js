function BTMCTESTS() {
	
    describe('wick.model.container.btree', function() {

        //Load the ModelContainer test Suite
        ModelContainerTests(wick.model.container.btree, false);

        let BTreeMC = wick.model.container.btree;

        it("Rejects non-numerical schemas", function() {
            let Constructor = class extends BTreeMC {};

            Constructor.schema = {
                model: wick.model.any.constr,
                parser: wick.scheme.string,
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