module.exports = {
    init(app){

        if(process.env.NODE_ENV === "test") {
            const mockAuth = require("../../spec/support/mock-auth.js");
            mockAuth.fakeIt(app);
        }

        const staticRoutes = require("../routes/static");
        const userRoutes = require("../routes/users");
        const wikiRoutes = require("../routes/wikis");
        app.use(staticRoutes);
        app.use(userRoutes);
        app.use(wikiRoutes);
    }
}