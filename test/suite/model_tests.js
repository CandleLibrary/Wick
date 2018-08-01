function MODELTESTS()  {

    describe('wick.model', function() {
    	it("Creates watchers on properties that automatically update views with updated values.");
    	//If passed an object into it's constructor, creates links to the object.
    	//Matches it's schema and will not update values not conforming to it's schema.
    	//Calls it's views when one or more of its views are changed. Asynch. 
    	//Destructor releases all views 
    	//Returns an AnyModel if it's constructor lacks a schema property
    	//toJson returns expected JSON structure
    });
}

if (typeof module !== "undefined") module.exports = MODELTESTS;