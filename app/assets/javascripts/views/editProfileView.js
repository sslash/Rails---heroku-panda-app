define([
// Vendor
'marionette',
'handlebars',
'bootstrap',

 // Models
 'models/shredder',

	// Templates
	'text!templates/shredder/editProfile.hbs',
	// Plugins
	'session'
	], function (Marionette, Handlebars, bs, Shredder, editProfileTpl, Session) {

		var EditProfileView = Marionette.ItemView.extend({
			template: Handlebars.compile(editProfileTpl),

			events: {
				'click #savebtnId' 		: 'saveBtnClicked',
				'click #saveGtrbtnId' 	: 'saveGtrBtnClicked',
				'click #saveGearbtnId' 	: 'saveGearBtnClicked',
				'change #profileImgId' 	: 'profileImgSelected',
				'change #guitarFileId' 	: 'guitarImgSelected',
				'change #gearFileId' 	: 'gearImgSelected'
			},

			initialize : function() {
				this.editProfileData = {};
				this.profileImg = null;
				this.guitarImg = null;
				this.gearImg = null;
			},

			saveGtrBtnClicked : function() {
				if ( this.guitarImg ){
					this.uploadFile( {
						file : this.guitarImg,
						handler : $.proxy(this.guitarImgSaved,this),
						url : '/api/shredders/' + Session.getUser().id + 
						'/addFile/?kind=guitarImg'
					});
				}
			},

			guitarImgSaved : function(res) {
				console.log("Saved guitar file. Will store meta");
				var guitar = {}
				guitar.model = $('#guitarModelId').val();
				guitar.file = res.filename;

				if ( guitar.model && guitar.file) {
					this.postAjax({
						url : '/api/shredders/' + Session.getUser().id + '/addGuitar',
						data : guitar,
						success : "Saved guitar meta success",
						fail : "Saved guitar meta failed"
					});
				}
			},

			postAjax : function(meta) {
				var that = this;
				$.ajax({
					url: meta.url,
					type: 'POST',
					data : JSON.stringify(meta.data),
					contentType : 'application/json',
					/*beforeSend: function ( xhr ) {
						xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
					},
					*/
					success:function(res){
						console.log(meta.success + ": " + JSON.stringify(res.shredder));
						that.model.set(res.shredder);
						Session.setUser(res.shredder);
						console.log("Model now: " + JSON.stringify(that.model.toJSON()));
						that.render();
					},
					error: function(res){console.log(meta.fail);}
				});
			},

			saveGearBtnClicked : function() {
				if ( this.gearImg ){
					this.uploadFile( {
						file : this.gearImg,
						handler : $.proxy(this.gearImgSaved,this),
						url :'/api/shredders/' + Session.getUser().id + 
						'/addFile/?kind=gearImg'
					});
				}
			},

			gearImgSaved : function(res) {
				console.log("Saved gear file. Will store meta");
				var gear = {}
				gear.model = $('#gearModelId').val();
				gear.file = res.filename;

				if ( gear.model && gear.file) {
					var url = 
					this.postAjax({
						url : '/api/shredders/' + Session.getUser().id +'/addGear',
						data : gear,
						success : "Saved gear meta success",
						fail : "Saved gear meta failed"
					});
				}
			},

			saveBtnClicked : function(e) {
				console.log("save btn clicked");
				this.seteditProfileData();
				if ( this.profileImg ){
					this.uploadFile( {
						file : this.profileImg,
						handler : function(){console.log("profile img saved");},
						url :'/api/shredders/' + Session.getUser().id + 
						'/addFile/?kind=profileImg'
					});
				}
			},

			profileSaved : function(res) {
				console.log("rendered img: " + JSON.stringify(res));
			},

			seteditProfileData : function(){
				var birthdate = $('#birthdateId').val();
				var country = $('#countryId').val();
				var playstyle = $('#playstyleId').val();
				var history = $('#historyId').val();
				var gender = $('input[name=optionsRadios]:checked').val();
				
				this.editProfileData.gender = gender;
				if (birthdate){
					this.editProfileData.birthdate = birthdate;
				}
				if (country){
					this.editProfileData.country = country;	
				} 
				if (playstyle) {
					this.editProfileData.playstyle = playstyle;
				} 
				if (history){
					this.editProfileData.history = history;
				}

				this.postAjax({
					url : '/api/shredders/' + Session.getUser().id + '/update',
					data :  this.editProfileData,
					success : "Updated profile success!",
					fail : "Failed to update profile :("
				});
			},

			guitarImgSelected : function(e) {
				console.log("Gutiar img sel");
				var f = this.getImgFile(e);
				if ( f ) {
					this.guitarImg = f;
				}
			},

			gearImgSelected : function(e) {
				console.log("Gear img sel");
				var f = this.getImgFile(e);
				if ( f ) {
					this.gearImg = f;
				}
			},

			profileImgSelected : function(e) {
				console.log("Profile img sel");
				var f = this.getImgFile(e);
				if ( f ) {
					this.profileImg = f;
				}
			},

			getImgFile : function(e) {
				var files = e.target.files;
				var f = files[0];

				if ( f && f.type.match('image.*')){
					return f;
				} else {
					return null;
				}
			},

			uploadFile : function(obj) {
				var that = this;
				var file = obj.file;
				if ( file ) {
					var data = new FormData();
					data.append("file", file);

					$.ajax({
						url : obj.url,
						type : 'POST',
						data : data,
						/*beforeSend: function ( xhr ) {
							xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
						},*/
						success : function(res) {
							obj.handler(res);
						},
						error : function(res) {
							console.log('error occured: ' + res);
						},
							//Options to tell JQuery not to process data or worry about content-type
							cache : false,
							contentType : false,
							processData : false
						});
				} else {
					obj.handler();
				}
			},

			fileUploaded : function(res){
				console.log(JSON.stringify(res));
				if ( res.filename )
					this.newFilename = res.filename;
			},

			showImgThmbAndSetFile : function(f){
			// var output = [];
			// output.push('<li><strong>', escape(f.name), '</strong>',
			// 	'</li>');

			// $('#file_list1').html('<ul>' + output.join('') + '</ul>');


			// var reader = new FileReader();

   //    			// Closure to capture the file information.
   //    			reader.onload = (function(theFile) {
   //    				return function(e) {
   //    					$('#addThingImg').attr('src', e.target.result);
   //    					$('#dropThingImgTxt').remove();
   //    					$('#chooseNewThingFile').html('Choose another file');
   //    				};
   //    			})(f);

   //    			// Read in the image file as a data URL.
   //    			reader.readAsDataURL(f);
}

});


   // Return the module for AMD compliance.
   return EditProfileView;

});
