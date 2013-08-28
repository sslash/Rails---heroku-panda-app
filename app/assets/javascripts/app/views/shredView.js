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
	'text!templates/shred/addTags.hbs',

	// Modules
	'session',
	'ajaxHelper',
	'collections/shreds',
	'models/shred'
	], function (Marionette,Handlebars, bs, _, shredsRowTpl, topShredsTpl, 
		modalShredTpl, createShredTpl, createTabsTpl, addTagsTpl,
		Session, Ah, Shreds, Shred) {

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
			barsIndex : 0,

			initialize : function() {
				this.listenTo(this.model, 'shred:change:rate', this.ratingChanged);
				this.listenTo(this.model, 'shred:change:comment', this.commentsChanged);
			},

			events : {
				'hide #shredModal' : 'modalHidden',
				'click #rateBtn' : 'rateShred',
				'keypress #commentText' : 'saveComment',
				'click #nextTabsBtn' : '__nextTabClicked',
				'click #prevTabsBnt' : '__prevTabClicked'
			},

			ui : {
				tab : ".tab"
			},

			modalHidden : function() {
				this.close();
			},

			onRender: function(){
				this.$('#shredModal').modal('show');
			},

			onDomRefresh : function() {
				// set Note Width
				this.__paintTabs();
				this.__paintBars();
				this.__initVideo();
			},

			__paintBars : function() {
				var bar=document.getElementById("bars");
				var width  = bar.width;
				var barSize = width / 4;
				var height = 250;

				
				var ctx=bar.getContext("2d");
				ctx.lineWidth = 1;

				ctx.beginPath();
				ctx.moveTo(barSize,0);
				ctx.lineTo(barSize,height);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo((barSize*2),0);
				ctx.lineTo((barSize*2),height);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo((barSize*3),0);
				ctx.lineTo((barSize*3),height);
				ctx.stroke();
			},

			__paintTabs : function() {
				if ( this.model.get('tabs')) {
					this.prevBarsIndex = this.barsIndex;
					var prevLeft = 0;
					var that = this;
					var width = 1111; //$('#bars').width(); TODO: SHOULD BE THIS
					var tabs = this.model.get('tabs');
					var prevRest = tabs[0].rest * 2; // Start from 32 px left margin

					for (var barsCounter = 0; (this.barsIndex < tabs.length && barsCounter < 4); this.barsIndex ++ ){
						var tab = tabs[this.barsIndex];
						barsCounter += 1/tab.rest;

						prevLeft = ( width / (prevRest*4)) + prevLeft;
						prevRest = tab.rest;
						
						_.each(tab.stringz, function(obj) {
							var le_string = Object.keys(obj)[0];
							var label = $("<label class='note' title='" +tab.rest + "'>" + obj[le_string] + "</label>");
							label.css('left', (prevLeft + "px") );
							var top = -10 + (le_string*12);
							label.css('top', (top + "px") );

							that.ui.tab.append(label);
						});							
					}
				}
			},


			// TODO: this doesnt work
			__prevTabClicked : function() {
				$('.note').remove();
				this.barsIndex = this.prevBarsIndex;
				this.__paintTabs();
			},

			__nextTabClicked : function() {
				$('.note').remove();
				this.__paintTabs();
			},

			__initVideo : function() {
				var pop = Popcorn("#leShredVideo");
				pop.footnote({
			       start: 2,
			       end: 6,
			       text: "Pop!",
			       target: "footnotediv"
			    });

				/** SET INTERVAL
			    pop.on("play", function() {
				    // 120 bpm = 120 / 60 = 2 beats/sek
				    // = 1000s / 2 = 500
				    setInterval(function() {
					}, 500);									    
				}); */
			},

			ratingChanged : function() {
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

			initialize : function() {
				this.addTagsTpl = Handlebars.compile(addTagsTpl);
				this.tags = [];
			},

			events : {
				'click .add-tabs-btn': '__addTabsBtnClicked',
				'keyup #addTag': '__addTagEntered',
				'change input:file' : '__fileChanged',
				'click .label' : '__labelClicked',
				'click .submit' : '__submitClicked'
			},

			__error : function(error) {
				if ( error.inputTag )
					$(error.inputTag).addClass("input-error");
				
				$(error.errorTag).text(error.msg);
				$(error.errorTag).show();
			},

			__submitClicked : function(e) {
				
				this.title = $('.shredTitle').val() || this.__error(
					{msg: "Title must be included", inputTag : '.shredTitle', errorTag : '.error-msg' });

				// precondition: file has been uploaded!
				this.__saveShredMeta();
			},

			__fileChanged : function(e) {
				var file = $('#addShredFile')[0].files[0];
				if ( file.type.match('video.*') ){
					this.file = file;
					this.__createShredModelAndUploadFile();
				}
			},

			__createShredModelAndUploadFile : function() {
				this.shred = new Shred();

				Ah.uploadFile( {
					file : this.file,
					url : '/api/shreds/file',
					handler : $.proxy(this.__postUploadFile, this)
				});
			},

			__postUploadFile : function(res) {
				if (res.filename && res.thumbname){
					this.shred.set({
						videoPath : res.filename,
						videoThumbnail : res.thumbname
					});

					// Change image src
					console.log("SAP: " + res.thumbname);
					 $('#uploadShredThmb').attr("src", "uploads/thumbs/" + res.thumbname);

				} else {
					// Something must have gone wrong saving the file :(
					this.file = null;
				}
			},


			__saveShredMeta : function(){
				if (!this.shred.get('videoPath') || !this.title ){
					alert("Error! Failed to upload shred :(");
					return;
				}

				this.shred.save({
					title : this.title,
					description : $('#descriptionInput').val(),
					owner : Session.getUser().id,
					tags : this.tags,
					guitar : $('#guitarInput').val() || "",
					amp : $('ampInput').val() || "",
					category : $("#categoryInput :selected").text() === "Category" ? "" : $("#categoryInput :selected").text()

				},{
					success : this.__saveSuccess
				});
			},

			__saveSuccess : function(res){
				$('#createShred').modal('hide');
			},

			__handleDragOver : function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
    			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    		},

    		__handleFileDrop: function(evt) {
    			evt.stopPropagation();
    			evt.preventDefault();
				// files is a FileList of File objects. List some properties.
				var files = evt.dataTransfer.files; 
				if ( files[0] && files[0].type.match('video.*')) {
					this.file = files[0];
					this.__createShredModelAndUploadFile();
				} else {
					// TODO: give error message to user
				}
			},

			__labelClicked : function(e) {
				$(e.target).toggleClass("label-success");
				this.tags.push (e.currentTarget.innerText);
			},

			__addTagEntered : function(e) {
				if (e.keyCode === 13) {
					var txt = e.target.value;
					var html = "<span class='label label-info'>" + txt + "</span>";
					this.$('.tags ').append(html);
					this.tags.push (txt);
					$(e.target).val("");
				}
			},

			__addTabsBtnClicked : function(e) {
				if ( !this.file){
					alert("Upload the Shred video first!");
				}else if (!$('.shredTitle').val()) {
					alert("A Shred title must be provided first!");
				}else{
					$(this.regions.meta).hide();				
					var view = new ShredView.CreateTabsForShredView({model : this.shred});
					this.tabs.show(view);
				}
			},			

			onDomRefresh: function(){
				this.$('#createShred').modal('show');
				$('#popoverTags').popover({
					html:true,
					animation: true,
					content: this.addTagsTpl
				});

				var dropZone = document.getElementById('shred_drop_zone');
				dropZone.addEventListener('dragover', $.proxy(this.__handleDragOver,this), false);
				dropZone.addEventListener('drop', $.proxy(this.__handleFileDrop,this), false);
			}
		});

		ShredView.CreateTabsForShredView = Marionette.ItemView.extend({
			template : Handlebars.compile(createTabsTpl),

			/*
			* tabs[] is the representation of a tab:
			* A tab can be:
			* tabs : [
				[
					{
						gtrString 	: 1,
						fret		: 3,
						rest   		: 1,
					},
					{
						gtrString 	: 3,
						fret		: 0,
						rest   		: 1,
					},
					{
						gtrString 	: 6,
						fret		: 3,
						rest   		: 1,
					}
				]
			]
			*
			*
			*/
			//tabs : [], /* Notes */
			tabsIndex : 0, /* time */
			tabsStringIndex : 0, /* current string */
			bars: 0, /* current bar / space */


			events: {
				'keyup #tab-input' : '__keypressed',
				'click .notes' : '__noteChangeClicked'
			},

			ui : {
				tabInput : "#tab-input"
			},

			initialize : function() {
				this.model.set({tabs : []})
			},

			onDomRefresh : function() {
				// set Note Width
				this.intervall = 4;
				this.noteDiv = "#crotchet";
				this.__painTabInputField();

				// draw lines
				var bar=document.getElementById("bars");
				var width  = bar.width;
				var barSize = width / 4;
				var height = 250;
				
				var ctx=bar.getContext("2d");
				ctx.lineWidth = 1;

				ctx.beginPath();
				ctx.moveTo(barSize,0);
				ctx.lineTo(barSize,height);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo((barSize*2),0);
				ctx.lineTo((barSize*2),height);
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo((barSize*3),0);
				ctx.lineTo((barSize*3),height);
				ctx.stroke();
			},

			__painTabInputField : function() {
				var intervallWidthPx = $('#bars').width() / (this.intervall*4);
				// Set tab-input start location
				this.ui.tabInput.css("left", ((intervallWidthPx / 2) + "px"));
			},	

			__noteChangeClicked : function(e) {
				var divId = e.currentTarget.id;
				switch (true) {
					case /^semibreve$/.test(divId):
						this.intervall = 1;
						break;
					case /^minim$/.test(divId):
						this.intervall = 2;
						break;
					case /^crotchet$/.test(divId):
						this.intervall = 4;
						break;
					case /^quaver$/.test(divId):
						this.intervall = 8;
						break;
					case /^semiquaver$/.test(divId):
						this.intervall = 16;
						break;
					case /^demisemiquaver$/.test(divId):
						this.intervall = 32;
						break;
					case /^hemidemisemiquaver$/.test(divId):
						this.intervall = 64;
						break;
				}
				$(this.noteDiv).removeClass("selected");
				this.noteDiv = "#" + divId;
				$(this.noteDiv).addClass("selected");
			},	

			__keypressed : function(e) {
				var key = e.keyCode;
				var fret = "";
				switch(key){
					case 13: // enter
						fret = this.ui.tabInput.val();
						this.__createNote(fret, this.tabsIndex, this.tabsStringIndex);
						this.tabsIndex ++;
						this.bars += 1/this.intervall;

						if ( this.bars !== 4){
							var intervallWidthPx = ($('#bars').width() / (this.intervall*4));
							this.ui.tabInput.animate({ left: "+=" + intervallWidthPx + "px"}, 1);
						}
						break;

					case 39: // right
						fret = this.ui.tabInput.val();
						this.__createNote(fret, this.tabsIndex, this.tabsStringIndex);
						this.tabsIndex ++;
						this.bars += 1/this.intervall;
						if ( this.bars !== 4){
							var intervallWidthPx = ($('#bars').width() / (this.intervall*4));
							this.ui.tabInput.animate({ left: "+=" + intervallWidthPx + "px"}, 1);
						}
						break;

					case 37: // left
						var intervallWidthPx = ($('#bars').width() / (this.intervall*4));
						this.ui.tabInput.animate({ left: "-=" + intervallWidthPx + "px"}, 1);
						this.tabsIndex --;
						this.bars -= 1/this.intervall;
						break;

					case 38: // up
						fret = this.__trySetFretWhenUpOrDown();
						this.ui.tabInput.animate({ top: "-=12px"}, 1);
						this.tabsStringIndex --;
						break;

					case 40: // down
						fret = this.__trySetFretWhenUpOrDown();
						this.ui.tabInput.animate({ top: "+=12px"}, 1);
						this.tabsStringIndex ++;
						break;
					default:
						return;
				}
				var label = $("<label class='note'>" + fret + "</label>");
				label.offset($("#tab-input").position());
				this.ui.tabInput.after(label);
				this.ui.tabInput.val("");

				if ( this.bars === 4 ) {
					this.__clearAndIterateBars();				
				}
			},

			__clearAndIterateBars : function() {
				$('.note').remove();
				this.__painTabInputField();
				this.bars = 0;
			},

			__trySetFretWhenUpOrDown : function() {
				var fret = this.ui.tabInput.val();
				if ( !isNaN (parseInt(fret, 10)) ){
					this.__createNote(fret, this.tabsIndex, this.tabsStringIndex);
				}
				return fret;
			},

			__createNote : function(fret,tabsIndex,tabsStringIndex) {
				var parsedFret = parseInt(fret, 10);
				parsedFret = isNaN(parsedFret) ? -1 : parsedFret;
				var tabs = this.model.get('tabs');

				if ( !tabs[tabsIndex] ){
					tabs[tabsIndex] = {};
				}

				tabs[tabsIndex].rest = this.intervall;
				if (!tabs[tabsIndex].stringz) {
					tabs[tabsIndex].stringz = []
				}

				// add the fret at the given string
				var obj = {}
				obj[tabsStringIndex] = parsedFret
				tabs[tabsIndex].stringz.push(obj);
				this.model.set({tabs : tabs});
			}
		});


	return ShredView;
});
