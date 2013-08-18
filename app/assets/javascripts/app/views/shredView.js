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

	// Modules
	'session',
	'collections/shreds',
	'models/shred'
	], function (Marionette,Handlebars, bs, _, shredsRowTpl, topShredsTpl, 
		modalShredTpl, Session, Shreds, Shred) {

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

//     template: "Shred",

//     initialize : function() {
//      // _.extend(this, Backbone.Events);
//      this.divId = this.options.divId + "_" + this.options.index; 
//      _.bindAll(this);
//      if ( this.options.template ){
//       this.template = this.options.template;
//     }
//     },

//   serialize : function() {
//     return {"shred" : this.model.toJSON(), index : this.options.index};
//   },

//   postRender : function() {
//     this.setListeners();
//   },

//   setListeners : function() {
//     $(this.divId).on('click', this.openShredModal);
//   },

//   unsetListeners : function() {
//     $(this.divId).off('click', this.openShredModal);
//   },

//   resetListeners : function() {
//     this.unsetListeners();
//     this.setListeners();
//   },

//   openShredModal : function(event) {
//     event.preventDefault();
//     app.Mediator.publish("createShredModalView", this.model);
//   },

//   cleanUp : function() {
//     console.log("Killing myself: " + this.cid);
//     this.unsetListeners();
//     this.remove();
//     this.unbind();
//   },

//   resetShredModel : function(newModel) {
//     this.model = newModel;
//   }

// });


//RowView = BaseView.extend({
//   page : 1,
//   offset : 20,
//   advancePage : 1,
//     initialize : function() {       
//       if ( !this.options.windowSize) {
//         this.options.windowSize = 4;
//         this.options.startCollIndex = 5;
//       }
//       this.options.currVindowIndex = this.options.startCollIndex; 
//       this.template = this.options.template;    

//       this.collection =  new Shred.Collection();
//       this.collection.initURL({
//         'page' : this.options.page || this.page,
//         'offset' : this.options.offset || this.offset,
//         'query' : this.options.query
//       });

//       if ( this.options.nextBtn) {
//         this.nextBtn = this.options.nextBtn;
//       }

//       if ( !this.renderFn ) {
//         this.renderFn = this.addAll;
//       }

//       this.subViews = [];
//     },

//     postRender : function() {
//       if (this.nextBtn){
//         $(this.nextBtn).on('click', $.proxy(this.nextShreds,this));
//       }
//       this.collection.fetch();
//       this.collection.on( 'reset', this.renderFn, this );

//       if ( this.options.tagSearch){
//         $("#tagSearch").on('keypress', $.proxy(this.fetchByTags,this));
//       }
//     },

//     fetchByTags : function() {
//       if(event.keyCode == 13) {  
//         var val = event.currentTarget.value;        
//         var tagsList = val.split(/,\s*/g);
//       this.fetchShredsByTags(tagsList);
//       }
//     },

//     fetchShredsByTags : function(tagsList) {
//        var query= _.reduce( tagsList, function(memo, arg) {
//         return memo + "&tag=" + arg;
//        }, "");

//       this.collection.extras = query;
//       this.collection.fetch();
//     },

//     addAll: function() {
//       var that = this;
//       var index = (this.options.startCollIndex - this.options.currVindowIndex) * this.options.windowSize;

//      this.clearCollection();
//       _.each(_.first(this.collection.models, this.options.windowSize), function(shred){
//         var shredView = new Shred.Views.ThumbnailView({
//          template : that.options.shredTemplate,
//          model: shred,
//          index : index++,
//          divId : that.options.divPrefix
//        });
//         that.subViews.push(shredView); 
//         that.showChildView(that.options.selector, shredView, that);
//       });        
//     },

//     // Might consider factoring this one out..
//     addAllInOne : function() {
//       var columns = 6;
//       var end = 18;
//       var rowStartHtml = "<div class='row-fluid'>";
//       var rowEndHtml = "</div>";
//       var html = "";

//       html += rowStartHtml;
//       var i = 1, index = 0; // last one is for index in shredview
//       var that = this;

//       // Loop through rows of shreds, and create an HTML string.
//       // For each row, wrap a set of shreds with row fluid div
//       // Insert the Shreds at the end.
//       // This is so neat, because the page is rendered, and THEN these are
//       // added. 
//       this.clearCollection();
//       this.collection.each(function(shred){
//        var shredView = new Shred.Views.ThumbnailView(
//        {
//         template : that.options.shredTemplate,
//         model: shred,
//         index : index++,
//         divId : that.options.divPrefix
//       });
//        this.subViews.push(shredView);

//        shredView.render()
//        .done(function(doneView){

//         html += doneView.$el.html();
//         if ( i ==  end) {
//           html += rowEndHtml;
//           $(that.options.selector).append(html);
//           _.each(that.subViews, function(view) {
//            view.postRender();       
//          });

//         } else if ( i % columns === 0) {
//           html += rowEndHtml;
//           html += rowStartHtml;
//         }
//         i++;           
//       });
//      }, this);
//     },

//     clearCollection : function() {
//       _.each(this.subViews, function(v){
//         v.cleanUp();
//       });
//       this.subViews = [];
//       $(this.options.selector).empty();

//     },

//     cleanUp : function() {
//       _.each(this.subViews, function(v){
//         v.cleanUp();
//       });
//       console.log("Cleaning up row view: " + this.cid);
//       this.remove();
//       this.unbind();
//     },

//     nextShreds : function(event) {
//       event.preventDefault();

//       if (this.options.currVindowIndex == this.advancePage){
//         this.collection.advancePage();
//         this.options.currVindowIndex = this.options.startCollIndex;
//         this.collection.fetch({});
//       } else {
//         this.options.currVindowIndex --;
//         this.moveRow();
//       } 
//     },

//     moveRow : function() {
//       var that = this;
//       var start = (this.options.startCollIndex - this.options.currVindowIndex) * this.options.windowSize;
//       var stop = start + this.options.windowSize;
//       $(this.options.selector).empty();
//        // Should maybe reset listeners before empty?

//        for ( var i = start, y=0; i < stop; i++, y++){
//         var model = this.collection.at(i);
//          this.subViews[y].resetShredModel(model);
//          // Un comment this!
//           // this.subViews[y].render()
//           // .done(function(view) {
//           //   $(that.options.selector).append(view.$el.html()); 
//           //   view.resetListeners();  
//           // });
//       }
//     }
//   }),


// Shred.Views.ModalView = BaseView.extend({
//   template: "shred/shredModal",

//     /** INITIALIZATION CODE */

//     // After the rendering process is done, 
//     //add the necessary event handlers
//     postRender : function() {
//        $('#rateButton').on("click", $.proxy(this.rateShred, this));
//        $('#commentButton').on("click", $.proxy(this.saveComment, this));
//        $('td .close').on("click", $.proxy(this.deleteComment, this));
//       this.listenTo(this.model, 'change', this.notifyOnChange);
//     },

//     // Return a JSON object that will be rendered into the HTML
//     serialize : function() {
//       return {"shred" : this.model.toJSON()};
//     },


//     /* EVENT HANDLERS */


//     // Rate button clicked
//     rateShred : function(event) {
//       event.preventDefault();
//       var rateVal = $('input[type=range]').val();

//       // Call the business operation in the model
//       this.model.addRating(rateVal);
//     },    

//     // Delete comment clicked. Call the business function in the model 
//     deleteComment : function(event) {
//       var commentIndex = event.currentTarget.id.split("-")[1];
//       this.model.deleteComment(commentIndex);
//     },

//     // A new comment is created. Call the model function for business op!
//     saveComment : function(event) {
//       event.preventDefault();
//       this.model.addComment($('#commentText').val(), Session.getUser());
//     },


//     /** CLEAN UP FUNCTIONS */


//     // Called when the shred object has been updated. Must re-render the view
//     notifyOnChange : function() {
//       app.Mediator.publish("createShredModalView", this.model);
//     },

//     // Called when a this view is to be re-used to display a new Shred
//     resetShredModel : function(newModel) {
//       this.stopListening(this.model, 'change', this.notifyOnChange);
//       this.model = newModel;
//     },

//     // Kill this view by deleting its DOM elements and remove event handlers 
//     cleanUp : function() {
//       console.log("Killing shredmodal " + this.cid);
//       this.remove();
//       this.unbind();
//    }
//  });

//   Shred.Views.ShredNewsView = BaseView.extend({
//     template : "shredpool/ShredNews",



//     initialize : function() {   
//       this.shredderId = this.options.shredderId;    
//       this.newestShreds = new Shred.Collection();
//       this.newestShreds.initURL({
//         page : 1,
//         offset : 5,
//         query : "newShredsFromFanees/" + this.shredderId
//       });
//       this.newestBattles = new Battle.Collection();
//       this.newestBattles.initURL({
//         query:"withFanees/"+ this.shredderId,
//         page : 1,
//         offset: 3
//       });

//       this.mightLikeShredders = new Shredder.Collection(); 
//       this.mightLikeShredders.initURL({
//         query : "mightKnowShredders/" + this.shredderId,
//         page : 1,
//         offset : 5
//       });
//       this.battleShredsFromFanees = new Battle.Collection();
//       this.battleShredsFromFanees.initURL({
//         query : "withLatestBattleShredsFromFanees/" + this.shredderId,
//         page : 1,
//         offset : 6
//       });
//     },

//     postRender : function() {
//       this.newestShreds.fetch();
//       this.newestShreds.on('reset', this.renderNewestShreds, this);
//       this.newestBattles.fetch();
//       this.newestBattles.on('reset', this.renderNewestBattles, this);
//       this.mightLikeShredders.fetch();
//       this.mightLikeShredders.on('reset', this.renderMighLikeShredders, this);
//       this.battleShredsFromFanees.fetch();
//       this.battleShredsFromFanees.on('reset', this.renderBattleShredsFromFanees, this);
//     },

//     renderNewestShreds : function() {
//        this.serializeCollection({
//         collection : this.newestShreds,
//         template : "shredpool/ShredNews_fromFanees",
//         selector : '#newShredFromFaneeNewsItem'
//       });
//     },

//     renderNewestBattles : function() {
//        this.serializeCollection({
//         collection : this.newestBattles,
//         template : "shredpool/ShredNews_newBattles",
//         selector : "#newBattlesFromFanees"
//        });
//     },

//     renderMighLikeShredders : function() {
//        this.serializeCollection({
//         collection : this.mightLikeShredders,
//         template : "shredpool/ShredNews_shreddersMightLike",
//         selector : "#shreddersYouMightLike"
//       });
//     },

//     renderBattleShredsFromFanees : function() {
//       this.serializeCollection({
//         collection : this.battleShredsFromFanees,
//         template : "shredpool/ShredNews_battleShreds",
//         selector : "#latesBattleShreds"
//        });
//     },

//     cleanUp : function() {
//       this.remove();
//     }

//   });

//   // Return the module for AMD compliance.
//   return Shred;

// });



return ShredView;
});
