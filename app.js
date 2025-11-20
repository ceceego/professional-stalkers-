const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./Config/db.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "View", "login_index.html"));
});

// ✅ Routes
app.use("/", require("./Routes/register_routes.js"));
app.use("/", require("./Routes/login_routes.js"));
app.use("/", require("./Routes/faculty_routes.js"));
app.use("/", require("./Routes/student_routes.js"));
app.use("/", require("./Routes/favorites_routes.js"));

// ✅ Serve static frontend files
console.log("Serving static files from:", path.join(__dirname, "View"));
app.use(express.static(path.join(__dirname, "View")));

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
