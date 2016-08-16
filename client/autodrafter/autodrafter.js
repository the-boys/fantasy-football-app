(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("AutodrafterController", function($scope, $state, $stateParams, $firebaseArray) {
    var ref = firebase.database().ref().child("autodrafter").child("players");
    $scope.players = $firebaseArray(ref);
    $scope.newPlayer = null;

    $scope.addPlayer = function() {
      $scope.newPlayer = {
        name: "",
        position: "",
        projections: 0
      };
    };

    $scope.savePlayer = function() {
      if ($scope.newPlayer.$id) {
        $scope.players.$save($scope.newPlayer);
      } else {
        $scope.players.$add($scope.newPlayer);
      }
      $scope.newPlayer = null;
    };

    $scope.cancelPlayer = function() {
      $scope.newPlayer = null;
    };

    $scope.updatePlayer = function(player) {
      $scope.players.$save(player);
    };

    $scope.editPlayer = function(player) {
      $scope.newPlayer = player;
    };
  });
})();
