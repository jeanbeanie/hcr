// public/core.js

var hcr = angular.module('hcr', []);

function mainController($scope, $http) {
  $scope.cards = []

  const getCardData = function(){
    console.log('Getting cards...');

    $http.get('/api/cards')
      .success(function(cards) {
        angular.forEach(cards, function(card) {
          $scope.cards.push(card);
        });
        console.log($scope.cards[0]);
      })
      .error(function(err) {
        console.log('Error getting cards through GET /api/cards : ' + err);
      });
      console.log('Finished loading cards.');
  }

  $scope.upVoteCard = function(cardId){
    $http.get('/api/card/cardId/' + cardId + '/')
      .success(function(id) {
        $http.post('/api/card/' + id + '/upVote')
      })
      .success(function(data) {
        getCardData();
      })
      .error(function(err){
        console.log('Error upvoting card, : ' + err);
      })
  }

  getCardData();
}
