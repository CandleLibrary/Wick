import chai from "chai";
import chaiAsPromised from 'chai-as-promised';
/*
import wick from "../source/wick.mjs";
import { IOBase } from "../source/compiler/component/io/io.mjs";
import Component from "../source/compiler/component_prototype.mjs";
/*/
import wick from "../source/wick.js";
import { IOBase } from "../source/compiler/component/io/io.js";
import Component from "../source/compiler/component_prototype.js";
//*/

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

async function createComponent(value, presets) {
    let comp;
    try {
        comp = await wick(value, presets).pending;
    } catch (e) {
        throw e;
    }

    const mount = new HTMLElement();

    mount.tag = "div";

    return { scope: await comp.mount(mount), ele: mount };
}

import parsing from "./parsing.js";

parsing(createComponent);

console.log("----------------------------------------------------START----------------------------------------------------");

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

describe("Composition", function() {
    it("Components can be defined and referenced by name within other components.", async function() {
        const presets = wick.presets();

        const { ele: eleA } = await createComponent(`<div component='test'>test</div>`, presets);
        const { scope, ele: eleB } = await createComponent(`<scope><div><a><test/></a></div></scope>`, presets);

        eleB.fch.fch.fch.fch.data.should.equal("test");
    });

    it("Components can be imported from a remote resource using the [url] attribute on <import> or <link> elements", async function() {
        const presets = wick.presets();
        const { comp, ele } = await createComponent(`<import url="./test/data/import.1.html"/><scope><test/></scope>`, presets);
        await sleep(5);
        ele.fch.fch.innerHTML.should.equal("I've been imported!");
    });

    it("Multiple imported components", async function() {
        const presets = wick.presets();
        const { comp, ele } = await createComponent(`
            <import url="./test/data/import.1.html"/>
            <import url="./test/data/import.2.html"/>
            <import url="./test/data/import.3.html"/>
            <scope><test/><test2/><test3/></scope>`, presets);
        
        await sleep(5);

        ele.children[0].fch.innerHTML.should.equal("I've been imported!");
        ele.children[1].fch.innerHTML.should.equal("I've been imported! version 2");
        ele.children[2].fch.innerHTML.should.equal("I've been imported! version 3");
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
            mount.tag = "div";
            const scope = await comp.mount(mount);
            const sub_ele = scope.ele.firstChild;
            sub_ele.getAttribute("temp").should.equal("true");
            sub_ele.getAttribute("foo").should.equal("biz");
            sub_ele.getAttribute("bar").should.equal("buz");
        });
    });

    describe("Slots", function() {

        it("Slots can be defined within components and referenced by mounting elements [slot] value that matches the slot's [name] attribute", async function() {
            const presets = wick.presets();

            const { ele: eleA } = await createComponent(`<div component='test'>Test this <slot name="test">out</slot> now!</div>`, presets);
            const { scope, ele: eleB } = await createComponent(`<scope><div><a><test><scope slot="test">2+4/22</scope></test></a></div></scope>`, presets);
            eleB.fch.fch.fch.innerText.should.equal("Test this 2+4/22 now!");
        });
    });
});

describe("Containers", function() {
    it("Create collection of components binding to data objects within an array.", async function() {
        const presets = wick.presets();

        await createComponent(`<scope component='test'>My name is ((name))</scope>`, presets);
        const { scope, ele } = await createComponent(`<scope><container>((names))<test/></container></scope>`, presets);

        const names = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }];

        scope.update({ names });
        await sleep(5);

        const children = ele.fch.children;

        for (var i = 0; i < names.length; i++)
            children[i].innerHTML.should.equal(`My name is ${names[i].name}`);
    });

    it("Filter [filter] attribute can be used to filter out components", async function() {
        const presets = wick.presets();

        await createComponent(`<scope component='test'>My name is ((name))</scope>`, presets);
        const { scope, ele } = await createComponent(`<scope><container><f filter=(( model.name == "A" ))/>((names))<test/></container></scope>`, presets);

        const names = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }];
        scope.update({ names });
        await sleep(5);
        const children = ele.fch.children;
        children.should.have.lengthOf(1);
        children[0].innerHTML.should.equal(`My name is A`);
    });

    it("Filter [filter] attribute can reference scope binding variables.", async function() {
        const presets = wick.presets();

        await createComponent(`<scope component='test'>My name is ((name))</scope>`, presets);
        const { scope, ele } = await createComponent(`<scope><container><f filter=(( model.name == filter_data ))/>((names))<test/></container></scope>`, presets);

        const names = [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }];
        for (var i = 0; i < names.length; i++) {
            scope.update({  names, filter_data: names[i].name});
            await sleep(3);
            const children = ele.fch.children;
            children.should.have.lengthOf(1);
            children[0].innerHTML.should.equal(`My name is ${names[i].name}`);
        }
    });

    describe("Scrubbing", function() {

        it("Introducing new offset and set of elements does not visually change element order.", async function() {
            this.slow(200000);
            this.timeout(10000);

            const { scope } = await createComponent(`./test/data/scrubbing2.js`, wick.presets()),
                sc = scope.containers[0];

            scope.update({ mounted: true });

            await sleep(5);
            //Add incremental scrubs that add up to 5
            const
                amount = 0.25,
                limit = Math.floor(6 / amount);

            for (let i = 0; i < limit; i++) {
                //console.log({amount})
                scope.update({ scrub: amount });
                await sleep(2); //Pausing for one frame in a 60f/1s mode. 
            }

            scope.update({ scrub: Infinity });

            await sleep(50);
            //console.log(sc.activeScopes.map((scope, i) => ({ index: i, top: scope._top, off: scope.model.data }))[10])
            sc.activeScopes.map((scope, i) => ({ index: i, top: scope._top, off: scope.model.data }))[11].off.should.equal(17);
        });
    });
});

describe("Errors", function() {
    it("Throws an error if it encounters incorrect syntax.", async function() {
        wick(`<scope><script on=((mounted))> ((test dm = 2)) </script> </scope>`).pending.should.eventually.be.rejected;
        wick(`<scope><script on=((mounted)> ((test dm = 2)) </script> </scope>`).pending.should.eventually.be.rejected;
        wick(`<scope><script on=((mounted)> ((test dm = 2)) <script> </scope>`).pending.should.eventually.be.rejected;
        wick(`<scope><script on=((mounted))> ((testdm 2=3 2)) <script> </scope>`).pending.should.eventually.be.rejected;
    });
});

describe("Scoped data flow", function() {
    it("Exports data to parent scope when [export] attribute is set.", async function() {
        const comp = await wick(`
            
            <scope export=out_test ><script on=((in_test))> out_test = "myvalue"  </script></scope>

        `).pending;

        const mount = new HTMLElement();

        mount.tag = "div";

        const scope = await comp.mount(mount);
        var UPIMPORTED = false;

        scope.parent = { upImport: (prop_name, data, meta) => UPIMPORTED = data == "myvalue" && prop_name == "out_test" };

        scope.update({ in_test: true });

        await sleep(10);

        UPIMPORTED.should.equal(true);
    });
});

describe("Binding Methods", function() {

    it("Simple binding within element updates text node", async function() {
        const { scope, ele } = await createComponent(`<scope>((test))</scope>`);

        scope.update({ test: "success" });

        await sleep(1);

        ele.fch.data.should.equal("success");
    });

    it("Expressions can be defined within binding", async function() {
        const { scope, ele } = await createComponent(`<scope>((testA + testB + (2 * testC) ))</scope>`);

        scope.update({ testA: "successfull", testB: " times ", testC: 4 });

        await sleep(1);

        ele.fch.data.should.equal("successfull times 8");
    });

    it("Expressions are evaluated ONLY once all dependent variables have received a value", async function() {
        const { scope, ele } = await createComponent(`<scope>((testA + testB + (2 * testC) ))</scope>`);

        scope.update({ testA: "successfull" });
        await sleep(1);
        ele.fch.data.should.equal("");

        scope.update({ testB: " times " });
        await sleep(1);
        ele.fch.data.should.equal("");

        scope.update({ testC: 4 });
        await sleep(1);
        ele.innerHTML.should.equal("successfull times 8");
    });

    it("Binding to a script tags [on] attributes causes that script to run", async function() {
        const test = { RESULT: false };
        const { scope, ele } = await createComponent(
            `<scope><script on=((test))> testdata.RESULT = true </script></scope>`, wick.presets({ custom: { testdata: test } })
        );

        scope.update({ test: "success" });

        await sleep(5);

        test.RESULT.should.be.true;
    });

    it("Scripts can define arguments using on=((id)(arg_list)) syntax");

    describe("Bindings on <input> [value] attribute.", function() {

        it("((A)(B)) : Value data received on binding A and user input pushed out through binding B", async function() {
            const { scope, ele } = await createComponent(
                "<scope export='a b'>" +
                "<input type='text' value=(( a )( b )) />" +
                "</scope>"
            ), a = ele.fch;

            var DID_RUN = false;
            scope.parent = {
                upImport: (prop_name, data, meta) => {
                    prop_name.should.equal("b");
                    scope.update({ a: "testCtrue" });
                    scope.update({
                        [prop_name]: "testCfalse"
                    });
                    data.should.equal("testA_user_input");
                    DID_RUN = true;
                }
            };
            scope.update({ a: "testAtrue", c: "failed" });
            await sleep(2);
            a.value.should.equal('testAtrue');
            a.value = "testA_user_input";
            a.runEvent("input", { target: a });
            await sleep(2);
            a.value.should.equal('testCtrue');
            DID_RUN.should.be.true;
        });

        it("(()(A)) : Scope data ignored and user input pushed out through binding A", async function() {
            const { scope, ele } = await createComponent(
                "<scope export='b'>" +
                "<input type='text' value=((  )( b )) />" +
                "</scope>"
            ), b = ele.fch;

            var DID_RUN = false;
            b.value = "testBfalse";
            scope.parent = {
                upImport: (prop_name, data, meta) => {
                    prop_name.should.equal("b");
                    scope.update({
                        [prop_name]: "testCfalse"
                    });
                    DID_RUN = true;
                }
            };
            scope.update({ b: "testAtrue", e: "failed" });
            await sleep(1);
            b.value.should.equal('testBfalse');
            b.value = "testCtrue";
            b.runEvent("input", { target: b });
            await sleep(2);
            b.value.should.equal('testCtrue');
            DID_RUN.should.be.true;
        });

        it("((A)) : Scope data received on A and user input pushed out through binding A", async function() {
            const { scope, ele } = await createComponent(
                "<scope export='a'>" +
                "<input type='text' value=(( a )) />" +
                "</scope>"
            ), a = ele.fch;

            var DID_RUN = false;
            a.value = "testBfalse";
            scope.parent = {
                upImport: (prop_name, data, meta) => {
                    prop_name.should.equal("a");
                    data.should.equal("testBfalse");
                    scope.update({
                        [prop_name]: "testCtrue"
                    });
                    DID_RUN = true;
                }
            };
            a.value.should.equal('testBfalse');
            scope.update({ a: "testAtrue", e: "failed" });
            await sleep(1);
            a.value.should.equal('testAtrue');
            a.value = "testBfalse";
            a.runEvent("input", { target: a });
            await sleep(5);
            a.value.should.equal('testCtrue');
            DID_RUN.should.be.true;
        });

        it("((A)(null)) : Scope data received on A and user input ignored", async function() {
            const { scope, ele } = await createComponent(
                "<scope export='a'>" +
                "<input type='text' value=(( a )( null )) />" +
                "</scope>"
            ), a = ele.fch;

            var DID_RUN = false;
            a.value = "testBfalse";
            scope.parent = {
                upImport: (prop_name, data, meta) => {
                    DID_RUN = true;
                }
            };
            a.value.should.equal('testBfalse');
            scope.update({ a: "testAtrue", e: "failed" });
            await sleep(1);
            a.value.should.equal('testAtrue');
            a.value = "testBfalse";
            a.runEvent("input", { target: a });
            await sleep(5);
            DID_RUN.should.be.false;
        });
    });

    it("HTML element should appear in the scoped DOM when an ExpressionIO, piped to a TextIO, yields a HTML object.", async function() {

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

describe("Javascript Parsing", function(){
    it('Detect and parse JS comments', async function(){
        const comp = await wick(`
            
            <scope attrib=((year)) >(( isUser ? "user" : "non-user" ))((name))</scope>

        `).pending.should.not.throw;
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

