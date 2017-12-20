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


//CARD API ROUTES

const Card = require('./card');

app.get('/api/cards', function(req, res) {
  Card.getAll(function(result){
    res.send(result);
  });
});

app.post('/api/cards', function(req, res){
  Card.populate(function(result){
    res.send(result);
  });
});


app.post('/api/card/:id/upVote', function(req, res) {
  const id = req.params.id;
  Card.upVote(id, function(result){
    res.send(result);
  });
})

app.post('/api/card/:id/downVote', function(req, res) {
  const id = req.params.id;
  Card.downVote(id, function(result){
    res.send(result);
  });
})


//**FRONTEND ROUTES

app.get('/', function( req, res) {
  //load single view file
  res.sendFile('./public/index.html'); });

app.listen(8080);
console.log("App listening on port 8080");
