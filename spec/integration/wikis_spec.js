const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {

    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true})
        .then(() => {
            User.create({
                name: "example",
                email: "bob@example.com",
                password: "1234567890"
            })
            .then((user) => {
                this.user = user;
                request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        userId: this.user.id,
                        email: this.user.email
                    }
                }, (err, res, body) => {
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("GET /wikis", () => {
        it("should render a view that displays all wikis", (done) => {
            Wiki.create({
                title: "My first wiki",
                body: "This site is great!",
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                request.get(base, (err, res, body) => {
                    expect(body).toContain("Wikis");
                    expect(body).toContain(this.wiki.title);
                    done();
                });
            });
        });
    });

    describe("GET /wikis/new", () => {
        it("should render a create wiki form", (done) => {
            request.get(`${base}/new`, (err, res, body) => {
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", ()=> {
        it("should create a wiki that passes validation", (done) => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "My first wiki",
                    body: "This site is great!",
                }
            };
            request.post(options, (err, res, body) => {
                Wiki.findOne({where: {title: "My first wiki"}})
                .then((wiki) => {
                    expect(wiki.body).toBe("This site is great!");
                    expect(wiki.userId).toBe(this.user.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        it("should not create a wiki that fails validation", (done) => {
            const options = {
                url: `${base}/create`,
                form: {
                    title: "My",
                    body: "Thi",
                }
            };
            request.post(options, (err, res, body) => {
                Wiki.findOne({where: {title: "My"}})
                .then((wiki) => {
                    expect(wiki).toBeNull();
                    done();
                })
                .catch((err) => {
                    done();
                });
            });
        });
    });

    describe("GET /wikis/:id", () => {
        it("should render a view of the wiki with the associated id", (done) => {
            this.wiki;
            Wiki.create({
                title: "My first wiki",
                body: "This site is great!",
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
                    expect(body).toContain(this.wiki.title);
                    expect(body).toContain(this.wiki.body);
                    done();
                })
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("GET /wikis/:id/edit", () => {
        it("should render a view to edit the wiki with the associated id", (done) => {
            Wiki.create({
                title: "My first wiki",
                body: "This site is great!",
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
                    expect(body).toContain("Edit Wiki")
                    expect(body).toContain(this.wiki.title);
                    expect(body).toContain(this.wiki.body);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("POST /wikis/:id/update", () => {
        it("should update the wiki with the associated id", (done) => {
            Wiki.create({
                title: "My first wiki",
                body: "This site is great!",
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                let options = {
                    url: `${base}/${this.wiki.id}/update`,
                    form: {
                        title: "My first wiki",
                        body: "My first edit!",
                        userId: this.user.id
                    }
                }
                request.post(options, (err, res, body) => {
                    Wiki.findById(this.wiki.id)
                    .then((wiki) => {
                        expect(wiki.title).toBe("My first wiki");
                        expect(wiki.body).toBe("My first edit!");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });

    describe("POST /wikis/:id/destroy", () => {
        it("should destroy the wiki with the associated id", (done) => {
            Wiki.create({
                title: "My first wiki",
                body: "This site is great!",
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
                    Wiki.findById(this.wiki.id)
                    .then((wiki) => {
                        expect(res.statusCode).toBe(303);
                        expect(wiki).toBeNull;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });
});