const express = require("express");
const router = express.Router();
const db = require("../Config/db.js");
const faculty_controller = require("../Controllers/faculty_controller");

// --- SPECIFIC ROUTES FIRST ---

// Office Hours
router.get("/faculty/officehours", faculty_controller.getOfficeHours);
router.post("/faculty/officehours", faculty_controller.saveOfficeHours);

// Check-in
router.post("/faculty/checkin", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Missing faculty username" });

  try {
    await db.query(
      "UPDATE users SET current_status = 'checked_in', status_updated_at = NOW() WHERE username = ?",
      [username]
    );
    res.json({ message: "Checked in successfully" });
  } catch (err) {
    console.error("Error during check-in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check-out
router.post("/faculty/checkout", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Missing faculty username" });

  try {
    await db.query(
      "UPDATE users SET current_status = 'checked_out', status_updated_at = NOW() WHERE username = ?",
      [username]
    );
    res.json({ message: "Checked out successfully" });
  } catch (err) {
    console.error("Error during check-out:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// NOTES ROUTES
router.get("/faculty/notes/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT notes FROM users WHERE username = ?",
      [username]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ notes: rows[0].notes || "" });
  } catch (err) {
    console.error("Error loading notes:", err);
    res.status(500).json({ message: "Server error loading notes" });
  }
});

router.post("/faculty/notes", async (req, res) => {
  const { username, notes } = req.body;

  try {
    await db.query(
      "UPDATE users SET notes = ? WHERE username = ?",
      [notes, username]
    );

    res.json({ message: "Notes saved successfully!" });
  } catch (err) {
    console.error("Error saving notes:", err);
    res.status(500).json({ message: "Server error saving notes" });
  }
});

// --- GENERIC ROUTE LAST ---
router.get("/faculty/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT firstname, lastname, username FROM users WHERE username = ? AND usertype = 'faculty'",
      [username]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Faculty not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching faculty info:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
