define([

	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

	// Utils
	'session',
	'ajaxHelper',

	// Models
	'models/shred',

	// Collections
	'collections/shreds',

	// Templates
	'text!templates/shredpool/shredpool.hbs',
	'text!templates/shredpool/shredInPool.hbs',
	], function (Marionette,Handlebars, bs, Session, Ah, Shred,
		Shreds, shredpoolTpl, shredInPoolTpl) {


		var ShredpoolView = {}

		ShredpoolView.MainLayout = Marionette.Layout.extend({
			template: Handlebars.compile(shredpoolTpl),

			events: {
				'submit #addShredForm' : 'saveShred',
				'keypress #ed_inputTags': 'pushTag',
				'click input[type=radio]' : "radioClicked",
				'keypress #inputTags' : 'inputTagsKeyPress',
				'keypress #inputCountry' : 'inputCountryKeyPress',
			},

			initialize : function() {
				this.tagsArr = [];
			},

			regions: {
				shreds: "#shreds"
			},

			serializeData : function() {
				var data = {}
				data.user = Session.getUser();
				return data;
			},

			inputTagsKeyPress : function(e) {
				if ( event.which === 13 ) {
					event.preventDefault();
					var tagsField = $("#inputTags");
					var input = tagsField.val().replace(/(^,)|(,$)/g, "");
					input = input.split(/,\s*/g);
					tagsField.val('');
					if ( input ) {
						var shreds = this.getCollection();
						shreds.initURL({
							extras : '&tags=' + input
						});
						shreds.fetch({reset:true});
					}
				}		
			},

			inputCountryKeyPress : function(e) {
				if ( event.which === 13 ) {
					event.preventDefault();
					var shreds = this.getCollection();
					var countryField = $("#inputCountry");
					var input = countryField.val();
					countryField.val('');
					if ( input ) {
						shreds.initURL({
							extras : '&country=' + input
						});
						shreds.fetch({reset:true});
					}
				}		
			},

			getCollection : function() {
				return this.regionManager.get('shreds').currentView.collection;
			},

			radioClicked : function(e) {
				query = e.currentTarget.id;
				var shreds = this.getCollection();
				shreds.initURL({
					query : query
				});
				shreds.fetch({reset:true});

			},

			/* Event handlers */
			pushTag : function (event) {
				if ( event.which === 13 ) {
					event.preventDefault();
					var tags = $("#ed_inputTags");
					var input = tags.val();
					tags.val('');
					this.appendInterest(input);
					this.tagsArr.push(input);
				}			
			},

			appendInterest : function(tag) {
				var span = '<a href="#" class="tagTooltip" data-toggle="tooltip"' +
				'title="Click to Remove" id = "tooltipTag_'+ tag + '">' +
				'<span class="label label-info tag-label">' + tag + '</span>';
				$('.tagPool').append(span);
			},

			saveShred : function(evt) {
				evt.preventDefault();

				// upload file first

				Ah.uploadFile( {
					file : this.file,
					url : '/api/shreds/file',
					handler : $.proxy(this.saveShredMeta, this)
				});
			},

			saveShredMeta : function(res){
				if (!res.filename) return;
				var title = $('#inputName').val();
				var desc = $('#inputDescription').val();
				var owner = Session.getUser().id;
				var tags = this.tagsArr;
				var shred = new Shred();
				shred.save({
					videoPath : res.filename,
					videoThumbnail : res.thumbname,
					title : title,
					description : desc,
					owner : owner,
					tags : tags
				},{
					success : this.saveSuccess
				});
			},

			saveSuccess : function(res){
				$('#addShredModal').modal('hide');
			},

			onDomRefresh: function(){
				var dropZone = document.getElementById('shred_drop_zone');
				dropZone.addEventListener('dragover', $.proxy(this.handleDragOver,this), false);
				dropZone.addEventListener('drop', $.proxy(this.handleFileDrop,this), false);
			},

			handleDragOver : function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
    			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    		},

    		handleFileDrop: function(evt) {
    			evt.stopPropagation();
    			evt.preventDefault();
				// files is a FileList of File objects. List some properties.
				var files = evt.dataTransfer.files; 
				if ( files[0] && files[0].type.match('video.*')) {
					this.file = files[0];
				} else {
					// TODO: give error message to user
				}
			},

			// uploadFile : function(obj) {
			// 	var that = this;
			// 	var file = obj.file;
			// 	if ( file ) {
			// 		var data = new FormData();
			// 		data.append("file", file);

			// 		$.ajax({
			// 			url : '/api/shreds/file',
			// 			type : 'POST',
			// 			data : data,
			// 			success : function(res) {
			// 				obj.handler(res);
			// 			},
			// 			beforeSend: function ( xhr ) {
			// 				xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
			// 			},
			// 			error : function(res) {
			// 				console.log('error occured: ' + res);
			// 			},
			// 				//Options to tell JQuery not to process data or worry about content-type
			// 				cache : false,
			// 				contentType : false,
			// 				processData : false
			// 			});
			// 	} else {
			// 		obj.handler();
			// 	}
			// },

			// fileUploaded : function(res){
			// 	console.log(JSON.stringify(res));
			// 	if ( res.filename )
			// 		this.newFilename = res.filename;
			// }
		});

ShredpoolView.ShredInPoolView = Marionette.ItemView.extend({
	template: Handlebars.compile(shredInPoolTpl),
	model: Shred,
	tagName: "div",
	className: "thumbnail shredInPool shadow",

	events: {
		'click a.shredItem' : 'shredClicked'
	},

	shredClicked : function(e) {
		e.preventDefault();
		mainController.trigger("show:shredModal", this.model);
	}
});

ShredpoolView.ShredsInPoolView = Marionette.CollectionView.extend({
	itemView: ShredpoolView.ShredInPoolView,
	collection : Shreds
});


return ShredpoolView;
});