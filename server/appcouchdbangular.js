var application_root = __dirname,
    express = require("express"),
	path = require("path");
	var databaseUrl = "sampledb"; 


var cradle = require('cradle');
var connection = new(cradle.Connection)('http://admin:admin@localhost', 5984, {
      auth: { username: 'admin', password: 'admin' }
  });
var db = connection.database(databaseUrl);

var app = express();


// Config
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  var methodOverride = require('method-override');
  app.use(methodOverride());
  app.use(express.static(path.join(application_root, "public")));
  var errorhandler = require('errorhandler');
  app.use(errorhandler());
}


app.route('/api').get(function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.send('Express API is running');
});
/*
app.get('/getangularusers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	
	db.list(function(err, body) {
	  if(err) { return res.send(err.message, err['status-code']); }	
	  var bodyStr = '';
	  bodyStr = '[';
	  if (!err) {
		//console.log(body);
		body.rows.forEach(function(doc) {
		   //var val = db.get(doc.key);
		   //console.log("1111 " +bodyStr);
		   db.get(doc.key, {}, function(err, body) {
		   	  if (!err)
			    //console.log("2222 " +bodyStr);
				bodyStr = bodyStr + '{ "name" : "' + body.username + '"},' +'\n';
				
			});
			
		});
		console.log(bodyStr);
		
		bodyStr = bodyStr.trim();
		bodyStr = bodyStr.substring(0,bodyStr.length-1);
		bodyStr = bodyStr + ']';
		res.end( bodyStr);
	  }
	}); 
});

app.get('/all', function(req, res){
    db.view('getAll','getAll',function (error, body, headers) {
	 if(error) console.log(error); 
     res.send(body, 200);
    });
}); 
*/


app.route('/insertangularcouchuser').post(function (req, res){
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  console.log(req.body);
  console.log(req.body.mydata);
  var jsonData = JSON.parse(req.body.mydata);
  console.log(jsonData.username);
  console.log(jsonData.password);
  console.log(jsonData.email);
  var doc = {email: jsonData.email, password: jsonData.password, username: jsonData.username};
  db.save('\''+Math.random()+'\'', doc, function (err, res) {
      if (err) {
          // Handle error
          res += ' SAVE ERROR: Could not save record!!\n';
      } else {
          // Handle success
          res += ' SUCESSFUL SAVE\n';
      }
  });
});

app.route('/createview').get(function (req, res) {
	db.save('_design/characters', {
      all: {
          map: function (doc) {
              if (doc.username) emit(doc.username, doc);
          }
      }
	});
	
});

app.route('/getangularusers').get(function (req, res) {
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	res.writeHead(200, {'Content-Type': 'application/json'});
	str='[';
	db.view('characters/all', function (err, response) {
		
		  response.forEach(function (row) {
			  //console.log("%s is on the %s side of the force.", row.name, row.force);
			  str = str + '{ "name" : "' + row.username + '"},' +'\n';
		  });
		  str = str.trim();
		  str = str.substring(0,str.length-1);
	      str = str + ']';
	      res.end( str);
	  });
});


//https://github.com/cloudhead/cradle


  
 




app.listen(1212);