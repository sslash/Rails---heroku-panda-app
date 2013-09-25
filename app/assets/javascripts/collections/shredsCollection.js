define([
	'models/shred',
	'backbone'
	],
	function(Shred, Backbone) {
		var ShredsCollection = Backbone.Collection.extend({
			models: Shred,
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

				if ( this.extraParams ) {
					url += '&params=' + this.extraParams;
				}
				return url;
			},

			advancePage : function(){
				this.page ++;
			},

			setSearchTerm : function(q){
				if (q) {
					this.extraParams = q;
				} else {
					this.extraParams = null;
				}
			}
		});

	return ShredsCollection;
});
