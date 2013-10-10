 define([  
  'backbone',
  'underscore'
  ],
  function(Backbone, _) {

	var Shredder = Backbone.Model.extend({
		urlRoot : "/api/shredders",

		defaults : {
			name : ''
		}
    });

    return Shredder;
});
