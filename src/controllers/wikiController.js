const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                console.log(err);
                res.redirect(500, '/')
            } else {
                res.render("wikis/wiki", {wikis});
            }
        })  
    },
    new(req, res, next){
        res.render("wikis/new");
    },
    create(req, res, next){
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        }
        wikiQueries.create(newWiki, (err, wiki) => {
            if(err) {
                res.redirect(req.headers.refer);
            } else {
                res.redirect(`/wikis`);
            }
        })
    },
    show(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis");
            } else {
                res.render("wikis/show", {wiki})
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/wikis")
            } else {
                res.render("wikis/edit", {wiki})
            }
        });
    },
    update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if(err || wiki == null) {
                res.redirect(404, `/wikis/${req.params.id}/edit`);
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