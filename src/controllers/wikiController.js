const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {
    index(req, res, next){
        const authorized = new Authorizer(req.user).private();
        if(authorized) {
            wikiQueries.getAllWikis((err, wikis) => {
                if(err){
                    res.redirect(500, '/');
                } else {
                    res.render("wikis/wiki", {wikis});
                }
            })  
        } else {
            wikiQueries.getAllPublicWikis((err, wikis) => {
                if(err){
                    res.redirect(500, '/');
                } else {
                    res.render("wikis/wiki", {wikis});
                }
            })  
        }
    },
    new(req, res, next){
        const authorized = new Authorizer(req.user).new();
        if(authorized) {
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    create(req, res, next){
        const authorized = new Authorizer(req.user);
        if(authorized.create()){
            let private = false;
            if(authorized.private() && req.body.private == "private"){
                private = true;
            }
            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                private: private,
                userId: req.user.id
            }
            wikiQueries.createWiki(newWiki, (err, wiki) => {
                if(err) {
                    res.redirect(req.headers.refer);
                } else {
                    res.redirect(`/wikis`);
                }
            })
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    show(req, res, next){
        wikiQueries.getWiki(req, (err, wiki) => {
            if(err || wiki == null){
                res.redirect("/wikis");
            } else {
                const bodyMarkdown = markdown.toHTML(wiki.body);
                res.render("wikis/show", {wiki: wiki, bodyMarkdown: bodyMarkdown});
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis")
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if(authorized){
                    res.render("wikis/edit", {wiki})
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect("/wikis");
                }
            }
        });
    },
    update(req, res, next){
        wikiQueries.updateWiki(req, (err, wiki) => {
            if(err || wiki == null) {
                res.redirect(`/wikis/${req.params.id}`);
            } else {
                res.redirect(`/wikis/${req.params.id}`)
            }
        });
    },
    destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                res.redirect(500, `/wikis/${req.params.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    }
}