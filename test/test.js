import chai from "chai";

import wick from "../source/wick.mjs";

import html from "@candlefw/html"

import url from "@candlefw/url"


chai.should();

function loadPolyFill() {
    global.window = {};
    html.polyfill();
    url.polyfill();
}

loadPolyFill();

async function sleep(time){
    return new Promise(res=>{
        setTimeout(res,time || 1);
    })
}



describe("Binding Methods", function() {

    it("HTML expression element binding should appear in DOM when expression yields the HTML object", async function() {

        const comp = await wick(`<scope>
            (( tree && <a href="test"> ((gravy))</a> ))
        </scope>`).pending;

        let mount = new HTMLElement();

        const scope = await comp.mount(mount);
        
        console.log(mount + "")

        scope.update({tree:true, gravy:"cool"});

        await sleep(1000)


        scope.update({tree:true, gravy:"cool"});

        console.log(mount + "")
        
        scope.ele.children.should.have.lengthOf(0);

        scope.ele.children.should.have.lengthOf(1)

    })
})