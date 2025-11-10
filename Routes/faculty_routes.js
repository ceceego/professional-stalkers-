const express = require("express");
const router = express.Router();
const faculty_controller = require("../Controllers/faculty_controller");

router.get("/faculty/officehours", faculty_controller.getOfficeHours);
router.post("/faculty/officehours", faculty_controller.saveOfficeHours);

module.exports = router;
