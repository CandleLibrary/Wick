
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

        let presets = wick.presets();

        await wick({
            dom: "<w-s component=\"scrubbing\">Test((data))</w-s>",
            $trs_in_up: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_in_up.trs({
                    obj: this,
                    test_value: [
                        { value: -50 },
                        {
                            value: 0,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_in_dn: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_in_dn.trs({
                    obj: this,
                    test_value: [
                        { value: 50 },
                        {
                            value: 0,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_out_up: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_out_up.trs({
                    obj: this,
                    test_value: [
                        { value: 0 },
                        {
                            value: 50,
                            duration: 20
                        }
                    ]
                });
            },
            $trs_out_dn: () => {
            	if(typeof(this.test_value) == "undefined")
            		this.test_value = 0;
                trs_out_dn.trs({
                    obj: this,
                    test_value: [
                        { value: 0 },
                        {
                            value: -50,
                            duration: 20
                        }
                    ]
                });
            }
        }, presets)

        let component = (await wick({
            dom: ` <w-s component="test">
    <w-c>
        ((data)) 
        <f limit="1">
        <f offset="1">
        <f shift="1">
        <f sort=((m1.data < m2.data ? -1 : 1))>
        <scrubbing> </scrubbing>
    </w-c>
</w-s>`
        }, presets));

        let ele = document.createElement("div");
        let mgr = component.mount(ele, { data: [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }, { data: 7 }, { data: 8 }] });
        const container = mgr.sources[0].containers[0];
 
        console.log(container.activeSources.map(e=>e.sources[0].test_value))
        await pause(120)
        
        container.offset.should.equal(1);
        (container.activeSources.map(e=>e.sources[0].test_value))[1].should.equal(0);

        
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))
        container.scrub(-0.5)
        pause(50)
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))
        container.scrub(-0.48)
        pause(50)
        console.log(container.offset, container.offset_fractional, container.activeSources.map(e=>e.sources[0].test_value))


    });;
                });;
                });;
                });