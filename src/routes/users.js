const express = require("express");
const router = express.Router();
const validation = require("./validation.js");

const userController = require("../controllers/userController.js");

router.get("/users/signup", userController.signUp);
router.post("/users/signup", validation.validateUser, userController.create);
router.get("/users/signin", userController.signInForm);
router.post("/users/signin", userController.signIn);
router.get("/users/signout", userController.signOut);
router.post("/users/upgrade", userController.upgrade);
router.post("/users/downgrade", userController.downgrade);
router.get("/users/account", userController.account);

module.exports = router;