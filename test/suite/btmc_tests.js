function BTREE_CONTAINER_TESTS(config) {
    let scheduler = wick.internals.scheduler;
    
    describe('wick.model.container.btree', function() {
        
        let btree = new (wick.model.scheme({
                self: [{
                    key:{ name: "num", type: wick.scheme.number, unique_key : "id" },
                    model: wick.model.any.constr
                }]
            }))();

        it("Adding Models", function() {
            let i = 0;
            
            btree.set([
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i},
                {num:i++, id: "id"+i}
            ]);

            btree.length.should.equal(9);
        });

        it("Getting Models", function() {
            let i = 0;
            
            btree.get(2, [])[0].id.should.equal("id3");
            btree.get([2,3,4,5], [])[1].id.should.equal("id4");
        });


    });
}

if (typeof module !== "undefined") module.exports = BTREE_CONTAINER_TESTS;