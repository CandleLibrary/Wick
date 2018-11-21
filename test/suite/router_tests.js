/**
 * Handles the testing of routing, component & element creation, pages and modals.
 */
function ROUTERTESTS(config) {
    describe("wick.network.router", function() {
        this.slow(10000);
        this.timeout(10000);

        let f_document = null,
            f_window = null,
            f_router = null;


        if (!config.BROWSER) {
            let JSDOM = require("jsdom").JSDOM;
            before((done) => {
                (new wick.core.network.url("/test/data/page.html")).fetchText().then(string => {
                    let virtualConsole = new (require("jsdom").VirtualConsole)();
                    let dom = new JSDOM(string, {
                        virtualConsole:virtualConsole,
                        runScripts: "dangerously",
                        resources: "usable",
                        pretendToBeVisual: true
                    });
                    dom.window.fetch = fetch;
                    dom.window.performance = { now() { return Date.now(); } };
                    dom.window.addEventListener("load", () => {
                        f_window = dom.window;
                        f_document = f_window.document;
                        done();
                    });
                });
            });
        } else {
            before((done) => {
                let frame = document.createElement("iframe");
                frame.src = "/test/data/page.html";
                document.body.appendChild(frame);
                frame.contentWindow.addEventListener("load", () => {
                    f_document = frame.contentWindow.document;
                    f_window = frame.contentWindow;
                    done();
                });
            });
        }


        it.skip("Loads page information from the current document and parses elements and creates components from component tags on page", function(done) {
            this.slow(10000);
            this.timeout(10000);
            setTimeout(() => {
                let body = f_document.body;
                let app = f_document.getElementsByTagName("apppage")[0];
                let ele1 = app.children[0];
                let ele2 = app.children[1];
                let ele3 = app.children[2];
                body.children.should.have.lengthOf(1);
                app.children.should.have.lengthOf(3);
                console.log(ele2)
                //ele2.getElementsByTagName("game")[0].tagName.should.equal("GAME");
                //ele1.getElementsByTagName("component")[0].innerHTML.should.equal("<div>Test Data One</div>");
                //ele3.getElementsByTagName("component")[0].innerHTML.should.equal("<div>Test Data One</div>");
                done();
            }, 200);
        });

        it("Handles page transitions and inter-component animations", function(done){
            done();
        });
    });
}

if (typeof module !== "undefined") module.exports = ROUTERTESTS;