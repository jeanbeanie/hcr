// public/core.js

var hcr = angular.module('hcr', []);

function mainController($scope, $http) {
  $http.get('/api/cards')
    .success(function(data) {
      $scope.cardSets = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

}
