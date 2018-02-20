/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');



// Util is handy to have around, so thats why that's here.
const util = require('util');
// and so is assert
const assert = require('assert');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	  extended: false
	}));
app.use(bodyParser.json());

// Now lets get cfenv and ask it to parse the environment variable
var appenv = cfenv.getAppEnv();

// Within the application environment (appenv) there's a services object
var services = appenv.services;

 
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


/*
//Then we create a route to handle our example database call
app.get("/reviews/getAllReviews", function(request, response) {
  // and we call on the connection to return us all the documents in the
  // words collection.

  mongodb.collection("tweetsData").find().toArray(function(err, tweet) {
    if (err) {
     response.status(500).send(err);
    } else {
     response.send(tweet);
    }
  });

});
*/
// start server on the specified port and binding host
app.listen(appenv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appenv.url);
});
