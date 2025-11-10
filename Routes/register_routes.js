const express = require("express");
const router = express.Router();
const register_controller = require("../Controllers/register_controller");

router.post("/register", register_controller.registerUser);

module.exports = router;
