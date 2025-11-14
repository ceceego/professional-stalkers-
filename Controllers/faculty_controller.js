const db = require("../Config/db.js");

// ✅ GET all office hours for a faculty member
exports.getOfficeHours = async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: "Missing faculty username" });

  try {
    // 1️⃣ Get office hours
    const [officeHoursRows] = await db.query(
      "SELECT day_of_week, start_time, end_time, location FROM office_hours WHERE faculty_username = ?",
      [username]
    );

    // 2️⃣ Get current_status from users table
    const [statusRows] = await db.query(
      "SELECT current_status FROM users WHERE username = ? AND usertype = 'faculty'",
      [username]
    );

    const current_status = statusRows.length ? statusRows[0].current_status : "checked_out";

    const formattedHours = officeHoursRows.map(h => ({
      day_of_week: h.day_of_week,
      start_time: h.start_time,
      end_time: h.end_time,
      location: h.location
    }));

    res.json({
      current_status,
      office_hours: formattedHours
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.saveOfficeHours = async (req, res) => {
  const { username, officeHours } = req.body; // expects array of slots

  if (!username || !Array.isArray(officeHours)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // 🧹 Remove old slots for this faculty
    await db.query("DELETE FROM office_hours WHERE faculty_username = ?", [username]);

    // 💾 Insert all new slots
    for (const slot of officeHours) {
      const { day_of_week, start_time, end_time, location } = slot;
      await db.query(
        "INSERT INTO office_hours (faculty_username, day_of_week, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)",
        [username, day_of_week, start_time, end_time, location]
      );
    }

    res.status(201).json({ message: "Office hours updated successfully" });
  } catch (err) {
    console.error("Error saving office hours:", err);
    res.status(500).json({ message: "Server error" });
  }
};
