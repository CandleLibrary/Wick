import chai from "chai";

import wick from "../source/wick.mjs";

import html from "@candlefw/html"


chai.should();

function loadPolyFill() {
    html.polyfill();
}

loadPolyFill();


describe("Binding Methods", function() {

    it("HTML expression element binding should appear in DOM when expression yields the HTML object", async function() {

        const comp = await wick(`<scope>
            (( tree && <a href="test"> my test</a> ))
        </scope>`).pending;

        let mount = new HTMLElement();

        const scope = comp.mount(mount);
        
        console.dir(mount, {depth:null});

        mount.children[0].children[0].should.have.lengthof(0);

        scope.update({tree:true});

        mount.children[0].children[0].should.have.lengthof(1)

    })
})