
            import chai from "chai";
            import jsd from "jsdom";
            const JSDOM =  jsd.JSDOM;
            chai.should();
        import wick from "./source/wick.mjs";
            import url from "@candlefw/url";
        
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
                    
                describe("element", ()=>{
                    
                    
                    
                    
                    
                describe("merging", ()=>{
                    
                    
                    
                    
                    it("Merging elements pulls statics from the merged-from tag", async()=>{
        let presets = wick.presets();
        await wick(`<w-s component="mergedto" #temp=false >test<w-s>`, presets);
        let comp = await wick(`<div><mergedto #temp=true>test false</mergedto></div>`, presets);
        let ele = document.createElement("div");
        let component = comp.mount(ele);
        console.log(component.sources[0])
        component.sources[0].sources[0].statics.should.have.property("temp", "true");
    });;
                });;
                });;
                });