
import wick from "../../source/wick";

function SCHEMATESTS()  {

	function testSchema(scheme, name){


		describe(`${name}`, function(){
			it(`Is an instance of SchemaType`, function(){
				if(!scheme instanceof wick.scheme.constr)
					throw new Error("scheme is not an instance of SchemaType");
			})

			it(`Has a defined scheme.start_value.`, function(){
				if(typeof(scheme.start_value) === "undefined")
					throw new Error("scheme does not have a valid start_value");
			})

			it(`scheme.parse always returns a value, or undefined. Never throws for any value.`, function(){
				let test1 = "test";
				let test2 = false;
				let test3 = 1000550;

				scheme.parse(test1)
				scheme.parse(test2)
				scheme.parse(test3)
			})

			it(`scheme.verify gives valid reject reason.`, function(){
				let result = {valid:false, reason: ""}

				let t;

				scheme.verify(t, result);

				if(result.valid)
					throw new Error("result.valid is true on an undefined value.")

				if(result.reason.length < 1)
					throw new Error("result.reason is a zero length string on an undefined value.")					
			})	
			
		})
	}

    describe('wick.scheme - Built-in Schemes', function() {
        
        for(let name in wick.scheme){
        	if(name == "constr") continue; //Skip constructors 
        	let scheme = wick.scheme[name];
        	testSchema(scheme, name)
        }

    });
}

if (typeof module !== "undefined") module.exports = SCHEMATESTS;