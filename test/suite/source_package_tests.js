import URL from "@candlefw/url";

function SOURCEPACKAGETESTS(config) {

    function appendToDocumentBody(ele) {
        if (config.BROWSER) {
            let wrap = document.createElement("h2");
            wrap.style.right = "0px";
            wrap.appendChild(ele);
            document.getElementById("mocha-report").appendChild(wrap);
        } else
            document.body.appendChild(ele);
    }
    let element = document.createElement("div");
    describe('wick.source', function() {

        before(() =>
            (new URL("/test/data/package.html"))
            .fetchText().then(text => {
                element.innerHTML = text;
            }));

        describe("Construction of Sources", function() {

            let scheduler = wick.internals.scheduler;

            var Any = wick.model.any({
                page_count: 34500,
                page_number: 0,
                value: "Toco Mako!!",
                time: "8pm",
                date: 0,
                style: 0,
                name: "schmoolie",

                users: [{
                    name: "Doug",
                    age: 18
                }, {
                    name: "Carly",
                    age: 256
                }]
            });
            

            it('Constructs a SourcePackage with Model bindings on properly formatted HTML',
                () => (new URL("/test/data/package.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    //appendToDocumentBody(ele);
                    ele.children.should.have.lengthOf(2);
                    source._HAVE_ERRORS_.should.equal(false);
                    Any.name = "Chesapeak McGee";
                    Any.set({age:22});
                    //Need to wait for update cycle
                    scheduler.update();
                    ele.children[0].innerHTML.should.equal("Chesapeak McGee");
                    ele.children[1].innerHTML.should.equal("22");
                    Any.age = 44;
                    scheduler.update();
                    scheduler.update();
                    scheduler.update();
                    scheduler.update();
                    scheduler.update();
                    ele.children[1].innerHTML.should.equal("44");
                    return true;
                })));
            
            it('Creates bindings based on JavaScript expressions.',
                () => (new URL("/test/data/expression.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    ele.children.should.have.lengthOf(2);
                    source._HAVE_ERRORS_.should.equal(false);
                    appendToDocumentBody(ele);
                    Any.name = "Makimbo";
                    Any.age = 38;
                    scheduler.update();
                    scheduler.update();
                    ele.children[0].innerHTML.should.equal("Makimbo:38");
                    ele.children[1].innerHTML.should.equal("Youngin");
                    Any.age = 89;
                    scheduler.update();
                    scheduler.update();
                    ele.children[1].innerHTML.should.equal("Elder");
                    return true;
                }))
            );

            it('Creates bindings that can send messages.',
                () => (new URL("/test/data/messaging.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    ele.children.should.have.lengthOf(1);
                    ele.firstElementChild.children.should.have.lengthOf(5);
                    source._HAVE_ERRORS_.should.equal(false);
                    appendToDocumentBody(ele);
                    let children = ele.firstElementChild.children;
                    let choiceA = children[1];
                    let choiceB = children[2];
                    let choiceC = children[3];
                    choiceA.innerHTML.should.equal("Rock");
                    choiceB.innerHTML.should.equal("Paper");
                    choiceC.innerHTML.should.equal("Scissors");
                    choiceA.click();
                    scheduler.update();
                    scheduler.update();
                    children[4].innerHTML.should.equal("Rock");
                    children[0].innerHTML.should.equal("Your choice is: Rock!");
                    choiceB.click();
                    scheduler.update();
                    scheduler.update();
                    children[4].innerHTML.should.equal("Paper");
                    children[0].innerHTML.should.equal("Your choice is: Paper!");
                    choiceC.click();
                    scheduler.update();
                    scheduler.update();
                    children[4].innerHTML.should.equal("Scissors");
                    children[0].innerHTML.should.equal("Your choice is: Scissors!");
                    return true;
                }))
            );

            it('Creates SourceTemplates that can bind to Models stored in containers.',
                () => (new URL("/test/data/source_template.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    appendToDocumentBody(ele);
                    source._HAVE_ERRORS_.should.equal(false);
                    ele.children.should.have.lengthOf(1);
                    ele.children[0].children.should.have.lengthOf(2);
                    let container = ele.children[0];
                    scheduler.update();
                    scheduler.update();
                    container.children.should.have.lengthOf(2);
                    let childA = container.children[0];
                    let childB = container.children[1];
                    childA.innerHTML.should.equal("Doug is a young person whose age is 18.");
                    childB.innerHTML.should.equal("Carly is an old person whose age is 256.");
                    scheduler.update();
                    scheduler.update();
                    
                    Any.users.set({
                        name: "Chevy",
                        age: 13
                    });
                    scheduler.update();
                    scheduler.update();
                    let childC = container.children[2];
                    childC.innerHTML.should.equal("Chevy is a young person whose age is 13.");
                    return true;
                }))
            );

            it('Filters and sorts SourceTemplate elements.',
                () => (new URL("/test/data/source_template_sort_and_filter.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    var manager = source.mount(ele, Any, false);
                    appendToDocumentBody(ele);
                    let st = ele.children[0].children[1]
                    let input = ele.children[0].children[0];
                    input.tagName.should.equal("INPUT");
                    st.tagName.should.equal("UL");
                    st.children.should.have.lengthOf(3);
                    manager.emit("filter", "Carly");
                    scheduler.update();
                    scheduler.update();
                    scheduler.update();
                    st.children.should.have.lengthOf(1);
                    st.children[0].innerHTML.should.equal("Carly is an old person whose age is 256.");
                    manager.emit("filter", "");
                    scheduler.update();
                    scheduler.update();
                    scheduler.update();
                    st.children.should.have.lengthOf(3);


                }))
            );

            it.skip('Adds transitions effects to SourceTemplate elements.',
                () => (new URL("/test/data/source_template_transition.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    t.slow(10000);
                    t.timeout(10000)
                    Any.users.push({
                        name: "Mason",
                        age: 98
                    });
                    Any.users.push({
                        name: "Drank",
                        age: 27
                    });
                    Any.users.push({
                        name: "Caleb",
                        age: 55
                    });
                    Any.users.push({
                        name: "Mable",
                        age: 13
                    });

                    let ele = document.createElement("div");
                    let manager = source.mount(ele, Any, false);
                    appendToDocumentBody(ele);
                    let st = ele.children[0].children[1];
                    st.children.should.have.lengthOf(7);
                    manager.emit("filter", "Carly");
                    st.children.should.have.lengthOf(7);
                    return new Promise(res => {
                        setTimeout(() => {
                            st.children.should.have.lengthOf(1);
                            manager.emit("filter", "D");
                            res(new Promise(res => {
                                setTimeout(() => {
                                    st.children.should.have.lengthOf(2);
                                    manager.emit("filter", "");
                                    res();
                                }, 1000);
                            }));
                        }, 1000);
                    });
                }))
            );

            it('Binds messaging to input elements.',
                () => (new URL("/test/data/form.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    appendToDocumentBody(ele);
                    source._HAVE_ERRORS_.should.equal(false);
                    ele.children.should.have.lengthOf(1);
                    ele.children[0].children.should.have.lengthOf(3);
                    let container = ele.children[0];
                    container.tagName.should.equal("FORM");
                    container.children[0].tagName.should.equal("INPUT");
                    let input = container.children[0];
                    input.value.should.equal(Any.name);
                    Any.name = "Silverston McGraw";
                    scheduler.update();
                    scheduler.update();

                }))
            );

            it('Imports Partial and Complete components from page and from network',
                () => {
                    let presets = { components: {} };
                    (new URL("/test/data/markopolo.html")).fetchText()
                        .then(text => wick.source(text, presets, true).then(source1 => {
                            return (new URL("/test/data/template.html")).fetchText()
                                .then(text => wick.source(text, presets, true).then(source => {
                                    let ele = document.createElement("div");
                                    source.mount(ele, Any, false);
                                    source._HAVE_ERRORS_.should.equal(false);
                                    appendToDocumentBody(ele);
                                    ele.children.should.have.lengthOf(3);
                                    let c = ele.children;
                                    c[0].children.should.have.lengthOf(2);
                                    ele.children.should.have.lengthOf(3);

                                }));
                        }));
                });
        });
    });

    if (config.PERFORMANCE) {

        describe("Source Performance Test Suite", function() {
            this.slow(100000000);
            this.timeout(500000);
            let element = "";

            before(() => (new URL("/test/data/performance.html")).fetchText().then(text => {
                element = text;
            }).catch((e) => console.throw(e)));

            const suite = new benchmark.Suite;
            const number_of_elements = 100;
            it(`Compares Build Every Component from Scratch vs Precompiling with SourcePackage: ${number_of_elements} components per cycle`, function(done) {
                this.timeout(500000);
                suite.add("Scratch", {
                    defer: true,
                    fn: function(deferred) {
                        let Any = wick.model.any({});
                        let constructing_template = element;
                        let count_down = number_of_elements;
                        let element1 = document.createElement("div");
                        for (var i = 0; i < number_of_elements; i++) {
                            wick.source(constructing_template, wick.core.presets({}), element, true).then((source) => {
                                let element = document.createElement("div");
                                let manager = source.mount(element, Any, false);
                                element1.appendChild(element);

                                if (--count_down < 1)
                                    deferred.resolve();
                            });
                        }
                    }
                }).add("Precompiling", {
                    defer: true,
                    fn: function(deferred) {
                        let Any = wick.model.any({});
                        let constructing_template = element;
                        let element1 = document.createElement("div");
                        wick.source(constructing_template, wick.core.presets({}), element, true).then((source) => {
                            for (var i = 0; i < number_of_elements; i++) {
                                let element = document.createElement("div");
                                let manager = source.mount(element, Any, false);
                                element1.appendChild(element);
                            }
                            deferred.resolve();
                        });
                    }
                }).on("start", function(event) {}).on("cycle", function(event) {
                    if (config.BROWSER) {
                        let li = document.createElement("li");
                        li.innerHTML = `<ul><li class="test" style="text-align:right"><h2>${(event.target)}</h2></li></ul>`;
                        document.getElementById("mocha-report").appendChild(li)
                    } else
                        console.log(event.target + "")
                }).on(`complete`, function() {
                    //console.log(this);
                    //console.log()
                    done();
                }).run({
                    'async': false
                });
            });
        });
    }

}

if (typeof module !== "undefined") module.exports = SOURCEPACKAGETESTS;