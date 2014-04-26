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
					    function($scope, $location, $window, ezfb, Auth) {
						$scope.startScreen = true;
						updateLoginStatus(updateApiMe);

						$scope.$watch('loginStatus', function() {
						    console.log($scope.loginStatus);
						    if ($scope.loginStatus.status == 'connected') {
							$('.connected-status').hide();
							$('.unknown-status').show();
						    } else {
							$('.connected-status').show();
							$('.unknown-status').hide();
						    }
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
							$scope.loginStatus = res;
							
							(more || angular.noop)();
						    });
						}
						
						function updateApiMe () {
						    ezfb.api('/me', function (res) {
							$scope.apiMe = res;
							Auth.setUser(res);
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
					   'deckStorage',
					   'Auth', 
					   function ($scope, deckStorage, Auth) {
					       $scope.logged = Auth.isLoggedIn();
					       $scope.deck = deckStorage.fetchAll();
					       $scope.incrementCount = function(card) {
						   if (card.count < 5) {
						       card.count++;
						   } else {
						       card.count = 0;
						   }
						   deckStorage.update(card);
					       };
					       
					   }]
			     );

stiggazControllers.controller('HelpCtrl', ['$scope', 
					   'Auth', 
					   function ($scope, Auth) {
					       $scope.logged = Auth.isLoggedIn();
					   }]
			     );









