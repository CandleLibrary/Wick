/**
	This is a general test suite for objects the inherit from ModelContainer
*/

var ModelContainerTests = function(Constructor) {
    //Create a schema to use with this constructor throughout the suites

    class MCConstructor extends Constructor {};
    
    MCConstructor.schema = {
    	identifier : "name",
    	parser: wick.schema.STRING,
    	model: wick.AnyModel
    }

    it('Is a constructor', function() {
        if (!constructor instanceof Function)
            throw new Error("Container is not a constructor")
    });

    let Container = new MCConstructor();

    it('Is instance of ModelContainer', function() {
        if (!Container instanceof wick.ModelContainer)
            throw new Error("Container is not an instance of ModelContainer")
    });

    describe("Model interactions", function() {
        var Container;

        before(function() {
            // Construct brand-new container
            Container = new MCConstructor();
        });

        after(function() {
            //Destroy the container
            Container.destructor();
            Container = null;
        })


        describe(".insert()", function() {

            it(`Will reject models that do not have an identifier that matches the schema of the ModelContainer instance.`, function() {
                
                let models = [{name: "bob"},{nombre: "sally"},{name: "mary"}];

                Container.insert(models);

                let results = Container.get(null, []);

                if(results.length < 1) throw new Error(`Not enough results returned, expected 2, got ${results.length}`);
                
                if(results.length > 2) throw new Error(`Too many results returned, expected 2, got ${results.length}`);

                for(let i = 0; i < results.length; i++){
                	if(results[i].nombre)
                		throw new Error(`Model with non-identify "nombre" returned. Identifier for the model should be ${Container.schema.identifier}`)
                }
            })

            it("Can handle insertion of generic objects, turning them into AnyModels.", function() {
                
                let models = [{name: "bob"},{name: "sally"},{name: "mary"}];

                Container.insert(models);
                
                let results = Container.get(null, []);

                if(results.length < 1) throw new Error(`Not enough results returned, expected 3, got ${results.length}`);

                for(let i = 0; i < results.length; i++){
                	if(!results[i] instanceof wick.AnyModel)
                		throw new Error(`Returned object is not an instance of AnyModel`)
                }

            })
        })
    })
}



if (typeof module !== "undefined") module.exports = ModelContainerTests;