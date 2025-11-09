const db = require("../Config/db.js");

// ✅ GET all office hours for a faculty member
exports.getOfficeHours = async (req, res) => {
  const { username } = req.query;

  if (!username) return res.status(400).json({ message: "Missing faculty username" });

  try {
    const [rows] = await db.query("SELECT * FROM office_hours WHERE faculty_username = ?", [username]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching office hours:", err);
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
