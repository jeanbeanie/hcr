// card.js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = require('./secrets').MONGODB_URL;

const unirest = require('unirest');
const API_KEY = require('./secrets').API_KEY;

//api functions

module.exports = {
  getAll: function(callback){
    MongoClient.connect(url, function(err, client){
      const db = client.db('card');
      db.collection('card', function(err, collection){
        collection.find().toArray(function (err, cards){
          if( cards.length == 0 ){
            console.log('preparing to populate database...');
            populateDB(client); 
          }
          else {
            callback(cards);
          }
        });
      });
    })
  },

  getFiltered: function(){

  },

  upVote: function(){

  },

  downVote: function(){

  },
  


}

const getCardSetsFromAPI = function(callback){
      let cards = [];

      const sets = ["Basic", "Classic", "Promo", "Goblins vs Gnomes", "Blackrock Mountain", "The Grand Tournament", "The League of Explorers", "Whispers of the Old Gods", "One Night in Karazhan", "Mean Streets of Gadgetzan", "Journey to Un'Goro", "Knights of the Frozen Throne", "Kobolds & Catacombs"]

      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1")
      .header("X-Mashape-Key", API_KEY)
      .end(function (response) {
          cardsData = (response.toJSON().body);
          //loop over array of card set per in json response
          for(let i=0; i<sets.length; i++){
            //loop over array of cards in each card set
            for(let j=0; j<cardsData[sets[i]].length; j++){
              //push each card obj into my predefined array
              cards.push(cardsData[sets[i]][j])
            }
          }
          console.log('received ' + cards.length + ' cards from 3rd party API. Nice!');
          callback(cards);
      });
}


const populateDB = function(client){
      getCardSetsFromAPI(function(cards){        
        saveCardsToDB(cards, client);
      })
}

const saveCardsToDB = function(cards, client){
  console.log('Checking if cards exist in db, looping through cards now...');
  
  for(let card in cards){    
    const cardId = cards[card].cardId
    if( findCardByCardId( cardId, client ) == null || undefined){
      saveCardToDB(cards[card], client)
    } else {
      //
    }
  }
}

const findCardByCardId = function(id, client){
    console.log('checking for id ' + id);

    const  db = client.db('card');
    db.collection('card').findOne({
      cardId: id
    },
    function(err, result){
      if(err == null && result == null){
        console.log('Card not found.');
        return result;
      }
      if(err == null && result != null){
        console.log('Found saved card with cardId ', result);
        return result;
      }
      if(err != null){
        console.log('Error finding card by cardId : ', err);
        return result;
      }
    });
}

const saveCardToDB = function(card, client){
    console.log('preparing to save card ' + card + ' to database...');

    let db = client.db('card');
    db.collection('card').insertOne(
      card, 
      function(err, result){
        if(err == null){
          console.log('Saved card ' + card.name + ' to database.');
        }
        else{
          console.log('Error saving card to db : ', err);
        }
      })
}

