(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("AccountController", function($state, $stateParams, $timeout, $firebaseAuth) {
    $timeout(function() {
      if ($stateParams.login) {
        $firebaseAuth().$signInWithPopup("google").finally(function() {
          $state.go("home");
        });
      } else if ($stateParams.logout) {
        $firebaseAuth().$signOut();
        $state.go("home");
      } else {
        $state.go("home");
      }
    }, 50);
  });
})();
