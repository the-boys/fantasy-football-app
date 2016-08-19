(function() {
  'use strict';

  angular.module('fantasyfootballapp', [
    'ui.router',
    'ngAnimate',
    'ngLodash',

    // base apps
    'base',

    // icons
    'angularIcons.iconic',
    'angularIcons.openIconic',
    'angularIcons.materialIcons',
    'angularIcons.ionicons',

    // dynamic routing
    'dynamicRouting',
    'dynamicRouting.animations',

    // firebase
    'firebase'
  ]);

  angular.module('fantasyfootballapp').config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  });

  angular.module('fantasyfootballapp').run(function($firebaseAuth, $rootScope) {
    $firebaseAuth().$waitForSignIn().then(function(user) {
      $rootScope.user = user;
    });

    // handle updates to authentication
    $firebaseAuth().$onAuthStateChanged(function(user) {
      $rootScope.user = user;
    });
  });
})();
