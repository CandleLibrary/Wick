
            import chai from "chai";
            import jsd from "jsdom";
            const JSDOM =  jsd.JSDOM;
            chai.should();
        import wick from "./source/wick.mjs";
            import url from "@candlefw/url"; url.polyfill();
        
            async function pause(time = 1000){
            	return new Promise(res=>{
            		setTimeout(res, time)
            	})
            };
        
                describe("wick", ()=>{
                    
                    
                    beforeEach(async () => {
            const DOM = new JSDOM(`
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

            const window = DOM.window;
            global.window = window;
            global.document = window.document;
            global.HTMLElement = window.HTMLElement;
            global.Location = window.Location;
            global.Element = window.Element;

        });
                    afterEach(async () => {
            global.window = null;
            global.document = null;
            global.HTMLElement = null;
            global.Location = null;
            global.Element = null;
        });
                    
                describe("container", ()=>{
                    
                    
                    
                    
                    
                describe("scrubbing", ()=>{
                    
                    
                    
                    
                    it("Introducing new offset and set of elements does not visually change elements order.", async function () {
            this.slow(200000)
            this.timeout(10000)

            const 
                component = await wick("/test/data/scrubbing2.js", wick.presets()),
                ele = document.createElement("div"),
                mgr = component.mount(ele),
                src = mgr.scopes[0],
                sc = src.containers[0];
                await pause(16);
                //Add incremental scrubs that add up to 5
                const 
                    amount = 0.05, 
                    limit = Math.floor(6.5 / amount);

                for(let i = 0; i < limit; i++){
                    src.update({scrub:amount})
                    await pause(5); //Pausing for one frame in a 60f/1s mode. 
                }

                src.update({scrub:Infinity})

                await pause(200)

                console.log(sc.activeScopes.map(e=>e.scopes[0].model))
                sc.activeScopes.map((m,i)=>({ index:i, top: m.scopes[0]._top, off:m.scopes[0].model.data}))[11].off.should.equal(17);

             
        });it("Jumping to random points keep components in expected places.");;
                });;
                });
                describe("element", ()=>{
                    
                    
                    
                    
                    
                describe("merging", ()=>{
                    
                    
                    
                    
                    it("Merging elements pulls statics from the merged-from tag", async () => {
        let presets = wick.presets();
        await wick(`<w-s component="mergedto" #temp=false >test<w-s>`, presets);
        let comp = await wick(`<div><mergedto #temp=true>test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);

        component.scopes[0].scopes[0].statics.should.have.property("temp", "true");
    });it("Merging pulls attribute data from both merging-component and merged-element. Merged elements attributes are preferred", async () => {
        let presets = wick.presets();
        await wick(`<w-s element="div" component="mergedto" temp="false" foo="biz">test<w-s>`, presets);
        let comp = await wick(`<div><mergedto temp="true" bar="buz">test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);
        let sub_ele = ele.firstChild.firstChild;
        sub_ele.getAttribute("temp").should.equal("true");
        sub_ele.getAttribute("foo").should.equal("biz");
        sub_ele.getAttribute("bar").should.equal("buz");
    });;
                });;
                });;
                });