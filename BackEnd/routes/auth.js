const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth");

router.post("/register", AuthController.createUser);

router.post("/login", AuthController.userLogin);

module.exports = router;
