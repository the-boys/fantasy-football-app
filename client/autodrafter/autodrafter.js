(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("AutodrafterController", function($scope, $state, $stateParams, $firebaseArray, lodash) {
    var ref = firebase.database().ref().child("autodrafter").child("players");
    $scope.players = $firebaseArray(ref);
    $scope.newPlayer = null;
    $scope.teamCount = $stateParams.count || 4;

    $scope.addPlayer = function() {
      $scope.newPlayer = {
        taken: false,
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

    $scope.getRanking = function(player) {
      if (player.taken) {
        return 0;
      } else {
        var topPlayers = lodash
          .chain($scope.players)
          .filter(function(p) {
            return p.position == player.position && !p.taken;
          })
          .orderBy('projections', 'desc')
          .take($scope.teamCount)
          .value();

        return player.projections - topPlayers[topPlayers.length-1].projections;
      }
    };
  });
})();
