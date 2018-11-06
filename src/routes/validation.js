module.exports = {
   validateUser(req, res, next) {
       if(req.method === "POST"){
           req.checkBody("email", "must be valid").isEmail();
           req.checkBody("name", "must be at least 3 characters in length").isLength({min: 3});
           req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
           req.checkBody("password_conf", "must match password provided").optional().matches(req.body.password);
       }

       const errors = req.validationErrors();
       console.log(errors);

       if(errors){
           req.flash("error", errors);
           return res.redirect(req.headers.referer);
       } else {
           return next();
       }
   } 
}