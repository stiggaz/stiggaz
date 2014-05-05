'use strict';

/* Services */

var stiggazServices = angular.module('stiggazServices', ['ngResource']);



stiggazServices.factory('Auth', function(){
    var user;
    
    return{
	setUser : function(aUser){
            user = aUser;
	},

	getUser : function() {
	    return this.isLoggedIn();
	},

	isLoggedIn : function(){
	    return(typeof user !== 'undefined' && typeof user.id == 'string')? user : false;
	}
    }
});

stiggazServices.factory('userService', ['$resource', 'ezfb', 'Auth', function($resource, ezfb, Auth) {
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

stiggazServices.factory('cardService', ['$resource', 'Auth', function($resource, Auth) {
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

	initUser: function() {
	    var user = Auth.getUser();
	    if (user == false) return;

	    // überprüfen ob der benutzer schon karten hat
	    var existingCollection = this.getCollection();

	    if (existingCollection.length == 0) {
		// decks neu anlegen
		var allCards = this.fetchAll();
		var allCardsLength = allCards.length;
		var deck = [];
		for (var n = 0; n < allCardsLength; n++) {
		    deck[n] = {
			name: allCards[n].name,
			count: 0,
			cardUUID: allCards[n].uuid,
			userUUID: user.uuid,
			userName: user.name,
			type: 'collections'
		    };
		}

		var options = {
		    method:'POST',
		    endpoint:'collections', //The collection name
		    body:deck
		};

		//Call request() to initiate the API call and process the results
		dataClient.request(options, function (error, result) {
		    if (error) {
			//error
		    } else {
			//success        
		    }
		});
	    }
	},

	update: function(card) {
	    card.type = 'collections';
	    var entity = new Apigee.Entity({
		client: dataClient,
		data: card
	    });
	    entity.save(logError);
	},

	getCollection: function() {
	    var user = Auth.getUser();
	    if (user == false) return;

	    var options = { 
		endpoint:"collections",
		qs: {ql:"userUUID=" + user.uuid, limit:200}
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

	getCollectionById: function(collectionUUID) {
	    var user = Auth.getUser();
	    if (user == false) return;
	    
	    var options = { 
		endpoint:"collections",
		qs: {ql:"uuid=" + collectionUUID}
	    };
	    var result = [];
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		    if (response.entities.length == 1) return response.entities[0];
		    else return false;
		}
	    });
	    return result;
	},

	updateCard: function(card) {
	    var user = Auth.getUser();
	    if (user == false) return;

	    if (existingEntity == false) {
		var entity = new Apigee.Entity({
		    client: dataClient,
		    data: {
			type: 'collections',
			userUUID: user.uuid,
			userName: user.name,
			cardUUID: card.cardUUID,
			cardName: card.name,
			count: 0
		    }
		});
		entity.save(logError);
return entity;
	    } else {
		existingEntity.count++;
		existingEntity.save(logError);
return existingEntity;
	    }

	    

/*
	    var connecting_entity_options = {
		client: dataClient,
		data: {
		    type:'users',
		    uuid:user.uuid
		}
	    };
	    var connecting_entity = new Apigee.Entity(connecting_entity_options);

	    var connected_entity_options = {
		client: dataClient,
		data: {
		    type:'cards',
		    uuid:'466a245a-d381-11e3-a961-6b9649832099'
		}
	    };
	    var connected_entity = new Apigee.Entity(connected_entity_options);

	    connecting_entity.connect('has', connected_entity, function (error, result) {
		
		if (error) { 
		    // Error
		} else { 
		    // Success
		}

	    });
*/
	},

	getCardsOfUser: function() {
	    var user = Auth.getUser();
	    if (user == false) return;

	    var options = {
		client: dataClient,
		data: {
		    type:'users',
		    uuid:user.uuid
		}
	    };

	    var entity = new Apigee.Entity(options);
	    var res = [];
	    entity.getConnections('has', function (error, result) {
		if (error) { 
		    console.log('could not fetch cards: ' + error);
		} else { 
		    res = result.entities;
		}
	    });

	    return res;
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

