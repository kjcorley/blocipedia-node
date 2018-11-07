const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const emailRelay = require("../email/helper.js");

module.exports = {
    signUp(req, res, next){
        res.render("users/signup");
    },
    create(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
        };

        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/signup")
            } else {
                passport.authenticate("local")(req, res, () => {
                    emailRelay.accountConfirmation(user);
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        })
    },
    signInForm(req, res, next){
        res.render("users/signin");
    },
    signIn(req, res, next){
        passport.authenticate("local", {failureRedirect: '/', failureFlash: "Invalid username or password"})(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
        })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You have been successfully signed out!");
        res.redirect("/");
    }
}