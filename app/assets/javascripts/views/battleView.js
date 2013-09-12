define([
	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

 	// Models
 	'models/battle',

	// Templates
	'text!templates/battle.hbs',
	// Plugins
	'session'
	], function (Marionette, Handlebars, bs, Battle, battleTpl, Session) {

		var BattleView = Marionette.ItemView.extend({
			template: Handlebars.compile(battleTpl),
			model : Battle,
			//collection : Shredders,

			events: {
				'change #guitarFileId' 	: 'battleSelected',
				'click .rateBtn' 	: 'ratingClicked'
			},

			initialize : function() {
				this.listenTo(this.model, 'change', this.render);
				//this.listenTo(this.collection, 'reset', this.render);
			},

			serializeData: function(){
				var data = {}
				data.canAdd = this.getCanAddNewBattle();
				data.b = this.model.toJSON();
				if ( this.collection) {
					data.battles = this.collection.toJSON();
				}
				data.rounds = data.b.battleRounds.length;
				console.log("DATA: " + JSON.stringify(data));
				return data;
			},

			ratingClicked : function(e) {
				var rateVal = $('input[type=range]').val();
				var shredArgs = e.currentTarget.id.split('-');
				var url = '/api/battles/' + this.model.get('id')
				+ '/rate' + shredArgs[1] + '/' + shredArgs[2] + 
				'/' + Session.getUser().id + '/?val=' + rateVal;
				var that = this;
				$.ajax({
					url: url,
					type: 'POST',
					success:function(res){
						that.model.set(res);
						console.log("rate win");
						that.render();
					},
					error: function(res){
          				// do nothing yet..
          				console.log("rate fail");
      				}
  				});
			},

			getCanAddNewBattle : function() {
				var userId = Session.getUser().id;
				var battle = this.model.toJSON();
				if ( battle.battleRounds[0]) {
					var lastRound = battle.battleRounds[0];
					if ( !lastRound.battleesShred && battle.battlee._id == userId){
						return true;
					}else if ( lastRound.battleesShred && battle.battler._id == userId){
						return true;
					}
				}
				return false;

			},


			battleSelected : function(e) {
				console.log("battle img sel");
				var f = this.getImgFile(e);
				if ( f ) {
					this.uploadFile({
						file: f,
						url : "/api/battles/" + this.model.get('id')
						+ "/addBattleShred/" + Session.getUser().id,
						handler : $.proxy(this.battleShredUploaded,this)
					});
				}
			},

			battleShredUploaded : function(res){
				console.log("res: ");
				this.model.set(res);
				this.render();
			},

			getImgFile : function(e) {
				var files = e.target.files;
				var f = files[0];

				if ( f && f.type.match('video.*')){
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
						beforeSend: function ( xhr ) {
							xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
						},
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

		});


   // Return the module for AMD compliance.
   return BattleView;
});
