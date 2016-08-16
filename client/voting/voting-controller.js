(function() {
  'use strict';

  angular.module('fantasyfootballapp').controller("VotingController", function($scope, $state, $stateParams, $firebaseArray) {
      var ref = firebase.database().ref().child("rules");
        // download the data into a local object
      $scope.rules = $firebaseArray(ref);
      $scope.newRule = "";
      $scope.voted = [];
      
     
      
    $scope.submitRule = function() {
        if ($scope.newRule) {
            $scope.rules.$add({
                text: $scope.newRule,
                vote: null,
                voteYes: 0,
                voteNo: 0,
                num: 0
            });
            $scope.newRule = "";
        }
    };
      
    $scope.submitVote = function(rule){
        if(rule.vote == true){
            rule.voteYes++;
        }
        if(rule.vote == false){
            rule.voteNo++;
        }
       
      $scope.rules.$save(rule);
        
    };
      
    $scope.deleteVote = function(rule){
      $scope.rules.$remove(rule);
    };
    
    
  });
})();
