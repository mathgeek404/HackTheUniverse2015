'use strict';

var express = require("express");
var app = express();
var http = require("http").Server(app);
var blockchain = require('blockchain.info');
var qs = require('querystring');
var url = require('url');
var mongoose = require("mongoose");
var lat, lon, t, d, ID, address, pwd,amount;

/*var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var isBitcoin = true;
if(!isBitcoin){
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'q3d8kvb5s559cyvt',
    publicKey:    '27h27ht5nc4tpv36',
    privateKey:   'e96ee18c7eb2a7b983038045fb0fb7b1'
});
app.use(express.static('public'));

app.get('/', function (request, response) {

  gateway.clientToken.generate({}, function (err, res) {
    response.render('index', {
      clientToken: res.clientToken
    });
  });

});

app.post('/process', parseUrlEnconded, function (request, response) {

  var transaction = request.body;
  var amt = JSON.parse(transaction).amount;
  var pm = JSON.parse(transaction).payment_method_nonce;
  gateway.transaction.sale({
    amount: amt,
    paymentMethodNonce: pm 
  }, function (err, result) {

    if (err) throw err;

    if (result.success) {

      console.log(result);
    } 
  });

});
}
*/
mongoose.connect('mongodb://localhost/test');

var giveRecord = mongoose.model('coll_give', {ID: String, lat: Number, lon: Number, time: Number, address: String, password: String, amount: Number }, 'coll_give');
var getRecord = mongoose.model('coll_receive', {lat: Number, lon: Number, time: Number, address: String }, 'coll_receive');

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

	/*request('https://blockchain.info/merchant/92e01fc7-8111-422d-b408-45d87ea9f343/balance?password=passwordpassword', function (error, response, body) {
	  console.log("Balance: " + JSON.parse(body).balance);
	});*/
	
	request('https://blockchain.info/merchant/92e01fc7-8111-422d-b408-45d87ea9f343/payment?password=passwordpassword&address=12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox&amount=10000&from=158C4z7bSXdZnFqNtm7Ga7UDZ8aHongsFJ&fee=10000');

});

app.post("/give", function(req, res){
	
	var body = ""; // request body

	req.on('data', function(data) {
	    body += data.toString(); // convert data to string and append it to request body
	});
	console.log(body);
	req.on('end', function() {
	    console.log(JSON.parse(body)); // request is finished receiving data, parse it
		lat = JSON.parse(body).lat;
		lon = JSON.parse(body).lon;
		ID = JSON.parse(body).identifier;
		address = JSON.parse(body).address;
		pwd = JSON.parse(body).password;
		amount = JSON.parse(body).amount;

	var newGiveRecord = new giveRecord({
		"ID": ID,
		"lat": lat,
		"lon": lon,
		"time": Date.now(),
		"address": address,
		"password": pwd,
		"amount": amount
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
		address = JSON.parse(body).address;
	var newReceiveRecord = new getRecord({
		"lat": lat,
		"lon": lon,
		"time": Date.now(),
		"address": address

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
var uri = "mongodb://localhost/test"
var db = mongojs(uri, ["coll_receive","coll_give"]);


//Every couple of minutes, checks the get/give requests and cross checks possible transactions
function timerHandler() {

  db.coll_give.find(function(err, give_docs) {
  	   db.coll_receive.find(function(err, get_docs) {
  	   	 for (var i=0;i<get_docs.length;i++) {
            for (var j=0;j<give_docs.length;j++) {
                var get = get_docs[i];
                var give = give_docs[j];
                if (Math.abs(parseInt(get["time"])-parseInt(give["time"]))<10000) {  //Within timest
                if ((Math.abs(parseFloat(get["lat"])-parseFloat(give["lat"]))<1) &&
                        Math.abs(parseFloat(get["lon"])-parseFloat(give["lon"]))<1) {  //
                    pass_payment(give,get);
                    db.coll_give.remove(give, function(err,docs) {console.log(String(err));});
                    db.coll_receive.remove(get, function(err, docs) {console.log(String(err));});
                }
             } 
            }
          }

      });
  });  
}
function pass_payment(give, get){
	var request = require('request');
	var btc_amount;
	request('https://blockchain.info/tobtc?currency=USD&value='+give["amount"],function(error,res,body){
		btc_amount = body;
	});
	//var btc_amount = 
	var template = 'https://blockchain.info/merchant/'+give["ID"]+'/payment?password='+give["password"]+'&address='+get["address"]+'&amount='+btc_amount+'&from='+give["address"]+'&fee=10000';
	
	request(template);
}
var minutes = 0.01, the_interval = minutes * 60 * 1000;
setInterval(timerHandler, the_interval);

http.listen(80, function(){
	console.log("Listening on *:80");
});