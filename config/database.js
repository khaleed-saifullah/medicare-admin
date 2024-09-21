const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medicare_new",
});

db.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Database Connected!");
  }
});

module.exports = db;
