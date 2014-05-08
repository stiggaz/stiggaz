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

stiggazServices.factory('chatService', ['$resource', 'Auth', function($resource, Auth) {
    var APIGEE_ORG = 'crisk',
        APIGEE_APP = 'sandbox',
        dataClient,
	me,
	friend;

    dataClient = new Apigee.Client({
        orgName: APIGEE_ORG,
        appName: APIGEE_APP
    });

    me = Auth.getUser();

    function logError(error){
        if(error) {
            console.log(error);
        }
    }

    return {
	sendMessage: function(friendId, message) {
	    var chatMessage = {
		userUUID: me.uuid,
		friendUUID: friendId,
		senderUUID: me.uuid,
		message: message
	    };

	    var options = {
		    method: 'POST',
		    endpoint: 'chats',
		    body: chatMessage
		};

		dataClient.request(options, function (error, result) {
		    if (error) {
			//error
		    } else {
			//success        
		    }
		});
	},

	getChat: function(friendId) {
	    var options = { 
		endpoint:"chats",
		qs: {ql:"userUUID=" + me.uuid + " and friendUUID='" + friendId + "'"}
	    };
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     cardDeck = response.entities;
		}
	    });
	    return cardDeck;
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
	    cardDeck = this.getCollection();
	    //var existingCollection = this.getCollection();

	    if (cardDeck.length == 0) {
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
		    method: 'POST',
		    endpoint: 'collections',
		    body: deck
		};

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

	getCollectionByUser: function(user) {
	    var options = { 
		endpoint:"collections",
		qs: {ql:"userUUID=" + user.uuid, limit:640}
	    };
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     cardDeck = response.entities;
		}
	    });
	    return cardDeck;
	},

	getCollection: function() {
	    var user = Auth.getUser();
	    if (user == false) return;

	    if (cardDeck.length > 0) {
		return cardDeck;
	    }

	    var options = { 
		endpoint:"collections",
		qs: {ql:"userUUID=" + user.uuid, limit:640}
	    };
	    dataClient.request(options, function(error, response) {
		if (error) {
		    console.log(error);
		} else {
		     cardDeck = response.entities;
		}
	    });
	    return cardDeck;
	},
	
	fetchAll: function() {
	    var options = { 
		endpoint:"cards",
		qs:{limit:640}
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


stiggazServices.factory('locationService', ['$resource', 'Auth', 'userService', 'cardService', function($resource, Auth, userService, cardService) {
    dataClient = new Apigee.Client({
        orgName: APIGEE_ORG,
        appName: APIGEE_APP
    });

    var map;
    var markers;

    function logError(error){
        if(error) {
            console.log(error);
        }
    }

    function setMarker(user, friend) {

	if (typeof markers === 'undefined') {
	    markers = new GMaps({
		el: '#gmap_marker',
		lat: user.location.latitude,
		lng: user.location.longitude,
		zoom: 13
	    });
	} 

	markers.addMarker({
	    lat: friend.location.latitude,
	    lng: friend.location.longitude,
	    title: 'Marker',
		infoWindow: {
		    content: getMarkerContent(friend)
		}
	});
	
    }

    function getMarkerContent(friend) {
	var x = 1,
	    y = 3, 
	    string = friend.first_name;
	string += ' hat <strong>' + x + '</strong> Sticker für Dich. <br>';
	string += 'Du hast <strong>' + y + '</strong> für ihn. <br>';
	string += '<button>Kontaktieren</button>';
	return string;
    }

    return {
	init: function() {
	    map = new GMaps({
		el: '#gmap_marker',
		lat: 48.1391265,
		lng: 11.5801863,
		zoom: 13
	    });

	    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		// Wait for the device to be ready to grab the geoloc
		// Helps avoid the unsightly iOS authorization message
		// http://stackoverflow.com/questions/1673579/location-permission-alert-on-iphone-with-phonegap 
		document.addEventListener("deviceready", onDeviceReady, false);
	    } else {
		this.onDeviceReady(); //this is the browser
	    }
	},

	onDeviceReady: function() {
	    navigator.geolocation.getCurrentPosition(this.onGetLocationSuccess, this.onGetLocationError);
	},

	onGetLocationSuccess: function(location) {
	    map.setCenter(location.coords.latitude, location.coords.longitude);

	    // update user location
	    var user = Auth.getUser();
	    user.location = {
		latitude: location.coords.latitude,
		longitude: location.coords.longitude
	    };
	    userService.update(user);
	    Auth.setUser(user);

	    this.getFriendsAround();
	},

	onGetLocationError: function() {
	    alert("Uuups! Leider konnten wir dich nicht finden :(");
	},

	getFriendsAround: function() {
	    var user = Auth.getUser();
	    var latlon = user.location.latitude + "," + user.location.longitude;

	    var options = {
		type: "users",
		client: dataClient,
		qs: {ql: "location within 16000 of " + latlon}
	    };
	    var collection = new Apigee.Collection(options);
	    collection.fetch(function (error, response) {
		if (error) {
		    
		} else {
		    if (response.count > 0) {
			for (var n = 0; n < response.count; n++) {
			    console.log(response.entities[n].location);
			    setMarker(user, response.entities[n]);
			}

			return response.entities;
		    } else {
			alert("Wir haben leider keine Sammler in deinem Umkreis gefunden");
			return [];
		    }
		}
	    });
	}
    };
}]);
