define([  
	'backbone',
	'session',
	'underscore'
	],
	function(Backbone, Session, _) {

		var Battle = Backbone.Model.extend({
			urlRoot : '/api/battles',

			initialize : function() {
				if ( !this.get('id') ){
					this.url = this.urlRoot + '/?page=1&offset=1'
				}
			},

			defaults : {
				battler : {},
				battlee : {},
				battleStyle : '',
				battleRounds : []
			},

			/*
			* In cases where we try and init a battle without id,
			* the get battles (which is a collection request) is called
			* with offset = 1 (done in the init above). We need to extract
			* the first value from the array to set this model's data.
			*/
			parse : function(response, options) {
				if (response instanceof Array) {
					response = response[0];	
				}
				var points = {
					battler : 0,
					battlee : 0
				};

				for ( var i = response.battleRounds.length-1, y=1; i >= 0; i--, y++){
					response.battleRounds[i].roundNo = y;
					console.log("R: " + response.id);
					points.battler += response.battleRounds[i].battlersShred.rating.currentRating; 
					points.battlee += response.battleRounds[i].battleesShred != null ? 
						response.battleRounds[i].battleesShred.rating.currentRating : 0; 
				}

				if ( points.battler === points.battlee){
					leader = ''
				}

				return response;				
			}
      	});
		return Battle;
	});
