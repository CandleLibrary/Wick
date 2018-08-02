if (typeof require !== "undefined") {
    chai = require("chai");
    assert = chai.assert;
}

function WURLTESTS() {
    if (typeof(Location) == "undefined") global.Location = class {};
    describe('wick.core.network.wurl', function() {
        let WURL = wick.core.network.url;

        describe("Handles different incomplete forms of URIs", function() {

            let uri1 = "https://www.ttt.localhost.tld.:80201/Fiesta/Free/Sunday?this=22&this=33#dataurl=sdf4f5464w32e1r32w1er54w3er1w1r3w24er5w31re21we12r14w684r36w1";
            it(uri1, function() {
                let url = new WURL(uri1);
                url.protocol.should.equal("https");
                url.host.should.equal("www.ttt.localhost.tld.");
                url.port.should.equal(80201);
                url.path.should.equal("/Fiesta/Free/Sunday");
                url.query.should.equal("this=22&this=33");
                url.hash.should.equal("dataurl=sdf4f5464w32e1r32w1er54w3er1w1r3w24er5w31re21we12r14w684r36w1");
                url.should.not.equal(WURL.G);
            })

            let uri2 = "www.ttt.localhost.tld:80";
            it(uri2, function() {
                let url = new WURL(uri2);
                url.protocol.should.equal("");
                url.host.should.equal("www.ttt.localhost.tld");
                url.port.should.equal(80);
                url.path.should.equal("");
                url.query.should.equal("");
                url.hash.should.equal("");
                url.should.not.equal(WURL.G);
            });

            let uri3 = "www.ttt.localhost.tld?tst=1258&more_good_toast=true";
            it(uri3, function() {
                let url = new WURL(uri3);
                url.protocol.should.equal("");
                url.host.should.equal("www.ttt.localhost.tld");
                url.port.should.equal(0);
                url.path.should.equal("");
                url.query.should.equal("tst=1258&more_good_toast=true");
                url.hash.should.equal("");
                url.should.not.equal(WURL.G);
            });

            let uri4 = "pop3://www.ttt.localhost.tld";
            it(uri4, function() {
                let url = new WURL(uri4);
                url.protocol.should.equal("pop3");
                url.host.should.equal("www.ttt.localhost.tld");
                url.port.should.equal(0);
                url.path.should.equal("");
                url.query.should.equal("");
                url.hash.should.equal("");
                url.should.not.equal(WURL.G);
            });

            let uri5 = "/the/giver/of/toast#11235";
            it(uri5, function() {
                let url = new WURL(uri5);
                url.protocol.should.equal("");
                url.host.should.equal("");
                url.port.should.equal(0);
                url.path.should.equal("/the/giver/of/toast");
                url.query.should.equal("");
                url.hash.should.equal("11235");
                url.should.not.equal(WURL.G);
            });

            let uri6 = `Empty string, global WURL: new WURL("",true)`;
            it(uri6, function() {
                let location = document.location;
                let url = new WURL("",true);
                url.protocol.should.equal(location.protocol);
                url.host.should.equal(location.hostname);
                url.port.should.equal(location.port);
                url.path.should.equal(location.pathname);
                url.query.should.equal(location.search.slice(1));
                url.hash.should.equal(location.hash.slice(1));
                url.should.equal(WURL.R);
            });
        });

        describe('Fetches local resources', function() {
            it("Gets: /test/data/test.txt", function(done) {
                let url = new WURL("/test/data/test.txt");

                url.fetchText().then((text) => {
                    text.should.equal("this is the test text!")
                    done()
                }).catch(e => done(e))
            })
        })

        describe("Maps data to query string", function() {
            it(`Maps: ?bar=foo&boo&roo=@$%^&bat=3`, function() {
                let url = new WURL("?bar=foo&boo&roo=@$%^&bat=3");
                let data = url.getData("boo")
                assert.isOk(data, "boo class");
                data.should.have.property("roo")
                data.roo.should.equal("@$%^")
                data.should.have.property("bat")
                data.bat.should.equal("3")
                data = url.getData()
                assert.isOk(data, "'root' class");
                data.should.have.property("bar")
                data.bar.should.equal("foo")
            })
            it(`Maps: ?boo&roo=@$%^&bat=3`, function() {
                let url = new WURL("?bar=foo&boo&roo=@$%^&bat=3");
                let data = url.getData("boo")
                assert.isOk(data, "boo class");
                data.should.have.property("roo")
                data.roo.should.equal("@$%^")
                data.should.have.property("bat")
                data.bat.should.equal("3")
            })
            it(`Maps: {data:"my_data"} to ?data=my_data`, function() {
                let url = new WURL();
                url.setData({ data: "my_data" });
                url.query.should.equal("?data=my_data")
            })
            it(`Maps: {data:"my_data"} with class "roo" to ?roo&data=my_data`, function() {
                let url = new WURL();
                url.setData({ data: "my_data" }, "roo");
                url.query.should.equal("?roo&data=my_data")
            })
        })
    })
}

if (typeof module !== "undefined") module.exports = WURLTESTS;