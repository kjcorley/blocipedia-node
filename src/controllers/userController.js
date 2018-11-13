const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const emailRelay = require("../email/helper.js");
const stripe = require("stripe")(process.env.STRIPE_SK);

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
    },
    upgrade(req, res, next){
        let amount = 1500;

        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then((customer) => {
            stripe.charges.create({
                amount,
                description: "Premium Upgrade",
                currency: "usd",
                customer: customer.id
            })
            .then((charge) => {
                userQueries.changeRole(req.user, "premium", (err, user) => {
                    if(err) {
                        req.flash("error", err);
                    } else {
                        req.flash("notice", "Your account has been upgraded to premium!")
                        res.redirect(req.headers.referer);
                    }
                })
            })
        })
    },
    downgrade(req, res, next){
        userQueries.changeRole(req.user, "standard", (err, user) => {
            if(err) {
                req.flash("error", err)
            } else {
                wikiQueries.downgradeWikis(req.user.id, (err) => {
                    if(err) {
                        req.flash("error", err);
                        res.redirect(req.headers.referer);
                    } else {
                        req.flash("notice", "Your account has been downgraded to standard!");
                        res.redirect(req.headers.referer);
                    }
                })
            }
        })
    },
    account(req, res, next){
        res.render("users/account");
    }
}