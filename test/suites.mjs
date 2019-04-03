export default [{
    name: "mocha.chai.jsdom",
    cmd: "mocha -w -r esm $file",
    initialize: function() {
        return `
            import chai from "chai";
            import jsd from "jsdom";
            const JSDOM =  jsd.JSDOM;
            chai.should();
        `;
    },

    group: function(name, build, beforeG, afterG, beforeT, afterT) {

        return `
                describe("${name}", ()=>{
                    ${ beforeG ? `before(${beforeG()});` : "" }
                    ${ afterG ? `after(${afterG()});` : "" }
                    ${ beforeT ? `beforeEach(${beforeT()});` : "" }
                    ${ afterT ? `afterEach(${afterT()});` : "" }
                    ${build()};
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
},{
    name: "mocha.chai",
    cmd: "mocha -w -r esm $file",
    initialize: function() {
        return `
            import chai from "chai";
            chai.should();
        `;
    },

    group: function(name, build, beforeG, afterG, beforeT, afterT) {

        return `
                describe("${name}", ()=>{
                    ${ beforeG ? `before(${beforeG()});` : "" }
                    ${ afterG ? `after(${afterG()});` : "" }
                    ${ beforeT ? `beforeEach(${beforeT()});` : "" }
                    ${ afterT ? `afterEach(${afterT()});` : "" }
                    ${build()};
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
}]
