// card.js
const Shared = require('mmap-object');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = require('./secrets').MONGODB_URL;

const unirest = require('unirest');
const API_KEY = require('./secrets').API_KEY;


// BEGINNING OF  MMAP OBJECT FUNCTIONS
  const getCardsFromMemory = function(){
    try {
      console.log('Looking for cards stored in memory');
      const HCR = new Shared.Open('hcr');
      const cards = JSON.parse(HCR.cards);
      HCR.close();
      return cards;
    }
    catch (err) {
      console.log('No cards stored in memory, creating shared file now.');
      const HCR = new Shared.Create('hcr');
      const cards = HCR.cards;
      HCR.close();
      return cards;
    }
  }

  const updateCardsInMemory = function(cards){
    const HCR = new Shared.Create('hcr');
    const updatedCards = JSON.stringify(cards);
    HCR.cards = updatedCards;
    HCR.close();
    console.log('Updated cards stored in memory');
  }
// END OF MMAP OBJ FUNCTIONS
//
// BEGINNING OF 3RD PARTY API RELATED FUNCTIONS
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
          saveAllCards(cards, client);
        })
  }

  const saveAllCards = function(cards, client){
    console.log('Checking if cards exist in db, looping through cards now...');
    
    for(let card in cards){    
      const cardId = cards[card].cardId
      if( findCardByCardId( cardId, client ) == null || undefined){
        saveCardToDB(cards[card], client)
      }   
    }
    return cards;
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
          console.log('Found saved card : ', result.name);
          return result;
        }
        if(err != null){
          console.log('Error finding card by cardId : ', err);
          return result;
        }
      });
  }

  const saveCardToDB = function(card, client){
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
// END OF 3RD PARTY API RELATED FUNCTIONS
//
// BEGINNING OF PRIVATE DB FUNCTIONS
  const getCardsFromDB = function(){
    MongoClient.connect(url, function(err, client){
      const db = client.db('card');
      db.collection('card', function(err, collection){
        collection.find().toArray(function (err, cards){
          if( cards.length == 0 ){
            console.log('preparing to populate database...');
            return populateDB(client); 
          }
          else {
            console.log('sending cards from database...');
            updateCardsInMemory(cards);
            return cards;
          }
        });
      });
    })
  }
//END OF PRIVATE DB FUNCTIONS
//
// BEGINNING OF PUBLIC FUNCTIONS, MODULE.EXPORTS
  module.exports = {
    getAll: function(callback){
      var savedCards = getCardsFromMemory();

      if( savedCards == undefined || null){
        console.log('no cards saved to memory, getting cards from DB instead..');
        const cards = getCardsFromDB();
        updateCardsInMemory(cards);     
        callback(cards)
      } else {
        console.log('sending saved cards from memory...');
        callback(savedCards);
      }
    },

    upVote: function(id, callback){
      MongoClient.connect(url, function(err, client){
        const db = client.db('card');
        const collection = db.collection('card');
        db.collection('card').update(
          { "cardId": id },
          { "$inc": { "upVotes": 1}})
        collection.find().toArray(function (err, cards){
            updateCardsInMemory(cards);
        })
        callback(true);
      })
    },

    downVote: function(id, callback){
      MongoClient.connect(url, function(err, client){
        const db = client.db('card');
        const collection = db.collection('card');
        collection.update(
          { "cardId": id },
          { "$inc": { "downVotes": 1}}
        )
        collection.find().toArray(function (err, cards){
            updateCardsInMemory(cards);
        })
      callback(true);
      })
    },

  }
//END OF PUBLIC API FUNCTINOS, MODULE EXPORTS
//
//END OF FILE card.js
