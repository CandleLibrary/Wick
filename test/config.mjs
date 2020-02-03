import cfwt from "@candlefw/tests";


(async function start() {
    //Testing turned off for alpha release
    
    //return;

    //Libraries
    cfwt.installLibrary({
        priority: 0,
        name: "wick",
        install: () => "import wick from \"./source/wick.mjs\";"
    }, {
        priority: 0,
        name: "vue",
        install: () => "import vue from \"vue\";"
    },{
        priority: 0,
        name: "url",
        install: () => `
            import url from "@candlefw/url"; url.polyfill();
        `
    },{
        priority: 0,
        name: "spark",
        install: () => `
            import spark from "@candlefw/spark";
        `
    },{
        priority: 0,
        name: "pause",
        install: () => `
            async function pause(time = 1000){
            	return new Promise(res=>{
            		setTimeout(res, time)
            	})
            };
        `
    })

    //suites
    await cfwt.installSuite("./test/suites.mjs");

    //groups
    cfwt.installGroup({
        name: "mocha.chai.jsdom:wick",
        beforeTest: async () => {
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

        },

        afterTest: async () => {
            global.window = null;
            global.document = null;
            global.HTMLElement = null;
            global.Location = null;
            global.Element = null;
        }
    })


    //Tests
    await cfwt.installTest("./test/suite/basic.mjs");
    //await cfwt.installTest("./test/suite/plugins.mjs");
    //await cfwt.installTest("./test/suite/model.mjs");
    //await cfwt.installTest("./test/suite/scrubbing.mjs");
    //await cfwt.installTest("./test/suite/merging.mjs");

    const suite = cfwt.build("wick.basic");
    console.log(suite)

    for (let a in suite) {
        await suite[a].run();
    }
})()
