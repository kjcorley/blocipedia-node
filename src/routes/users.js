const express = require("express");
const router = express.Router();
const validation = require("./validation.js");

const userController = require("../controllers/userController.js");

router.get("/users/signup", userController.show);
router.post("/users/signup", validation.validateUser, userController.create);

module.exports = router;