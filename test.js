
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
                    
                describe("container", ()=>{
                    
                    
                    
                    
                    
                describe("scrubbing", ()=>{
                    
                    
                    
                    
                    it("Allows scrubbing of elements within a container", async function() {
            this.slow(5000);
            this.timeout(12000);
            let component = await wick("/test/data/scrubbing.js", wick.presets());

            let ele = document.createElement("div");
            let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
            const container = mgr.sources[0].containers[0];
            await pause(120)

            container.offset.should.equal(1);
            (container.activeSources.map(e => e.sources[0].test_value))[1].should.equal(0);


            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
            container.scrub(-0.5)
            pause(50)
            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
            container.scrub(-0.48)
            pause(50)
            console.log(container.offset, container.offset_fractional, container.activeSources.map(e => e.sources[0].test_value))
        });it("Jumping to random points keep components in expected places.", async () => {
            let component = await wick("/test/data/scrubbing.js", wick.presets());
            let ele = document.createElement("div");
            let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
            const container = mgr.sources[0].containers[0];

            //Start a prefixed place
            mgr.update({ offset: 4 })


        });it("Jumping to random points keep components in expected places.");;
                });;
                });;
                });