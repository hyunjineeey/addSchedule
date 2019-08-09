/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");

var db = require("./db.js");

console.log("Connected!");
  var sql = `CREATE TABLE tbl_events(event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                      event_name VARCHAR(30),
                                      event_location VARCHAR(30),
                                      event_day VARCHAR(30),
                                      event_start_time VARCHAR(30),
                                      event_end_time VARCHAR(30))`;
db.query(sql, function(err, result) {
  if(err) {
    throw err;
  }
  console.log("Table created");
});

