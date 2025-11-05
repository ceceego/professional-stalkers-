const express = require("express");
const cors = require("cors");
const db = require("./Model/db.js");

const app = express();
app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => res.send("Office Hours Tracker API running"));

// ✅ Test DB connection
(async () => {
  try {
    const [rows] = await db.promise().query("SELECT 1");
    console.log("✅ MySQL connected successfully!");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
