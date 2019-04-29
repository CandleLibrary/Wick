
            import chai from "chai";
            import jsd from "jsdom";
            const JSDOM =  jsd.JSDOM;
            chai.should();
        import wick from "./source/wick.mjs";import vue from "vue";
            import url from "@candlefw/url"; url.polyfill();
        
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
                    
                describe("error", ()=>{
                    
                    
                    
                    
                    it("Generates errors", async () => {
        const
            comp = await wick(`<scope><script on=((mounted))> test.dm = 2 </script> </scope>`),
            ele = document.createElement("div"),
            mgr = comp.mount(ele);
    });;
                });;
                });