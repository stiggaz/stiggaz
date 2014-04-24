'use strict';

var stiggazControllers = angular.module('stiggazControllers', []);

stiggazControllers.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function(route) {
	return route === $location.path();
    }
}]);

stiggazControllers.controller('DeckCtrl', ['$scope', 'deckStorage', function ($scope, deckStorage) {
   
    $scope.deck = deckStorage.fetchAll();

    $scope.incrementCount = function(card) {
	if (card.count < 5) {
	    card.count++;
	} else {
	    card.count = 0;
	}
	deckStorage.update(card);
    };

}]);

stiggazControllers.controller('HelpCtrl', function ($scope) {
   
});

