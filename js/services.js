'use strict';

/* Services */

var stiggazServices = angular.module('stiggazServices', ['ngResource']);

/*
stiggazServices.factory('Deck', ['$resource', function($resource){
    return $resource('phones/:phoneId.json', {}, {
	query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);
*/

stiggazServices.factory('userService', ['$resource', function($resource) {
    var APIGEE_ORG = 'crisk',
        APIGEE_APP = 'sandbox',
        dataClient;

    dataClient = new Apigee.Client({
        orgName: APIGEE_ORG,
        appName: APIGEE_APP
    });

    function logError(error){
        if(error) {
            console.log(error);
        }
    }

    return {
	update: function(user) {
	    card.type = 'users';
	    var entity = new Apigee.Entity({
		client: dataClient,
		data: user
	    });
	    entity.save(logError);
	},

	getByFBId: function(id) {
	    var options = { 
		endpoint:"users",
		qs: {ql:"id='" + id + "'"}
	    };
	    var result = [];
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     result = response.entities;
		}
	    });
	    return result;
	}
    };
}]);

stiggazServices.factory('deckStorage', ['$resource',function($resource) {
    var APIGEE_ORG = 'crisk',
        APIGEE_APP = 'sandbox',
        dataClient;

    dataClient = new Apigee.Client({
        orgName: APIGEE_ORG,
        appName: APIGEE_APP
    });

    function logError(error){
        if(error) {
            console.log(error);
        }
    }

    return {
	update: function(card) {
	    card.type = 'cards';
	    var entity = new Apigee.Entity({
		client: dataClient,
		data: card
	    });
	    entity.save(logError);
	},

	getByName: function(name) {
	    var options = { 
		endpoint:"cards",
		qs: {ql:"name='" + name + "'"}
	    };
	    var result = [];
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     result = response.entities;
		}
	    });
	    return result;
	},

	fetchAll: function() {
	    var options = { 
		endpoint:"cards",
		qs:{limit:200}
	    };
	    var result = [];
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     result = response.entities;
		}
	    });
	    return result;
	}
    };

}]);

