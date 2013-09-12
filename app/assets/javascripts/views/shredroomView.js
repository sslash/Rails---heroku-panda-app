define([
	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

 	// Models
 	'models/shredder',

 	// collections
 	'collections/shredders',

	// Templates
	'text!templates/showroom/showroom.hbs',
	// Plugins
	'session'
	], function (Marionette, Handlebars, bs, Shredder, Shredders, showroomTpl, Session) {

		var ShowroomView = Marionette.ItemView.extend({
			template: Handlebars.compile(showroomTpl),
			model : Shredder,
			collection : Shredders,

			events: {},

			initialize : function() {
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.collection, 'reset', this.render);

			},
			onRender : function(){
				$('.carousel').carousel();
				console.log("RENDERING SHOW");
			},

			events : {
				'keypress .search-query' : 'searchPressed'
			},

			searchPressed : function(e) {
				if ( e.keyCode == 13 ) {
					var q = $('.search-query').val();
					this.collection.search(q);
				}
			},

			serializeData: function(){
				var data = {}
				data.shredder = this.model.toJSON();
				if ( data.shredder.guitars)
					data.gtrSize = data.shredder.guitars.length;
				
				if ( data.shredder.equiptment)
					data.eqSize =  data.shredder.equiptment.length;
				if ( this.collection) {
					data.shredders = this.collection.toJSON();
				}
				

    // If sheds < 6
    //console.log("DATA: " + JSON.stringify(data));

    return data;
},

});


   // Return the module for AMD compliance.
   return ShowroomView;
});
