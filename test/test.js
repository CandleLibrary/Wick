import chai from "chai";
import chaiAsPromised from 'chai-as-promised';
import wick from "../source/wick.js";

import { IOBase } from "../source/compiler/component/io/io.js";
import Component from "../source/compiler/component_prototype.js";

import html from "@candlefw/html";

import url from "@candlefw/url";

chai.use(chaiAsPromised);
chai.should();

function loadPolyFill() {
    global.window = {};
    html.polyfill();
    url.polyfill();
}

loadPolyFill();

async function sleep(time) {
    return new Promise(res => {
        setTimeout(res, time || 1);
    });
}

function* recurseIO(io) {
    if (io.ele instanceof IOBase)
        yield* recurseIO(io.ele);
    else yield io;
}

function* recurseIONodes(io) {
    yield io;
    if (io.ele instanceof IOBase)
        yield* recurseIO(io.ele);
}

console.log("----------------------------------------------------START----------------------------------------------------")

describe("Basic", function() {
    it("Creates compiled components using HTML syntax", async function() {
        const comp = await wick(`<scope element=div>test</scope>`).pending;
        comp.should.be.instanceOf(Component);
    });

    it("Creates compiled components using class syntax", async function() {

        class D extends wick {
            constructor() {
                super("<div></div>");
            }
        }

        const comp = await (new D).pending;

        comp.should.be.instanceOf(Component);
    });
});

describe("Merging", function() {

    it("Merging elements pulls statics from the merged-from tag", async function() {
        let presets = wick.presets();
        await wick(`<scope component="mergedto" temp=false>test</scope>`, presets).pending;
        let comp = await wick(`<div><mergedto temp=true>test false</mergedto></div>`, presets).pending;
        let component = comp.mount();
    });

    it("Merging pulls attribute data from both merging-component and merged-element. Merged elements attributes are preferred", async function() {
        const presets = wick.presets();
        await wick(`<scope element="div" component="mergedto" temp="false" foo="biz">test</scope>`, presets).pending;
        const comp = await wick(`<div><mergedto temp="true" bar="buz">test false</mergedto></div>`, presets).pending;
        const mount = new HTMLElement();
        mount.tag ="div";
        const scope = await comp.mount(mount);
        const sub_ele = scope.ele.firstChild;
        sub_ele.getAttribute("temp").should.equal("true");
        sub_ele.getAttribute("foo").should.equal("biz");
        sub_ele.getAttribute("bar").should.equal("buz");
    });
});

describe("Errors", function() {
    it("Throws an error if it encounters incorrect syntax.", async function() {
        await wick(`<scope><script on=((mounted))> ((test dm = 2)) </script> </scope>`).pending.should.be.rejected;
        await wick(`<scope><script on=((mounted)> ((test dm = 2)) </script> </scope>`).pending.should.be.rejected;
        await wick(`<scope><script on=((mounted)> ((test dm = 2)) <script> </scope>`).pending.should.be.rejected;
        await wick(`<scope><script on=((mounted)> ((testdm 2=3 2)) <script> </scope>`).pending.should.be.rejected;
    });
});

describe("Binding Methods", function() {

    it("Scripts can define arguments using on=((id)(arg_list)) syntax");

    it("Input bindings to value using ((id)(expr)), (()(expr)), ((id)), & ((id)()) all work correctly ");

    it("HTML element should appear in the scoped DOM when an ExpressionIO, bound to a DataIO, yields a HTML object.", async function() {

        const comp = await wick(`
            
            <scope>(( isUser ? <a href="test">((name))</a> : "non-user" ))</scope>

        `).pending;

        const mount = new HTMLElement();

        mount.tag = "div";

        const scope = await comp.mount(mount);

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);

        scope.update({ isUser: false, name: "Douglas Adams" });
        await sleep(1);

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);
        scope.ele.children[0].data.should.equal("non-user");

        scope.update({ isUser: true, name: "Douglas Adams" });
        await sleep(2);

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(HTMLElement);
        scope.ele.children[0].tagName.should.equal("A");
        scope.ele.children[0].children[0].data.should.equal("Douglas Adams");

        const element = scope.ele.children[0].children[0];


        scope.update({ isUser: false, name: "Douglas Adamss" });

        await sleep(1);

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);
        scope.ele.children[0].data.should.equal("non-user");

        //scan the scopes ios and see if the old element is still referenced
        for (const tap of scope.taps.values()) {
            for (const io of tap.ios)
                for (const result of recurseIO(io)) {
                    for (const ele of element.traverse())
                        if (result.ele === ele)
                            throw new Error(`Reference to discarded element has not been removed: \n[ \n ${ele}]`);
                }
        }
    });
});

describe("[IO] Processing", function() {
    it("[io] down methods are called once per object sent to scope.update()", async function() {
        const comp = await wick(`
            
            <scope attrib=((year)) >(( isUser ? "user" : "non-user" ))((name))</scope>

        `).pending;

        const mount = new HTMLElement();

        mount.tag = "div";

        const scope = await comp.mount(mount);
        const counts = [];
        const ios = [];

        for (const tap of scope.taps.values()) {
            for (const root_io of tap.ios)
                for (const io of recurseIONodes(root_io)) {
                    ((io) => {
                        const index = counts.push(0) - 1;
                        const fun = io.down;
                        ios.push(io);
                        io.down = function(...v) {
                            counts[index]++;
                            return fun.call(this, ...v);
                        };
                    })(io);
                }
        }

        const length = counts.length;

        scope.update({ isUser: true, name: "Douglas Adams", year: 2008 });

        await sleep(5);

        counts.reduce((r, v) => v + r, 0).should.equal(length);

        scope.update({ isUser: false, name: "Douglas Addams", year: 2009 });

        await sleep(5);

        counts.reduce((r, v) => v + r, 0).should.equal(length * 2);

    });
});
