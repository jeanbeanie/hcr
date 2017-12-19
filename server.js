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


//mongo
//const mongodb = require('mongodb');
//const MongoClient = require('mongodb').MongoClient
//const assert = require('assert');
//const url = require('./secrets').MONGODB_URL

//api routes
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

app.get('/api/cards/votes', function(req, res){
  
  MongoClient.connect(url, function(err, db){
    db.collection('cards', function (err, collection){
      collection.find().toArray( function (err, cards) {
        res.send(cards)
      });
    })
  })

});

app.get('/api/card/cardId/:cardId', function(req, res){
  const cardId = req.params.cardId;

  MongoClient.connect(url, function(err, db){
    db.collection('cards').findOne({
      cardId: cardId
    },
    function (err, result){
      if(err==null){
        res.json(result)
      } 
      else{
        console.log('error finding card by cardId : ', err);
      }
    })
  })
});

app.post('/api/card/:id/upVote', function(req, res) {
  const id = req.params.id


  MongoClient.connect(url, function(err, db){
    db.collection('cards').findOne({
      _id: new mongodb.ObjectID(id)
    },
    function (err, result){
      if(err==null){
      
        db.collection('cards').updateOne(
          {"_id": new mongodb.ObjectID(id) },
          { $set:
            {
              "upVotes": +1,
            }
          }, 
          function (err, result){
            if(err == null){
              res.json(result)
            }
            else {
              console.log('error updating card : ' + err)
            }
          }
        )
      }
      else
      {
        console.log('error finding card to update : ' + err)      
      }
    })
  })

})

// app.post('/api/card/:id/downVote', function(req, res) {


// app.get('/api/cards/:params/', function(req, res) {
// app.get('/api/cards/votes/', function(req, res) {


//**FRONTEND ROUTES
app.get('/', function( req, res) {
  res.sendFile('./public/index.html'); //load single view file
});

app.listen(8080);
console.log("App listening on port 8080");
