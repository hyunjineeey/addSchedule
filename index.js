// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT
var control = require("./control.js");

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

var xml2js = require('xml2js');

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
var port = 9007;
app.listen(port, () => console.log('Listening on port ' + port + '!'));

// var db = require("./db.js");

var db;

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/dbconfig.xml', function (err, data) {
  parser.parseString(data, function (err, result) {
    db = mysql.createConnection({
      host: result.dbconfig.host[0],
      user: result.dbconfig.user[0],
      password: result.dbconfig.password[0],
      database: result.dbconfig.database[0],
      port: result.dbconfig.port[0]
    });
    db.connect(function(err) {
  if (err) {
      throw err;
    };
    console.log("Connected to MYSQL database!");
  });
  });
});



app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

app.get('first', function(req,res) {
  console.log("see");
  req.session.value = 1;
  res.send('started session');
});

app.get('/second', function(req,res) {
  console.log("see");
  if(log.session.value) {
    res.send('session not started');
  }
  else {
    console.log('session exists');
    req.session.value += 1;
    var newval = req.session.value;
    res.send(`session value : ` + newval);
  } 
});

// GET method route for the events page.
// It serves schedule.html present in client folder
app.get('/schedule',function(req, res) {
  // If not logged in, redirect to login
  if (!req.session.authenticated) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/schedule.html');
  }
});

// GET method route for the admin page.
// It serves admin.html present in client folder
app.get('/admin', function (req, res) {
  // If not logged in, redirect to login
  if (!req.session.authenticated) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/admin.html');
  }
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get('/addSchedule',function(req, res) {
  // If not logged in, redirect to login
  if (!req.session.authenticated) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/addSchedule.html');
  }
});

//GET method for stock page
app.get('/stock', function (req, res) {
  if (!req.session.authenticated) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/stock.html');
  }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});

// GET method to return the list of favourite places
// The function queries the table tbl_places for the list of places and sends the response back to client
app.get('/getListOfUsers', function (req, res) {
  db.query('SELECT * FROM tbl_accounts', function (err, result) {
    if (err) throw err;
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(result, null, 2));
    res.end();
  });
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/getListOfEvents', function(req, res) {
  db.query('SELECT event_name, event_location, event_day, event_start_time, event_end_time FROM tbl_events', function (err, result) {
  	if (err) throw err;
  	res.statusCode = 200;
  	res.setHeader('Content-type', 'application/json');
  	res.write(JSON.stringify(result, null, 2));
  	res.end();
  });
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEvent', function(req, res) {
  var rowInsert = {
    event_name: req.body.eventName,
    event_location: req.body.location,
    event_day: req.body.date,
    event_start_time: req.body.stime,
    event_end_time: req.body.etime
  };
  db.query('INSERT tbl_events SET ?', rowInsert, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Inserted!");
    res.statusCode = 302;
    res.setHeader('Location', '/schedule');
    res.end();
  });
});

// POST method to validate new user credentials
// upon successful login, user session is created
app.post('/validateNewUser', function (req, res) {
  var name = req.body.name;
  var login = req.body.login;
  var password = crypto.createHash('sha256').update(req.body.password).digest('base64');

  console.log(`Adding new user ${login}`);

  var sql = `SELECT acc_password FROM tbl_accounts WHERE acc_login = '${login}'`;
  db.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      console.log(`Error: Found user ${result[0].acc_login} in database`);
      res.status(500).send('Found user undefined in database');
    } else {
      console.log(`User ${login} not found. Adding to database.`);
      db.query('INSERT tbl_accounts SET ?', { acc_name: name, acc_login: login, acc_password: password }, function (err, result) {
        if (err) {
          throw err;
        }
        console.log("Value inserted");
        res.status(200).send('ok');
      });
    }
  });
});

// POST method to validate new user credentials
// upon successful login, user session is created
app.post('/updateUser', function (req, res) {
  var name = req.body.name;
  var login = req.body.login;
  var oldLogin = req.body.oldLogin;
  var password = crypto.createHash('sha256').update(req.body.password).digest('base64');

  console.log(`Updating user ${login}`);


  db.query(`SELECT * FROM tbl_accounts WHERE acc_login = '${login}' and acc_login != '${oldLogin}'`, function (err, result) {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      console.log(`Error: Found user ${result[0].acc_login} in database`);
      res.status(500).send('Found user undefined in database');
    } else {
      console.log(`User ${login} not found. Adding to database.`);
      var sql = `UPDATE tbl_accounts SET ? WHERE acc_login = '${oldLogin}'`;
      var row = { acc_name: name, acc_login: login, acc_password: password };
      db.query(sql, row, function (err, result) {
        if (err) {
          throw err;
        }
        console.log("Value updated");
        req.session.username = login;
        res.status(200).send('ok');
      });
    }
  });
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var username = req.body.username;
  var password = crypto.createHash('sha256').update(req.body.password).digest('base64');

  var sql = `SELECT acc_password FROM tbl_accounts WHERE acc_login = '${username}'`;
  db.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    var pw = result[0].acc_password;
    if (pw === password) {
      console.log("Password is correct");
      req.session.authenticated = true;
      res.send('/schedule');
    }
    else {
      console.log("Password is incorrect");
      res.status(500).send('Error: Invalid credentials');
    }
  });
});

app.delete('/deleteUser', function (req, res) {
  var login = req.body.login;
  console.log(`User ${req.session.username} is deleting user ${login}`);

  if (login === req.session.username) {
    res.status(500).send('Error: Can not delete the user that is logged in');
  } else {
    var sql = `DELETE FROM tbl_accounts WHERE acc_login = '${login}'`;
    console.log(sql);
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`Deleted user ${login}`);
      res.send('ok');
    });
  }
});

app.get('/currentUser', function (req, res) {
  if (req.session.username) {
    res.send(req.session.username);
  }
});

app.get('/logout', function(req, res) {
  req.session.authenticated = false;
  res.redirect('/login');
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/client/404.html');
});
