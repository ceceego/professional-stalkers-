const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "users.json");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Load existing users
let users = [];
if (fs.existsSync(DATA_FILE)) {
  users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Home page (Signup form)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "1. Views", "register_index.html"));
});

// Original version: Signup: Create new user
app.post("/register", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.send("Please enter both name and email.");
  }

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  res.redirect("/users");
});


// // New version: 
app.post("/signup", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.send("Please enter both name, email, and phone.");
  }

  const newUser = { id: Date.now(), name, email, phone };
  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  res.redirect("/users");
});
