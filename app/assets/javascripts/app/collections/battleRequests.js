 // Battlerequest module
 define([
 	'models/battleRequest',
 	'backbone'
 	],

 // Map dependencies from above array.
 function(BattleRequest,Backbone) {

 	var BattleRequests = Backbone.Collection.extend({
 		model: BattleRequest,

 		url : function() {
 			return "api/battleRequests/shredder/" + this.shredderId;
 		}, 

 		setShredderId : function(id) {
 			this.shredderId = id;
 		}
 	});

   // Return the module for AMD compliance.
   return BattleRequests;

});
