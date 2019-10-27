const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('dotenv').config();
var path = require("path");
var request = require('request');
const Login = require('./models/login');
var tesseract = require('node-tesseract');
var textract = require('textract');
var AWS = require('aws-sdk');
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

textract.fromFileWithPath("ad.jpg",function(err,text){
	console.log(text);
});
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

app.listen(port, function () {
	console.log('App listening on port 3000!');
});

app.get('/', function (req, res) {
	res.sendFile('/views/frontpage.html', { root: __dirname });
});
app.get('/loggedin', function (req, res) {
	res.sendFile('/views/index.html', { root: __dirname });
});

app.get('/indextest', function (req, res) {
	res.sendFile('/views/indextest.html', { root: __dirname });
});

app.get('/about', function (req, res) {
	res.sendFile('/views/about.html', { root: __dirname });
});

app.get('/signup', function (req, res) {
	res.sendFile('/views/signup.html', { root: __dirname });
});

app.get('/testsean', function (req, res) {
	res.sendFile('/views/testsean.html', { root: __dirname });
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
			console.log(languageParam);
			res.send(data); // Sends the result as JSON
		}           // successful response
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
				if (prevHist.length >= 3){
					prevHist[2] = prevHist[1];
					prevHist[1] = prevHist[0];
					prevHist[0] = [req.params.newhistory,req.params.sent];
				} else{
					prevHist.unshift([req.params.newhistory,req.params.sent]);
				}
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

app.put('/logout',function(req, res, next){
	if(loginUsername == ""){
		res.send("not logged in");
	} else{
		loginUsername = "";
		res.send("");
	}
});

app.get('/getUser',function(req, res, next){
	res.send(loginUsername);
});