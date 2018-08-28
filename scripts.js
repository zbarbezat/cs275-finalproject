/* CS 275 Final Project
 *
 */
//Set up modules we're using
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.static("."));

/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var request = require('request'); // "Request" library

var client_id = '6ba0d68acbb14b11bcc1001e3c4b5dd7'; // Your client id
var client_secret = 'a022baaccb3640a4a8ce3c5f04d229e9'; // Your secret


//For the default site with no requests
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
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
	      url: 'https://api.spotify.com/v1/search?q=chon&type=artist&limit=1',
	      headers: {
	        'Authorization': 'Bearer ' + token
	      },
	      json: true
	    };
	    request.get(options, function(error, response, body) {
	      console.log(body.artists.items[0].uri);
	    });
	  }
	});
});

app.listen(8080,function(){
	console.log('Server is listening :]');
});
// 

