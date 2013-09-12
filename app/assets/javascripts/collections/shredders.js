 define([
 	'models/shredder',
 	'backbone'
 	],
 	function(Shredder,Backbone) {

 		var Shredders = Backbone.Collection.extend({
 			model: Shredder,
 			page: 1,    
 			offset:20,
 			query: "",
 			extras:"",

 			initialize : function() {
				this.listenTo(this, "fetch:sweetShredders", this.fetchSweetShredders);
			},

 			url: function() {
 				console.log("WILL RETURN URL: " + this.extras);
 				return "api/shredders/" + this.query +"?page=" + this.page + "&offset=" + 
 				this.offset + this.extras;
 			},

 			initURL: function(attr){
 				if ( attr.page ) this.page = attr.page;
 				if ( attr.query ) this.query = attr.query;
 				if ( attr.offset ) this.offset = attr.offset;
 				if ( attr.extras ) this.extras = attr.extras;
 			},

 			fetchSweetShredders : function() {
 				this.url = 'api/shredders/sweetShredders';
				this.fetch({reset:true});
 			},

 			search : function(q) {
 				this.extras = "&q=" + q;
 				this.fetch({reset : true});
 			}
 		});

 		return Shredders;

 	});
