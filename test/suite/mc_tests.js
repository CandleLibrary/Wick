function MCTESTS() {
    /**
    	This is a general test suite for objects the inherit from ModelContainer

    	@param {class} Constructor - A function that has wick.ModelContainer in its prototype chain. 
    	@param {Boolean} IS_STRING_CAPABLE - If set to true, test will be run with string and number based identifiers. If false, just number based identifiers will be used. 
    */
    ModelContainerTests = function(Constructor, IS_STRING_CAPABLE = true) {

        it('Is a constructor', function() {
            if (!constructor instanceof Function)
                throw new Error("Container is not a constructor")
        });

        let Container = new Constructor({
            identifier:"",
            parser : wick.scheme.number
        });

        it('Is instance of ModelContainer', function() {
            if (!Container instanceof wick.model.container.constr)
                throw new Error("Container is not an instance of ModelContainer")
        });

        function handlesSchemaTypeAnyModel(SCHEMA_TYPE, MODEL_TYPE, identifier, models, extra_matching_models, filters, valid_count, filtered_count, reject_count) {

            var Container;
            var object_models;
            var parser = SCHEMA_TYPE;
            var filter_string = JSON.stringify(filters);



            class MCConstructor extends Constructor {};

            MCConstructor.schema = {
                identifier,
                parser: SCHEMA_TYPE,
                model: MODEL_TYPE
            }

            try{
                new MCConstructor()
            }catch(e){
                return;
            }


            describe(`insert() : ${SCHEMA_TYPE.constructor.name}`, function() {

                beforeEach(function() {
                    // Construct brand-new container
                    Container = new MCConstructor();
                    // Create a 
                });

                afterEach(function() {
                    //Destroy the container
                    Container._destroy_();
                    Container = null;
                })

                it(`Will reject models that do not have an identifier prop that matches schema.identifer of the ModelContainer instance.`, function() {

                    Container.insert(models);

                    let results = Container.get(null, []);

                    if (results.length < 1) throw new Error(`Not enough results returned, expected ${valid_count}, got ${results.length}`);

                    if (results.length > valid_count) throw new Error(`Too many results returned, expected ${valid_count}, got ${results.length}`);

                    for (let i = 0; i < results.length; i++) {
                        if (!results[i][identifier])
                            throw new Error(`Model without an identifier returned. Identifier for the model should be ${identifier}`)
                    }
                })

                it("Can handle insertion of generic objects, converting them into AnyModels.", function() {

                    Container.insert(models);

                    let results = Container.get(null, []);

                    if (results.length < 1) throw new Error(`Not enough results returned, expected ${valid_count}, got ${results.length}`);

                    for (let i = 0; i < results.length; i++) {
                        if (!results[i] instanceof wick.model.any.constr)
                            throw new Error(`Returned object is not an instance of AnyModel`)
                    }

                })

                it("Will insert data into a derived container.", function() {

                    Container.insert(models);

                    let results = Container.get(filters);

                    if (!results instanceof wick.model.container.constr) throw new Error(`Container.get(${filters}). Container did not return a linked ModelContainer.`);

                    if (!results.get(null, [])[0]) throw new Error(`Linked container is empty, it should contain ${models.reduce(e=>{ parser.filter(parser.parse(e[identifier]),filters.map(i => parser.parse(i)))? e.toJson() : "" })}`)

                    Container.insert(extra_matching_models);

                    if (results.length !== filtered_count + extra_matching_models.length) throw new Error(`Linked Container did not receive the new entries: ${JSON.stringify(extra_matching_models)}. Filters: ${JSON.stringify(results.__filters__)} LinkedContainer: ${results.toJson()} `);
                })
            })

            describe(`remove() : ${SCHEMA_TYPE.constructor.name}`, function() {

                let remaining_count = valid_count - filtered_count;

                beforeEach(function() {
                    // Construct brand-new container
                    Container = new MCConstructor();
                    // Create a set of Models
                    Container.insert(models);
                });

                afterEach(function() {
                    //Destroy the container
                    Container._destroy_();
                    Container = null;
                })

                it(`Should remove based on matching provided by terms: ${filter_string}`, function() {

                    let results = Container.remove(filters);

                    if (results.length < 1) throw new Error(`Not enough results, expected ${filtered_count}, got ${results.length}`);
                    if (results.length !== filtered_count) throw new Error(`Too many results, expected ${filtered_count}, got ${results.length}`);

                    results.forEach((e) => {
                        if (!(parser.filter(parser.parse(e[identifier]), (filters.map(e => parser.parse(e))))))
                            throw new Error(`Results do not match terms ${filter_string}. Result value is "${e[identifier]}".`);
                    })
                })

                it(`LinkedContainer should remove from Source`, function() {

                    let results = Container.get(filters);

                    results.remove();
                    if(!Container.length) debugger

                    if (Container.length < 1) throw new Error(`Not enough results, expected ${remaining_count}, got ${Container.length}`);
                    if (Container.length !== remaining_count) throw new Error(`Too many results, expected ${remaining_count}, got ${Container.length}`);
                    if (results.length > 0) throw new Error(`All results of the LinkedContainer should have been removed`);

                    Container.get(null, []).forEach((e) => {
                        if (parser.filter(parser.parse(e[identifier]), (filters).map(r => parser.parse(r))))
                            throw new Error(`Result ${e.toJson()} should have been removed as it's identifier "${identifier}" matches the filters ${filter_string}`);
                    })
                })

                it(`Source should remove from LinkedContainer`, function() {

                    let results = Container.get(filters);

                    Container.remove(filters);

                    if (results.length > 0) throw new Error(`Too many results, expected 0, got ${Container.length}`);
                    if (Container.length !== remaining_count) throw new Error(`Too many results, expected ${remaining_count}, got ${Container.length}`);

                })
            })
        }

        //(SCHEMA_TYPE, MODEL_TYPE, identifier, models, extra_matching_models, filters, valid_count, filtered_count, reject_count)
        describe("Model Interactions", function() {
            handlesSchemaTypeAnyModel(
                wick.scheme.string,
                wick.model.any.constr,
                "name", [
                    { name: "bob", birthday: "Jul 01 2018" }, { name: "sally", birthday: "May 01 2018" },
                    { name: "mary", birthday: "Sep 15 2017" }, { name: "bobby", birthday: "Sep 08 1981" },
                    { name: "marysue", birthday: "Sep 08 1988" }, { name: "suzy", birthday: "Sep 08 2020" },
                    { nombre: "suzia", brthday: "Sep 08 2020" }
                ], [
                    { name: "robo", birthday: "Jul 10 1994" }, { name: "sandy", birthday: "May 01 1976" },
                ], ["bo", "sa"],
                6, 3, 1,
            );

            handlesSchemaTypeAnyModel(
                wick.scheme.date,
                wick.model.any.constr,
                "birthday", [
                    { name: "bob", birthday: "Jul 01 2018" }, { name: "sally", birthday: "May 01 2018" },
                    { name: "mary", birthday: "Sep 15 2017" }, { name: "bobby", birthday: "Sep 08 1981" },
                    { name: "marysue", birthday: "Sep 08 1988" }, { name: "suzy", birthday: "Sep 08 1998" },
                    { nombre: "suzia", brthday: "Sep 08 2020" }
                ], [
                    { name: "robo", birthday: "Jul 10 1994" }, { name: "sandy", birthday: "May 01 1998" },
                ], ["Jan 01 1990", "Dec 30 2017"],
                6, 2, 1,
            );
        })
    }
}



if (typeof module !== "undefined") module.exports = MCTESTS;