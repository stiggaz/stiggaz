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
						    var user = Auth.getUser();
						    if (typeof user !== 'undefined') {
							$scope.username = user.first_name;
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

					       // wieviele karten hat der user schon?
					       var cardDeckLength = cardDeck.length;
					       var counter = 0;
					       for (var n = 0; n < cardDeckLength; n++) {
						   if (cardDeck[n].count > 0) {
						       counter++;
						   }
					       }

					       $scope.statPercent = Math.round((counter * 100 / cardDeckLength) );
					     
					       if ($scope.statPercent < 25) {
						   $scope.statText = 'Aller Anfang ist schwer!';
					       } else if ($scope.statPercent >= 25 && $scope.statPercent < 50) {
						   $scope.statText = 'Nicht schlecht! Jetzt heißt es durchhalten!';
					       } else if ($scope.statPercent >= 50 && $scope.statPercent < 75) {
						   $scope.statText = 'Beachtliche Sammlung!';
					       } else {
						   $scope.statText = 'Super, du bist fast fertig!';
					       }


					       var updatePie = function($that) {
						   var $this = $that, 
						       $text = $('span', $this), 
						       $oldValue = $text.html();

						   $this.data('easyPieChart').update($scope.statPercent);
						   
						   $({v: $oldValue}).animate({v: $scope.statPercent}, {
						       duration: 1000,
						       easing:'swing',
						       step: function() {
							   $text.text(Math.ceil(this.v));
						       }
						   });
					       };

					       $('.easypiechart').each(function(){
    						   var $barColor = $(this).data("barColor") || function($percent) {
						       $percent /= 100;
						       return "rgb(" + Math.round(255 * (1-$percent)) + ", " + Math.round(255 * $percent) + ", 125)";
						   },
						       $trackColor = $(this).data("trackColor") || "#c8d2db",
						       $scaleColor = $(this).data("scaleColor"),
						       $lineWidth = $(this).data("lineWidth") || 12,
						       $size = $(this).data("size") || 130,
						       $animate = $(this).data("animate") || 1000;

						   $(this).easyPieChart({
						       barColor: $barColor,
						       trackColor: $trackColor,
						       scaleColor: $scaleColor,
						       lineCap: 'butt',
						       lineWidth: $lineWidth,
						       size: $size,
						       animate: $animate,
						       onStop: function(){
	        					   var $this = this.$el;
							   updatePie($this);
						       }
						   });
					       });
					   }]
			     );


stiggazControllers.controller('MapCtrl', ['$scope', 
					   'Auth', 
					  'locationService',
					   function ($scope, Auth, locationService) {
					       $scope.logged = Auth.isLoggedIn();
					       locationService.init();
					       locationService.getFriendsAround();
					   }]);


stiggazControllers.controller('ChatCtrl', ['$scope',
					   '$routeParams',
					   'Auth', 
					   'chatService',
					   function ($scope, $routeParams, Auth, chatService) {
					       $scope.logged = Auth.isLoggedIn();
					       $scope.me = Auth.getUser();
					       $scope.chat = chatService.getChat($routeParams.friendId);

					       $scope.sendMessage = function() {
						   chatService.sendMessage($routeParams.friendId, $scope.chatMessage);
						   $scope.chat = chatService.getChat($routeParams.friendId); 
					       };

					       $scope.getPrettyTime = function(timestamp) {
						   return prettyDate(timestamp);
					       };

					       function prettyDate(time){
						   var date = new Date(time),
						       diff = (((new Date()).getTime() - date.getTime()) / 1000),
						       day_diff = Math.floor(diff / 86400);

						   if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
						       return;
			
						   return day_diff == 0 && (
						       diff < 60 && "gerade eben" ||
							   diff < 120 && "vor einer Minute" ||
							   diff < 3600 && "vor " + Math.floor( diff / 60 ) + " Minuten" ||
							   diff < 7200 && "vor einer Stunde" ||
							   diff < 86400 && "vor " + Math.floor( diff / 3600 ) + " Stunden") ||
						       day_diff == 1 && "Gestern" ||
						       day_diff < 7 && "vor " + day_diff + " Tagen" ||
						       day_diff < 31 && "vor " + Math.ceil( day_diff / 7 ) + " Wochen";
					       }

					   }]);




