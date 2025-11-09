const db = require("../Config/db.js");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { firstname, lastname, username, password, usertype } = req.body;

  try {
    const [existing] = await db.query("SELECT username FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (firstname, lastname, username, password, usertype) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, username, hashedPassword, usertype]
    );

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};
