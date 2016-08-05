(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("TeamController", function($scope, $state, $stateParams, $firebaseObject) {
    if (!$stateParams.id) {
      $state.go("home");
      return;
    }

    var ref = firebase.database().ref().child("teams").child($stateParams.id);
    $scope.team = $firebaseObject(ref);
    $scope.team.$loaded().then(function() {
      if (!$scope.team.id) {
        $scope.team.id = $stateParams.id;
        $scope.team.name = $stateParams.id;
      }
    });

    $scope.editing = false;
    $scope.startEditing = function() {
      $scope.editing = true;
    };
    $scope.stopEditing = function() {
      $scope.team.$save();
      $scope.editing = false;
    };
  });
})();
