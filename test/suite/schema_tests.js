function SCHEMATESTS()  {

	function testSchema(schema, name){


		describe(`${name}`, function(){
			it(`Is an instance of SchemaType`, function(){
				if(!schema instanceof wick.schema.constr)
					throw new Error("schema is not an instance of SchemaType");
			})

			it(`Has a defined schema.start_value.`, function(){
				if(typeof(schema.start_value) === "undefined")
					throw new Error("schema does not have a valid start_value");
			})

			it(`schema.parse always returns a value, or undefined. Never throws for any value.`, function(){
				let test1 = "test";
				let test2 = false;
				let test3 = 1000550;

				schema.parse(test1)
				schema.parse(test2)
				schema.parse(test3)

			})

			it(`schema.verify gives valid reject reason.`, function(){
				let result = {valid:false, reason: ""}

				let t;

				schema.verify(t, result);

				if(result.valid)
					throw new Error("result.valid is true on an undefined value.")

				if(result.reason.length < 1)
					throw new Error("result.reason is a zero length string on an undefined value.")					
			})	
			
		})
	}

    describe('wick.schema - Built-in Schemas', function() {
        
        for(let name in wick.core.schema.instances){
        	let schema = wick.core.schema.instances[name];
        	testSchema(schema, name)
        }

    });
}

if (typeof module !== "undefined") module.exports = SCHEMATESTS;