define([
	'models/shred',
	'backbone',
	'session'
	],
	function(Shred, Backbone, Session) {
		var ShredCollection = Backbone.Collection.extend({
			model: Shred,
			page : 1,
			query: "",
			offset: 0,

			initialize : function() {
				this.listenTo(this, "fetch:topShreds", this.fetchTopShreds);
				this.listenTo(this, "fetch:shredpoolShreds", this.fetchShredpoolShreds);
			},

			url: function() {
				url =  "api/shreds/" + this.query + "?page=" + this.page + "&offset=" + this.offset;
				if ( this.extras ) {
					url += this.extras;
				}

				if ( this.uid ) {
					url += this.uid;
				}
				return url;
			},

			initURL: function(attr){
				if ( attr.page ) this.page = attr.page;
				if ( attr.query ) this.query = attr.query;
				if ( attr.offset ) this.offset = attr.offset;
				if ( attr.extras ) this.extras = attr.extras;
				if ( attr.uid ) this.uid = attr.uid;
			},

			advancePage : function(){
				this.page ++;
			},

			setQuery : function(q) {
				this.query = q;
			},

			fetchTopShreds : function() {
				this.initURL({
					query : 'topRated',
					page : 1,
					offset: 3
				});
				this.fetch();
			},

			fetchShredpoolShreds : function() {
				this.initURL({
					query : 'byPopularity/',
					uid: '&uid=' + Session.getUser().id,
					page : 1,
					offset: 40
				});
				this.fetch();
			}
		});

		return ShredCollection;
});
