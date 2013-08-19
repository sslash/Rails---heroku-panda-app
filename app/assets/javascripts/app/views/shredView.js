define([
	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',
	'underscore',

	// Templates
	'text!templates/shredsRow.hbs',
	'text!templates/shred/topShreds.hbs',
	'text!templates/shred/shredModal.hbs',
	'text!templates/shred/createShred.hbs',

	// Modules
	'session',
	'collections/shreds',
	'models/shred'
	], function (Marionette,Handlebars, bs, _, shredsRowTpl, topShredsTpl, 
		modalShredTpl, createShredTpl, Session, Shreds, Shred) {

		var ShredView = {}


		ShredView.ThumbnailView = Marionette.ItemView.extend({
			template : Handlebars.compile(topShredsTpl),
			model: Shred,
			tagName: "li",
			className: "span4",

			events: {
				'click a.shredItem' : 'shredClicked'
			},

			shredClicked : function(e) {
				e.preventDefault();
				mainController.trigger("show:shredModal", this.model);
			}
		});

		ShredView.RowView = Marionette.CompositeView.extend({
			template : Handlebars.compile(shredsRowTpl),
			itemView : ShredView.ThumbnailView,
			collection: Shreds,

			appendHtml: function(collectionView, itemView, index){
				collectionView.$(".shreds").append(itemView.el);
			}
		});

		ShredView.ModalView = Marionette.ItemView.extend({
			template: Handlebars.compile(modalShredTpl),
			model : Shred,

			initialize : function() {
				this.listenTo(this.model, 'shred:change:rate', this.ratingChanged);
				this.listenTo(this.model, 'shred:change:comment', this.commentsChanged);
			},

			events : {
				'hide #shredModal' : 'modalHidden',
				'click #rateBtn' : 'rateShred',
				'keypress #commentText' : 'saveComment'
			},

			modalHidden : function() {
				this.close();
			},

			/* EVENT HANDLERS */
			onRender: function(){
				this.$('#shredModal').modal('show');
			},

			ratingChanged : function() {
				"nigga swag";
				var rating = this.model.get('shredRating');
				this.$('#rating').html(rating.currentRating);
				this.$('#nRaters').html(rating.numberOfRaters);				
			},

			commentsChanged : function() {
				var comments = this.model.get('shredComments');	

				var html = "";
				_.each(comments, function(c) {
					html += 
					'<li class="comments">' +
          			'<a href> <small>'+ c.commenterName +
          			'<span>'+c.timeCreated + '</span></small></a>' + 
          			'<p>' + c.text +'</p>'+
          			'</li>'
				});
				this.$('#commentsList').html(html);
				this.$('#commentText').val('');
			},

    		// Rate button clicked
    		rateShred : function(event) {
    			var rateVal = $('input[type=range]').val();
      			this.model.addRating(rateVal);
      		},    

    		// Delete comment clicked. Call the business function in the model 
    		deleteComment : function(event) {
    			var commentIndex = event.currentTarget.id.split("-")[1];
    			//this.model.deleteComment(commentIndex);
    		},

    		// A new comment is created. Call the model function for business op!
    		saveComment : function(e) {
    			if ( e.keyCode == 13){
    				console.log("SA");
    				this.model.addComment($('#commentText').val());
    			}
    		},
    	});

		ShredView.CreateShredView = Marionette.ItemView.extend({
			template : Handlebars.compile(createShredTpl),
		
			onDomRefresh: function(){
				this.$('#createShred').modal('show');
			}
		});


	return ShredView;
});
