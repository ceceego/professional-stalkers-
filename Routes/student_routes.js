const express = require("express");
const router = express.Router();
const db = require("../Config/db.js");

router.get("/faculty", async (req, res) => {
  try {
    const [facultyRows] = await db.query(
      "SELECT id, firstname, lastname, username, current_status FROM users WHERE usertype = 'faculty'"
    );

    const [officeHourRows] = await db.query(
      "SELECT faculty_username, day_of_week, start_time, end_time, location FROM office_hours"
    );

    const facultyData = facultyRows.map(f => {
      const hours = officeHourRows.filter(o => o.faculty_username === f.username);

      return {
        id: f.id,
        firstname: f.firstname,
        lastname: f.lastname,
        username: f.username,
        office_hours: hours.map(h => ({
          day: h.day_of_week,
          start: h.start_time,
          end: h.end_time,
          location: h.location
        })),
        current_status: f.current_status || 'checked_out' // default if null
      };
    });

    res.json(facultyData);
  } catch (err) {
    console.error("Error fetching faculty data:", err);
    res.status(500).json({ message: "Error fetching faculty data" });
  }
});

// 🧩 Get a single student's info by username
router.get("/students/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT firstname, lastname, username FROM users WHERE username = ? AND usertype = 'student'",
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching student info:", err);
    res.status(500).json({ message: "Error fetching student info" });
  }
});

module.exports = router;
