/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");

var db = require("./db.js");

console.log("Connected!");
var sql = `CREATE TABLE tbl_accounts(acc_id INT NOT NULL AUTO_INCREMENT,
                                      acc_name VARCHAR(20),
                                      acc_login VARCHAR(20),
                                      acc_password VARCHAR(50), 
                                      PRIMARY KEY (acc_id))`;
db.query(sql, function(err, result) {
  if(err) {
    throw err;
  }
  console.log("Table created");
});
