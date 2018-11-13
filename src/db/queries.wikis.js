const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getAllPublicWikis(callback){
        return Wiki.findAll({where: {private: false}})
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    createWiki(newWiki, callback){
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).show();
            if (authorized) {
                callback(null, wiki);
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }
        })
        .catch((err) => {
            callback(err);
        })
    },
    updateWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found!");;
            }
            let updatedWiki = {
                title: req.body.title,
                body: req.body.body,
            };
            const authorized = new Authorizer(req.user, wiki);
            if(authorized.private() && req.body.private == "private") {
                updatedWiki.private = true;
            }

            if(authorized.update()){
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }

        });
    },
    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();
            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, res);
                })
                .catch((err) => {
                    callback(err);
                })
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback(401);
            }
        })
    },
    downgradeWikis(userId, callback){
        return Wiki.update({private: false}, {where: {userId}})
        .then(() => {
            callback(null);
        })
        .catch((err) => {
            callback(err);
        })
    }
}