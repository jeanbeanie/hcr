//server.js

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));
app.use(methodOverride());


//model
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hcr');

const Card = mongoose.model('Card',{
  cardId : String,
  upVotes : Number,
  downVotes : Number,
});

//api routes
const unirest = require('unirest');
const API_KEY = require('./secrets').API_KEY;

app.get('/api/cards', function(req, res) {
	unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1")
	.header("X-Mashape-Key", API_KEY)
	.end(function (result) {
		console.log(result.status, result.headers, result.body);
		res.json(result)
	});
});
// app.get('/api/cards/:params/', function(req, res) {
// app.get('/api/cards/votes/', function(req, res) {
// app.post('/api/card/:id/upVote', function(req, res) {
// app.post('/api/card/:id/downVote', function(req, res) {


//**FRONTEND ROUTES
app.get('*', function( req, res) {
  res.sendFile('./public/index.html'); //load single view file
});

app.listen(8080);
console.log("App listening on port 8080");
