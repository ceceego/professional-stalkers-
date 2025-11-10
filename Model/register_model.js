const db = require("../Config/db.js");

const RegisterModel = {
  // Insert a new user
  createUser: async (firstname, lastname, username, usertype, password) => {
    const sql = `
      INSERT INTO users (firstname, lastname, username, usertype, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.query(sql, [firstname, lastname, username, usertype, password]);
  },

  // Find a user by username
  findByUsername: async (username) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [rows] = await db.query(sql, [username]);
    return rows;
  },
};

module.exports = RegisterModel;
