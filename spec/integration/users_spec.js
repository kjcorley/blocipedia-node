const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
    beforeEach((done) => {
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("GET /users/signup", () => {
        it("should render a view with a signup form", (done) => {
            request.get(`${base}signup`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign Up");
                done();
            });
        });
    });

    describe("POST /users/signup", () => {
        it("should create a new user with valid values and redirect", (done) => {
            const options = {
                url: `${base}signup`,
                form: {
                    name: "starman",
                    email: "starman@tesla.com",
                    password: "1234567890",
                    password_conf: "1234567890"
                }
            };
            request.post(options, (err, res, body) => {
                User.findOne({where: {email: "starman@tesla.com"}})
                .then((user) => {
                    expect(user).not.toBeNull();
                    expect(user.email).toBe("starman@tesla.com");
                    expect(user.id).toBe(1);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        it("should not create a new user with invalid attributes and redirect", (done) => {
            const options = {
                url: `${base}signup`,
                form: {
                    name: "s",
                    email: "tesla.com",
                    password: "1234567890"
                }
            };
            request.post(options, (err, res, body) => {
                User.findOne({where: {email: "tesla.com"}})
                .then((user) => {
                    expect(user).toBeNull();
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            })
        })
    });

    describe("GET /users/signin", () => {
        it("should render a view with a sign in form", (done) => {
            request.get(`${base}signin`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign in");
                done();
            });
        });
    });
});