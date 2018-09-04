/* CS 275 Final Project
 *
 */
//Set up modules we're using
var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var app = express();
app.use(express.static("."));

var con = mysql.createConnection({
	host: "cs275project.c689xb3yjax8.us-east-1.rds.amazonaws.com",
	user: "projectadmin",
	password: "userlogin"
});

con.connect(function (err){
	if (err) throw err;
	console.log("Connected to database!");
});
/**
Sorry for how nasty this all looks, pretty much it has to make the api calls on the server side 
or else it runs into a cors error. I'm not sure if this is the cleanest way to do but it was the 
only attempt I got to spit out the correct uri. Will not be offended if you guys want to go about
this differently.
 */

var request = require('request'); // "Request" library

var client_id = '6ba0d68acbb14b11bcc1001e3c4b5dd7'; // our client id
var client_secret = 'a022baaccb3640a4a8ce3c5f04d229e9'; // our secret


//For the default site with no requests
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'indexServer.html'));
});

app.get('/search', function(req, res){
	// your application requests authorization
	var authOptions = {
	  url: 'https://accounts.spotify.com/api/token',
	  headers: {
	    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
	  },
	  form: {
	    grant_type: 'client_credentials'
	  },
	  json: true
	};

	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

	    // use the access token to access the Spotify Web API
	    var token = body.access_token;
	    var options = {
	      url: 'https://api.spotify.com/v1/search?q=' + req.query.value + '&type=artist&limit=1',
	      headers: {
	        'Authorization': 'Bearer ' + token
	      },
	      json: true
	    };
	    request.get(options, function(error, response, body) {
	    	//all it does now is give the link to the band we want. Can't handle multi word strings yet (need to have plus signs) and will add error handling.
	    	uri = body.artists.items[0].uri;
	    	console.log(uri);
	    	res.send(uri);
	    });
	  }
	});
});

app.listen(4200,function(){
	console.log('Server is listening :]');
});
// 

