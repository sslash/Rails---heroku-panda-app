define([  
	'backbone'
	],
	function(Backbone) {

		var Badge = Backbone.Model.extend({
			urlRoot : '/api/badges',
      	});
		return Badge;
	});
