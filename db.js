// establish connection to MYSQL database

var mysql = require("mysql");

var db = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G56",
  password: "3166",
  database: "C4131S19G56",
  port: 3306
});

// var db = mysql.createConnection({
//   host: "remotemysql.com",
//   user: "eNn28Jd2Hj",
//   password: "P6VJFx4adF",
//   database: "eNn28Jd2Hj",
//   port: 3306
// });

// db.connect(function(err) {
//   if (err) {
//     throw err;
//   };
//   console.log("Connected to MYSQL database!");
// });

module.exports = db
