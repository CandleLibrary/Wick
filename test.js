
            import chai from "chai";
            import jsd from "jsdom";
            const JSDOM =  jsd.JSDOM;
            chai.should();
        import wick from "./source/wick.mjs";import vue from "vue";
            import url from "@candlefw/url";
        
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
            //global.window = window;
            //global.document = window.document;
            //global.HTMLElement = window.HTMLElement;
            //global.Location = window.Location;
            //global.Element = window.Element;

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
            //global.window = window;
            //global.document = window.document;
            //global.HTMLElement = window.HTMLElement;
            //global.Location = window.Location;
            //global.Element = window.Element;

        });
                    
                describe("plugin", ()=>{
                    
                    
                    
                    
                    it("Can specify special handlers that insert 3rd party components into the compiled tree based on tag:VUE", async ()=>{
		let PLUGIN_ACTIVATED = false;

		//First install the plugin
		wick.plugin("tagHandler", "vue", async (HTMLnode)=>{
			//Wick expects a node object returned that can be inserted into the existing compiled tree.
			//To that end, it provides a url to the anticipated resource and a prebuilt HTMLNode object that can have it's build function reassigned
			//To a function that the library can inject it's own code into.
			PLUGIN_ACTIVATED = true;

			if(!HTMLnode)
				throw new Error("Should have a innerNode tree here");


			HTMLnode.build = function(element){
				let e = document.createElement("head")
				this.element = e;
				element.appendChild(e);
			}

			HTMLnode.render = function(){

			}



			
		})
		wick.polyfill();
		url.simulate();
		url.addResource("vue.js", "Test");
		let component = await wick(`
			<div>
				<vue>
					<div id="app">
						{{ message }}
					</div>
				</vue>
			</div>`)

		console.log((await component.toString()).toString())



		PLUGIN_ACTIVATED.should.equal(true);
	});it("Can specify handlers that replace elements of particular tags with 3rd party compononents:VUE", async ()=>{
		
		//Create a vue plugin and test whether it integrates into DOM.
		
		// First arg is the plugin selector,
		// Second arg a list of files or folders to respond to
		
		wick.plugin("install3rdPartyComponentTag", ["./test/vue/"], (fetchedData, node)=>{
			//return DOM node.
			node.build = function(model, presets){
				
			}
		})
	});;
                });;
                });