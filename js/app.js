'use strict';

/* INIT */
var stiggazApp = angular.module('stiggazApp', [
    'ngRoute',
    'stiggazControllers',
    'stiggazServices',
    'ezfb', 
    'hljs'
])

/* CONFIG */
.config(function(ezfbProvider) {
    ezfbProvider.setInitParams({
	appId: '1492206844327957'
    });
});

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
	  when('/stat', {
              templateUrl: 'partials/stat.html',
        controller: 'StatCtrl'
      }).
      when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/deck'
      });
  }])

.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
        }
    });
}]);


