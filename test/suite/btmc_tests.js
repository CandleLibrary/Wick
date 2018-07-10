function BTMCTESTS() {
	
    describe('wick.core.model.BTreeArrayContainer', function() {

        //Load the ModelContainer test Suite
        ModelContainerTests(wick.model.container.constr.btree, false);

        let BTreeMC = wick.model.container.constr.btree;

        it("Rejects non-numerical schemas", function() {
            let Constructor = class extends BTreeMC {};

            Constructor.schema = {
                model: wick.model.any.constr,
                parser: wick.schema.string,
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