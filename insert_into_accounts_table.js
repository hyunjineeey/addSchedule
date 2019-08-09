/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");
var crypto = require('crypto');

var db = require('./db.js')

var rowToBeInserted = {
  acc_name: 'jin', // replace with acc_name chosen by you OR retain the same value
  acc_login: 'jin', // replace with acc_login chosen by you OR retain the same vallue
  acc_password: crypto.createHash('sha256').update("1234").digest('base64') // replace with acc_password chosen by you OR retain the same value
};

var sql = ``;
db.query('INSERT tbl_accounts SET ?', rowToBeInserted, function(err, result) {
  if(err) {
    throw err;
  }
  console.log("Value inserted");
});
