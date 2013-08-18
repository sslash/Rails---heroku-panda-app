 define([
 	'models/battle',
 	'backbone'
 	],
 	function(Battle,Backbone) {

 		var Battles = Backbone.Collection.extend({
 			model: Battle,
 			page: 1,    
 			offset:20,
 			query: "",

 			url : function() {
 				return '/api/battles/' + this.query + "?page=" + this.page + "&offset=" + this.offset; 
 			},
 			
 			initURL: function(attr){
 				if ( attr.page ) this.page = attr.page;
 				if ( attr.query ) this.query = attr.query;
 				if ( attr.offset ) this.offset = attr.offset;
 			}
 		});

 		return Battles;

 	});


//   // Default Collection.
//   Battle.Collection = Backbone.Collection.extend({
//     model: Battle.Model,

//     url : function() {
//       return '/api/battles/' + this.query + "?page=" + this.page + "&offset=" + this.offset; 
//     },

//     initURL: function(attr){
//       if ( attr.page ) this.page = attr.page;
//       if ( attr.query ) this.query = attr.query;
//       if ( attr.offset ) this.offset = attr.offset;
//     }

//   });

//   // Default View.
//   Battle.Views.Battle = Backbone.Layout.extend({
//     template: "battle"
//   });

//   // Return the module for AMD compliance.
//   return Battle;

// });
