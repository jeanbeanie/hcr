// public/core.js

var hcr = angular.module('hcr', []);

function mainController($scope, $http) {
  $scope.cards = []

  $http.get('/api/cards')
    .success(function(cards) {
      angular.forEach(cards, function(card) {
        $scope.cards.push(card);
      });
    })
    .error(function(err) {
      console.log('Error getting cards through GET /api/cards : ' + err);
    });

  $scope.upVoteCard = function(cardId){
    $http.get('/api/card/cardId/' + cardId + '/')
      .success(function(id) {
        $http.post('/api/card/' + id + '/upVote')
      })
      .success(function(data) {
        $scope.cardVotes = data;
      })
      .error(function(err){
        console.log('Error upvoting card, : ' + err);
      })
  }
}
