const fs = require("fs");
const path = require("path");
const chai = require("chai");
chai.should();
const assert = chai.assert;


const config = {
    PERFORMANCE: false,
    BROWSER: false
};

import wick from "../source/wick";

describe("Wick test suite.", function() {
    let window;
    let DOM;
    let wick;

    beforeEach(function() {
        
        this.slow(100000);
        this.timeout(100000);

        global.benchmark = require("benchmark");

        /**
         * Global `fetch` polyfill - basic support
         */
        global.fetch = (url, data) =>
            new Promise((res, rej) => {
                let p = path.resolve(process.cwd(), (url[0] == ".") ? url + "" : "." + url);
                fs.readFile(p, "utf8", (err, data) => {
                    if (err) {
                        rej(err);
                    } else {
                        res({
                            status: 200,
                            text: () => {
                                return {
                                    then: (f) => f(data)
                                }
                            }
                        });
                    }
                })
            });


        /* 
            Forcefully delete the node.js "require" cache. 
            This is a lazy way to ensure all source files will load correctly when changed.
        */

        let JSDOM = require("jsdom").JSDOM;

        /** Poly Fills **/

        DOM = new JSDOM(`
        <!DOCTPE html>
        
        <head test="123">
        
        </head>
        
        <body version="v3.14">
            <app>
            </app>
        </body>

        <script>
        </script>
    `);

        window = DOM.window;

        global.window = window;

        global.document = window.document;

        global.HTMLElement = window.HTMLElement;

        const performance = {
            now() {
                return Date.now();
            }
        };

        function raf(f) { return setTimeout(f, 30); }

        global.Element = window.Element;

        global.wick = wick;
    });

    it("tests", function() {
        require("./suite/schema_tests.js")(config);
        require("./suite/model_tests.js")(config);
        require("./suite/btmc_tests.js")(config);
        require("./suite/source_package_tests.js")(config);
    });
});