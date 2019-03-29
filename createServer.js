
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);

  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/schedule.html'){
    schedule(req,res);  //request for schedule page
  }
  else if (req.url === '/stock.html') {
      stockPage(req, res); //stock page request
  }
  else if(req.url === '/addSchedule.html'){
    addSchedule(req,res);  //Form request
  }
  else if(req.url === '/getSchedule'){
    getSchedule(req,res); //Ajax request from schedule page
  }
  // Next route will get the data from the form and process it
  else if(req.url === '/postScheduleEntry') { 
        var reqBody = '';
        // server starts receiving the form data
        req.on('data', function(data) {
          reqBody += data;

        });
        // server has received all the form data
        req.on('end', function() {
          addScheduleEntry(req, res, reqBody);
        });
  }
  else if (req.url === '/schedule.json') { 
      getSchedule(req, res)
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9001);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function stockPage(req, res) {
    fs.readFile('client/stock.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html);
        res.end();
    });
}

function schedule(req, res) {
  fs.readFile('client/schedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function addSchedule(req, res) {
  console.log("In Add Schedule");
  fs.readFile('client/addSchedule.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}


function getSchedule(req, res) {
  fs.readFile('schedule.json', function (err, content) {
    if (err) {
      throw err;
    }
    parseJson = JSON.parse(content);
    var response = { res: parseJson };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(response));
    res.end();
  });
}

function addScheduleEntry(req, res, reqBody) {
  newSchedule = qs.parse(reqBody);
  fs.readFile('schedule.json', function (err, content) {
    if (err) {
      throw err;
    }
    var jsonData = JSON.parse(content);
    jsonData.schedule.push(newSchedule);
    fs.writeFile('schedule.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) throw err;
      else {
        res.writeHead(302, { Location: '/schedule.html'})
        res.end();
      }
    });
  });
}
