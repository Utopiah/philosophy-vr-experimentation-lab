// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE ThoughExperimentData (datapoint TEXT)');
    console.log('New table ThoughExperimentData created!');
    
    // insert default datapoint
    db.serialize(function() {
      db.run('INSERT INTO ThoughExperimentData (datapoint) VALUES ("Left"), ("Right"), ("Right")');
    });
  }
  else {
    console.log('Database "ThoughExperimentData" ready to go!');
    db.each('SELECT * from ThoughExperimentData', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to add datapoint in the database
app.get('/addDatapoint', function(request, response) {
  var stmt = db.prepare("INSERT INTO ThoughExperimentData VALUES (?)");
  stmt.run( request.query.datapoint );
  stmt.finalize();
  response.send("added");
});

// endpoint to get all the datapoints in the database
app.get('/getDatapoints', function(request, response) {
  db.all('SELECT * from ThoughExperimentData', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
