var express = require("express");
var app = express();
var http = require("http").Server(app);
var blockchain = require('blockchain.info');
var qs = require('querystring');
var url = require('url');
var mongoose = require("mongoose");
var lat, lon, t, d;

mongoose.connect('mongodb://localhost/test');

var giveRecord = mongoose.model('coll_give', {lat: Number, lon: Number, time: String}, 'coll_give');
var getRecord = mongoose.model('coll_receive', {lat: Number, lon: Number, time: String}, 'coll_receive');

// var transaction;

// var giveEvent = new Event('giveReady');
// var receiveEvent = new Event('receiveReady');

// transaction.addEventListener('giveReady', function(e){
	
// }, false);

// transaction.addEventListener('receiveReady', function(e){
	
// }, false);

var myWallet = new blockchain.MyWallet("92e01fc7-8111-422d-b408-45d87ea9f343", "passwordpassword");

app.get("/", function(req, res){
	console.log("GET /");
	res.send("<h1>Hello PebblePay</h1>");
	var request = require('request');

	request('https://blockchain.info/merchant/92e01fc7-8111-422d-b408-45d87ea9f343/balance?password=passwordpassword', function (error, response, body) {
	  console.log("Balance: " + JSON.parse(body).balance);
	});
	
	request('https://blockchain.info/merchant/92e01fc7-8111-422d-b408-45d87ea9f343/payment?password=passwordpassword&address=12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox&amount=10000&from=158C4z7bSXdZnFqNtm7Ga7UDZ8aHongsFJ&fee=10000');

});

app.post("/give", function(req, res){
	
	var body = ""; // request body

	req.on('data', function(data) {
	    body += data.toString(); // convert data to string and append it to request body
	});
	
	req.on('end', function() {
	    console.log(JSON.parse(body)); // request is finished receiving data, parse it
		lat = JSON.parse(body).lat;
		lon = JSON.parse(body).lon;
		t = JSON.parse(body).time;
		d = new Date(0); // The 0 there is the key, which sets the date to the epoch
		d.setUTCSeconds(t / 1000);
		//console.log(d);
	var newGiveRecord = new giveRecord({
		"lat": lat,
		"lon": lon,
		"time": t
	});
	newGiveRecord.save();
	});

});

app.post("/receive", function(req, res){
	
	var body = ""; // request body

	req.on('data', function(data) {
	    body += data.toString(); // convert data to string and append it to request body
	});
	
	req.on('end', function() {
	    console.log(JSON.parse(body)); // request is finished receiving data, parse it
		lat = JSON.parse(body).lat;
		lon = JSON.parse(body).lon;
		t = JSON.parse(body).time;
		d = new Date(0); // The 0 there is the key, which sets the date to the epoch
		d.setUTCSeconds(t / 1000);
		//console.log(d);
	var newReceiveRecord = new getRecord({
		"lat": lat,
		"lon": lon,
		"time": t
	});
	newReceiveRecord.save();
	});

});


// app.post("/give", function(req, res){
// 	var body = ""; // request body

// 	req.on('data', function(data) {
// 	    body += data.toString(); // convert data to string and append it to request body
// 	});
	
// 	req.on('end', function() {
// 	    console.log(JSON.parse(body)); // request is finished receiving data, parse it
// 		console.log(JSON.parse(body).lat);
// 		console.log(JSON.parse(body).lon);
// 		console.log(JSON.parse(body).time);
// 		console.log(JSON.parse(body).amount);
// 		transaction.dispatchEvent(giveEvent);
// 		//makeTransaction(JSON.parse(body).amount);
// 	});
// });

// app.post("/receive", function(req, res){
// 	var body = ""; // request body

// 	req.on('data', function(data) {
// 	    body += data.toString(); // convert data to string and append it to request body
// 	});
	
// 	req.on('end', function() {
// 	    console.log(JSON.parse(body)); // request is finished receiving data, parse it
// 		console.log(JSON.parse(body).lat);
// 		console.log(JSON.parse(body).lon);
// 		console.log(JSON.parse(body).time);
// 		transaction.dispatchEvent(receiveEvent);
// 	});
// });



// function makeTransaction(amount) {
// 	if (receiveReady && giveReady) {
		
// 	}
// }

/*
 * Welcome to JSApp.US
 * ctrl-b to run the current code on the server
 * ctrl-l to login/make a new user
 * ctrl-h for help
 *
 * For more command check out the command window at the bottom
 * commands: test login/logout newuser new save open ls deploy
 */

var mongojs = require('mongojs');
var uri = "argofuckyourself:argofuckyourself@ds033153.mongolab.com:33153/helloworld"
var db = mongojs(uri, ["coll_get","coll_give"]);


//Every couple of minutes, checks the get/give requests and cross checks possible transactions
def timerHandler() {
  db.coll_give.find(function(err, give_docs) {
      db.coll_get.find(function(err, get_docs) {
          for (i=0;i<give_docs.length;i++) {
            for (j=0;j<give_docs.length;j++) {
                get = get_docs[i];
                give = give_docs[j];
                
                if (Math.abs(parseInt(get["time"])-parseInt(give["time"]))<100) {  //Within timestep
                if ((Math.abs(parseFloat(get["lat"])-parseFloat(give["lat"]))<1) &&
                        Math.abs(parseFloat(get["long"])-parseFloat(give["long"]))<1) {  //Within range
                    pass_payment(give,get);
                    db.coll_get.remove(give, function(err,docs) {console.log(String(err));});
                    db.coll_get.remove(get, function(err, docs) {console.log(String(err));});
                }
             } 
            }
          }

      });
  });  
}
var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(timerHandler, the_interval);

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen();


http.listen(80, function(){
	console.log("Listening on *:80");
});