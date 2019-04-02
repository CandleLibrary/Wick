import cfwt from "@candlefw/tests";


async function start() {

	console.log(process.env.PWD)

    cfwt.installSuite({
        name: "mocha.chai",
        cmd: "mocha -r esm $file",
        initialize: function() {
            return `
            import chai from "chai";
            chai.should();
        `;
        },

        group: function(name, build) {
            return `describe("${name}", ()=>{
            ${build()}
        });`
        },

        test: function(name, build) {
            const test = build();
            if (!test)
                return `it("${name}");`;
            else
                return `it("${name}", ${test});`;
        },

        finalize: () => ""
    });

    cfwt.installTest("./test/suite/plugins.mjs");
    console.log(cfwt.build("wick"))
}

start()