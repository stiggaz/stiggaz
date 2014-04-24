'use strict';

/* INIT */
var stiggazApp = angular.module('stiggazApp', [
  'ngRoute',
//  'phonecatAnimations',
  'stiggazControllers',
//  'phonecatFilters',
  'stiggazServices',
    'facebook'
]).config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1492206844327957';
     
     // You can set appId with setApp method
     FacebookProvider.setAppId('1492206844327957');
     
     /**
      * After setting appId you need to initialize the module.
      * You can pass the appId on the init method as a shortcut too.
      */
     FacebookProvider.init(myAppId);
     
    }
  ])

/* ROUTING */
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
	when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
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
      
      when('/stat', {
        templateUrl: 'partials/stat.html',
        controller: 'StatCtrl'
      }).*/
      otherwise({
        redirectTo: '/deck'
      });
  }]);


