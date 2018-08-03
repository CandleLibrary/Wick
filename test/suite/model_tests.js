function MODELTESTS(config) {
    let scheduler = wick.internals.scheduler;
    describe('wick.model', function() {
        it("Allows watchers to attach receive update on change events", function() {
            let model = wick.model({
                id: 0,
                name: "bob",
                nationality: "canadian"
            });

            model.nationality.should.equal("canadian");


            let listener = {
                _update_: (data) => {
                    data.name.should.equal("bob");
                }
            };

            model.addListener(listener);
        });

        it("Can Create copies that reference the same listeners to allow for immutable usage", function() {
            let model = wick.model({
                id: 0,
                name: "bob",
                nationality: "Canadian"
            });

            model.nationality.should.equal("Canadian");

            let listener = {
                _update_: (data) => {
                    data.name.should.equal("bob");
                }
            };

            model.addListener(listener);


            scheduler._update_();

            let clone = model.clone();

            clone.name = "mark";

            listener._update_ = (data) => {
                data.name.should.equal('mark');
            };

            scheduler._update_();

            model.name.should.equal("bob");
        });

        it("Allows Composition of multiple models", function(done) {
            let modelA = wick.model({
                name: "deniki",
                nationality: "Zimbabwe"
            });
            let modelB = wick.model({
                user: modelA
            });

            //let store = wick.store(modelB);

            modelB.set({
                user: {
                    nationality: "Japanese"
                }
            });

            scheduler._update_();

            let listener = {
                _update_: (data) => data.user.nationality.should.equal("Japanese")
            };

            modelB.addListener(listener);

            modelA.nationality.should.equal("Japanese");

            scheduler._update_();

            listener._update_ = (data) => data.user.nationality.should.equal("Bermudian");

            scheduler._update_();

            modelA.nationality = "Bermudian";

            done();
        });

        it("Can create immutable data structures", function() {
            let users = [{ key: "name" }, { name: "bob", access_level: 1 }, { name: "sue", access_level: 8 }, { name: "yulia", access_level: 3 }];
            let model = wick.model({ number_of_users: 3, users });

            let new_model = model.seal();

            new_model.set({ users: { name: "bob", access_level: 9001 } });
            model.users.proxy.bob.access_level.should.equal(1);
            new_model.users.proxy.bob.access_level.should.equal(9001);
            new_model.users.proxy.sue.access_level.should.equal(8);
            new_model.users.proxy.yulia.access_level.should.equal(3);
            model.should.not.equal(new_model);

            let new_model2 = new_model.seal();
            new_model2.set({ users: { name: "yulia", access_level: 9001 } });

            new_model.users.proxy.bob.access_level.should.equal(9001);
            new_model.users.proxy.yulia.access_level.should.equal(3);

            new_model2.users.proxy.bob.access_level.should.equal(9001);
            new_model2.users.proxy.yulia.access_level.should.equal(9001);

            new_model2.set({ users: { name: "yulia", access_level: 20 } });
            new_model2.users.proxy.yulia.access_level.should.equal(20);

        });

        it("Store structure allows leaf imutability", function() {

            let users = [{ key: "name" }, { name: "bob", access_level: 1 }, { name: "sue", access_level: 8 }, { name: "yulia", access_level: 3 }];

            let store = wick.model.store({ number_of_users: 3, users });

            let bob = store.current.users.proxy.bob;

            let new_bob = bob.seal();

            new_bob.set({ access_level: 20 });

            store.current.users.proxy.bob.access_level.should.equal(20);

            store.getHistory(0).users.proxy.bob.access_level.should.equal(1);
        });

        it("Schemed properties can be created", function() {
            let user = wick.model({ name: "tommy", food: { type: "macaroon", common_name: 1122 } }, {
                name: wick.scheme.string,
                birthday: wick.scheme.date,
                food: wick.model({}, {
                    type: wick.scheme.string,
                    common_name: wick.scheme.string
                }),
            });

            user.food.type.should.equal("macaroon");
            user.food.common_name.should.equal("1122");

            user.name = 1234;
            user.name.should.equal("1234");

            user.birthday = "August 13, 1989";
            user.birthday.should.equal(618991200000);
        });

        it("Allows hook functions to be defined to provide mechanisms for server storage", function(done) {
            let User = wick.model.scheme({
                name: wick.scheme.string,
                age: wick.scheme.number,
                birthdate: wick.scheme.date,
            });

            User.prototype.LOADED = false;

            User.prototype.getHook = function(prop_name, data) {
                if (!this.LOADED) {

                    (new wick.core.network.url("/test/data/user.json"))

                    .fetchText().then(txt => {

                        if (this.LOADED) return;

                        this.LOADED = true;

                        let data = JSON.parse(txt);

                        this.set(data);
                    });
                }
                return data;
            };

            let view = new wick.core.view();

            view._update_ = function(data) {
                if (data.age) {
                    data.age.should.equal(25);
                    data.name.should.equal("tom");
                    data.birthdate.should.equal(747468000000);
                    done();
                }
            };

            let user = new User();

            user.addView(view);

            let name = user.name;
        });
    });

    if (config.PERFORMANCE) {


        describe("Model Performance Test Suite", function() {
            this.slow(100000000);

            const suite = new benchmark.Suite();

            let modelA = wick.model_old;
            let modelB = wick.model;
            let scheduler = wick.internals.scheduler;

            let factoryA = function(model_factory) {

                let view = new wick.core.view();

                view.age = 0;

                view.deferred = null;

                view._update_ = function(model) {
                    this.age = model.age;
                    this.deferred.resolve();
                };

                return function(deferred) {
                    let model = model_factory({ name: "tom", age: 77, weight: 8 });
                    model.addView(view);
                    view.deferred = deferred;
                    model.proxy.age = Math.random();

                    scheduler._update_();
                    scheduler._update_();
                    scheduler._update_();
                };
            };

            it("Model creation and updating on a shared view.", function(done) {

                this.timeout(500000);

                suite

                    .add("Original Model", { defer: true, fn: factoryA(modelA) })

                    .add("Revised Model", { defer: true, fn: factoryA(modelB) })

                    .on("cycle", function(event) {
                        if (config.BROWSER) {
                            let li = document.createElement("li");
                            li.innerHTML = `<ul><li class="test" style="text-align:right"><h2>${(event.target)}</h2></li></ul>`;
                            document.getElementById("mocha-report").appendChild(li);
                        } else
                            console.log(event.target + "");
                    })
                    .on(`complete`, function() {
                        done();
                    })
                    .run({
                        'async': false
                    });
            });
        });
    }
}

if (typeof module !== "undefined") module.exports = MODELTESTS;