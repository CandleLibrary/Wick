function CSSTESTS() {

    const test_data =
        `.panel-success > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #d6e9c6;
}
a {
  border-top-color: green;
}`
    describe('wick.core.css', function() {
        it("Parses well formed CSS and returns an object graph of CSS rules", function(done) {
            wick.core.css(test_data).then((og) => {
                let rule = og.getRule("a");
                rule.should.have.property("props");
                rule.props.should.have.property("border_top_color");
                rule.props.border_top_color.toString().should.equal("rgba(0,128,0,1)");
                done();
            }).catch(e => done(e));
        })

        it("Matches rules against elements", function(done) {
            let ele = document.createElement("div");
            ele.innerHTML = `
            <a><a></a>
                <div id="roo" class="bar">
                    <span class="class"></span>
                </div>
            </a>`
            wick.core.css(`
                a+div.bar #roo span.class{font-size:2px; color:green}
                span {color:yellow}
            `).then(og => {
                let span = ele.getElementsByTagName("span")[0];
                let rule = og.getApplicableRules(span);
                rule.props.font_size.should.equal(2);
                rule.props.color.toString().should.equal("rgba(255,255,0,1)");
                done();
            }).catch(e => done(e));
        })

        it("Parses color values", () => wick.core.css(`
            .one{color:rgba(255,255,255,0.5)}
            .two{color:rgb(255,255,255)}
            .three{color:#FFFFFF}
            .four{color:white}
            `).then(css => {
                css.getRule(".one").props.color.toString().should.equal("rgba(255,255,255,0.5)")
                css.getRule(".two").props.color.toString().should.equal("rgba(255,255,255,1)")
                css.getRule(".three").props.color.toString().should.equal("rgba(255,255,255,1)")
                css.getRule(".four").props.color.toString().should.equal("rgba(255,255,255,1)")
        }))

        describe("Handles @media", function() {
            it("@media screen and (min-height : 200px)", function(done) {
                let ele = document.createElement("div");
                ele.innerHTML = `<a><a></a>
                <div id="roo" class="bar">
                    <span class="class"></span>
                </div>
            </a>`

                wick.core.css("@media screen and (min-height : 200px) { a+div.bar #roo span.class{font-size:2px; color:green} }")
                    .then((og) => {
                        let os = og.getMedia(); //Get Media that applies to the current window state.
                        let span = ele.getElementsByTagName("span")[0];
                        let rule = os.getApplicableRules(span);
                        rule.props.should.have.property("color");
                        rule.props.should.have.property("font_size");
                        rule.props.color.toString().should.equal("rgba(0,128,0,1)")
                        rule.props.font_size.should.equal(2);
                        done();
                    }).catch(e => done(e));
            })
        })

        describe("Handles @import", function() {
            it("@import url(\"/test/data/import.css\")", function(done) {
                this.timeout(5000);

                wick.core.css(`@import url("/test/data/import.css"); a{font-size:2px}`)
                    .then((og) => {
                        let ele = document.createElement("div");
                        ele.innerHTML = `<a></a>`;
                        let rule = og.getApplicableRules(ele.getElementsByTagName("a")[0]);
                        rule.props.font_size.should.equal(2);
                        rule.props.color.toString().should.equal("rgba(255,255,0,1)")
                        done()
                    }).catch(e => done(e));
            })
        })
    });
}

if (typeof module !== "undefined") module.exports = CSSTESTS;