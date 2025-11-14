const express = require("express");
const router = express.Router();
const db = require("../Config/db.js");

// get all favorites for a specific student
router.get("/favorites/:student_username", async (req, res) => {
  const { student_username } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT faculty_username FROM favorites WHERE student_username = ?",
      [student_username]
    );

    // Return array of faculty usernames
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching favorites:", err);
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

// Add a favorite for a student
router.post("/favorites/add", async (req, res) => {
  const { student_username, faculty_username } = req.body;

  if (!student_username || !faculty_username) {
    return res.status(400).json({ message: "Missing student or faculty username" });
  }

  try {
    // Avoid duplicates
    await db.query(
      "INSERT IGNORE INTO favorites (student_username, faculty_username) VALUES (?, ?)",
      [student_username, faculty_username]
    );

    // Return updated favorites list
    const [rows] = await db.query(
      "SELECT faculty_username FROM favorites WHERE student_username = ?",
      [student_username]
    );

    res.json({
      message: "Favorite added successfully",
      favorites: rows,
    });
  } catch (err) {
    console.error("❌ Error adding favorite:", err);
    res.status(500).json({ message: "Error adding favorite" });
  }
});

// Remove a favorite for a student
router.post("/favorites/remove", async (req, res) => {
  const { student_username, faculty_username } = req.body;

  if (!student_username || !faculty_username) {
    return res.status(400).json({ message: "Missing student or faculty username" });
  }

  try {
    await db.query(
      "DELETE FROM favorites WHERE student_username = ? AND faculty_username = ?",
      [student_username, faculty_username]
    );

    // Return updated favorites list
    const [rows] = await db.query(
      "SELECT faculty_username FROM favorites WHERE student_username = ?",
      [student_username]
    );

    res.json({
      message: "Favorite removed successfully",
      favorites: rows,
    });
  } catch (err) {
    console.error("❌ Error removing favorite:", err);
    res.status(500).json({ message: "Error removing favorite" });
  }
});

module.exports = router;
