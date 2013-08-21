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
	'text!templates/shred/createTabs.hbs',

	// Modules
	'session',
	'collections/shreds',
	'models/shred'
	], function (Marionette,Handlebars, bs, _, shredsRowTpl, topShredsTpl, 
		modalShredTpl, createShredTpl, createTabsTpl, Session, Shreds, Shred) {

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

		ShredView.CreateShredView = Marionette.Layout.extend({
			template : Handlebars.compile(createShredTpl),

			regions: {
   				meta: "#metaRegion",
    			tabs: "#tabsRegion"
			},

			events : {
				'click .add-tabs-btn': '__addTabsBtnClicked'
			},

			__addTabsBtnClicked : function(e) {
				$(this.regions.meta).hide();
				var view = new ShredView.CreateTabsForShredView();
				this.tabs.show(view);
			},			

			onDomRefresh: function(){
				this.$('#createShred').modal('show');
			}
		});

		ShredView.CreateTabsForShredView = Marionette.ItemView.extend({
			template : Handlebars.compile(createTabsTpl),

			events: {
				"keyup #tab-input" : "__keypressed"
			},

			ui : {
				tabInput : "#tab-input"
			},

			__keypressed : function(e) {
				var key = e.keyCode;
				switch(key){
					case 13: // enter
						this.ui.tabInput.animate({ left: "+=16px"}, 1);
						console.log("e");
						break;

					case 39: // right
						this.ui.tabInput.animate({ left: "+=16px"}, 1);
						console.log("r");
						break;

					case 37: // left
						this.ui.tabInput.animate({ left: "-=16px"}, 1);
						console.log("l");
						break;

					case 38: // up
						this.ui.tabInput.animate({ top: "-=15px"}, 1);
						console.log("u");
						break;

					case 40: // down
						this.ui.tabInput.animate({ top: "+=15px"}, 1);
						console.log("d");
						break;
					default:
						return;
				}
				var str = "<label>" + this.ui.tabInput.val() + "</label>";
				var label = $(str);
				label.offset($("#tab-input").position());
				this.ui.tabInput.after(label);
				this.ui.tabInput[0].left -= 11;
				this.ui.tabInput.val("");
			}
		});


	return ShredView;
});
