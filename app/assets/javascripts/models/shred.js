 define([  
  'backbone',
  'underscore'
  ],
  function(Backbone, _) {

	var Shred = Backbone.Model.extend({
		urlRoot : "/api/shreds",

		validate : function(attrs, options){
			if (!attrs.title){
				return "Title must be included";
			} else if (!attrs.shredVideo){
				return "A video file must be included";
			}
		},

		save : function() {
			var data = new FormData();
			//Add the file meta

			_.each(this.keys(), function(k) {
				data.append(k, this.get(k));
			}, this);

			$.ajax({
				url : this.urlRoot,
				type : 'POST',
				data : data,
				cache : false,
				contentType : false,
				processData : false,
				context:this,
				error: this.saveError,
				success: this.saveSuccess
			});
		},

		saveError : function(err){
			this.trigger('shred:save:error', err);
		},


		saveSuccess : function(model){
			Shredr.vent.trigger('shred:save:success', new Shred(model));
		}

    });

    return Shred;
});
