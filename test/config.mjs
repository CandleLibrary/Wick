import cfwt from "@candlefw/tests";


(async function start() {

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
            import url from "@candlefw/url";
        `
    })

    //suites
    await cfwt.installSuite("./test/suites.mjs");

    //Tests
    await cfwt.installTest("./test/suite/plugins.mjs");

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
            //global.window = window;
            //global.document = window.document;
            //global.HTMLElement = window.HTMLElement;
            //global.Location = window.Location;
            //global.Element = window.Element;

        },

        afterTest: async () => {
            global.window = null;
            global.document = null;
            global.HTMLElement = null;
            global.Location = null;
            global.Element = null;
        }
    })

    const suite = cfwt.build("wick");

    for (let a in suite) {
        await suite[a].run();
    }
})()
