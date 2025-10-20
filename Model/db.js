import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "172.19.120.201",
  user: "root",
  password: "password",
  database: "office_hours"
});
