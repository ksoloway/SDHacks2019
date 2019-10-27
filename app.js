const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('dotenv').config();
var path = require("path");
var request = require('request');
const Person = require('./models/person')
const Login = require('./models/login')
var AWS = require('aws-sdk')
// Set up the Express app
const app = express();
var bcrypt = require('bcrypt');
var loginUsername = "";
mongoose.connect(process.env.URI, {dbName: 'SDHacks2019Db'});

var credentials = new AWS.EnvironmentCredentials('AWS');
AWS.config.credentials = credentials;

AWS.config.getCredentials(function(err) {
	if (err) console.log(err.stack);
	// credentials not loaded
  });
  AWS.config.update({region: 'us-east-1'});
  var comprehend = new AWS.Comprehend();

// Set up static files
app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/views', express.static(path.join(__dirname, 'public/views')));


// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Error handling middleware
app.use(function (err, req, res, next) {
	console.log(err); // To see properties of message in our console
	res.status(422).send({ error: err.message });
});

var port = process.env.PORT || 3000;

// Starts the Express server, which will run locally @ localhost:3000
app.listen(port, function () {
	console.log('App listening on port 3000!');
});

// Serves the index.html file (our basic frontend)
app.get('/', function (req, res) {
	res.sendFile('/views/index.html', { root: __dirname });
});

app.get('/indextest', function (req, res) {
	res.sendFile('/views/indextest.html', { root: __dirname });
});

app.get('/test', function (req, res) {
	res.sendFile('/views/login.html', { root: __dirname });
});

app.get('/testsean', function (req, res) {
	res.sendFile('/views/testsean.html', { root: __dirname });
});
// GET route that displays all people (finds all Person objects)
app.get('/people', function (req, res, next) {
	Person.find({}, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			res.send(result); // Sends the result as JSON
		}
	});
});

function languageCode(language) {
	if (language == "English"){
		return "en";
	}
	if (language == "German"){
		return "de";
	}
	if (language == "Spanish"){
		return "es";
	}
	if (language == "French"){
		return "fr";
	}
	if (language == "Italian"){
		return "it";
	}
	if (language == "Portuguese"){
		return "pt";
	}
}


app.get('/amzapi/:text/:language', function(req,res,next){
	textParam = req.params.text;
	languageParam = languageCode(req.params.language);
	params = {Text: textParam, LanguageCode:languageParam};
	comprehend.detectSentiment(params, function(err, data) {
		if (err) {
			console.log(err)
		} else {
			res.send(data); // Sends the result as JSON
		}           // successful response
	  });
});
// GET route that displays one person's friends
app.get('/people/:id', function (req, res, next) {
	Person.findById(req.params.id, function (err, result) { // Finds person with id (param)
		if (!err) {
			res.send(result.friends); // Returns the person's friends array as JSON
		} else {
			throw err;
		}
	});
});

app.post('/hist/:newhistory/:sent',function(req, res, next){
	var prevHist;
	if(loginUsername==""){
		res.send("not logged in");
	} else{
		Login.find({username:loginUsername},function(err,docs){
			if(err || docs == undefined || docs.length == 0){
				res.send("cannot be found");
			} else{
				prevHist= docs[0].history;
				prevHist.push([req.params.newhistory,req.params.sent]);
				Login.findOneAndUpdate({username:loginUsername},
					{$set:{history:prevHist}},
					function(err, docs){
						if(err){
							console.log("unsuccessful");
						}
				});
				res.send("succeeded");
			}
		});	
	}
});

app.get('/hist',function(req, res, next){
	Login.find({username:loginUsername},function(err,docs){
		if(err || docs == undefined || docs.length == 0){
			console.log("user can't be found");
		} else{
			prevHist= docs[0].history;
			res.send(prevHist);
		}
	});	
});

app.post('/signup/:usr/:pwd', function(req,res,next){
	bcrypt.hash(req.params.pwd, 1, function(err, hash) {
		userparam = req.params.usr;
		//passwordparam = req.params.pwd;
		var login = new Login();
		login.username = userparam;
		login.password = hash;
		login.history = [];
		Login.find({username:userparam},function(err,docs){
			if(err || docs==undefined || docs.length == 0){
				//login.password = bcrypt.hashSync(passwordparam);
				login.save(function (err, login) { // Saves the Person object to the database
					if (err) {
						console.log(err);
					} else {
						loginUsername = login.username;
						res.send(loginUsername); // Returns the new object as JSON
					}
				})
			} else{
				res.send("already exist");
			}
		});
		
	});
});

app.get('/login/:usr/:pwd', function(req,res,next){
	userparam = req.params.usr;
	passwordparam = req.params.pwd;
	Login.find({username:userparam},function(err,docs){
		if(err || docs==undefined || docs.length==0){
			res.send("doesn't exist");
		}else{
			bcrypt.compare(passwordparam, docs[0].password, function(err, Hres) {
				if(Hres) {
					loginUsername = userparam;
					res.send(loginUsername);
				} else {
					res.send("wrong password");
				} 
			  });
		}
		
	})
	
});

// POST route that adds a new Person object
app.post('/people', function (req, res, next) {
	// First gets a random dog image URL
	request('https://dog.ceo/api/breeds/image/random', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var person = new Person();
			person.name = req.body.name; // Stores the 'name' string
			person.dog = JSON.parse(body).message; // Stores the 'dog' image URL
			person.save(function (err, person) { // Saves the Person object to the database
				if (err) {
					console.log(err);
				} else {
					res.send(person); // Returns the new object as JSON
				}
			})
		}
	})
});

app.put('/logout',function(req, res, next){
	if(loginUsername == ""){
		res.send("not logged in");
	} else{
		loginUsername = "";
		res.send("");
	}
});

// PUT route that adds a friend to a person
app.put('/people/:id', function (req, res, next) {
	Person.findById(req.params.id, function (err, person) { // Finds a Person by id (param in URL)
		person.friends.push(req.body.id); // Adds the friend with ID in POST parameters
		person.save(function (err) { // Saves the Person object
			if (err) {
				console.log(err);
			} else {
				Person.findById(req.body.id, function (err, person) { // Same, but for the 2nd person
					person.friends.push(req.params.id); // Saves the Person object
					person.save(function (err) {
						if (err) {
							console.log(err);
						} else {
							res.send("Friendship between " + req.body.id + " and " + req.params.id + "created!");
						}
					})
				});
			}
		})
	});
});

// DELETE route that removes a Person object from the database
app.delete('/people/:id', function (req, res, next) {
	Person.findByIdAndRemove(req.params.id, function (err, result) { // Finds by ID and remove
		if (err) {
			console.log(err);
		} else {
			res.send("Deleted person with id " + req.params.id);
		}
	});
});

exports.loginUsername = loginUsername;