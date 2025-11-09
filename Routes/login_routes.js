const express = require("express");
const router = express.Router();
const login_controller = require("../Controllers/login_controller");

router.post("/login", login_controller.loginUser);

module.exports = router;
