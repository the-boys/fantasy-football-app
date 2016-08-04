(function() {
  'use strict';

  angular.module('fantasyfootballapp', [
    'ui.router',
    'ngAnimate',

    // base apps
    'base',
    'base.dynamicRouting',
    'base.dynamicRouting.animations'
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
