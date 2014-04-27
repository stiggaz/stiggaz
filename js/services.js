'use strict';

/* Services */

var stiggazServices = angular.module('stiggazServices', ['ngResource']);



stiggazServices.factory('Auth', function(){
    var user;
    
    return{
	setUser : function(aUser){
            user = aUser;
	},
	isLoggedIn : function(){
	    return(typeof user !== 'undefined' && typeof user.id == 'string')? user : false;
	}
    }
});

stiggazServices.factory('userService', ['$resource', 'ezfb', 'deckStorage', 'Auth', function($resource, ezfb, deckStorage, Auth) {
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
	handleUser: function(user) {
	    if(typeof user.id == 'string') {
		var userEntity = this.getById(user.id);
		if (userEntity.length == 0) {
		    this.update(user);
		    userEntity = user;
		} else {
		    // nimm erstes element;
		    userEntity = userEntity[0];
		}
		return userEntity;
	    }
	},

	getCards: function() {
	    var user = Auth.isLoggedIn();
	    if (user) {
		return user.cards;
	    }
	},

	update: function(user) {
	    user.type = 'users';
	    var entity = new Apigee.Entity({
		client: dataClient,
		data: user
	    });
	    entity.save(logError);
	},

	getById: function(id) {
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

