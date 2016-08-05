(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("HomeController", function($scope, $state, $stateParams, $firebaseObject) {
    var ref = firebase.database().ref().child("teams");
    // download the data into a local object
    $scope.teams = $firebaseObject(ref);
  });
})();
