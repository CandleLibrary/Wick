import URL from "@candlefw/url";
import spark from "@candlefw/spark";
import wick from "../../source/wick";

function MODELTESTS(config) {
    
    describe('wick.model', function() {
        it("Allows watchers to attach receive update on change events", function() {
            let model = wick.model({
                id: 0,
                name: "bob",
                nationality: "canadian"
            });

            model.nationality.should.equal("canadian");


            let listener = {
                update: (data) => {
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
                update: (data) => {
                    data.name.should.equal("bob");
                }
            };

            model.addListener(listener);


            spark.update();

            let clone = model.clone();

            clone.name = "mark";

            listener.update = (data) => {
                data.name.should.equal('mark');
            };

            spark.update();

            model.name.should.equal("bob");
        });

        it("Allows Composition of multiple models", function(done) {

            let modelA = wick.model({
                name: "Munesu",
                nationality: "Zimbabwean"
            });

            let modelB = wick.model({
                user: modelA
            });

            
            modelB.set({
                user: {
                    nationality: "Japanese"
                }
            });

            spark.update();

            let listener = {
                update: (data) => data.user.nationality.should.equal("Japanese")
            };

            modelB.addListener(listener);

            modelA.nationality.should.equal("Japanese");

            spark.update();

            listener.update = (data) => data.user.nationality.should.equal("Bermudian");

            spark.update();

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

        it("Can create schemed properties that accept specific values", function() {
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

            user.birthday = "August 13, 1989 00:00:00";
            user.birthday.should.equal((new Date("August 13, 1989 00:00:00")).valueOf());
        });

        it("Allows hook functions to be defined to provide mechanisms for server storage", function(done) {
            this.slow(20000);
            let User = wick.model.scheme({
                name: wick.scheme.string,
                age: wick.scheme.number,
                birthdate: wick.scheme.date,
            });

            User.prototype.LOADED = false;

            User.prototype.getHook = function(prop_name, data) {
                if (!this.LOADED) {

                    (new URL("/test/data/user.json"))

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

            view.update = function(data) {
                if (data.age) {
                    data.age.should.equal(25);
                    data.name.should.equal("tom");
                    data.birthdate.should.equal((new Date("September 8, 1993")).valueOf());
                    done();
                }
            };

            let user = new User();

            user.addView(view);

            let name = user.name;
            user.name = name;
        });

        it("Creates containers that can store multiple models", function() {
            let User = wick.model.scheme({
                name: wick.scheme.string,
                age: wick.scheme.number,
                birthday: wick.scheme.date,
            });

            let Users = wick.model.scheme({
                self: [{
                    key:{ name: "name", type: wick.scheme.string },
                    model: User
                }]
            })

            let Users2 = wick.model.scheme({
                self: [{
                    key:{ name: "birthday", type: wick.scheme.date, unique_key : "name" },
                    model: User
                }]
            })

            let users = new Users;
            let users2 = new Users2;

            let user_list = [
                {name:"tom", age: 34, birthday:  "August 1, 2015"},
                {name:"greg", age: 34, birthday:  "August 2, 2015"},
                {name:"charly", age: 34, birthday:  "August 3, 2015"},
                {name:"herbert", age: 34, birthday:  "August 4, 2015"},
                {name:"fran", age: 34, birthday:  "August 5, 2015"},
                {name:"gloria", age: 34, birthday:  "August 6, 2015"},
                {name:"silvia", age: 34, birthday:  "August 7, 2015"},
            ]

            users.set(user_list);
            users2.set(user_list);

            users.remove("greg")
            users2.remove(["August 5, 2015"])

            users.length.should.equal(6);
            users.get("tom", [])[0].age.should.equal(34);

            users2.length.should.equal(6);
            users2.get(["August 1, 2015", "August 7, 2015"], []).length.should.equal(6);

            users.set([
                {name:"flora", age:15},
                {name:"tom", age:32}
            ])

            users.length.should.equal(7);
            users.get("tom", [])[0].age.should.equal(32);

        })

        it("Creates complex data hierarchies from basic Javascript object descriptions", function() {
            
            let User = wick.model.scheme({
                name: wick.scheme.string,
                age: wick.scheme.number,
                birthdate: wick.scheme.date
            });

            let Users = wick.model.scheme({
                self: [{
                    key: [
                        { name: "name" },
                        { name: "age", type: wick.scheme.number }
                    ],
                    model : User
                }]
            });

            let Store = wick.model.store({
                users : Users
            });

            Store.current.set({
                users : [
                    {name:"Charles Dogo", age:57, birthdate:"November 18, 1968"},
                    {name:"Allator Lehtinen", age:22, birthdate:"January 22, 1996"},
                ]
            });


            Store.current.users.length.should.equal(2);
            Store.current.users.get({name:"Charles Dogo"},[])[0].age.should.equal(57);
            Store.current.users.get({age:22},[])[0].name.should.equal("Allator Lehtinen");
        });
    });
}

if (typeof module !== "undefined") module.exports = MODELTESTS;