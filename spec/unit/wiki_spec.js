const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
    beforeEach((done) => {
        this.user;
        sequelize.sync({force: true})
        .then(() => {
            User.create({
                name: "example",
                email: "bob@example.com",
                password: "1234567890"
            })
            .then((user) => {
                this.user = user;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })
    })

    describe("#create()", () => {
        it("should create a wiki with the associated user", (done) => {
            Wiki.create({
                title: "How to make a wiki",
                body: "Click the add wiki button",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki).not.toBeNull();
                expect(wiki.title).toBe("How to make a wiki");
                expect(wiki.private).toBeFalsy;
                expect(wiki.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })
    })

    describe("#getWikis()", () => {
        it("should return the wikis with the associated userId", (done) => {
            this.wiki;
            Wiki.create({
                title: "How to make a wiki",
                body: "Click the add wiki button",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                this.user.getWikis()
                .then((wikis) => {
                    expect(wikis.length).toBe(1);
                    expect(wiki.title).toBe(this.wiki.title);
                    done();
                })
            })
        })
    })
})