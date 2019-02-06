import URL from "@candlefw/url";
import spark from "@candlefw/spark";
import wick from "../../source/wick";

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

            var Any = wick.model.any({
                page_count: 34500,
                page_number: 0,
                value: "Toco Mako!!",
                time: "8pm",
                date: 0,
                style: 0,
                name: "schmoolie",
                age: 0,

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
                    source.HAVE_ERRORS.should.equal(false);
                    Any.name = "Chesapeak McGee";
                    Any.set({age:22});
                    //Need to wait for update cycle
                    spark.update();
                    ele.children[0].innerHTML.should.equal("Chesapeak McGee");
                    ele.children[1].innerHTML.should.equal("22");
                    Any.age = 44;
                    spark.update();
                    spark.update();
                    spark.update();
                    spark.update();
                    spark.update();
                    ele.children[1].innerHTML.should.equal("44");
                    return true;
                })));
            
            it('Creates bindings based on JavaScript expressions.',
                () => (new URL("/test/data/expression.html")).fetchText()
                .then(text => wick.source(text, wick.core.presets({}), true).then(source => {
                    let ele = document.createElement("div");
                    source.mount(ele, Any, false);
                    ele.children.should.have.lengthOf(2);
                    source.HAVE_ERRORS.should.equal(false);
                    appendToDocumentBody(ele);
                    Any.age = 38;
                    Any.name = "Makimbo";
                    spark.update();
                    spark.update();
                    spark.update();
                    spark.update();

                    ele.children[0].innerHTML.should.equal("Makimbo:38");
                    ele.children[1].innerHTML.should.equal("Youngin");
                    Any.age = 89;
                    spark.update();
                    spark.update();
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
                    source.HAVE_ERRORS.should.equal(false);
                    appendToDocumentBody(ele);
                    let children = ele.firstElementChild.children;
                    let choiceA = children[1];
                    let choiceB = children[2];
                    let choiceC = children[3];
                    choiceA.innerHTML.should.equal("Rock");
                    choiceB.innerHTML.should.equal("Paper");
                    choiceC.innerHTML.should.equal("Scissors");
                    choiceA.click();
                    spark.update();
                    spark.update();
                    children[4].innerHTML.should.equal("Rock");
                    children[0].innerHTML.should.equal("Your choice is: Rock!");
                    choiceB.click();
                    spark.update();
                    spark.update();
                    children[4].innerHTML.should.equal("Paper");
                    children[0].innerHTML.should.equal("Your choice is: Paper!");
                    choiceC.click();
                    spark.update();
                    spark.update();
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
                    source.HAVE_ERRORS.should.equal(false);
                    ele.children.should.have.lengthOf(1);
                    ele.children[0].children.should.have.lengthOf(2);
                    let container = ele.children[0];
                    spark.update();
                    spark.update();
                    container.children.should.have.lengthOf(2);
                    let childA = container.children[0];
                    let childB = container.children[1];
                    childA.innerHTML.should.equal("Doug is a young person whose age is 18.");
                    childB.innerHTML.should.equal("Carly is an old person whose age is 256.");
                    spark.update();
                    spark.update();
                    
                    Any.users.set({
                        name: "Chevy",
                        age: 13
                    });
                    spark.update();
                    spark.update();
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
                    spark.update();
                    spark.update();
                    spark.update();
                    st.children.should.have.lengthOf(1);
                    st.children[0].innerHTML.should.equal("Carly is an old person whose age is 256.");
                    manager.emit("filter", "");
                    spark.update();
                    spark.update();
                    spark.update();
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
                    source.HAVE_ERRORS.should.equal(false);
                    ele.children.should.have.lengthOf(1);
                    ele.children[0].children.should.have.lengthOf(3);
                    let container = ele.children[0];
                    container.tagName.should.equal("FORM");
                    container.children[0].tagName.should.equal("INPUT");
                    let input = container.children[0];
                    input.value.should.equal(Any.name);
                    Any.name = "Silverston McGraw";
                    spark.update();
                    spark.update();

                }))
            );

            it('Imports Partial and Complete components from page and from network',
                async () => {
                    let presets = { components: {} };
                    (new URL("/test/data/markopolo.html")).fetchText()
                        .then(text => wick.source(text, presets, true).then(source1 => {
                            return (new URL("/test/data/template.html")).fetchText()
                                .then(text => wick.source(text, presets, true).then(source => {
                                    let ele = document.createElement("div");
                                    source.mount(ele, Any, false);
                                    source.HAVE_ERRORS.should.equal(false);
                                    appendToDocumentBody(ele);
                                    ele.children.should.have.lengthOf(3);
                                    let c = ele.children;
                                    c[0].children.should.have.lengthOf(2);
                                    ele.children.should.have.lengthOf(3);

                                }));
                        }));
                });
            it.only('Allows slots to be defined in components and passes element data to the slot from a host component',
                async () => {
                    let presets = { components: {} };

                    let utf_data = await (new URL("/test/data/slot_a.html")).fetchText();
                    
                    let source_package = await wick.source(utf_data, presets, true);

                    let ele = document.createElement("div");

                    source_package.mount(ele, {}, false);
                    
                    source_package.HAVE_ERRORS.should.equal(false);
                    
                    appendToDocumentBody(ele);

                    let component = ele.children[0];

                    component.children.should.have.lengthOf(2);

                    component.tagName.should.equal("DIV")

                    component.children[0].tagName.should.equal("DIV")

                    component.children[0].innerHTML.should.equal("This should be inside the component.")

                    component.children[1].tagName.should.equal("SPAN")

                    component.children[1].innerHTML.should.equal("This should also be inside the component.")
                });
        });
    });
}

if (typeof module !== "undefined") module.exports = SOURCEPACKAGETESTS;