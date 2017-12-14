// public/core.js

var hcr = angular.module('hcr', []);

function mainController($scope, $http) {
  $scope.cards = []

  $http.get('/api/cards')
    .success(function(data) {
      const cardSets = data;
      angular.forEach(cardSets, function(cardSet) {
        angular.forEach(cardSet, function(cards) {
          angular.forEach(cards, function(card) {
            $scope.cards.push(card);
          });
        })
      });
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}
