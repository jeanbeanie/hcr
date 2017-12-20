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

  $scope.upVoteCard = function(cardId){
    $http.post('/api/card/' + cardId + '/upVote')
      .success(function(data) {
        console.log('Upvoted card.');
        getCardData();
      })
      .error(function(err){
        console.log('Error upvoting card, : ' + err);
      })
  }
  
  $scope.downVoteCard = function(cardId){
    $http.post('/api/card/' + cardId + '/downVote')
      .success(function(data) {
        console.log('Downvoted card.');
        getCardData();
      })
      .error(function(err){
        console.log('Error downvoting card, : ' + err);
      })
  }

  getCardData();
}
