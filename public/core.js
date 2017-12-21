// public/core.js

var hcr = angular.module('hcr', []);

function mainController($scope, $http) {
  $scope.cards = []

  const getCardData = function(){
    console.log('Refreshing cards...');
    const updatedCards = [];
    
    $http.get('/api/cards')
      .success(function(cards) {
        angular.forEach(cards, function(card) {
          updatedCards.push(card);
        });
      })
      .error(function(err) {
        console.log('Error getting cards through GET /api/cards : ' + err);
      });
      $scope.cards = updatedCards;
      console.log('Finished loading cards.');
  }

  $scope.upVoteCard = function(card){
    var id = card.cardId;
    $http.post('/api/card/' + id + '/upVote')
      .success(function(data) {
        if( card.upVotes == undefined || null ){
          card.upVotes = 1;
        }
        else{
          card.upVotes += 1;
        }
        console.log('Upvoted card.');
      })
      .error(function(err){
        console.log('Error upvoting card, : ' + err);
      })
  }
  
  $scope.downVoteCard = function(card){
    var id = card.cardId;
    $http.post('/api/card/' + id + '/downVote')
      .success(function(data) {
        if( card.downVotes == undefined || null ){
          card.downVotes = 1;
        }
        else{
          card.downVotes += 1;
        }
        console.log('Downvoted card.');
      })
      .error(function(err){
        console.log('Error downvoting card, : ' + err);
      })
  }

  getCardData();
}
