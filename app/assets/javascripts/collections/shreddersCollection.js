define([
	'models/shredder',
	'backbone'
	],
	function(Shredder, Backbone) {
		var ShreddersCollection = Backbone.Collection.extend({
			models: Shredder,
			page : 0,
			offset: 40,
			sort: '',

			url: function() {
				url =  "api/shredders/" + "?page=" + this.page + "&offset=" + this.offset;
				
				if ( this.sort ) {
					url += '&sort=' + this.sort;
				}

				if ( this.extraParams ) {
					url += '&params=' + this.extraParams;
				}
				return url;
			},

			advancePage : function(){
				this.page ++;
			}
		});

	return ShreddersCollection;
});
