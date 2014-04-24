'use strict';

var stiggazApp = angular.module('stiggazApp', [
  'ngRoute',
//  'phonecatAnimations',
  'stiggazControllers',
//  'phonecatFilters',
  'stiggazServices'
]);


stiggazApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/deck', {
        templateUrl: 'partials/deck.html',
        controller: 'DeckCtrl'
      }).
        when('/help', {
            templateUrl: 'partials/help.html',
            controller: 'HelpCtrl'
	}).

/*
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      when('/help', {
        templateUrl: 'partials/help.html',
        controller: 'HelpCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/stat', {
        templateUrl: 'partials/stat.html',
        controller: 'StatCtrl'
      }).*/
      otherwise({
        redirectTo: '/deck'
      });
  }]);


