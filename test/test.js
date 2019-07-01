import chai from "chai";

import wick from "../source/wick.js";

import { IOBase } from "../source/compiler/component/io/io.js"

import html from "@candlefw/html"

import url from "@candlefw/url"


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
    })
}
console.log("----------------------------------------------------START----------------------------------------------------")

function* recurseIO(io) {
    if (io.ele instanceof IOBase)
        yield* recurseIO(io.ele);
    else yield io;
}

describe("Binding Methods", function() {


    it("HTML expression element binding should appear in DOM when expression yields the HTML object", async function() {

        const comp = await wick(`
            
            <scope>(( isUser ? <a href="test">((name))</a> : "non-user" ))</scope>

        `).pending;

        let mount = new HTMLElement();

        mount.tag = "div";

        const scope = await comp.mount(mount);

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);

        scope.update({ isUser: false, name: "Douglas Adams" });
        await sleep(1)

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);
        scope.ele.children[0].data.should.equal("non-user");

        scope.update({ isUser: true, name: "Douglas Adams" });
        await sleep(2)

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(HTMLElement);
        scope.ele.children[0].tagName.should.equal("A");

        const element = scope.ele.children[0].children[0];

        scope.update({ isUser: false, name: "Douglas Adams" });
        await sleep(1)

        scope.ele.children.should.have.lengthOf(1);
        scope.ele.children[0].should.be.instanceof(Text);
        scope.ele.children[0].data.should.equal("non-user");

        //scan the scopes ios and see if the old element is still referenced
        for (const tap of scope.taps.values())
            for (const io of tap.ios)
                for (const result of recurseIO(io)) {
                    console.log(result.ele , element)
                    if (io.ele === element)
                        throw "Discarded element has not been removed";
                }
    })
})