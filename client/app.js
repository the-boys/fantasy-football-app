(function() {
  'use strict';

  angular.module('fantasyfootballapp', [
    'ui.router',
    'ngAnimate',

    // base apps
    'base',

    // icons
    'angularIcons.iconic',

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
})();
