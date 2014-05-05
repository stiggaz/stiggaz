'use strict';

var stiggazControllers = angular.module('stiggazControllers', []);

stiggazControllers.controller('NavCtrl', ['$scope', 
					  '$location', 
					  'Auth',
					  function ($scope, $location, Auth) {
					      $scope.isActive = function(route) {
						  return route === $location.path();
					      }
					  }]
			     );

stiggazControllers.controller('LoginCtrl', ['$scope', 
					    '$location', 
					    '$window', 
					    'ezfb', 
					    'Auth', 
					    'userService',
					    'cardService',
					    function($scope, $location, $window, ezfb, Auth, userService, cardService) {
						updateLoginStatus(updateApiMe);

						$scope.$watch('loginStatus', function() {
						    if ($scope.loginStatus && $scope.loginStatus.status == 'connected') {
							$('.connected-status').hide();
							$('.unknown-status').show();
						    } else {
							$('.connected-status').show();
							$('.unknown-status').hide();
						    }
						});

						$scope.$watch('apiMe', function() {
						    Auth.setUser($scope.apiMe);
						    Auth.setUser(userService.handleUser(Auth.isLoggedIn()));
						    cardService.initUser();
						    $scope.username = $scope.apiMe.first_name;
						});

						$scope.login = function () {
						    ezfb.login(function (res) {
							if (res.authResponse) {
							    updateLoginStatus(updateApiMe);
							}
						    }, {scope: 'email,user_likes'});
						};
						
						$scope.logout = function () {
						    Auth.setUser(false);
						    ezfb.logout(function () {
							updateLoginStatus(updateApiMe);
							$location.path('/login');
						    });
						};
						
						function updateLoginStatus (more) {
						    ezfb.getLoginStatus(function (res) {
							(more || angular.noop)();
							$scope.loginStatus = res;
						    });
						}
						
						function updateApiMe () {
						    ezfb.api('/me', function (res) {
							$scope.apiMe = res;
						    });
						}

						var autoToJSON = ['loginStatus', 'apiMe']; 
						angular.forEach(autoToJSON, function (varName) {
						    $scope.$watch(varName, function (val) {
							$scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
						    }, true);
						});
					    }]
			     );


stiggazControllers.controller('DeckCtrl', ['$scope', 
					   'cardService',
					   'Auth',
					   function ($scope, cardService, Auth) {
					      
					       $scope.deck = cardService.getCollection();

					       $scope.updateCard = function(card) {

						   if (card.count < 5) {
						       card.count++;
						   } else {
						       card.count = 0;
						   }

						   cardService.update(card);
						   
						   
/*
						   if (card.count < 5) {
						       card.count++;
						   } else {
						       card.count = 0;
						   }
						   var user = Auth.isLoggedIn();*/
						   //userService.update(user);
					       };
					       
					   }]
			     );

stiggazControllers.controller('HelpCtrl', ['$scope', 
					   'Auth', 
					   function ($scope, Auth) {
					       $scope.logged = Auth.isLoggedIn();
					   }]
			     );

stiggazControllers.controller('StatCtrl', ['$scope', 
					   'Auth', 
					   function ($scope, Auth) {
					       
					   }]
			     );









