var express = require("express");
var app = express();
var http = require("http").Server(app);
var blockchain = require('blockchain.info');
var qs = require('querystring');
var url = require('url');
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');

var giveRecord = mongoose.model('coll_give', {lat: Number, lon: Number, time: Number}, 'coll_give');

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
		console.log(JSON.parse(body).lat);
		console.log(JSON.parse(body).lon);
		console.log(JSON.parse(body).time);
		var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
		d.setUTCSeconds(JSON.parse(body).time / 1000);
		console.log(d);

		var newGiveRecord = new giveRecord({
		"lat": JSON.parse(body).lat,
		"lon": JSON.parse(body).lon,
		"time": JSON.parse(body).time
	});
	newGiveRecord.save();
	});

	

	//collection.insert(body, {w: 1}, function(err, records){
  	//console.log("Record added as "+records[0]._id);
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

http.listen(80, function(){
	console.log("Listening on *:80");
});