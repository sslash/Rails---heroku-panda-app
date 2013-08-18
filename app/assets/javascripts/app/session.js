	// Used to copy-paste in stuff
	define([
		], function(){

			var Session = function() {};

			Session.clear = function() {
				localStorage.clear();
			};

			Session.getUser = function() {
				var user = localStorage.getItem("user");
				if ( user ) {
					return JSON.parse(user);
				} else {
					return null;
				}
			};

			Session.setSentBattleRequests = function(reqs) {
				var jsonRqs = JSON.stringify(reqs);
				localStorage.setItem("sentBR", jsonRqs);
			};

			Session.setToken = function(token){
				localStorage.setItem("token", token);
			};

			Session.getToken = function() {
				return localStorage.getItem("token");
			};

			Session.getSentBattleRequests = function() {
				var battleRqs = localStorage.getItem("sentBR");
				if ( battleRqs ) {
					return JSON.parse(battleRqs);
				} else {
					return null;
				}
			};

			Session.setUser = function(user) {
				var jsonUser = JSON.stringify(user);
				localStorage.setItem("user", jsonUser);
			};

			Session.setBattles = function(battles) {
				var jsonbattles = JSON.stringify(battles);
				localStorage.setItem("battles", jsonbattles);
			};

			Session.getBattles = function() {
				var battles = localStorage.getItem("battles");
				if ( battles ) {
					return JSON.parse(battles);
				} else {
					return null;
				}
			};

			Session.setIncomingBattleRequests = function(br){
				var jsonreqs = JSON.stringify(br);
				localStorage.setItem("incomingBR", jsonreqs);
			};

			Session.getIncomingBattleRequests = function() {
				var br = localStorage.getItem("incomingBR");
				if ( br ) {
					return JSON.parse(br);
				} else {
					return null;
				}
			};

			return Session; 
		});