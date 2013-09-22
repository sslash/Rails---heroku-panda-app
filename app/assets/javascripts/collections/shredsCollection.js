define([
	'models/shred',
	'backbone'
	],
	function(Shred, Backbone) {
		var ShredsCollection = Backbone.Collection.extend({
			model: Shred,
			page : 0,
			offset: 40,
			sort: '',

			initialize : function() {
				this.sort = 'topRated';
			},

			url: function() {
				url =  "api/shreds/" + "?page=" + this.page + "&offset=" + this.offset;
				
				if ( this.sort ) {
					url += '&sort=' + this.sort;
				}
				return url;
			},

			advancePage : function(){
				this.page ++;
			},
		});

	return ShredsCollection;
});
